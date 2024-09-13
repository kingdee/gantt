import { LocaleMap } from "../types/public-types"

export let SOURCE = {}

export const setLangMap = (localeMap: LocaleMap) => {
  SOURCE = localeMap
}

// 国际化
export const translation = (key: string = '', variables?: any) => {
  let str = SOURCE[key] || ''
  Object.entries(variables || {}).forEach((item: any) => {
    str = str.replace(new RegExp(`{${item[0]}}`, 'g'), item[1])
  })
  return str
}
