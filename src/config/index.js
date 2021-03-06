const apiHost = 'http://39.100.53.120:8000'
// const apiHost = 'http://192.168.1.178:8000'
// const apiHost = 'http://192.168.1.233:8000'
// const apiHost = 'http://epai.shxiot.cn:8000'
export default {
	api: {
		// 查找点位照片（审核打开时使用）
		findExtraction: apiHost + '/extraction/findPage',
		// 查找分享页面下载相关数据
		findOrder: apiHost + '/extraction/findOrder',
		// 查找详情页的任务完成的进度条
		findSpeedPro: apiHost + '/extraction/findSpeedPro',
		// 查找订单城市
		findCity: apiHost + '/extraction/findCity',
		// 获取任务详情进度条
		sgTaskSpeedProgress: apiHost + '/task/sgTaskSpeedProgress',
		// 下载快速上刊照
		downZipShare: apiHost + '/extraction/downZipShare',
		// 查询一定比例点位照(在审核未通过时使用)
		findPercentPage: apiHost + '/extraction/findPercentPage',
		// 查询快速上刊照（审核关闭时使用）
		findFastPhoto: apiHost + '/extraction/findFastPhoto'
	}
}
