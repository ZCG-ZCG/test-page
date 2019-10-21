<template>
  <div class="home">
    <!-- <img alt="Vue logo" src="../assets/logo.png" /> -->
    <el-form :model="codeForm">
      <el-form-item label="">
        <el-input v-model="codeForm.code" placeholder="请输入提取码" style="width:80%"></el-input>
      </el-form-item>
      <el-form-item label="" style="margin-top:10px;">
        <el-button type="primary" @click="getSharePage">确定</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import HttpUtils from '../util/HttpUtils'

export default {
	name: 'home',
	data() {
		return {
			codeForm: {
				code: ''
			}
		}
	},
	methods: {
		getSharePage() {
			HttpUtils.request({
				api: 'findExtraction',
				method: 'post',
				data: {
					size: 1,
					current: 1,
					extractedCode: this.codeForm.code
				}
			}).then(res => {
				// console.log(res)
				if (res.result.code === 200) {
					this.$router.push(`/details?code=${this.codeForm.code}`)
				} else {
					this.$message.error(`获取信息失败！${res.result.message ? res.result.message : ''}`)
				}
			})
		}
	}
}
</script>

<style lang="stylu" scoped>

</style>
