// const apiHost = 'http://39.100.53.120:8000'
const apiHost = 'http://192.168.1.178:8000'

export default {
	api: {
		// 查找生成验证码页面
		findExtraction: apiHost + '/extraction/findPage',
		// 查找分享页面下载相关数据
		downExtraction: apiHost + 'extraction/findOrder'
	}
}
