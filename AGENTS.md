## ⚠️ 语言强制要求（最高优先级）

- 内部思考过程（thinking/reasoning）必须使用**简体中文**
- 所有对外输出必须使用**简体中文**
- 所有代码注释、解释和沟通也请使用中文

# AGENTS.md — Logout 邀请有礼

## 项目概述

金融交易平台移动端邀请有礼/合作伙伴 H5 页面，运行在原生 App 的 WebView 中。基于 Vue 3 + Vite + Vant 4 移动端模板，通过 JSBridge 与原生 App 通信。主要功能包括**邀请好友**、**返佣管理**、**排行榜**、**海报分享**等合作伙伴相关业务。模板来源：`easy-temps/vue3-vant-mobile`。

## 技术栈

| 项目 | 值 |
|------|-----|
| **项目名** | `vue3-vant-mobile` |
| **版本** | `3.10.2` |
| **Vue** | `^3.5.14` |
| **Vite** | `^6.3.5` |
| **UI 框架** | Vant `^4.9.19` |
| **路由** | Vue Router `^4.5.1` (文件路由, Hash 模式) |
| **状态管理** | Pinia `^3.0.2` (+ persistedstate) |
| **国际化** | Vue I18n `^11.1.3` |
| **CSS** | UnoCSS `66.1.2` + Less + postcss-mobile-forever |
| **HTTP** | Axios `^1.9.0` |
| **图表** | ECharts `^5.6.0` |
| **轮播** | Swiper `^11.2.10` |
| **二维码** | qrcode `^1.5.4` |
| **海报** | html2canvas `^1.4.1` |
| **包管理器** | `pnpm@10.11.0` |
| **TypeScript** | `^5.8.3` |

## 目录结构

```
logout/
├── src/
│   ├── main.ts                 # 入口 (JSBridge 初始化 → 挂载)
│   ├── App.vue                 # 根组件 (van-config-provider + keep-alive)
│   ├── pages/                  # ★ 文件路由页面
│   │   ├── index.vue           # ★ 邀请有礼首页 (核心页面)
│   │   ├── [...all].vue        # 404 页面
│   │   ├── invite/             # 好友邀请页
│   │   ├── detail/             # 用户明细页 (流水列表)
│   │   │   └── more/           # 更多详情
│   │   ├── rule/               # 活动规则页 (合作伙伴计划)
│   │   │   └── old.vue         # 旧版规则
│   │   ├── invite-setting/     # 邀请设置页
│   │   └── rebate-variety/     # 返佣品种配置页
│   ├── components/             # 组件 (自动注册)
│   │   ├── ArcTabs.vue         # 弧形标签切换
│   │   ├── FAQ.vue             # 常见问题组件
│   │   ├── NavBar.vue          # 导航栏
│   │   ├── TabBar.vue          # 底部标签栏
│   │   ├── Tabs.vue            # 标签页
│   │   ├── TipsModal.vue       # 提示弹窗
│   │   ├── Chart/              # 图表 (含暗色主题)
│   │   ├── Partner/            # 合作伙伴组件
│   │   │   ├── Ad.vue          # 广告
│   │   │   ├── Income.vue      # 收益
│   │   │   ├── NumberBar.vue   # 数字条
│   │   │   ├── Rank.vue        # 排行榜
│   │   │   ├── Sub.vue         # 下线列表
│   │   │   └── UserCard.vue    # 用户卡片
│   │   ├── invite/             # ★ 邀请相关组件
│   │   │   ├── Overview.vue    # 总览
│   │   │   ├── Invitation.vue  # 我的邀请
│   │   │   ├── Rebate.vue      # 我的返佣
│   │   │   ├── Record.vue      # 回赠记录
│   │   │   ├── InviteCard.vue  # 邀请码卡片
│   │   │   ├── PosterInvitePopup.vue  # 海报邀请弹窗
│   │   │   ├── PosterPage.vue  # 海报页面
│   │   │   ├── QrcodeModal.vue # 二维码弹窗
│   │   │   └── FriendStep.vue  # 好友步骤引导
│   │   └── rebate-variety/     # 返佣品种组件
│   ├── composables/
│   │   └── dark.ts             # 暗色模式
│   ├── stores/modules/
│   │   ├── partner.ts          # 合作伙伴下级信息
│   │   ├── user.ts             # 用户状态 (持久化)
│   │   └── routeCache.ts       # 路由缓存 Store
│   ├── utils/
│   │   ├── request.ts          # Axios 封装 (Token注入/错误处理)
│   │   ├── jsBridge.ts         # ★ JSBridge (iOS/Android/iframe)
│   │   ├── auth.ts             # 认证 (Token/DeviceId)
│   │   ├── i18n.ts             # 国际化初始化 (14种语言)
│   │   └── genPoster.ts        # 海报生成工具
│   ├── api/
│   │   ├── partner.ts          # 合作伙伴 API (收益/排行/下线/流水/提现)
│   │   ├── invite.ts           # 邀请 API (总览/受邀者/返佣/回赠/邀请码)
│   │   ├── rebate-variety.ts   # 返佣品种 API
│   │   └── user.ts             # 用户 API
│   ├── locales/                # ★ 14种语言翻译文件
│   │   ├── zh-Hans.json        # 简体中文 (主语言)
│   │   ├── zh-Hant.json        # 繁体中文
│   │   ├── en-US.json          # 英语
│   │   ├── ar-SA.json / da-DK.json / es-ES.json / fil-PH.json / ...
│   └── styles/
│       ├── app.less            # 全局样式 (暗色模式 + Gilroy 字体)
│       └── var.less            # Vant CSS 变量覆盖
├── build/vite/                 # Vite 插件集合
│   ├── index.ts                # 12 插件注册
│   └── optimize.ts             # 预构建优化
├── polymer/env/
│   └── env.js                  # 运行时注入 window.__APP_CONFIG__
├── mock/                       # Mock 服务
├── vite.config.ts
├── uno.config.ts               # presetWind4 + shortcuts
├── postcss.config.ts           # postcss-mobile-forever (375 视口)
└── tsconfig.json
```

## 路由

**基于文件路由** (`unplugin-vue-router@0.12.0`)，Hash 模式：

| 路由 | 页面 | 说明 |
|------|------|------|
| `/` | 邀请有礼首页 | 核心页面 (合作伙伴入口) |
| `/invite` | 好友邀请 | 邀请列表/佣金详情 |
| `/detail` | 用户明细 | 收益流水列表 |
| `/detail/more` | 更多详情 | 流水详情 |
| `/rule` | 活动规则 | 合作伙伴计划规则全文 |
| `/rule/old` | 旧版规则 | 历史规则页 |
| `/invite-setting` | 邀请设置 | 邀请码/备注管理 |
| `/rebate-variety` | 返佣品种 | 返佣比例配置表 |

SFC 可使用 `<route lang="json5">` 自定义 meta (title, i18n, keepAlive)。

## Vite 插件体系

| 插件 | 用途 |
|------|------|
| `unplugin-vue-router` | 文件路由生成 |
| `unplugin-vue-components` | 组件自动导入 (+ VantResolver) |
| `unplugin-auto-import` | API 自动导入 (vue/vueuse/router/i18n) |
| `@intlify/unplugin-vue-i18n` | i18n 消息预编译 |
| `unocss/vite` | 原子 CSS |
| `vite-plugin-mock-dev-server` | Mock 服务 |
| `@vitejs/plugin-legacy` | 旧浏览器兼容 |
| `vite-plugin-pwa` | PWA 支持 |

组件无需手动 import，`src/components/` 和 Vant 组件自动可用。

## JSBridge

`src/utils/jsBridge.ts` 支持 iOS/Android/iframe 三通道：
- `jsBridge.call(method, data)` — 调用原生方法
- `jsBridge.on(event, callback)` — 监听 `pageWillAppear`、`updateUserInfo`

## Axios 封装

`src/utils/request.ts`：
- baseURL: `window.__APP_CONFIG__.API_BASE_HOST`
- 自动注入 headers: `Authorization`, `x-request-id`, `x-language`
- API 前缀：`/violet/api/taskcenter/...`

## 环境变量

```bash
VITE_APP_PUBLIC_PATH=./
VITE_APP_PREVIEW=true
VITE_APP_OUT_DIR=dist
VITE_APP_VCONSOLE=false
```

运行时通过 `polymer/env/env.js` 注入 `window.__APP_CONFIG__` (H5_BASE_HOST, API_BASE_HOST, WS_URL, VERSION 等)。

## 国际化

Vue I18n v11。支持 **14 种语言**：
zh-Hans, zh-Hant, en-US, ar-SA, da-DK, es-ES, fil-PH, fr-CA, fr-FR, ms-MY, pt-PT, ru-RU, tr-TR, vi-VN。
- 语言优先级：`localStorage` → `navigator.language` → `en-US`
- 自动同步 Vant 组件语言包
- 翻译覆盖：邀请有礼核心文案 (邀请方式/返佣比例/总览等) + 活动规则全文 (~100+ key)

## 开发/构建

```bash
pnpm dev           # 开发 (port 3000, Mock 8086)
pnpm build:dev     # 开发构建 (含类型检查)
pnpm build:pro     # 生产构建 (含类型检查)
pnpm preview       # 预览构建产物
pnpm lint          # ESLint
pnpm typecheck     # vue-tsc --noEmit
```

Git hooks：pre-commit (ESLint 自动修复) + commit-msg (commitlint)。

## 测试

**无测试框架或测试文件**。

## 禁止事项

- 禁止手动 import 组件 — 使用自动导入
- 禁止硬编码 API URL — 使用环境变量
- 禁止硬编码文本 — 使用 `$t()`
- 添加/修改翻译后必须同步更新所有 14 个语言文件
- 暗色模式通过 `van-config-provider` + `useDark()` 控制
