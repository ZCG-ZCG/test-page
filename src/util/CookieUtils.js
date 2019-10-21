/* eslint-disable one-var */
/**
 * Created by ibm on 2018/5/8.
 */
// 获取cookie、
export function getCookie (name) {
	var arr, reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)')
	if (!(arr = document.cookie.match(reg))) {
		return null
	} else {
		return unescape(arr[2])
	}
}

// 设置cookie,增加到vue实例方便全局调用
export function setCookie (name, value, expiredays) {
	var exdate = new Date()
	if (expiredays <= 0) {
		expiredays = 1000 * 60 * 60
	}
	exdate.setDate(exdate.getDate() + expiredays)
	document.cookie = name + '=' + escape(value) + ((expiredays == null) ? '' : ';expires=' + exdate.toGMTString())
}

// 删除cookie
export function delCookie (name) {
	var exp = new Date()
	exp.setTime(exp.getTime() - 1)
	var cval = getCookie(name)
	if (cval != null) {
		document.cookie = name + '=' + cval + ';expires=' + exp.toGMTString()
	}
}
