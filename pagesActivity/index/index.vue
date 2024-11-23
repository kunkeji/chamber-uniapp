<template>
	<view class="container" :style="{'--theme-color': themeColor}">
		<!-- 标题栏 -->
		<title-bar title="活动列表"></title-bar>
		<!-- 内容区 -->
		<view class="container-main">
			<block v-if="loadEnd">
				<!-- 顶部导航 -->
				<view class="main-search" :style="{top: titleBarHeight + 'px'}">
					<view class="search-input flex align-items-center" @click="toSearch()">
						<image class="icon" src="/static/search.png" mode="aspectFit"></image>
						<text class="text flex-item">请输入关键字搜索</text>
					</view>
				</view>
				<!-- 新闻列表 -->
				<view class="main-list">
					<activity-item :show-data="activityList"></activity-item>
				</view>
			</block>
			<view class="main-login" v-else-if="showLogin">
				<image class="login-image" :src="loginImg" mode="aspectFit"></image>
				<view class="login-tips">小程序需要登录注册才能使用相关功能，请登录后查看该页面</view>
				<view class="login-btn" @click="toLogin()">前往登录</view>
				<view class="login-btn cancel" @click="toBack()">返回上一页</view>
			</view>
		</view>
		<!-- 底部导航 -->
		<tab-bar></tab-bar>
	</view>
</template>

<script>
	import activityItem from "@/pages/component/activity/index.vue"
	// #ifdef H5
	import wx from 'weixin-js-sdk';
	// #endif
	import {
		mapState
	} from "vuex"
	export default {
		components: {
			activityItem,
		},
		data() {
			return {
				// 加载完成
				loadEnd: false,
				// 标题栏高度
				titleBarHeight: 0,
				// 活动列表
				activityList: [],
				// 分类查询参数
				page: 1,
				limit: 10,
				hasMore: false,
				// 是否显示登录提示
				showLogin: false,
			}
		},
		computed: {
			...mapState({
				themeColor: state => state.app.themeColor,
				shareImage: state => state.app.shareImage,
				shareTitle: state => state.app.shareTitle,
				loginImg: state => state.app.loginImg,
			})
		},
		mounted() {
			// #ifdef MP-WEIXIN
			let statusBarHeight = uni.getSystemInfoSync().statusBarHeight
			let menuButtonInfo = uni.getMenuButtonBoundingClientRect()
			this.titleBarHeight = statusBarHeight + (menuButtonInfo.top - statusBarHeight) * 2 + menuButtonInfo.height
			// #endif
		},
		onLoad() {
			uni.showLoading({
				title: "加载中"
			})
			this.getActivityList(() => {
				uni.hideLoading()
				this.loadEnd = true
			})
			// #ifdef H5
			this.initConfig()
			// #endif
		},
		onPullDownRefresh() {
			this.page = 1
			this.getActivityList(() => {
				uni.stopPullDownRefresh()
			})
		},
		onReachBottom() {
			if (this.hasMore) {
				this.page++
				this.getActivityList()
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
			// 跳转搜索
			toSearch() {
				this.$util.toPage({
					mode: 1,
					path: "/pagesActivity/search/index"
				})
			},
			// 获取活动列表
			getActivityList(fn) {
				this.$util.request("activity.list", {
					page: this.page,
					limit: this.limit,
				}).then(res => {
					if (fn) fn()
					if (res.code == 1) {
						let list = res.data.data
						this.hasMore = this.page < res.data.total / this.limit ? true : false
						this.activityList = this.page == 1 ? list : [...this.activityList, ...list];
					} else {
						uni.showToast({
							title: res.msg,
							icon: 'none'
						})
					}
				}).catch(error => {
					if (error == 401) {
						this.showLogin = true
					} else {
						console.error('获取活动列表 ', error)
					}
				})
			},
			// 前往登录
			toLogin() {
				uni.navigateTo({
					url: "/pages/login/index",
				})
			},
			// 返回上一页
			toBack() {
				if (getCurrentPages().length == 1) {
					this.$util.toPage({
						mode: 1,
						path: "/pages/index/index"
					})
				} else {
					uni.navigateBack()
				}
			},
		}
	}
</script>

<style lang="scss">
	.container {
		.container-main {
			.main-search {
				position: sticky;
				top: 0;
				z-index: 99;
				background: #ffffff;
				padding: 16rpx 32rpx;

				.search-input {
					padding: 20rpx 32rpx;
					background: #F9F9F9;
					border-radius: 16rpx;

					.icon {
						width: 40rpx;
						height: 40rpx;
					}

					.text {
						margin-left: 16rpx;
						color: #8D929C;
						font-size: 28rpx;
						line-height: 40rpx;
					}
				}
			}

			.main-list {
				padding: 32rpx;
			}

			.main-login {
				padding: 96rpx 60rpx 0;

				.login-image {
					width: 100%;
					height: 500rpx;
				}

				.login-tips {
					color: #585858;
					font-size: 36rpx;
					line-height: 50rpx;
					margin-top: 48rpx;
					text-align: center;
				}

				.login-btn {
					margin-top: 56rpx;
					height: 88rpx;
					line-height: 88rpx;
					font-size: 28rpx;
					border-radius: 16rpx;
					text-align: center;
					background: var(--theme-color);
					color: #ffffff;

					&.cancel {
						background: #dedede;
						color: #999;
						margin-top: 48rpx;
					}
				}
			}
		}
	}
</style>