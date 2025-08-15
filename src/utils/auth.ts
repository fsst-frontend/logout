import jsBridge from '@/utils/jsBridge'
import { STORAGE_DEVICE_ID_KEY, STORAGE_TOKEN_KEY } from '@/stores/mutation-type'
import { useLocalStorage } from '@vueuse/core'

import { locale } from './i18n'

const token = useLocalStorage(STORAGE_TOKEN_KEY, '')
const deviceId = useLocalStorage(STORAGE_DEVICE_ID_KEY, '')

export async function initUserBridgeContext() {
  try {
    const res = await jsBridge.call('getUserInfo')

    if (res) {
      localStorage.setItem('language', res.language_code)
      locale.value = res.language_code

      localStorage.setItem('userInfo', JSON.stringify(res))
    }
    if (res?.token) {
      localStorage.setItem(STORAGE_TOKEN_KEY, res.token)
    }
    if (res?.device_id) {
      localStorage.setItem(STORAGE_DEVICE_ID_KEY, res.device_id)
    }
    if (res?.safeAreaTop) {
      const safeAreaTop = res.safeAreaTop
      document.documentElement.style.setProperty('--safe-area-inset-top', `${safeAreaTop}px`)
    }
  }
  catch (err) {
    console.warn('[JSBridge] 获取用户信息失败，使用默认值:', err)
    localStorage.setItem(
      STORAGE_TOKEN_KEY,
      'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NjE4MDc4NzMsImp0aSI6IllpclhoY2VCYVciLCJpYXQiOjE3NTQwMzE4NzMsImlzcyI6IjlwNnlqdW9hVnhuMFZ3d21TdHRJY20zWEp3bWNmUkNrIiwibmJmIjoxNzU0MDMxODczLCJzdWIiOiI4MDAwMDYzMyIsImFwcGlkIjoxLCJzaXRlIjo0LCJwbGF0Zm9ybSI6Img1IiwidWlkIjoiODAwMDA2MzMiLCJtcF91aWQiOiIiLCJkZXZpY2VfaWQiOiIzOTU4Mjc2My1DOUIyLTQ3MjAtQjM3NC0xRUY5MUYzMENEMkIiLCJ0cmFuc2FjdGlvbl9hY2NvdW50IjoxMDA3NTIsInRyYW5zYWN0aW9uX2FjY291bnRfdHlwZSI6MSwidHJhbnNhY3Rpb25fcGxhdGZvcm0iOiJNVDUiLCJsb2dpbl90aW1lIjoxNzU0MDMxODczfQ.YQN1rtvO2gmXIFbOQilx4zkqXSJL9Um65p3lUrsGLPk', // 你的默认 token
    )
    localStorage.setItem(STORAGE_DEVICE_ID_KEY, '39582763-C9B2-4720-B374-1EF91F30CD2B')
  }
}

function isLogin() {
  return !!token.value
}

function getToken() {
  return token.value
}

function setToken(newToken: string) {
  token.value = newToken
}

function clearToken() {
  token.value = null
}

// device
function getDeviceId() {
  return deviceId.value
}
function setDeviceId(newDeviceId: string) {
  deviceId.value = newDeviceId
}
function clearDeviceId() {
  deviceId.value = null
}

export { isLogin, getToken, setToken, clearToken, getDeviceId, setDeviceId, clearDeviceId }
