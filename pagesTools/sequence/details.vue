<template>
	<view class="container">
		<!-- 标题栏 -->
		<title-bar :showBack="true" title="活动接龙详情"></title-bar>
		<!-- 内容区 -->
		<view class="container-main">
			<block v-if="loadEnd">
				<!-- 接龙信息 -->
				<view class="main-sequence-info">
					<view class="sequence-info-title text-ellipsis-more">{{ chainsDetails.name }}</view>
					<view class="sequence-info-person alignments">
						<image :src="chainsDetails.avatar" mode="aspectFill" class="info-person-img"></image>
						<view class="info-person-item">
							<view class="alignments">
								<view class="info-person-item-name">{{ chainsDetails.member_name }}</view>
								<view class="info-person-item-level" :style="{ color: themeColor }">{{ chainsDetails.level_name }}</view>
							</view>
							<view class="info-person-item-time">{{ chainsDetails.createtime }}</view>
						</view>
						<!-- #ifdef MP-WEIXIN -->
						<button open-type="share" class="info-person-button alignments" :style="{ background: themeColor }">
							<image src="/static/invite.png" mode="aspectFill" class="info-person-button-icon"></image>邀请填写
						</button>
						<!-- #endif -->
					</view>
					<view class="sequence-info-time">结束时间：{{ chainsDetails.expire_time }}</view>
					<view class="sequence-info-introduce">
						<text user-select>{{ chainsDetails.content }}</text>
					</view>
				</view>
				<!-- 接龙完成情况 -->
				<view class="main-sequence-situation" :style="{'--theme-color': themeColor}">
					<view class="situation-title">接龙完成情况</view>
					<div class="situation-list">
						<div v-for="(item, index) in manList" :key="index" @click="nameToFeedback(item)" :class="[{'situation-list-item': item.status != 1}, {'situation-list-item-finish': item.status == 1}]">
							<text>{{item.member_name}}</text>
							<image src="/static/tick.png" mode="aspectFill" class="situation-list-radio" v-if="item.status == 1"></image>
						</div>
						<div v-if="manList.length == 0" class="situation-list-empty">
							<image src="/static/empty.png" mode="aspectFill" class="list-empty-img"></image>
							<view>暂无接龙人员,<text :style="{ color: themeColor }" @click="toFeedback()">去反馈</text></view>
						</div>
					</div>
				</view>
				<!-- 底部按钮 -->
				<view class="main-bottom">
					<view class="flex">
						<view class="main-bottom-phone" @click="onContact()">
							<image src="/static/phone.png" mode="aspectFit" class="phoneImg"></image>
							<view class="phoneTxt">联系电话</view>
						</view>
						<view class="main-bottom-button" :style="{ background: themeColor }" @click="toFeedback()" v-if="type == 2">我要反馈</view>
						<view class="main-bottom-button" :style="{ background: themeColor }" @click="toFeedInfo(chainsDetails.id)" v-else>查看反馈</view>
					</view>
					<view class="safe-padding"></view>
				</view>
			</block>
			<view class="main-login" v-else-if="showLogin">
				<image class="login-image" :src="loginImg" mode="aspectFit"></image>
				<view class="login-tips">小程序需要登录注册才能使用相关功能，请登录后查看该页面</view>
				<view class="login-btn" :style="{background: themeColor}" @click="toLogin()">前往登录</view>
				<view class="login-btn cancel" @click="toBack()">返回上一页</view>
			</view>
		</view>
	</view>
</template>

<script>
	// #ifdef H5
	import wx from 'weixin-js-sdk';
	// #endif
	import {
		mapState
	} from "vuex"
	export default {
		data() {
			return {
				// 加载完成
				loadEnd: false,
				// 接龙id
				id: 0,
				// 是否可反馈
				type: 0,
				// 接龙详情
				chainsDetails: {},
				manList: [],
				// 是否显示登录提示
				showLogin: false,
			};
		},
		computed: {
			...mapState({
				themeColor: state => state.app.themeColor,
				jielongImg: state => state.app.jielongImg,
				loginImg: state => state.app.loginImg,
			})
		},
		onLoad(option) {
			uni.showLoading({
				title: "加载中"
			})
			this.id = option.id
			if (this.id) {
				this.getChainsDetails(() => {
					uni.hideLoading()
					this.loadEnd = true
					// #ifdef H5
					this.initConfig()
					// #endif
				})
				this.chainsFeedback()
			}
		},
		onShow() {
			if (this.loadEnd) {
				this.getChainsDetails()
				this.chainsFeedback()
			}
		},
		onShareAppMessage() {
			return {
				title: this.chainsDetails.name,
				path: '/pagesTools/sequence/details?id=' + this.id,
				imageUrl: this.jielongImg,
			}
		},
		onShareTimeline() {
			return {
				title: this.chainsDetails.name,
				path: '/pagesTools/sequence/details?id=' + this.id,
				imageUrl: this.jielongImg,
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
								title: this.chainsDetails.name,
								desc: "",
								link: window.location.href,
								imgUrl: this.jielongImg,
							});
							wx.updateTimelineShareData({
								title: this.chainsDetails.name,
								link: window.location.href,
								imgUrl: this.jielongImg,
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
			// 获取详情
			getChainsDetails(fn) {
				this.$util.request("sequence.chainsDetails", {
					id: this.id
				}).then(res => {
					if (res.code == 1) {
						if (res.data.data.jielong_auth == 2) {
							this.getMemberState(() => {
								if (fn) fn()
								this.chainsDetails = res.data.data
								this.manList = res.data.member_data
							})
						} else {
							if (fn) fn()
							this.chainsDetails = res.data.data
							this.manList = res.data.member_data
						}
					} else {
						if (fn) fn()
						uni.showToast({
							title: res.msg,
							icon: 'none'
						})
					}
				}).catch(error => {
					if (error == 401) {
						this.showLogin = true
					} else {
						console.error('获取详情 ', error)
					}
				})
			},
			// 获取会员状态
			getMemberState(fn) {
				this.$util.request("member.state").then(res => {
					if (res.code == 1) {
						if (res.data.state.state == 6) {
							fn()
						} else if (res.data.state.state == -1) {
							uni.showModal({
								title: "系统提示",
								content: "此页面需成为会员后可查看！",
								confirmColor: this.themeColor,
								confirmText: "去加入",
								success: (res) => {
									if (res.confirm) {
										uni.navigateTo({
											url: "/pages/member/apply/index"
										})
									}
								}
							})
						} else {
							uni.showModal({
								title: "系统提示",
								content: "此页面需成为会员后可查看！",
								confirmColor: this.themeColor,
								confirmText: "前往查看",
								success: (res) => {
									if (res.confirm) {
										uni.switchTab({
											url: "/pages/mine/index"
										})
									}
								}
							})
						}
					} else {
						uni.showToast({
							title: res.msg,
							icon: 'none'
						})
					}
				}).catch(error => {
					console.error('获取会员状态 ', error)
				})
			},
			// 点击名字去反馈
			nameToFeedback(item) {
				// chainsDetails.type = 2 限定接龙时触发
				if (this.chainsDetails.type == 2) {
					// 判断是否反馈过
					this.$util.request("sequence.chainsFeedback", {
						id: this.id
					}).then(res => {
						if (res.code == 1) {
							// 当没有反馈过并且点击自己时
							if (res.data.status == 2 && res.data.id == item.id) {
								this.$util.toPage({
									mode: 1,
									path: "/pagesTools/sequence/feedback?name=" + res.data.member_name + "&memberId=" + res.data.id + "&chainsId=" + this.id
								})
							} else if (res.data.status == 1 && res.data.id == item.id) {
								uni.showToast({
									title: "您已反馈过该接龙",
									icon: "none",
									duration: 1000
								})
							}
						} else {
							uni.showToast({
								title: res.msg,
								icon: 'none'
							})
						}
					}).catch(error => {
						console.error('判断是否反馈过', error)
					})
				}
			},
			// 判断是否反馈过
			chainsFeedback() {
				this.$util.request("sequence.chainsFeedback", {
					id: this.id
				}).then(res => {
					if (res.code == 1) {
						this.type = res.data.status
					} else {
						uni.showToast({
							title: res.msg,
							icon: 'none'
						})
					}
				}).catch(error => {
					console.error('判断是否反馈过', error)
				})
			},
			// 去反馈
			toFeedback() {
				// 判断是否反馈过
				this.$util.request("sequence.chainsFeedback", {
					id: this.id
				}).then(res => {
					if (res.code == 1) {
						if (res.data.status == 2) {
							this.$util.toPage({
								mode: 1,
								path: "/pagesTools/sequence/feedback?name=" + res.data.member_name + "&memberId=" + res.data.id + "&chainsId=" + this.id
							})
						} else {
							uni.showToast({
								title: "您已反馈过该接龙",
								icon: "none",
								duration: 1000
							})
						}
					} else {
						uni.showToast({
							title: res.msg,
							icon: 'none'
						})
					}
				}).catch(error => {
					console.error('判断是否反馈过', error)
				})
			},
			// 查看反馈信息
			toFeedInfo(id) {
				uni.navigateTo({
					url: "/pagesTools/sequence/feedInfo?id=" + id
				})
			},
			// 联系电话 
			onContact() {
				this.$util.toPage({
					mode: 6,
					phone: this.chainsDetails.mobile,
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
			padding: 32rpx 32rpx 144rpx;

			.main-sequence-info {
				padding: 32rpx;
				margin-bottom: 32rpx;
				border-radius: 12rpx;
				background: #FFFFFF;

				.sequence-info-title {
					margin-bottom: 32rpx;
					font-size: 32rpx;
					line-height: 44rpx;
					font-weight: 600;
					color: #5A5B6E;
				}

				.sequence-info-person {
					margin-bottom: 32rpx;

					.info-person-img {
						width: 80rpx;
						height: 80rpx;
						border-radius: 50%;
					}

					.info-person-item {
						flex: 1;
						padding-left: 16rpx;

						.info-person-item-name {
							font-size: 28rpx;
							line-height: 40rpx;
							color: #5A5B6E;
						}

						.info-person-item-level {
							padding-left: 8rpx;
							font-size: 28rpx;
							line-height: 40rpx;
						}

						.info-person-item-time {
							font-size: 24rpx;
							line-height: 34rpx;
							color: #8D929C;
						}
					}

					.info-person-button {
						padding: 12rpx;
						font-size: 24rpx;
						line-height: 34rpx;
						border-radius: 8rpx;
						color: #FFFFFF;

						.info-person-button-icon {
							padding-right: 8rpx;
							width: 32rpx;
							height: 32rpx;
						}
					}
				}

				.sequence-info-time {
					margin-bottom: 32rpx;
					padding: 16rpx 0rpx;
					font-size: 24rpx;
					line-height: 34rpx;
					color: #5A5B6E;
					border-radius: 8rpx;
					text-align: center;
					background: #EEF2FF;
				}

				.sequence-info-introduce {
					font-size: 28rpx;
					line-height: 40rpx;
					color: #8D929C;
				}
			}

			.main-sequence-situation {
				padding: 32rpx;
				border-radius: 10rpx;
				background: #FFFFFF;

				.situation-title {
					margin-bottom: 16rpx;
					font-size: 28rpx;
					line-height: 40rpx;
					color: #5A5B6E;
				}

				.situation-list {
					display: flex;
					flex-wrap: wrap;
					margin-left: -16rpx;

					.situation-list-radio {
						width: 16rpx;
						height: 16rpx;
						background: var(--theme-color);
						border-radius: 50%;
						position: absolute;
						top: -2rpx;
						right: -2rpx;

					}

					.situation-list-item {
						margin: 16rpx 0 0 16rpx;
						padding: 12rpx 16rpx;
						font-size: 28rpx;
						line-height: 40rpx;
						color: #5A5B6E;
						border-radius: 8rpx;
						background: #F6F7FB;
					}

					.situation-list-item-finish {
						margin: 16rpx 0 0 16rpx;
						padding: 11rpx 15rpx;
						font-size: 28rpx;
						line-height: 40rpx;
						color: #5A5B6E;
						border-radius: 8rpx;
						background: #F6F7FB;
						border: 1rpx solid var(--theme-color);
						position: relative;
						z-index: 1;
					}

					.situation-list-empty {
						display: flex;
						flex-direction: column;
						align-items: center;
						width: 100%;
						font-size: 28rpx;
						padding-bottom: 16rpx;
						color: #8D929C;

						.list-empty-img {
							width: 128rpx;
							height: 128rpx;
						}
					}
				}
			}

			.main-bottom {
				position: fixed;
				bottom: 0;
				left: 0;
				right: 0;
				width: 100%;
				text-align: center;
				background: #FFF;
				padding: 16rpx 24rpx;
				z-index: 1;

				.main-bottom-phone {
					display: flex;
					flex-direction: column;
					align-items: center;

					.phoneTxt {
						font-size: 20rpx;
						line-height: 28rpx;
					}

					.phoneImg {
						width: 52rpx;
						height: 52rpx;
					}
				}

				.main-bottom-button {
					flex: 1;
					margin-left: 36rpx;
					padding: 22rpx 0rpx 22rpx;
					background: #999999;
					color: rgba(255, 255, 255, 1);
					text-align: center;
					line-height: 44rpx;
					font-size: 32rpx;
					border-radius: 16rpx;
				}

			}

			.main-share {
				padding: 32rpx 48rpx;
				border-radius: 40rpx 40rpx 0rpx 0rpx;
				background: #FFFFFF;
				width: 100vw;
				padding-bottom: constant(safe-area-inset-bottom);
				padding-bottom: calc(20rpx + env(safe-area-inset-bottom));

				.main-share-title {
					text-align: center;
					font-size: 32rpx;
					line-height: 40rpx;
					color: #5A5B6E;
				}

				.main-share-item {
					margin-top: 64rpx;
					padding: 0rpx 128rpx 0rpx 128rpx;
					display: flex;
					justify-content: space-between;

					.share-item-box {
						display: flex;
						flex-direction: column;
						align-items: center;
						margin: 0rpx;
						padding: 0rpx;
						background-color: transparent;

						.item-box-txt {
							padding-top: 16rpx;
							font-size: 28rpx;
							line-height: 40rpx;
							color: #8D929C;
						}

						.item-box-img {
							width: 96rpx;
							height: 96rpx;
						}
					}
				}

				.main-share-cancel {
					margin-top: 36rpx;
					text-align: center;
					font-size: 32rpx;
					line-height: 40rpx;
					color: #E10602;
				}
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