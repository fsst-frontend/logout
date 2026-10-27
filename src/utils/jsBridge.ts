declare global {
  interface Window {
    webkit?: {
      messageHandlers?: {
        [key: string]: {
          postMessage: (data: any) => any
        }
      }
    }
    CMSScriptMessageChannel?: {
      postMessage: (data: any) => any
    }
    CMSJsCallBack?: (data: any) => void
    CMSCallJsMessage?: (data: any) => void
  }
}

let callId = 0
const callbackMap = {}
const eventMap = {}

/** 宿主与子页可跨源，以直接父窗口首次握手的来源为准。 */
let parentOrigin: string | undefined
const pendingPayloads: any[] = []

/**
 * H5 调用 APP 方法
 * @param {string} method - 方法名（如 showToast）
 * @param {object} data - 参数（可选）
 * @returns {Promise<any>}
 */

function callNative(method, data = {}): Promise<any> {
  return new Promise((resolve, reject) => {
    const methodId = `cb_${method}_${Date.now()}_${++callId}`
    const payload = {
      method,
      params: {
        ...data,
        methodId,
      },
    }
    callbackMap[methodId] = function (res) {
      if (res.code === '1') {
        resolve(res.data)
      }
      else {
        reject(new Error(res.data?.msg || '调用失败'))
      }
      delete callbackMap[methodId]
    }
    try {
      if (window.webkit?.messageHandlers?.CMSScriptMessageChannel) {
        window.webkit.messageHandlers.CMSScriptMessageChannel.postMessage(payload)
      }
      else if (window.CMSScriptMessageChannel) {
        window.CMSScriptMessageChannel.postMessage(JSON.stringify(payload))
      }
      else if (window.parent !== window) {
        if (!parentOrigin) {
          pendingPayloads.push(payload)
        }
        else {
          window.parent.postMessage(payload, parentOrigin)
        }
      }
      else {
        reject(new Error('JSBridge 通道不存在'))
      }
    }
    catch (err) {
      const errorResponse = {
        code: '0',
        method,
        data: {
          msg: err.message || '调用异常',
        },
      }
      reject(errorResponse)
    }
  })
}

function onAppMessage({ code = '0', methodId, method, data = {} }) {
  if (methodId && callbackMap[methodId]) {
    callbackMap[methodId]({ code, methodId, data })
  }
  if (method && eventMap[method]) {
    const eventData = { code: '1', method, data }
    eventMap[method].forEach(fn => fn(eventData))
  }
}

/**
 * 注册事件监听（App 主动通知 H5）
 * @param {string} event 事件名
 * @param {Function} callback 回调函数
 */
function on(event, callback) {
  if (!eventMap[event]) {
    eventMap[event] = []
  }
  eventMap[event].push(callback)
}

window.CMSJsCallBack = onAppMessage
window.CMSCallJsMessage = onAppMessage
window.addEventListener('message', (event) => {
  if (window.parent === window || event.source !== window.parent)
    return
  if (!event.data || typeof event.data !== 'object')
    return
  if (event.data.type === 'web-bridge-ready') {
    if (!/^https?:\/\//.test(event.origin))
      return
    // 首次握手锁定直接父窗口的来源，后续握手不能改绑。
    if (!parentOrigin)
      parentOrigin = event.origin
    if (event.origin !== parentOrigin)
      return
    const queued = pendingPayloads.splice(0)
    for (const payload of queued) {
      window.parent.postMessage(payload, parentOrigin)
    }
    return
  }
  if (!parentOrigin || event.origin !== parentOrigin)
    return
  onAppMessage(event.data)
})

export default {
  call: callNative,
  on,
}
