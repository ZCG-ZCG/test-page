<template>
  <div>
    <main class="container">
      <el-container>
        <el-header style="height:4.35vh"></el-header>

        <el-main>
          <el-row type="flex">
            <p class="title-text">亲爱的客户，您的方案执行进度如下：</p>
          </el-row>

          <el-row style="margin-top:5vh;">
            <el-col :span="2">
              <p style="font-size:18px">总进度任务：</p>
            </el-col>
            <el-col :span="10" style="margin-top:5px;">
              <el-progress :percentage="percentage" :stroke-width="15"></el-progress>
            </el-col>
          </el-row>

          <el-row style="margin-top:6.5vh" :gutter="24">
            <el-col :span="4" v-if="shareForm.orderShare">
              <div class="btn-background-size down-position-img flex-auto" @click="downPositionImg">
                <img src="../../assets/pc/downPositionInner.png" />
                <span style="color:#FFF;margin-left:5px">下载点位照片</span>
              </div>
            </el-col>
            <el-col :span="4" :offset="2" v-if="shareForm.orderShare">
              <div class="btn-background-size downPPT flex-auto" @click="downPPT">
                <img src="../../assets/pc/downPPTInner.png" />
                <span style="color:#FFF;margin-left:5px">下载监测PPT</span>
              </div>
            </el-col>
            <el-col :span="4" :offset="2" v-if="shareForm.orderShare">
              <div
                class="btn-background-size down-complate-reporter flex-auto"
                @click="downComplateReporter"
              >
                <img src="../../assets/pc/downComplateReporterInner.png" />
                <span style="color:#FFF;margin-left:5px">下载完工报告</span>
              </div>
            </el-col>

            <el-col :span="8" :offset="4" v-if="!shareForm.orderShare">
              <div class="btn-background-size downPPT flex-auto" @click="downShareZip">
                <img src="../../assets/pc/downShareZip.png" />
                <span style="color:#FFF;margin-left:5px">下载快速上刊照</span>
              </div>
            </el-col>
          </el-row>

          <el-row
            style="margin-top:5vh"
            v-infinite-scroll="loadMore"
            infinite-scroll-disabled="disabled"
            :infinite-scroll-immediate="false"
            :infinite-scroll-distance="10"
          >
            <el-col
              v-for="item in imgList"
              :key="item.id"
              :offset="1"
              :span="4"
              style="margin-bottom:3.7vh"
            >
              <!-- {{item}} -->
              <div>
                <el-image :src="item.imgUrl" class="img-size" :preview-src-list="[item.imgUrl]" />
                <span>{{item.estateName}} {{item.buildingNum}} {{item.liftNum}} {{item.position}}</span>
              </div>
            </el-col>
          </el-row>
        </el-main>

        <p v-if="showLoading">正在拼命加载中...</p>

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
			showLoading: false, //是否正在加载过程中
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
			return this.current * 8 > this.total
		},
		disabled() {
			return this.showLoading || this.noMore
		}
	},
	methods: {
		getImgList() {
			HttpUtils.request({
				api: 'findExtraction',
				method: 'post',
				data: {
					size: 8,
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
				this.showLoading = false
			})
		},
		// 下滑加载更多
		loadMore() {
			this.showLoading = true
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
				api: 'downExtraction',
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
  margin-left 2.8125vw
.title-text
  font-size 20px
  font-weight bold
.btn-background-size
  width 14.479vw
  height 12.4vh
.flex-auto
  display flex
  justify-content center
  align-items center
.down-position-img
  border-radius 17px
  background url('../../assets/pc/downPositionImg.png') no-repeat
  background-size 100%
.downPPT
  border-radius 17px
  background url('../../assets/pc/downPPT.png') no-repeat
  background-size 100%
.down-complate-reporter
  border-radius 17px
  background url('../../assets/pc/downComplateReporter.png') no-repeat
  background-size 100%
.img-size
  width 15.625vw
  height 37vh
</style>