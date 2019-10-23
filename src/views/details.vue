<template>
  <div>
    <div class="title">亲爱的客户：您的方案执行进度如下</div>
    <el-row class="layout-margin">
      <el-col :span="8">
        <span>总任务进度：</span>
      </el-col>
      <el-col :span="10">
        <el-progress :percentage="percentage"></el-progress>
      </el-col>
    </el-row>

    <!-- 一行中三个下载按钮 -->
    <el-row class="layout-margin" type="flex">
      <el-col :span="6" style="margin-right:20px;">
        <el-button type="primary" @click="downPositionImg">下载点位照片</el-button>
      </el-col>
      <el-col :span="6" style="margin-right:20px;">
        <el-button type="primary" @click="downPPT">下载监测PPT</el-button>
      </el-col>
      <el-col :span="6" style="margin-right:20px;">
        <el-button type="primary" @click="downComplateReporter">下载完工报告</el-button>
      </el-col>
    </el-row>

    <el-row v-for="(item) in imgList" :key="item.id" style="margin-top:20px;">
      <el-col :span="24">
        <div>
          <img class="image" style="width:300px;" v-lazy="item.imgUrl" />
          <div>
            <span>{{item.estateName}} {{item.position}} {{item.resourceNo}}</span>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import HttpUtils from '../util/HttpUtils'
// import DropDownRefresh from '@/components/DrowDownRefresh'
// import { VueBetterScroll } from 'vue2-better-scroll'

export default {
	// name: 'details',
	// components: {
	// 	VueBetterScroll
	// },
	data() {
		return {
			// 这个配置可以开启滚动条，默认为 false。当设置为 true 或者是一个 Object 的时候，都会开启滚动条，默认是会 fade 的
			// scrollbarObj: {
			// 	fade: true
			// },
			// 这个配置用于做下拉刷新功能，默认为 false。当设置为 true 或者是一个 Object 的时候，可以开启下拉刷新，可以配置顶部下拉的距离（threshold） 来决定刷新时机以及回弹停留的距离（stop）
			// pullDownRefreshObj: {
			// 	threshold: 90,
			// 	stop: 40
			// },
			// 这个配置用于做上拉加载功能，默认为 false。当设置为 true 或者是一个 Object 的时候，可以开启上拉加载，可以配置离底部距离阈值（threshold）来决定开始加载的时机
			// pullUpLoadObj: {
			// 	threshold: 0,
			// 	txt: {
			// 		more: '加载更多',
			// 		noMore: '没有更多数据了'
			// 	}
			// },
			// startY: 0, // 纵轴方向初始化位置
			code: '',
			percentage: 0,
			estateName: '',
			pptUrl: '',
			zipUrl: '',
			finishReportUrl: '',
			imgList: [],
			shareForm: {
				city: '',
				orderId: ''
			}
		}
	},
	created() {
		this.code = this.$route.query.code
		this.getDetails()
		this.getPro()
		this.getDownUrl()
	},
	mounted() {
		
	},
	methods: {
		// 下载点位照片
		downPositionImg() {
			if (this.zipUrl) {
				window.location.href = this.zipUrl
			} else {
				this.$message.error('暂时没有数据！')
			}
		},
		// 下载监测PPT
		downPPT() {
			if (this.pptUrl) {
				window.location.href = this.pptUrl
			} else {
				this.$message.error('暂时没有数据！')
			}
		},
		// 下载完工报告
		downComplateReporter() {
			if (this.finishReportUrl) {
				window.location.href = this.finishReportUrl
			} else {
				this.$message.error('暂时没有数据！')
			}
		},
		
		// 获取页面详情方法
		getDetails() {
			HttpUtils.request({
				api: 'findExtraction',
				method: 'post',
				data: {
					size: 100,
					current: 1,
					extractedCode: this.code
				}
			}).then(res => {
				return new Promise(resolve => {
					if (res.result.code === 200) {
						let data = res.result.data
						// console.log(data)
						let temp = []
						data.map(val => {
							// console.log(val.materials)
							temp.push(...val.materials)
						})
						this.imgList = temp
						resolve(this.imgList)
						console.log(temp)
					}
				})
			})
		},
		// 获取下载地址
		getDownUrl() {
			HttpUtils.request({
				api: 'downExtraction',
				method: 'post',
				data: {
					extractedCode: this.code
				}
			}).then(res => {
				if (res.result.code === 200) {
					this.pptUrl = res.result.data.pptUrl
					this.zipUrl = res.result.data.zipUrl
					this.finishReportUrl = res.result.data.finishReportUrl
				}
			})
		},
		// 获取进度条
		getPro() {
			HttpUtils.request({
				api: 'sgTaskSpeedProgress',
				method: 'post',
				data: {
					orderId: this.orderId,
					stage: this.stage,
					city: this.city,
					current: 1,
					size: 10
				}
			}).then(res => {
				if (res.result.code === 200) {
					let progress = res.result.data.progress
					this.percentage = progress
				}
			})
		}
	}
}
</script>

<style lang="stylus" scoped>
.layout-margin
  margin-top 10px

.position-box
  position fixed
  top 30px
  left 0
  right 0
  bottom 0
</style>
