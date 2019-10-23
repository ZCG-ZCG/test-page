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
    <!-- 选择城市 -->
    <!-- <el-row class="layout-margin" type="flex">
			<el-col :span="8">
				<span>请选择城市：</span>	
			</el-col>
			<el-col :span="10">
				<el-select v-model="city" placeholder="请选择城市">
					<el-option v-for="(item, index) in cities" :key="index" :value="item">{{item}}</el-option>
				</el-select>
			</el-col>
    </el-row>-->
    <!-- 选择楼盘 -->
    <!-- <el-row class="layout-margin" type="flex">
      <el-col :span="8">
        <span>请选择楼盘：</span>
      </el-col>
      <el-col :span="10">
        <el-select v-model="estateName" placeholder="请选择楼盘">
          <el-option v-for="(item, index) in estateNameList" :key="index" :value="item">{{item}}</el-option>
        </el-select>
      </el-col>
    </el-row> -->
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

    <!-- <div>
			<el-card v-for="item in imgList" :key="item.id">
				<img :src="item.imgUrl" style="width:auto;">
			</el-card>
    </div>-->
    <el-row v-for="(item) in imgList" :key="item.id" style="margin-top:20px;">
      <el-col :span="24" >
        <!-- <el-card> -->
          <div>
            <img :src="item.imgUrl" class="image" style="width:300px;"/>
            <div >
              <span>{{item.estateName}} {{item.imgName}}</span>
            </div>
          </div>
        <!-- </el-card> -->
      </el-col>
    </el-row>
  </div>
</template>

<script>
import HttpUtils from '../util/HttpUtils'
export default {
	data() {
		return {
			code: '',
			percentage: 0,
			cities: [],
			estateName: '',
			estateNameList: [],
			pptUrl: '',
			zipUrl: '',
			finishReportUrl: '',
			imgList: [],
			shareForm: {
				city: '',
				orderId: '',
				stage: ''
			}
		}
	},
	created() {
		this.code = this.$route.query.code
		this.getDetails()
		this.getPro()
		this.getDownUrl()
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
					size: 10,
					current: 1,
					extractedCode: this.code
				}
			}).then(res => {
				let data = res.result.data
				// console.log(data)
				// 获取所有任务的城市
				let cityArr = []
				// 获取所有任务的楼盘
				let estateNameArr = []
				// 获取所有任务的期次
				let stageList = []
				// 获取图片列表
				let imgList = []
				// 当数据不为空的时候
				if (data.length) {
					data.map(val => {
						// console.log(val.city)
						// console.log(index)
						cityArr.push(val.city)
						estateNameArr.push(val.estateName)
						stageList.push(val.stage)
						imgList.push(val.materials)
					})
				}

				this.cities = Array.from(new Set(cityArr))
				this.shareForm.city = this.cities[0]
				// this.estateNameList = Array.from(new Set(estateNameArr))
				this.estateNameList = estateNameArr
			
				this.shareForm.stage = stageList[0]
				this.shareForm.orderId = data[0].orderId

				// 获取图片
				let temp = []
				imgList.map(val => {
					temp.push(...val)
				})
				this.imgList = Array.from(new Set(temp))
				console.log(this.imgList)
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
</style>
