/*
 * 由 Workbox 生成的 sw.js 通过 importScripts 引入（build/vite/index.ts）。
 *
 * 旧版 Service Worker 会把整套页面（index.html + 构建产物）预缓存。手机上还留着它时，
 * 每次发版后第一次打开都先显示旧页面，旧页面再去请求新镜像里早已删除的资源：坏图、chunk 加载失败。
 * 新 SW 安装时检查本作用域的预缓存里有没有旧页面或构建产物；有的话，激活后让已打开的页面
 * 重新加载一次，直接换成最新版本（旧缓存由 Workbox 激活时清掉）。
 * 现行 SW 不预缓存页面，检查结果为否，不会刷新；标记用完即删，不会循环刷新。
 */
const UPGRADE_MARK = 'sw-upgrade-reload'
const SCOPE = self.registration.scope

/** 旧版预缓存里的页面或构建产物（现行 SW 只预缓存图标与 manifest） */
function isStaleEntry(url) {
  const { pathname } = new URL(url)
  return /\.html?$/i.test(pathname) || pathname.includes('/assets/')
}

async function hasStalePrecache() {
  for (const name of await caches.keys()) {
    // Workbox 预缓存名形如 workbox-precache-v2-<scope>，同源其他子模块的缓存不看
    if (!name.includes('-precache-') || !name.includes(SCOPE))
      continue
    const keys = await (await caches.open(name)).keys()
    if (keys.some(req => isStaleEntry(req.url)))
      return true
  }
  return false
}

self.addEventListener('install', (event) => {
  // 安装时旧预缓存还在（Workbox 激活时才删），在这里判断并落一个标记给 activate
  event.waitUntil((async () => {
    if (await hasStalePrecache())
      await (await caches.open(UPGRADE_MARK)).put(SCOPE, new Response('1'))
  })().catch(() => {}))
})

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const marks = await caches.open(UPGRADE_MARK)
    if (!(await marks.match(SCOPE)))
      return
    await marks.delete(SCOPE)
    await self.clients.claim()
    const pages = await self.clients.matchAll({ type: 'window' })
    await Promise.all(pages.map(page => page.navigate(page.url).catch(() => {})))
  })().catch(() => {}))
})
