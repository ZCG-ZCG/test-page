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
		</el-row> -->
		<!-- 选择楼盘 -->
		<el-row class="layout-margin" type="flex" v-show="city">
			<el-col :span="8">
				<span>请选择楼盘：</span>	
			</el-col>
			<el-col :span="10">
				<el-select v-model="estateName" placeholder="请选择楼盘">
					<el-option v-for="(item, index) in estateNameList" :key="index" :value="item">{{item}}</el-option>
				</el-select>
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
			city: '',
			cities: [],
			estateName: '',
			estateNameList: []
		}
	},
	created () {
		this.code = this.$route.query.code
		this.getDetails()
		// this.getPro()
	},
	methods: {
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
				console.log(data)
				// 获取所有任务的城市
				let cityArr = []
				let estateNameArr = []
				data.map((val) => {
					// console.log(val.city)
					// console.log(index)
					cityArr.push(val.city)
					estateNameArr.push(val.estateName)
				})
				this.cities = Array.from(new Set(cityArr))
				this.estateNameList = Array.from(new Set(estateNameArr))
			})
		},
		// 获取进度条
		getPro() {
			HttpUtils.request({
				api: 'findSpeedPro',
				method: 'post',
				data: {
					extractedCode: this.code
				}
			}).then(res => {
				console.log(res)
			})
		}
	},

}
</script>

<style lang="stylus" scoped>
	.layout-margin
		margin-top 10px
</style>
