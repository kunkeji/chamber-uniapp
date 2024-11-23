<template>
	<view class="container">
		<!-- 标题栏 -->
		<title-bar title="会员单位"></title-bar>
		<!-- 内容区 -->
		<view class="container-main" v-if="loadEnd">
			<member-units :show-data="unitsList" v-if="unitsList.length"></member-units>
			<empty top="64rpx" title="暂无相关会员单位~" v-else></empty>
		</view>
		<!-- 底部导航 -->
		<tab-bar></tab-bar>
	</view>
</template>

<script>
	import memberUnits from "@/pages/component/member/units.vue"
	// #ifdef H5
	import wx from 'weixin-js-sdk';
	// #endif
	import {
		mapState
	} from "vuex"
	export default {
		components: {
			memberUnits,
		},
		data() {
			return {
				// 加载完成
				loadEnd: false,
				// 分类查询参数
				page: 1,
				limit: 10,
				hasMore: false,
				// 会员单位列表
				unitsList: [],
			}
		},
		computed: {
			...mapState({
				shareImage: state => state.app.shareImage,
				shareTitle: state => state.app.shareTitle,
			})
		},
		onLoad() {
			uni.showLoading({
				title: "加载中"
			})
			this.getMemberUtils(() => {
				uni.hideLoading()
				this.loadEnd = true
			})
			// #ifdef H5
			this.initConfig()
			// #endif
		},
		onPullDownRefresh() {
			this.page = 1
			this.getMemberUtils(() => {
				uni.stopPullDownRefresh()
			})
		},
		onReachBottom() {
			if (this.hasMore) {
				this.page++
				this.getMemberUtils()
			}
		},
		onShareAppMessage() {
			return {
				title: this.shareTitle,
				imageUrl: this.shareImage,
			}
		},
		onShareTimeline() {
			return {
				title: this.shareTitle,
				imageUrl: this.shareImage,
			}
		},
		methods: {
			// #ifdef H5
			// 微信公众号初始化方法
			initConfig() {
				this.$util.request("main.WeChatConfig", {
					url: location.href.split("?")[0]
				}).then(res => {
					if (res.code == 1) {
						wx.config({
							debug: false,
							appId: res.data.appId,
							timestamp: Number(res.data.timestamp),
							nonceStr: res.data.nonceStr,
							signature: res.data.signature,
							jsApiList: ["updateAppMessageShareData", "updateTimelineShareData"],
							openTagList: ["updateAppMessageShareData", "updateTimelineShareData"],
						})
						wx.ready(() => {
							wx.updateAppMessageShareData({
								title: this.shareTitle,
								desc: "",
								link: window.location.href,
								imgUrl: this.shareImage,
							});
							wx.updateTimelineShareData({
								title: this.shareTitle,
								link: window.location.href,
								imgUrl: this.shareImage,
							});
						});
					} else {
						uni.hideLoading()
						uni.showToast({
							title: res.msg,
							icon: 'none'
						})
					}
				}).catch(error => {
					uni.hideLoading()
					console.error('通过config接口注入权限验证配置 ', error)
				})
			},
			// #endif
			// 获取会员列表
			getMemberUtils(fn) {
				this.$util.request("member.units", {
					page: this.page,
					limit: this.limit
				}).then(res => {
					if (fn) fn()
					if (res.code == 1) {
						let list = res.data.data
						this.hasMore = this.page < res.data.total / this.limit ? true : false
						this.unitsList = this.page == 1 ? list : [...this.unitsList, ...list];
					} else {
						uni.showToast({
							title: res.msg,
							icon: 'none'
						})
					}
				}).catch(error => {
					console.error('获取会员单位列表 ', error)
				})
			},
		}
	}
</script>

<style lang="scss">
	.container {
		.container-main {
			padding: 32rpx;
		}
	}
</style>