<template>
  <div>
    <main class="position-box">
      <!-- 需要一个创建一个父容器 组件高度默认等于父容器的高度 -->
      <vue-better-scroll
        class="wrapper"
        ref="scroll"
        :scrollbar="scrollbarObj"
        :pullDownRefresh="pullDownRefreshObj"
        :pullUpLoad="pullUpLoadObj"
        :startY="parseInt(startY)"
        @pulling-down="onPullingDown"
        @pulling-up="onPullingUp"
      >
        <div class="title" style="padding-top:30px;">亲爱的客户：您的方案执行进度如下</div>
        <el-row class="layout-margin">
          <el-col :span="8">
            <span>总任务进度：</span>
          </el-col>
          <el-col :span="10">
            <el-progress :percentage="percentage" type="line" :show-text="true"></el-progress>
          </el-col>
        </el-row>

        <!-- 一行中三个下载按钮 -->
        <el-row class="layout-margin" type="flex" :span="24">
          <el-col :span="4" style="margin-right:20px;" v-if="orderShare">
            <el-button type="primary" @click="downPositionImg" size="mini">下载点位照片</el-button>
          </el-col>
          <el-col :span="4" style="margin-right:20px;" v-if="orderShare" :offset="3">
            <el-button type="primary" @click="downPPT" size="mini">下载监测PPT</el-button>
          </el-col>
          <el-col :span="4" style="margin-right:20px;" v-if="orderShare" :offset="3">
            <el-button type="primary" @click="downComplateReporter" size="mini">下载完工报告</el-button>
          </el-col>
          <el-col :span="8" style="margin-right:20px;" v-if="!orderShare" :offset="8">
            <el-button type="primary" @click="downShareZip" size="mini">下载快速上刊照</el-button>
          </el-col>
        </el-row>

        <el-row v-for="(item,index) in imgList" :key="index" style="margin-top:20px;">
          <el-col :span="24">
            <div>
              <img class="image" style="width:300px;" :src="item.imgUrl" />
              <div>
                <span>{{item.estateName}} {{item.position}} {{item.resourceNo}}</span>
                <!-- <span>{{item.id}}</span> -->
              </div>
            </div>
          </el-col>
        </el-row>

        <!-- <el-row v-for="(item) in imgList" :key="item.id" style="margin-top:20px;">
      <el-col :span="24">
        <div>
          <img class="image" style="width:300px;" v-lazy="item.imgUrl" />
          <div>
            <span>{{item.estateName}} {{item.position}} {{item.resourceNo}}</span>
          </div>
        </div>
      </el-col> 
        </el-row>-->
      </vue-better-scroll>
    </main>
    <button class="go-top" @click="scrollTo" size="mini">返回顶部</button>
  </div>
</template>

<script>
import HttpUtils from '../util/HttpUtils'
import { getCookie } from '../util/CookieUtils'

export default {
	beforeCreate() {
		this.$options.components.VueBetterScroll = require('../components/better-scroll/index.js').default
	},
	data() {
		return {
			// 这个配置可以开启滚动条，默认为 false。当设置为 true 或者是一个 Object 的时候，都会开启滚动条，默认是会 fade 的
			scrollbarObj: {
				fade: true
			},
			// 这个配置用于做下拉刷新功能，默认为 false。当设置为 true 或者是一个 Object 的时候，可以开启下拉刷新，可以配置顶部下拉的距离（threshold） 来决定刷新时机以及回弹停留的距离（stop）
			pullDownRefreshObj: {
				threshold: 90,
				stop: 40
			},
			// 这个配置用于做上拉加载功能，默认为 false。当设置为 true 或者是一个 Object 的时候，可以开启上拉加载，可以配置离底部距离阈值（threshold）来决定开始加载的时机
			pullUpLoadObj: {
				threshold: 20,
				txt: {
					more: '加载更多',
					noMore: '没有更多数据了'
				}
			},
			startY: 0, // 纵轴方向初始化位置
			code: '',
			orderShare: false,
			percentage: 0,
			estateName: '',
			pptUrl: '',
			zipUrl: '',
			finishReportUrl: '',
			imgList: [],
			shareForm: {
				// city: '',
				// stage: '',
				// orderId: ''
			},
			current: 1,
			pages: ''
		}
	},
	created() {
		this.code = JSON.parse(getCookie('extractedCode'))

		this.onPullingDown()
		this.getDownUrl()
		// this.getPro()
	},
	mounted() {
		// this.onPullingDown()
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
		// 下载快速上刊照
		downShareZip() {
			// console.log(this.shareForm)
			HttpUtils.request({
				api: 'downZipShare',
				method: 'post',
				data: this.shareForm
			}).then(res => {
				let shareZipUrl = res.result.data.zipUrl
				if (shareZipUrl) {
					window.location.href = shareZipUrl
				} else {
					this.$message.error('暂时没有数据！')
				}
			})
		},
		// 下载完工报告
		downComplateReporter() {
			if (this.finishReportUrl) {
				window.location.href = this.finishReportUrl
			} else {
				this.$message.error('暂时没有数据！')
			}
		},

		// 返回顶部
		scrollTo() {
			/**
			 * 三个参数分别代表
			 * 起点x轴位置
			 * 起点y轴位置
			 * 到顶点的动画时间(ms)
			 */
			this.$refs.scroll.scrollTo(0, 0, 1000)
		},

		onPullingDown() {
			console.log('下拉刷新')
			this.current = 1
			this.getDetails().then(res => {
				this.imgList = res
				this.$refs.scroll.forceUpdate(true)
			})
		},
		onPullingUp() {
			console.log('上拉加载')
			++this.current

			this.getDetails().then(res => {
				if (this.current <= this.pages) {
					// console.log(res)
					this.imgList = this.imgList.concat(res)
					this.$refs.scroll.forceUpdate(true)
				} else {
					this.$refs.scroll.forceUpdate(false)
				}
			})
		},
		// 获取页面详情方法
		getDetails() {
			// debugger
			return new Promise(resolve => {
				HttpUtils.request({
					api: 'findExtraction',
					method: 'post',
					data: {
						size: 3,
						current: this.current,
						extractedCode: this.code
					}
				}).then(res => {
					if (res.result.code === 200) {
						let data = res.result.data
						this.pages = res.result.meta.pages
						let temp = []
						data.map(val => {
							temp.push(val)
						})
						resolve(temp)
						// console.log(data)
					}
				})
			})
		},
		// 获取下载地址
		getDownUrl() {
			HttpUtils.request({
				api: 'findOrder',
				method: 'post',
				data: {
					extractedCode: this.code
				}
			}).then(res => {
				if (res.result.code === 200) {
					let data = res.result.data
					this.pptUrl = data.pptUrl
					this.zipUrl = data.zipUrl
					this.finishReportUrl = data.finishReportUrl
					this.shareForm.stage = data.stage
					this.shareForm.city = data.city
					this.shareForm.orderId = data.orderId
					this.getPro()
					if (data.orderShare) {
						this.orderShare = data.orderShare
					}
				}
			})
		},
		// 获取进度条
		getPro() {
			HttpUtils.request({
				api: 'sgTaskSpeedProgress',
				method: 'post',
				data: {
					orderId: this.shareForm.orderId,
					stage: this.shareForm.stage,
					city: this.shareForm.city,
					current: 1,
					size: 10
				}
			}).then(res => {
				if (res.result.code === 200) {
					// console.log(res.result.data)

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
  top 0px
  left 0
  right 0
  bottom 0
.go-top
  position fixed
  right 20px
  bottom 20px
  background-color #409EFF
  border-radius 5px
  border 1px solid #fff
  color #fff
  padding 10px 15px

</style>
