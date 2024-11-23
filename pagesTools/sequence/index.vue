<template>
	<view class="container">
		<!-- 标题栏 -->
		<title-bar title="活动接龙"></title-bar>
		<!-- 内容区 -->
		<view class="container-main" v-if="loadEnd">
			<block v-if="loadEnd">
				<!-- 活动接龙 -->
				<view class="main-column">
					<chains-item :show-data="chainsList" show-type="1" @setShareData="setShareData"></chains-item>
					<empty top="36%" title="暂无活动接龙~" v-if="chainsList.length == 0"></empty>
				</view>
			</block>
			<view class="main-login" v-else-if="showLogin">
				<image class="login-image" :src="loginImg" mode="aspectFit"></image>
				<view class="login-tips">小程序需要登录注册才能使用相关功能，请登录后查看该页面</view>
				<view class="login-btn" :style="{background: themeColor}" @click="toLogin()">前往登录</view>
				<view class="login-btn cancel" @click="toBack()">返回上一页</view>
			</view>
		</view>
		<!-- 底部导航 -->
		<tab-bar></tab-bar>
	</view>
</template>

<script>
	import chainsItem from "@/pages/component/chains/index.vue"
	// #ifdef H5
	import wx from 'weixin-js-sdk';
	// #endif
	import {
		mapState
	} from "vuex"
	export default {
		components: {
			chainsItem
		},
		data() {
			return {
				// 加载完成
				loadEnd: false,
				// 当前页
				page: 1,
				// 限制条数
				limit: 10,
				// 是否存在下一页
				hasMore: false,
				// 接龙列表 
				chainsList: [],
				// 分享数据
				shareData: {},
				// 是否显示登录提示
				showLogin: false,
			};
		},
		computed: {
			...mapState({
				themeColor: state => state.app.themeColor,
				shareImage: state => state.app.shareImage,
				shareTitle: state => state.app.shareTitle,
				loginImg: state => state.app.loginImg,
			})
		},
		onLoad() {
			uni.showLoading({
				title: "加载中"
			})
			this.getChainsList()
			// #ifdef H5
			this.initConfig()
			// #endif
		},
		onShareAppMessage(res) {
			if (res.from == "button") {
				return {
					title: this.shareData.title,
					path: this.shareData.path,
					imageUrl: this.shareData.imageUrl || this.shareImage,
				}
			} else {
				return {
					title: this.shareTitle,
					imageUrl: this.shareImage,
				}
			}

		},
		onShareTimeline() {
			return {
				title: this.shareTitle,
				imageUrl: this.shareImage,
			}
		},
		onPullDownRefresh() {
			this.page = 1
			this.getChainsList(() => {
				uni.stopPullDownRefresh();
			})
		},
		onReachBottom() {
			if (this.hasMore) {
				this.page++
				this.getChainsList();
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
			// 设置分享数据
			setShareData(data) {
				this.shareData = data
			},
			// 获取接龙列表
			getChainsList(fn) {
				this.$util.request("sequence.chainsList", {
					page: this.page,
					limit: this.limit
				}).then(res => {
					if (fn) fn()
					if (res.code == 1) {
						let list = res.data.data
						this.hasMore = this.page < res.data.total / this.limit ? true : false
						this.chainsList = this.page == 1 ? list : [...this.chainsList, ...list];
						uni.hideLoading()
						this.loadEnd = true
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
						console.error('获取接龙列表 ', error)
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
			padding: 32rpx;

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