import Vue from 'vue'
import VueRouter from 'vue-router'
// import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
	// {
	// 	path: '/',
	// 	name: 'home',
	// 	component: Home
	// },
	// {
	// 	path: '/details',
	// 	name: '进度详情',
	// 	component: resolve => require(['@/views/details'],resolve)
	// }
	// {
	// 	path: '/',
	// 	redirect: '/HomePc'
	// },
	{
		path: '/HomePc',
		name: 'HomePc',
		component: resolve => require(['@/views/pc/HomePc'], resolve)
	},
	{
		path: '/detailsPc',
		name: 'detailsPc',
		component: resolve => require(['@/views/pc/detailsPc'], resolve)
	},
	{
		path: '/HomePhone',
		name: 'HomePhone',
		component: resolve => require(['@/views/phone/HomePhone'], resolve)
	},
	{
		path: '/detailsPhone',
		name: 'detailsPhone',
		component: resolve => require(['@/views/phone/detailsPhone'], resolve)
	}
]

const router = new VueRouter({
	mode: 'history',
	base: process.env.BASE_URL,
	routes
})

export default router
