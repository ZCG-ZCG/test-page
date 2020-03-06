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
            <el-col :span="7">
              <div
                class="btn-background-size down-position-img flex-auto"
                @click="downPositionImg"
                v-if="shareForm.orderShare === 1"
              >
                <img src="../../assets/phone/downPositionInner.png" style="width:20%" />
                <span style="color:#FFF;margin-left:5px;;font-size:10px;">下 载 点 位 照 片</span>
              </div>
              <div
                class="btn-background-size down-position-img flex-auto"
                @click="downShareZip(2)"
                v-if="shareForm.orderShare === 0"
              >
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

            <el-col :span="7" :offset="5" v-if="!shareForm.orderShare">
              <div class="btn-background-size downPPT flex-auto" @click="downShareZip(9)">
                <img src="../../assets/phone/downShareZip.png" style="width:20%" />
                <span style="color:#FFF;margin-left:5px;font-size:10px;">下 载 快 速 上 刊 照</span>
              </div>
            </el-col>
          </el-row>

          <div v-if="shareForm.orderShare === 1">
            <el-row
              style="margin-top:5vh"
              v-infinite-scroll="sharedLoadMore"
              infinite-scroll-disabled="disabled"
              infinite-scroll-distance="10"
              infinite-scroll-immediate="false"
            >
              <el-col
                v-for="(item,index) in positionImgList"
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
            <p
              v-if="showLoading"
              v-loading="showLoading"
              element-loading-text="拼命加载中..."
              element-loading-spinner="el-icon-loading"
            ></p>

            <el-divider v-if="noMore" content-position="center"></el-divider>
          </div>

          <div v-if="shareForm.orderShare === 0">
            <el-row style="margin-top:1.5vh">
              <p style="color:#03AEFE;font-size:1rem">点位照片</p>

              <!-- <div class="scroll-view"> -->
              <el-col
                v-for="(item,index) in percentageImgList"
                :key="item.id"
                :offset="index % 2 ? 1 : 0"
                :span="11"
                style="margin-top:3vh"
              >
                <div>
                  <el-image :src="item.imgUrl" class="img-size" :preview-src-list="[item.imgUrl]" />
                  <span
                    style="font-size:0.9rem"
                  >{{item.estateName}} {{item.buildingNum}} {{item.liftNum}} {{item.position}}</span>
                </div>
              </el-col>
              <!-- </div> -->
            </el-row>

            <el-row style="margin-top:1.8vh">
              <p style="color:#03AEFE;font-size:1rem">快速上刊照</p>

              <!-- <div class="scroll-view"> -->
              <el-col
                v-for="(item,index) in fastImgList"
                :key="item.id"
                :offset="index % 2 ? 1 : 0"
                :span="11"
                style="margin-top:3vh"
              >
                <div>
                  <el-image :src="item.imgUrl" class="img-size" :preview-src-list="[item.imgUrl]" />
                  <span
                    style="font-size:0.9rem"
                  >{{item.estateName}} {{item.buildingNum}} {{item.liftNum}} {{item.position}}</span>
                </div>
              </el-col>
              <!-- </div> -->
            </el-row>
          </div>
        </el-main>
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
			shareForm: {},
			positionCurrent: 1,
			positionPage: 0,
			positionImgList: [],
			fastImgList: [],
			percentageImgList: [],

			showLoading: false, //是否正在加载过程中
			percentage: 0
		}
	},
	created() {
		this.code = JSON.parse(getCookie('extractedCode'))
		this.shareForm = JSON.parse(getCookie('shareForm'))
		console.log(this.shareForm)
		// 当审核关闭时，需要加载10%的点位照片
		if (this.shareForm.orderShare === 0) {
			// debugger
			this.getPercentImgList()
			this.getFastImgList()
		} else if (this.shareForm.orderShare === 1) {
			this.getPositionImgList()
		}
		this.getProgress()
	},
	computed: {
		noMore() {
			//当起始页数大于总页数时停止加载
			return this.positionCurrent >= this.positionPage
		},
		disabled() {
			return this.showLoading || this.noMore
		}
	},
	methods: {
		// 审核状态打开时下滑加载更多
		sharedLoadMore() {
			this.showLoading = true
			this.positionCurrent++
			setTimeout(() => {
				this.getPositionImgList()
			}, 2000)
		},
		// 获取一定比例的点位照片
		getPercentImgList() {
			HttpUtils.request({
				api: 'findPercentPage',
				method: 'post',
				data: {
					size: 999,
					current: 1,
					extractedCode: this.code
				}
			}).then(res => {
				// console.log(res)
				let temp = []
				let data = res.result.data
				data.map(item => {
					temp.push(item)
				})
				this.percentageImgList.push(...temp)
			})
		},
		// 获取快速上刊照
		getFastImgList() {
			HttpUtils.request({
				api: 'findFastPhoto',
				method: 'post',
				data: {
					size: 999,
					current: 1,
					extractedCode: this.code
				}
			}).then(res => {
				let temp = []
				let data = res.result.data
				data.map(item => {
					temp.push(item)
				})
				this.fastImgList.push(...temp)
			})
		},
		// 获取点位信息照片集合,
		getPositionImgList() {
			HttpUtils.request({
				api: 'findExtraction',
				method: 'post',
				data: {
					size: 8,
					current: this.positionCurrent,
					extractedCode: this.code
				}
			}).then(res => {
				let temp = []
				let data = res.result.data
				this.positionPage = res.result.meta.pages

				data.map(item => {
					temp.push(item)
				})

				this.positionImgList.push(...temp)
				this.showLoading = false
			})
		},

		// 下载快速上刊照
		downShareZip(type) {
			// 快速上刊照9  点位2
			let { city, stage, orderId, newPoster } = this.shareForm
			HttpUtils.request({
				api: 'downZipShare',
				method: 'post',
				data: {
					city,
					stage,
					orderId,
					type,
					newPoster
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