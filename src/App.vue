<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>


export default {
	name: 'app',
	components: {},

	mounted() {
		if (this._isMobile()) {
			// alert('移动端')
			this.$router.replace('/HomePhone')
		} else {
			// alert('PC端')
			this.$router.replace('/HomePc')
		}
	},
	methods: {
		_isMobile() {
			let flag = navigator.userAgent.match(
				/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
			)
			return flag
		}
	}
}
</script>

<style>
* {
	margin: 0;
	padding: 0;
}
#app {
	/* font-family: 'Avenir', Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: center;
	color: #2c3e50;
	margin-top: 0; */
}
</style>
