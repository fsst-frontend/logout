/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'

  const component: DefineComponent<Record<string, never>, Record<string, never>, any>
  export default component
}
declare global {
  interface Window {
    __APP_CONFIG__?: {
      // 接口地址
      H5_BASE_HOST: string
      // 接口地址
      API_BASE_HOST: string
      // websocket地址
      WS_URL: string
      // 文件上传地址
      STATIC_FILE_API: string
      // google store
      GOOGLE_STORE_URL: string
      // app store
      APP_STORE_URL: string
      // 版本号
      VERSION: string
    }
  }
}

export {}
