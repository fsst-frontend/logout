import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { basename, dirname, resolve } from 'node:path'
import { setImmediate } from 'node:timers/promises'
import { fileURLToPath } from 'node:url'
import { runInNewContext } from 'node:vm'
// 使用 Node 内置测试，无需新增测试框架依赖。
// eslint-disable-next-line test/no-import-node-test
import test from 'node:test'

// 默认从当前仓库运行，也允许在应用修改前验证候选源码。
const projectRoot = resolve(process.env.BRIDGE_PROJECT_ROOT || resolve(dirname(fileURLToPath(import.meta.url)), '..'))
const projectName = basename(projectRoot).toLowerCase()
const sourcePath = resolve(process.env.BRIDGE_SOURCE_PATH || resolve(projectRoot, 'src/utils/jsBridge.ts'))
const require = createRequire(resolve(projectRoot, 'package.json'))
const ts = require('typescript')

const source = ts.transpileModule(readFileSync(sourcePath, 'utf8'), {
  fileName: sourcePath,
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText

const hostOrigin = 'https://host.example'
const otherOrigin = 'https://other.example'
const supportsEarlyEvents = ['center', 'activity'].includes(projectName)

function contract(name, run, options = {}) {
  test(name, { timeout: 1500, ...options }, run)
}

// 每个用例使用独立窗口和模块，避免握手、监听及回调状态互相影响。
function createRuntime({ ios = false, android = false, embedded = true } = {}) {
  const sent = []
  const iosCalls = []
  const androidCalls = []
  const listeners = new Map()
  const parent = {
    postMessage(payload, targetOrigin) {
      sent.push({ payload, targetOrigin })
    },
  }
  const window = {
    __APP_CONFIG__: {
      H5_BASE_HOST: 'https://proxy.example/h5.project/polymer',
      API_BASE_HOST: 'https://proxy.example/api.project',
    },
    addEventListener(type, listener) {
      const registered = listeners.get(type) || []
      registered.push(listener)
      listeners.set(type, registered)
    },
  }
  window.parent = embedded ? parent : window
  if (ios) {
    window.webkit = {
      messageHandlers: {
        CMSScriptMessageChannel: { postMessage: payload => iosCalls.push(payload) },
      },
    }
  }
  if (android)
    window.CMSScriptMessageChannel = { postMessage: payload => androidCalls.push(payload) }

  const module = { exports: {} }
  runInNewContext(source, { window, module, exports: module.exports, URL, console }, { filename: sourcePath })

  const emit = (data, { origin = hostOrigin, source = parent } = {}) => {
    for (const listener of listeners.get('message') || [])
      listener({ data, origin, source })
  }
  const ready = options => emit({ type: 'web-bridge-ready' }, options)
  const reply = (payload, data, { code = '1', ...options } = {}) => {
    emit({ code, methodId: payload.params.methodId, data }, options)
  }
  return { bridge: module.exports.default, window, parent, sent, iosCalls, androidCalls, emit, ready, reply }
}

function observe(promise) {
  const state = { settled: false }
  promise.then(() => {
    state.settled = true
  }, () => {
    state.settled = true
  })
  return state
}

contract('跨源宿主握手释放排队调用，后续请求固定发往真实宿主', async () => {
  const runtime = createRuntime()
  const user = runtime.bridge.call('getUserInfo', { requestedBy: '子页面' })
  const pkg = runtime.bridge.call('getPackageName')
  assert.equal(runtime.sent.length, 0)
  runtime.ready()
  assert.equal(runtime.sent.length, 2)
  const [userCall, pkgCall] = runtime.sent
  assert.equal(userCall.targetOrigin, hostOrigin)
  assert.equal(pkgCall.targetOrigin, hostOrigin)
  assert.equal(userCall.payload.params.requestedBy, '子页面')
  assert.notEqual(userCall.payload.params.methodId, pkgCall.payload.params.methodId)
  runtime.reply(userCall.payload, { token: '测试令牌' })
  runtime.reply(pkgCall.payload, { packageName: '测试包名' })
  assert.equal((await user).token, '测试令牌')
  assert.equal((await pkg).packageName, '测试包名')
  const next = runtime.bridge.call('getUserInfo')
  assert.equal(runtime.sent.at(-1).targetOrigin, hostOrigin)
  runtime.reply(runtime.sent.at(-1).payload, { token: '后续令牌' })
  assert.equal((await next).token, '后续令牌')
})

contract('非父窗口、空来源、不透明来源和非法协议不能完成握手', async () => {
  const runtime = createRuntime()
  const pending = runtime.bridge.call('getUserInfo')
  runtime.ready({ source: {} })
  runtime.ready({ source: null })
  for (const origin of ['', 'null', 'file://', 'data:text/html,测试', 'ftp://host.example'])
    runtime.ready({ origin })
  assert.equal(runtime.sent.length, 0)
  runtime.ready()
  assert.equal(runtime.sent.length, 1)
  assert.equal(runtime.sent[0].targetOrigin, hostOrigin)
  runtime.reply(runtime.sent[0].payload, { accepted: true })
  assert.equal((await pending).accepted, true)
})

contract('有效 HTTP 宿主也可握手并使用精确目标来源', async () => {
  const runtime = createRuntime()
  const pending = runtime.bridge.call('getUserInfo')
  const origin = 'http://localhost:3000'
  runtime.ready({ origin })
  assert.equal(runtime.sent[0].targetOrigin, origin)
  runtime.reply(runtime.sent[0].payload, { accepted: true }, { origin })
  assert.equal((await pending).accepted, true)
})

contract('重复同来源握手不会重放已释放的队列', async () => {
  const runtime = createRuntime()
  const pending = runtime.bridge.call('getUserInfo')
  runtime.ready()
  runtime.ready()
  runtime.ready()
  assert.equal(runtime.sent.length, 1)
  runtime.reply(runtime.sent[0].payload, { accepted: true })
  await pending
})

contract('首次握手后父窗口变更来源不能改绑或伪造回包及事件', async () => {
  const runtime = createRuntime()
  runtime.ready()
  const events = []
  runtime.bridge.on('pageWillAppear', event => events.push(event.data.value))
  runtime.ready({ origin: otherOrigin })
  const pending = runtime.bridge.call('getUserInfo')
  const state = observe(pending)
  const call = runtime.sent.at(-1)
  assert.equal(call.targetOrigin, hostOrigin)
  runtime.reply(call.payload, { value: '伪造' }, { origin: otherOrigin })
  runtime.emit({ method: 'pageWillAppear', data: { value: '伪造' } }, { origin: otherOrigin })
  await setImmediate()
  assert.equal(state.settled, false)
  assert.deepEqual(events, [])
  runtime.reply(call.payload, { value: '真实' })
  runtime.emit({ method: 'pageWillAppear', data: { value: '真实' } })
  assert.equal((await pending).value, '真实')
  assert.deepEqual(events, ['真实'])
})

contract('来源相同但不是直接父窗口的回包和事件仍被拒绝', async () => {
  const runtime = createRuntime()
  runtime.ready()
  const events = []
  runtime.bridge.on('updateUserInfo', event => events.push(event.data.user))
  const pending = runtime.bridge.call('getUserInfo')
  const state = observe(pending)
  const call = runtime.sent.at(-1)
  runtime.reply(call.payload, { user: '伪造' }, { source: {} })
  runtime.emit({ method: 'updateUserInfo', data: { user: '伪造' } }, { source: {} })
  await setImmediate()
  assert.equal(state.settled, false)
  assert.deepEqual(events, [])
  runtime.reply(call.payload, { user: '真实' })
  runtime.emit({ method: 'updateUserInfo', data: { user: '真实' } })
  assert.equal((await pending).user, '真实')
  assert.deepEqual(events, ['真实'])
})

contract('握手前的事件既不通知监听者，也不污染稍后注册的监听者', () => {
  const runtime = createRuntime()
  const live = []
  const late = []
  runtime.bridge.on('pageWillAppear', event => live.push(event.data.value))
  runtime.emit({ method: 'pageWillAppear', data: { value: '握手前' } })
  runtime.emit({ method: 'updateUserInfo', data: { value: '握手前' } })
  runtime.ready()
  runtime.bridge.on('updateUserInfo', event => late.push(event.data.value))
  assert.deepEqual(live, [])
  assert.deepEqual(late, [])
  runtime.emit({ method: 'pageWillAppear', data: { value: '可信' } })
  runtime.emit({ method: 'updateUserInfo', data: { value: '可信' } })
  assert.deepEqual(live, ['可信'])
  assert.deepEqual(late, ['可信'])
})

contract('iOS 通道优先于 Android 和 iframe，原生回调无需握手', async () => {
  const runtime = createRuntime({ ios: true, android: true })
  const pending = runtime.bridge.call('getUserInfo', { requestedBy: '原生' })
  assert.equal(runtime.iosCalls.length, 1)
  assert.equal(runtime.androidCalls.length, 0)
  assert.equal(runtime.sent.length, 0)
  const payload = runtime.iosCalls[0]
  assert.equal(typeof payload, 'object')
  assert.equal(payload.params.requestedBy, '原生')
  runtime.window.CMSJsCallBack({ code: '1', methodId: payload.params.methodId, data: { platform: 'ios' } })
  assert.equal((await pending).platform, 'ios')
  runtime.ready()
  const next = runtime.bridge.call('getPackageName')
  assert.equal(runtime.iosCalls.length, 2)
  assert.equal(runtime.sent.length, 0)
  runtime.window.CMSCallJsMessage({ code: '1', methodId: runtime.iosCalls[1].params.methodId, data: { packageName: 'ios' } })
  assert.equal((await next).packageName, 'ios')
})

contract('Android 通道优先于 iframe 并保留 JSON 字符串载荷', async () => {
  const runtime = createRuntime({ android: true })
  runtime.ready()
  const pending = runtime.bridge.call('getUserInfo', { requestedBy: '原生' })
  assert.equal(runtime.androidCalls.length, 1)
  assert.equal(runtime.sent.length, 0)
  assert.equal(typeof runtime.androidCalls[0], 'string')
  const payload = JSON.parse(runtime.androidCalls[0])
  assert.equal(payload.method, 'getUserInfo')
  assert.equal(payload.params.requestedBy, '原生')
  runtime.window.CMSCallJsMessage({ code: '1', methodId: payload.params.methodId, data: { platform: 'android' } })
  assert.equal((await pending).platform, 'android')
})

contract('两种原生回调入口保留业务错误和事件通知行为', async () => {
  for (const options of [{ ios: true }, { android: true }]) {
    const runtime = createRuntime(options)
    const events = []
    runtime.bridge.on('pageWillAppear', event => events.push(event.data.value))
    for (const callback of ['CMSJsCallBack', 'CMSCallJsMessage']) {
      const pending = runtime.bridge.call('getUserInfo')
      const rejection = assert.rejects(pending, /原生业务失败/)
      const payload = options.ios ? runtime.iosCalls.at(-1) : JSON.parse(runtime.androidCalls.at(-1))
      runtime.window[callback]({ code: '0', methodId: payload.params.methodId, data: { msg: '原生业务失败' } })
      await rejection
      runtime.window[callback]({ method: 'pageWillAppear', data: { value: callback } })
    }
    assert.deepEqual(events, ['CMSJsCallBack', 'CMSCallJsMessage'])
  }
})

contract('可信 iframe 回包保留失败码语义和默认错误信息', async () => {
  const runtime = createRuntime()
  runtime.ready()
  for (const code of ['0', 1]) {
    const pending = runtime.bridge.call('getUserInfo')
    const rejection = assert.rejects(pending, /调用失败/)
    runtime.reply(runtime.sent.at(-1).payload, {}, { code })
    await rejection
  }
})

contract('没有原生通道的顶层页面仍明确拒绝桥接调用', async () => {
  const runtime = createRuntime({ embedded: false })
  await assert.rejects(runtime.bridge.call('getUserInfo'), /JSBridge 通道不存在/)
  assert.equal(runtime.sent.length, 0)
})

contract('支持早到事件的项目仅缓存可信握手后的事件，并只补发一次', () => {
  const runtime = createRuntime()
  runtime.emit({ method: 'pageWillAppear', data: { value: '握手前' } })
  runtime.ready()
  runtime.emit({ method: 'pageWillAppear', data: { value: '其他窗口' } }, { source: {} })
  runtime.emit({ method: 'pageWillAppear', data: { value: '其他来源' } }, { origin: otherOrigin })
  runtime.emit({ method: 'pageWillAppear', data: { value: '可信早到' } })
  const first = []
  const second = []
  runtime.bridge.on('pageWillAppear', event => first.push(event.data.value))
  runtime.bridge.on('pageWillAppear', event => second.push(event.data.value))
  assert.deepEqual(first, ['可信早到'])
  assert.deepEqual(second, [])
  runtime.ready()
  assert.deepEqual(first, ['可信早到'])
  runtime.emit({ method: 'pageWillAppear', data: { value: '实时事件' } })
  assert.deepEqual(first, ['可信早到', '实时事件'])
  assert.deepEqual(second, ['实时事件'])
}, { skip: !supportsEarlyEvents })

contract('activity 保留移除单个及全部事件监听的能力', () => {
  const runtime = createRuntime()
  runtime.ready()
  let first = 0
  let second = 0
  const firstListener = () => first++
  const secondListener = () => second++
  runtime.bridge.on('pageWillAppear', firstListener)
  runtime.bridge.on('pageWillAppear', secondListener)
  runtime.emit({ method: 'pageWillAppear' })
  runtime.bridge.off('pageWillAppear', firstListener)
  runtime.emit({ method: 'pageWillAppear' })
  assert.equal(first, 1)
  assert.equal(second, 2)
  runtime.bridge.off('pageWillAppear')
  runtime.emit({ method: 'pageWillAppear' })
  assert.equal(first, 1)
  assert.equal(second, 2)
}, { skip: projectName !== 'activity' })
