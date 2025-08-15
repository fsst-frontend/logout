import { createI18n } from 'vue-i18n'
import enUS from 'vant/es/locale/lang/en-US'
import zhCN from 'vant/es/locale/lang/zh-CN'
import { Locale } from 'vant'
import type { PickerColumn } from 'vant'

const FALLBACK_LOCALE = 'en-US'

const vantLocales = {
  'zh-Hans': zhCN,
  'en-US': enUS,
}

export const languageColumns: PickerColumn = [
  { text: '中文（简体）', value: 'zh-Hans' },
  { text: '英语（美国）', value: 'en-US' },
  { text: '土耳其语（土耳其）', value: 'tr-TR' },
  { text: '菲律宾语（菲律宾）', value: 'fil-PH' },
  { text: '越南语（越南）', value: 'vi-VN' },
  { text: '俄语（俄罗斯）', value: 'ru-RU' },
  { text: '阿拉伯语（沙特）', value: 'ar-SA' },
  { text: '西班牙语（西班牙）', value: 'es-ES' },
  { text: '法语（法国）', value: 'fr-FR' },
  { text: '葡萄牙语（葡萄牙）', value: 'pt-PT' },
  { text: '马来语（马来西亚）', value: 'ms-MY' },
  { text: '中文（繁體）', value: 'zh-Hant' },
  { text: '法语（加拿大）', value: 'fr-CA' },
  { text: '丹麦语（丹麦）', value: 'da-DK' },
]

export const i18n = setupI18n()
type I18n = typeof i18n

export const locale = computed({
  get() {
    return i18n.global.locale.value
  },
  set(language: string) {
    setLang(language, i18n)
  },
})

function setupI18n() {
  const locale = getI18nLocale()
  const i18n = createI18n({
    locale,
    legacy: false,
  })
  setLang(locale, i18n)
  return i18n
}

async function setLang(lang: string, i18n: I18n) {
  await loadLocaleMsg(lang, i18n)

  document.querySelector('html').setAttribute('lang', lang)
  localStorage.setItem('language', lang)
  i18n.global.locale.value = lang

  // 设置 vant 组件语言包
  Locale.use(lang, vantLocales[lang])
}

// 加载本地语言包
async function loadLocaleMsg(locale: string, i18n: I18n) {
  const messages = await import(`../locales/${locale}.json`)
  i18n.global.setLocaleMessage(locale, messages.default)
}

// 获取当前语言对应的语言包名称
function getI18nLocale() {
  const storedLocale = localStorage.getItem('language') || navigator.language

  const langs = languageColumns.map(v => v.value as string)

  // 存在当前语言的语言包 或 存在当前语言的任意地区的语言包
  const foundLocale = langs.find(v => v === storedLocale || v.indexOf(storedLocale) === 0)

  // 若未找到，则使用 默认语言包
  const locale = foundLocale || FALLBACK_LOCALE

  return locale
}
