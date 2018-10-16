import Cookies from 'js-cookie'

export function getCookiesName() {
  return Cookies.get('nameKey')
}

export function setCookiesName(name) {
  return Cookies.set('nameKey', name)
}

export function removeCookiesName() {
  return Cookies.remove('nameKey')
}
