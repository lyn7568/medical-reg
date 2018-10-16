/**
 * Created by luyanan on 18/9/12.
 */
export const comUrl = process.env.BASE_API
/**
 * 解析url参数
 * @example ?id=12345&a=b
 * @return Object {id:12345,a:b}
 */
export function urlParse(name) {
  return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.href) || ['', ''])[1].replace(/\+/g, '%20')) || null
}

/**
 * 格式化日期
 * @param  {[String]} startTime [date]
 * @return {[String]}           [return date(YYYY/MM/dd)]
 */
export function parseTime(startTime) {
  return startTime.substring(0, 4) + '/' + startTime.substring(4, 6) + '/' + startTime.substring(6, 8)
}

/**
 * 去除str前后空格
 * @param str
 */
export function trim(str) {
  return str.replace(/(^\s*)|(\s*$)/g, '')
}

/**
 * IE与非IE的下载file url
 * @param  {[String]} content   [file_url]
 * @param  {[String]} file_name [file_name]
 * @return {[type]}           [description]
 */
export function downFile(content, file_name) {
  var csvData = new Blob([content], { type: 'text/csv' })
  if (window.navigator && window.navigator.msSaveOrOpenBlob) { // for IE
    window.navigator.msSaveOrOpenBlob(csvData, file_name)
  } else {
    const aTag = document.createElement('a')
    const url = window.URL.createObjectURL(csvData)
    aTag.download = file_name
    aTag.href = url
    aTag.click()
    window.URL.revokeObjectURL(url)
  }
}

/**
 * 转换浮点数
 * @param {[Number]} a [description]
 * @param {[Number]} n [n decimal point]
 */
function SplitAndRound(a, n) {
  a = a * Math.pow(10, n)
  return (Math.round(a)) / (Math.pow(10, n))
}

/**
 * 格式化file size
 * @param  {[String]} str [file size]
 * @return {[String]}     [formatter size —— B,KB,MB,GB]
 */
export function formatterSize(str) {
  if (str < 1024) {
    return str + ' B'
  } else if (str >= 1024 && str < (1024 * 1024)) {
    return SplitAndRound(str / 1024, 2) + ' KB'
  } else if (str >= (1024 * 1024) && str < (1024 * 1024 * 1024)) {
    return SplitAndRound(str / 1024 / 1024, 2) + ' MB'
  }
}

