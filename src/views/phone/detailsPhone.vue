<template>
  <div>
    <main class="container">
      <el-container>
        <el-header style="height:4.35vh"></el-header>

        <el-main>
          <el-row type="flex">
            <p class="title-text">亲爱的客户，您的方案执行进度如下：</p>
          </el-row>

          <el-row style="margin-top:3vh;">
            <el-col :span="8">
              <p style="font-size:14px">总进度任务：</p>
            </el-col>
            <el-col :span="16" style="margin-top:2px;">
              <el-progress :percentage="percentage" :stroke-width="12"></el-progress>
            </el-col>
          </el-row>

          <el-row style="margin-top:4.5vh" :gutter="24">
            <el-col :span="7" v-if="shareForm.orderShare">
              <div class="btn-background-size down-position-img flex-auto" @click="downPositionImg">
                <img src="../../assets/phone/downPositionInner.png" style="width:20%" />
                <span style="color:#FFF;margin-left:5px;;font-size:10px;">下 载 点 位 照 片</span>
              </div>
            </el-col>
            <el-col :span="7" :offset="1" v-if="shareForm.orderShare">
              <div class="btn-background-size downPPT flex-auto" @click="downPPT">
                <img src="../../assets/phone/downPPTInner.png" style="width:20%" />
                <span style="color:#FFF;margin-left:5px;font-size:10px;">下 载 监 测 P P T</span>
              </div>
            </el-col>
            <el-col :span="7" :offset="1" v-if="shareForm.orderShare">
              <div
                class="btn-background-size down-complate-reporter flex-auto"
                @click="downComplateReporter"
              >
                <img src="../../assets/phone/downComplateReporterInner.png" style="width:20%" />
                <span style="color:#FFF;margin-left:5px;font-size:10px;">下 载 完 工 报 告</span>
              </div>
            </el-col>

            <el-col :span="16" :offset="7" v-if="!shareForm.orderShare">
              <div class="btn-background-size downPPT flex-auto" @click="downShareZip">
                <img src="../../assets/phone/downShareZip.png" style="width:20%" />
                <span style="color:#FFF;margin-left:5px;font-size:10px;">下 载 快 速 上 刊 照</span>
              </div>
            </el-col>
          </el-row>

          <el-row
            style="margin-top:5vh"
            v-infinite-scroll="loadMore"
            infinite-scroll-disabled="disabled"
            :infinite-scroll-immediate="false"
            :infinite-scroll-distance="20"
          >
            <el-col
              v-for="(item,index) in imgList"
              :key="item.id"
              :span="11"
              :offset="index % 2 ? 1 : 0"
              style="margin-bottom:3.37vh"
            >
              <div>
                <el-image :src="item.imgUrl" class="img-size" :preview-src-list="[item.imgUrl]" />
                <span>{{item.estateName}} {{item.buildingNum}} {{item.liftNum}} {{item.position}}</span>
              </div>
            </el-col>
          </el-row>
        </el-main>

        <p v-if="loading">正在拼命加载中...</p>

        <el-divider v-if="noMore" content-position="center">我也是有底线的</el-divider>
      </el-container>
    </main>
  </div>
</template>


<script>
import { getCookie } from '@/util/CookieUtils'
import HttpUtils from '@/util/HttpUtils'

export default {
	data() {
		return {
			code: '',
			shareForm: {
				city: '',
				stage: '',
				orderId: '',
				orderShare: 0
			},
			current: 1,
			total: 0,
			imgList: [],
			loading: false, //是否正在加载过程中
			percentage: 0
		}
	},
	created() {
		// console.log(this.$route)
		this.code = JSON.parse(getCookie('extractedCode'))
		this.getImgList()
		this.getDownUrl()
	},
	computed: {
		noMore() {
			return this.current * 4 > this.total
		},
		disabled() {
			return this.loading || this.noMore
		}
	},
	methods: {
		getImgList() {
			HttpUtils.request({
				api: 'findExtraction',
				method: 'post',
				data: {
					size: 4,
					current: this.current,
					extractedCode: this.code
				}
			}).then(res => {
				let temp = []
				let data = res.result.data
				this.total = res.result.meta.total

				data.map(item => {
					temp.push(item)
				})
				this.imgList.push(...temp)
				console.log(this.imgList)
				this.loading = false
				debugger
			})
		},
		// 下滑加载更多
		loadMore() {
			this.loading = true
			++this.current
			this.getImgList()
		},
		// 下载快速上刊照
		downShareZip() {
			let { city, stage, orderId } = this.shareForm
			HttpUtils.request({
				api: 'downZipShare',
				method: 'post',
				data: {
					city,
					stage,
					orderId
				}
			}).then(res => {
				let shareZipUrl = res.result.data.zipUrl
				if (shareZipUrl) {
					window.location.href = shareZipUrl
				} else {
					this.$message.error('暂时没有数据！')
				}
			})
		},
		// 下载点位照片
		downPositionImg() {
			let zipUrl = this.shareForm.zipUrl
			zipUrl
				? (window.location.href = zipUrl)
				: this.$message.error('暂时没有数据！')
		},
		// 下载监测PPT
		downPPT() {
			let pptUrl = this.shareForm.pptUrl
			pptUrl
				? (window.location.href = pptUrl)
				: this.$message.error('暂时没有数据！')
		},
		// 下载完工报告
		downComplateReporter() {
			let finishReportUrl = this.shareForm.finishReportUrl
			finishReportUrl
				? (window.location.href = finishReportUrl)
				: this.$message.error('暂时没有数据！')
		},
		// 获取下载地址和客户信息
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
					this.shareForm = Object.assign({}, data)
					console.log(this.shareForm)
					this.getProgress()
				}
			})
		},
		// 获取进度条
		getProgress() {
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
				// console.log(res)
				let progress = res.result.data.progress
				this.percentage = progress
			})
		}
	}
}
</script>


<style lang="stylus" scoped>
.container
  margin-left 4vw
.title-text
  font-size 1rem
.btn-background-size
  width 21.86vw
  height 5.92vh
.flex-auto
  display flex
  justify-content center
  align-items center
.down-position-img
  border-radius 7px
  background url('../../assets/phone/downPositionImg.png') no-repeat
  background-size 100%
.downPPT
  border-radius 7px
  background url('../../assets/phone/downPPT.png') no-repeat
  background-size 100%
.down-complate-reporter
  border-radius 7px
  background url('../../assets/phone/downComplateReporter.png') no-repeat
  background-size 100%
.img-size
  width 40vw
  height 30vh
</style>