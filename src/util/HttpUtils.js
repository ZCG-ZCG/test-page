/* eslint-disable no-extend-native,no-unused-vars */
import axios from 'axios'
import { getCookie } from './CookieUtils'
import config from '../config'
import { Message } from 'element-ui'
// import {getCookie} from '@/common/CookieUtils'

String.prototype.format = function () {
	if (arguments.length === 0) return this
	var param = arguments[0]
	var s = this
	if (typeof (param) === 'object') {
		for (var key in param) {
			s = s.replace(new RegExp('\\{' + key + '\\}', 'g'), param[key])
		}
		return s
	} else {
		for (var i = 0; i < arguments.length; i++) {
			s = s.replace(new RegExp('\\{' + i + '\\}', 'g'), arguments[i] + '')
		}
		return s
	}
}
axios.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8'
export default {

	request (option) {
		let method = option.method ? option.method : 'get'

		let putData = {
			url: config.api[option.api],
			method: method
		}

		if (option.restTag) {
			putData.url = putData.url.format(option.restTag)
		}
		if (method === 'get') {
			if (option.suffix) {
				putData.url = putData.url + '/' + option.suffix
			} else if (option.q) {
				putData.params = { q: option.data }
			} else {
				putData.params = option.data
			}
		} else if (method === 'post') {
			putData.data = option.data
		} else if (method === 'put') {
			if (option.suffix) {
				putData.url = putData.url + '/' + option.suffix
			}
			putData.data = option.data
		} else if (method === 'delete') {
			putData.params = option.data
		}
		/**
     * 请求拦截：在请求之前执行 比如loading处理
     * */
		return new Promise((resolve, reject) => {
			axios.interceptors.request.use((config) => {
				if (option.isToken) {
					config.headers['Authorization'] = getCookie('token')
				}
				return config
			})
			/**
       * 请求完成后执行
       * */
			axios.interceptors.response.use(
				response => {
					if (response.status !== 200) {
						Message.error({ message: response.data.code + ':' + response.data.message })
					}
					return response
				},

				error => {
					if (error.response.status) {
						return
					}
				}

			)
			axios(putData).then(res => {
				resolve({
					status: 0,
					result: res.data
				})
			}).catch(() => {
				// reject('error');
			})
		})
	},

	multiRequest (_this, options) {
		let requestData = []
		for (var k in options) {
			var option = options[k]
			let method = option.method ? option.method : 'get'
			let putData = {
				api: option.api,
				url: config.api[option.api],
				method: method
			}
			if (option.isToken) {
				putData.isToken = false
			}
			if (method === 'get') {
				putData.params = option.data
			} else if (method === 'post') {
				putData.data = option.data
			}
			requestData[k] = new Promise((resolve, reject) => {
				axios.interceptors.request.use((config) => {
					if (options[k].isToken) {
						config.headers['Authorization'] = getCookie('token') ? getCookie('token') : ''
					}
					return config
				})
				/**
         * 请求完成后执行
         * */
				axios.interceptors.response.use(
					response => {
						// common.removeLoading();
						return response
					},
					error => {
						if (error.response.status) {
							// _this.$message.error(error.response.data.message)
						}
					}
				)
				axios(putData).then(res => {
					resolve({
						status: 0,
						result: res.data
					})
				}).catch(() => {
				})
			})
		}
		return axios.all(requestData)
			.then(axios.spread(_this.multiRequestCallBack))
	}
}
