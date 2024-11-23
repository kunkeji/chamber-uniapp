<template>
	<view class="container">
		<!-- 标题栏 -->
		<title-bar :showBack="true" title="供需详情"></title-bar>
		<!-- 内容区 -->
		<view class="container-main">
			<block v-if="loadEnd">
				<!-- 顶部提示语 -->
				<view class="main-prompt alignments" style="background: #FFF1F2" v-if="demandDetails.business.reject">
					<view class="main-prompt-txt" style="color: #FF626E">驳回原因:{{ demandDetails.business.reject }}</view>
				</view>
				<view class="main-prompt alignments" :style="{ background: themeColorWithOpacity }" v-else>
					<view class="main-prompt-icon" :style="{'background-image': 'url('+ iconSecurity +')'}" v-if="iconSecurity"></view>
					<view class="main-prompt-txt" :style="{ color: themeColor }">信息真实,该信息由本{{organize}}成员发布,接受大家监督</view>
				</view>
				<!-- 供需详情 -->
				<view class="demand-main">
					<!-- 顶部发布人信息 -->
					<view class="demand-person alignments" @click="toMemberDetails()">
						<image :src="demandDetails.member.avatar" mode="aspectFill" class="demand-person-img"></image>
						<view class="demand-person-info">
							<view class="info-name">{{ demandDetails.member.name }}</view>
							<view class="info-level">
								<text class="info-level-rank">{{ demandDetails.member.level_name }}</text>
								|
								<text class="info-level-time">{{ getDateBefore(demandDetails.business.createtime) }}</text>
								|
								<text class="info-level-scan">浏览{{ demandDetails.business.page_view }}</text>
							</view>
						</view>
						<view class="demand-person-icon" :style="{'background-image': 'url('+ iconRightArrow +')'}" v-if="iconRightArrow"></view>
					</view>
					<!-- 供需内容 -->
					<view class="demand-info">
						<view class="demand-info-title">
							<text>{{ demandDetails.business.title }}</text>
						</view>
						<view class="demand-info-introduce">
							<text>{{ demandDetails.business.content }}</text>
						</view>
						<view class="demand-info-img" v-if="demandDetails.business && demandDetails.business.images != ''">
							<view v-for="(items, index) in demandDetails.business.images.slice(0, 12)" :key="index" :style="{ marginBottom: ((index + 1) % 3 !== 0) ? '16rpx' : '0' }" @click="previewImages(index)">
								<image :src="items" mode="aspectFill" class="info-img-size"></image>
							</view>
						</view>
					</view>
				</view>
				<!-- 底部按钮 -->
				<view class="demand-bottom" v-if="type == 1">
					<!-- #ifdef MP-WEIXIN -->
					<view style="display: flex;">
						<view class="demand-bottom-share">
							<button style="background-color: transparent;" open-type="share">
								<view class="bottom-share-button">
									<view class="shareImg" :style="{'background-image': 'url('+ iconShare +')'}" v-if="iconShare"></view>
									<view class="shareTxt">
										分享
									</view>
								</view>
							</button>
						</view>
						<view class="demand-bottom-button" :style="{ background: themeColor }" @click="onContact()">联系TA</view>
					</view>
					<!-- #endif -->
					<!-- #ifndef MP-WEIXIN -->
					<view class="demand-bottom-button" style="width: 100%;" :style="{ background: themeColor }" @click="onContact()">联系TA</view>
					<!-- #endif -->
					<view class="safe-padding"></view>
				</view>
				<view class="main-bottom" v-else-if="type == 2">
					<view class="alignment justify-content-between">
						<view class="main-bottom-button" :style="{ 'width': '49%', 'background': themeColor  }" @click="editDemand(demandDetails.business.id)">修改</view>
						<view class="main-bottom-button" :style="{ 'width': '49%', 'background': '#FF2525'  }" @click="delDemand(demandDetails.business.id)">删除</view>
					</view>
					<view class="safe-padding"></view>
				</view>
			</block>
			<view class="main-login" v-else-if="showLogin">
				<image class="login-image" :src="loginImg" mode="aspectFit"></image>
				<view class="login-tips">小程序需要登录注册才能使用相关功能，请登录后查看该页面</view>
				<view class="login-btn" :style="{ background: themeColor }" @click="toLogin()">前往登录</view>
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
	import svgData from "@/common/svg.js"
	export default {
		data() {
			return {
				// 加载完成
				loadEnd: false,
				// 供需id
				id: 0,
				// 详情类型
				type: 1,
				demandDetails: {},
				// 是否显示登录提示
				showLogin: false,
			};
		},
		computed: {
			...mapState({
				themeColor: state => state.app.themeColor,
				organize: state => state.app.organize,
				iconSecurity: state => {
					return svgData.svgToUrl("security", state.app.themeColor);
				},
				iconRightArrow: state => {
					return svgData.svgToUrl("rightArrow", state.app.themeColor);
				},
				iconShare: state => {
					return svgData.svgToUrl("share", state.app.themeColor);
				},
				loginImg: state => state.app.loginImg,
			}),
			themeColorWithOpacity() {
				return this.$util.hexToRgb(this.themeColor, 0.06);
			}
		},
		onLoad(option) {
			this.type = option.type
			this.id = option.id
			uni.showLoading({
				title: "加载中"
			})
			this.getDemandDetails(() => {
				uni.hideLoading()
				this.loadEnd = true
				// #ifdef H5
				this.initConfig()
				// #endif
			})
		},
		onShareAppMessage() {
			return {
				title: this.demandDetails.business.title,
				imageUrl: this.demandDetails.business.images[0],
			}
		},
		onShareTimeline() {
			return {
				title: this.demandDetails.business.title,
				imageUrl: this.demandDetails.business.images[0],
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
								title: this.demandDetails.business.title,
								desc: "",
								link: window.location.href,
								imgUrl: this.demandDetails.business.images[0],
							});
							wx.updateTimelineShareData({
								title: this.demandDetails.business.title,
								link: window.location.href,
								imgUrl: this.demandDetails.business.images[0],
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
			getDemandDetails(fn) {
				if (this.type == 1) {
					this.$util.request("demand.businessDetails", {
						id: this.id
					}).then(res => {
						if (fn) fn()
						if (res.code == 1) {
							this.demandDetails = res.data
							this.demandDetails.business.images = (res.data.business.images).split(',')
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
							if (fn) fn()
							console.error('获取详情 ', error)
						}
					})
				} else if (this.type = 2) {
					this.$util.request("demand.businessUserDetails", {
						id: this.id
					}).then(res => {
						if (fn) fn()
						if (res.code == 1) {
							this.demandDetails = res.data
							this.demandDetails.business.images = (res.data.business.images).split(',')
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
							if (fn) fn()
							console.error('获取详情 ', error)
						}
					})
				}
			},
			// 修改供需
			editDemand(id) {
				this.$util.toPage({
					mode: 2,
					path: "/pagesDemand/demand/edit?id=" + id
				})
			},
			// 删除供需
			delDemand(id) {
				uni.showModal({
					title: '提示',
					content: '确认删除此条吗?',
					confirmText: '确认删除',
					confirmColor: '#E50002',
					cancelText: '我再想想',
					cancelColor: '#999999',
					success: (res) => {
						if (res.confirm) {
							this.$util.request("demand.businessDel", {
								id: id,
							}).then(res => {
								if (res.code == 1) {
									uni.showToast({
										title: "删除成功"
									})
									setTimeout(() =>
										uni.navigateBack(), 1000)
								} else {
									uni.showToast({
										title: res.msg,
										icon: 'none'
									})
								}
							}).catch(error => {
								console.error('获取供需列表', error)
							})

						}
					}
				})
			},
			// 去会员详情
			toMemberDetails() {
				this.$util.toPage({
					mode: 1,
					path: "/pages/member/details?id=" + this.demandDetails.member.id
				})
			},
			// 联系
			onContact() {
				this.$util.toPage({
					mode: 6,
					phone: this.demandDetails.member.mobile,
				})
			},
			// 预览图片 
			previewImages(index) {
				const urls = this.demandDetails.business.images.map(item => item);
				uni.previewImage({
					urls: urls,
					current: index,
				});

			},
			// 时间戳转换
			getDateBefore(time) {
				if (time) return this.$util.getDateBeforeNow(time)
				else return ""
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
			.main-prompt {
				padding: 24rpx 36rpx;
				font-size: 24rpx;
				line-height: 34rpx;
				background: #EEF2FF;
				color: #325DFF;

				.main-prompt-icon {
					width: 32rpx;
					height: 32rpx;
					background-size: 32rpx;
				}

				.main-prompt-txt {
					padding-left: 8rpx;
					font-size: 24rpx;
					line-height: 34rpx;
				}
			}

			.demand-main {
				margin: 32rpx 32rpx 150rpx 32rpx;
				padding: 32rpx;
				border-radius: 16rpx;
				background: #FFFFFF;

				.demand-person {

					.demand-person-img {
						width: 96rpx;
						height: 96rpx;
						border-radius: 50%;
					}

					.demand-person-info {
						flex: 1;
						padding-left: 24rpx;
						color: #666666;

						.info-name {
							font-size: 32rpx;
							font-weight: 600;
							line-height: 44rpx;
							color: #5A5B6E;
						}

						.info-level {
							display: flex;
							padding-top: 12rpx;
							font-size: 28rpx;
							line-height: 40rpx;
							color: #666666;

							.info-level-rank {
								padding-right: 8rpx;
							}

							.info-level-time {
								padding-left: 8rpx;
								padding-right: 8rpx;
							}

							.info-level-scan {
								padding-left: 8rpx;
							}
						}
					}

					.demand-person-icon {
						width: 50rpx;
						height: 50rpx;
						background-size: 50rpx;
					}

					.demand-person-contact {
						padding: 8rpx 16rpx;
						border-radius: 8rpx;
						font-size: 24rpx;
						background: #325DFF;
						color: #FFFFFF;
					}
				}

				.demand-info {
					padding-top: 32rpx;

					.demand-info-title {
						font-size: 32rpx;
						font-weight: 600;
						line-height: 44rpx;
						color: #5A5B6E;
					}

					.demand-info-introduce {
						padding-top: 24rpx;
						font-size: 28rpx;
						line-height: 40rpx;
						color: #5A5B6E;
					}

					.demand-info-img {
						display: flex;
						flex-wrap: wrap;
						justify-content: space-between;
						padding-top: 16rpx;

						.info-img-size {
							border-radius: 16rpx;
							width: 200rpx;
							height: 200rpx;
						}
					}

					.demand-info-img::after {
						width: 200rpx;
						content: '';
					}
				}

				.demand-browse {
					padding-top: 24rpx;
					display: flex;

					.demand-browse-num {
						flex: 1;
						font-size: 24rpx;
						line-height: 34rpx;
						color: #999999;
					}

					.demand-browse-share {
						display: flex;
						font-size: 28rpx;
						line-height: 40rpx;
						color: #5A5B6E;

						.share-img {
							width: 32rpx;
							height: 32rpx;
						}

					}
				}
			}

			.demand-bottom {
				position: fixed;
				bottom: 0;
				width: 100%;
				background: #FFF;
				padding: 16rpx 24rpx;

				.demand-bottom-share {
					flex: 1;

					.bottom-share-button {
						display: flex;
						flex-direction: column;
						align-items: center;
						width: 50rpx;

						.shareTxt {
							padding-top: 8rpx;
							font-size: 24rpx;
							line-height: 30rpx;
							color: #5A5B6E;
						}

						.shareImg {
							width: 32rpx;
							height: 32rpx;
							background-size: 32rpx;
						}
					}


				}

				.demand-bottom-button {
					width: 240rpx;
					height: 80rpx;
					background: #999999;
					color: rgba(255, 255, 255, 1);
					text-align: center;
					line-height: 80rpx;
					border-radius: 16rpx;
					font-size: 32rpx;
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

				.main-bottom-money {
					font-size: 40rpx;
					line-height: 56rpx;
				}

				.main-bottom-button {
					padding: 22rpx 0rpx 22rpx;
					background: #999999;
					color: rgba(255, 255, 255, 1);
					text-align: center;
					line-height: 44rpx;
					border-radius: 16rpx;
					font-size: 32rpx;
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