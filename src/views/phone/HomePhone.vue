<template>
  <div class="container">
    <img src="@/assets/phone/entry_bg.png" style="width:100%" />

    <main class="home">
      <p class="title-text">请输入提取码：</p>
      <el-input
        v-model="codeForm.code"
        class="code-input"
        placeholder="请输入提取码"
        clearable
        size="medium"
      ></el-input>
      <el-button type="primary" class="sub-btn" @click="getSharePage" size="mini">确 定</el-button>
    </main>
  </div>
</template>


<script>
import HttpUtils from '@/util/HttpUtils'
import { setCookie } from '@/util/CookieUtils'

export default {
	data() {
		return {
			codeForm: {
				code: ''
			}
		}
	},

	methods: {
		getSharePage() {
			if (this.codeForm.code === '') {
				this.$message.warning('请先输入提取码！')
				return
			}

			HttpUtils.request({
				api: 'findOrder',
				method: 'post',
				data: {
					size: 1,
					current: 1,
					extractedCode: this.codeForm.code
				}
			}).then(res => {
				if (res.result.code === 200) {
					this.$router.replace('/detailsPhone')
					let data = res.result.data
					setCookie('shareForm', JSON.stringify(data))
					setCookie('extractedCode', JSON.stringify(this.codeForm.code))
				} else {
					this.$message.error(
						`获取信息失败！${res.result.message ? res.result.message : ''}`
					)
				}
			})
		}
	}
}
</script>


<style lang="stylus" scoped>
.home
  width 76.8vw
  height 26.31vh
  margin 0vh auto 0
  transform translateY(50%)
  border-radius 10px
  box-shadow 0px 0px 14px 0px rgba(0, 0, 0, 0.15)
.title-text
  padding 5.55vh 0px 0px 3.125vw
  font-size 15px
.code-input
  width 80%
  margin 5vh 0 2vh 8.5vw
.sub-btn
  margin 0vh auto auto 30.1vw
</style>