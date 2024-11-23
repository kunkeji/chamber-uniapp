<template>
	<page-meta :page-style="'overflow:' + (pageShow ? 'hidden' : 'visible')"></page-meta>
	<view class="container" :style="{'--theme-color': themeColor}">
		<!-- 标题栏 -->
		<title-bar :showBack="true" title="活动详情"></title-bar>
		<!-- 内容区 -->
		<view class="container-main" :style="{paddingBottom: (activityInfo.state == 6 ? '32rpx' : '144rpx')}" v-if="loadEnd">
			<!-- 驳回原因 -->
			<view class="main-reason" v-if="activityInfo.pay_state == 5">驳回原因：{{activityInfo.reject || "无"}}</view>
			<!-- 轮播图 -->
			<carousel :show-data="activityInfo.image_list" height="320rpx" radius="10rpx" bottom="24rpx" right="24rpx"></carousel>
			<!-- 活动信息 -->
			<view class="main-info">
				<view class="info-header flex align-items-center" v-if="activityInfo.state == 1">
					<image class="header-bg" src="/static/activity/time_bg.png" mode="aspectFill"></image>
					<image class="header-icon" src="/static/activity/time.png" mode="aspectFit"></image>
					<view class="header-box flex-item flex align-items-center">
						<view class="text flex-item">距离报名结束还有</view>
						<view class="cell">{{countdown.day}}</view>
						<view class="text">天</view>
						<view class="cell">{{countdown.hours}}</view>
						<view class="text">时</view>
						<view class="cell">{{countdown.minutes}}</view>
						<view class="text">分</view>
						<view class="cell">{{countdown.seconds}}</view>
						<view class="text">秒</view>
					</view>
				</view>
				<view class="info-box">
					<view class="box-title">{{activityInfo.name}}</view>
					<view class="box-row flex align-items-center">
						<view class="price" v-if="activityInfo.fees > 0"><text>￥</text>{{activityInfo.fees}}</view>
						<view class="price" v-else>免费</view>
						<view class="label">
							<text class="type-1" v-if="activityInfo.activity_state == 1">报名中</text>
							<text class="type-2" v-else-if="activityInfo.activity_state == 2">进行中</text>
							<text class="type-3" v-else-if="activityInfo.activity_state == 3">已结束</text>
						</view>
						<view class="label">
							<text v-if="activityInfo.organizing_method == 1">线上活动</text>
							<text v-else-if="activityInfo.organizing_method == 2">线下活动</text>
						</view>
					</view>
					<view class="box-column flex align-items-center">
						<view class="column-icon" :style="{'background-image': 'url('+ iconTime +')'}" v-if="iconTime"></view>
						<view class="column-text flex-item">{{activityInfo.time_frame}}</view>
					</view>
					<view class="box-column flex align-items-start" v-if="activityInfo.organizing_method == 2">
						<view class="column-icon" :style="{'background-image': 'url('+ iconLocation +')'}" v-if="iconLocation"></view>
						<view class="column-text flex-item">{{activityInfo.address}}</view>
						<view class="column-navigation flex align-items-center" @click="toNavigation()">
							<view class="icon" :style="{'background-image': 'url('+ iconNavigation +')'}" v-if="iconNavigation"></view>
							<text class="text">导航</text>
						</view>
					</view>
				</view>
			</view>
			<!-- 已报名 -->
			<view class="main-record flex justify-content-between align-items-center" v-if="activityInfo.apply_count">
				<view class="record-bubble">已报名：{{activityInfo.apply_count}}人</view>
				<view class="record-list flex">
					<view class="list-item" v-for="(item, index) in activityInfo.apply_list" :key="index">
						<image :src="item.member_avatar" mode="aspectFill"></image>
					</view>
					<view class="list-item" v-if="activityInfo.apply_count > 9">
						<view class="item-more flex justify-content-around align-items-center">
							<view class="point"></view>
							<view class="point"></view>
							<view class="point"></view>
						</view>
					</view>
				</view>
			</view>
			<!-- 活动介绍 -->
			<view class="main-content">
				<mp-html :content="activityInfo.content"></mp-html>
			</view>
			<!-- 底部按钮 -->
			<view class="main-footer">
				<view class="flex justify-content-between align-items-center">
					<view class="footer-menu flex">
						<!-- #ifdef MP-WEIXIN -->
						<button type="default" open-type="share" class="menu-btn">
							<image class="icon" src="/static/share.png" mode="aspectFit"></image>
							<view class="text">分享</view>
						</button>
						<!-- #endif -->
						<view class="menu-btn" @click="onContact">
							<image class="icon" src="/static/phone.png" mode="aspectFit"></image>
							<view class="text">联系</view>
						</view>
					</view>
					<view class="footer-btn flex-item flex">
						<!-- 报名中 -->
						<block v-if="activityInfo.activity_state == 1">
							<!-- 待付款 -->
							<block v-if="activityInfo.pay_state == 1">
								<view class="btn" style="background: #FF626E;" @click="toCancel(activityInfo.apply_id)">取消参加</view>
								<view class="btn" @click="toPayment">去支付</view>
							</block>
							<!-- 已付款 -->
							<block v-else-if="activityInfo.pay_state == 2">
								<!-- 取消参加/申请退款 -->
								<block>
									<!-- 免费 -->
									<view class="btn" style="background: #FF626E;" @click="handleCancel(activityInfo.apply_id)" v-if="parseFloat(activityInfo.fees) == 0">取消参加</view>
									<!-- 付费 -->
									<view class="btn" style="background: #FF626E;" @click="handleRefund(activityInfo.apply_id)" v-else-if="activityInfo.refund == 1">申请退款</view>
								</block>
								<!-- 线上地址/参会凭证 -->
								<block>
									<view class="btn" style="background: #FFB656;" @click="showWebsite(activityInfo.url)" v-if="activityInfo.organizing_method == 1">线上地址</view>
									<view class="btn" style="background: #FFB656;" @click="$refs.activityPoster.getPoster(activityId)" v-else-if="activityInfo.organizing_method == 2 && activityInfo.is_verifying == 1 && activityInfo.is_sign_in == 2">参会凭证</view>
								</block>
							</block>
							<!-- 退款中 -->
							<block v-else-if="activityInfo.pay_state == 3">
								<view class="btn" style="background: #bbbbbb;">退款中</view>
							</block>
							<!-- 已退款 -->
							<block v-else-if="activityInfo.pay_state == 4">
								<view class="btn" style="background: #bbbbbb;">已退款</view>
							</block>
							<!-- 已驳回 -->
							<block v-else-if="activityInfo.pay_state == 5">
								<view class="btn" style="background: #FF626E;" @click="handleRefund(activityInfo.apply_id)">申请退款</view>
							</block>
						</block>
						<!-- 进行中 -->
						<block v-else-if="activityInfo.activity_state == 2">
							<view class="btn" style="background: #FFB656;" @click="showWebsite(activityInfo.url)" v-if="activityInfo.organizing_method == 1">线上地址</view>
							<view class="btn" style="background: #FFB656;" @click="$refs.activityPoster.getPoster(activityId)" v-else-if="activityInfo.organizing_method == 2 && activityInfo.is_verifying == 1 && activityInfo.is_sign_in == 2">参会凭证</view>
							<view class="btn" style="background: #bbbbbb;" v-else-if="activityInfo.organizing_method == 2 && activityInfo.is_verifying == 1 && activityInfo.is_sign_in == 1">已参会</view>
						</block>
						<!-- 已结束 -->
						<block v-else-if="activityInfo.activity_state == 3">
							<view class="btn" style="background: #bbbbbb;">活动已结束</view>
							<!-- <view class="btn" @click="showCertificate">参会证书</view> -->
						</block>
					</view>
				</view>
				<view class="safe-padding"></view>
			</view>
		</view>
		<!-- 参会凭证 -->
		<activity-poster ref="activityPoster" @onChange="pageChange"></activity-poster>
	</view>
</template>

<script>
	import activityPoster from "@/pages/component/activity/poster.vue"
	import carousel from "@/pages/component/carousel/carousel.vue"
	import svgData from "@/common/svg.js"
	// #ifdef H5
	import wx from 'weixin-js-sdk';
	// #endif
	import {
		mapState
	} from "vuex"
	export default {
		components: {
			carousel,
			activityPoster,
		},
		data() {
			return {
				// 加载完成
				loadEnd: false,
				// 页面是否阻止滚动
				pageShow: false,
				// 活动id
				activityId: null,
				// 订单id
				orderId: null,
				// 活动详情
				activityInfo: {},
				// 活动剩余时间计时器
				activityInterval: null,
				// 活动倒计时
				countdown: {
					day: 0,
					hours: 0,
					minutes: 0,
					seconds: 0,
				},
			}
		},
		computed: {
			...mapState({
				themeColor: state => state.app.themeColor,
				iconTime: state => {
					return svgData.svgToUrl("time", state.app.themeColor)
				},
				iconLocation: state => {
					return svgData.svgToUrl("location", state.app.themeColor)
				},
				iconNavigation: state => {
					return svgData.svgToUrl("navigation", state.app.themeColor)
				},
			})
		},
		onLoad(option) {
			this.activityId = option.activity_id
			this.orderId = option.order_id
			uni.showLoading({
				title: "加载中"
			})
			this.getActivity(() => {
				this.loadEnd = true
				uni.hideLoading()
			})
			// #ifdef H5
			this.initConfig()
			// #endif
		},
		onUnload() {
			clearInterval(this.activityInterval)
		},
		methods: {
			// 改变页面滚动状态
			pageChange(state) {
				this.pageShow = state
			},
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
							jsApiList: ["wx-open-launch-weapp"],
							openTagList: ['wx-open-launch-weapp'],
						})
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
			// 获取活动详情
			getActivity(fn) {
				this.$util.request("activity.orderDetails", {
					id: this.activityId,
					order_id: this.orderId,
				}).then(res => {
					if (fn) fn()
					if (res.code == 1) {
						this.activityInfo = res.data
						this.activityInfo.time_frame = this.getTimeFrame(res.data.start_time, res.data.end_time)
						if (this.activityInfo.images) this.activityInfo.image_list = this.activityInfo.images.split(",")
						else this.activityInfo.image_list = []
						this.getCountdown()
					} else {
						uni.showToast({
							title: res.msg,
							icon: 'none'
						})
					}
				}).catch(error => {
					console.error('获取活动详情 ', error)
				})
			},
			// 获取活动剩余时间
			getCountdown() {
				this.activityInterval = setInterval(() => {
					let nowTime = new Date().getTime()
					this.countdown = this.$util.getTimeDifference(nowTime, this.activityInfo.end_time * 1000)
					if (this.countdown.day == 0 && this.countdown.hours == 0 && this.countdown.minutes == 0 && this.countdown.seconds == 0) {
						clearInterval(this.activityInterval)
					}
				}, 1000);
			},
			// 获取时间范围
			getTimeFrame(start, end) {
				let startTime = this.$util.formatDate(start, "object")
				let endTime = this.$util.formatDate(end, "object")
				let startResult = `${startTime.year}-${startTime.month}-${startTime.day} ${startTime.hours}:${startTime.minutes}`
				let endResult = `${endTime.year}-${endTime.month}-${endTime.day} ${endTime.hours}:${endTime.minutes}`
				return startResult + "—" + endResult
			},
			// 跳转地图导航
			toNavigation() {
				this.$util.toPage({
					mode: 7,
					address: {
						address: this.activityInfo.address,
						latitude: this.activityInfo.latitude,
						longitude: this.activityInfo.longitude
					}
				})
			},
			// 联系 
			onContact() {
				this.$util.toPage({
					mode: 6,
					phone: this.activityInfo.mobile,
				})
			},
			// 去支付 
			toPayment() {
				this.$util.toPage({
					mode: 1,
					path: "/pagesActivity/index/order?id=" + this.activityId
				})
			},
			// 未支付取消参加
			toCancel(applyId) {
				uni.showModal({
					content: "确认取消参加此活动？取消后无法再次报名此活动",
					confirmColor: "#FF626E",
					confirmText: "确认取消",
					cancelColor: "#999999",
					cancelText: "我再想想",
					success: (res) => {
						if (res.confirm) {
							this.$util.request("activity.applyDel", {
								id: applyId
							}).then(res => {
								if (res.code == 1) {
									uni.showToast({
										title: "已取消参加",
										icon: "none",
										duration: 1000
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
								console.error('取消参加 ', error)
							})
						}
					}
				})
			},
			// 取消参加
			handleCancel(applyId) {
				uni.showModal({
					content: "确认取消参加此活动？取消后无法再次报名此活动",
					confirmColor: "#FF626E",
					confirmText: "确认取消",
					cancelColor: "#999999",
					cancelText: "我再想想",
					success: (res) => {
						if (res.confirm) {
							this.$util.request("activity.applyCancel", {
								id: applyId
							}).then(res => {
								if (res.code == 1) {
									uni.showToast({
										title: "已取消参加",
										icon: "none",
										duration: 1000
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
								console.error('取消参加 ', error)
							})
						}
					}
				})
			},
			// 申请退款 
			handleRefund(applyId) {
				uni.showModal({
					content: "确认申请退款此活动？退款后无法再次报名该活动",
					confirmColor: "#FF626E",
					confirmText: "确认退款",
					cancelColor: "#999999",
					cancelText: "取消退款",
					success: (res) => {
						if (res.confirm) {
							this.$util.request("activity.applyRefund", {
								activity_id: this.activityId,
								apply_id: applyId
							}).then(res => {
								if (res.code == 1) {
									uni.redirectTo({
										url: "/pagesActivity/order/success"
									})
								} else {
									uni.showToast({
										title: res.msg,
										icon: 'none'
									})
								}
							}).catch(error => {
								console.error('申请退款 ', error)
							})
						}
					}
				})
			},
			// 线上地址
			showWebsite() {
				if (this.activityInfo.url) {
					uni.showModal({
						content: this.activityInfo.url,
						confirmColor: this.themeColor,
						confirmText: "复制链接",
						cancelColor: "#999999",
						cancelText: "关闭页面",
						success: (res) => {
							if (res.confirm) {
								uni.setClipboardData({
									data: this.activityInfo.url,
									success: () => {
										uni.showToast({
											icon: "success",
											title: "复制成功"
										})
									}
								});
							}
						}
					})
				} else {
					uni.showToast({
						icon: "none",
						title: "暂无线上地址，请稍后再试"
					})
				}
			},
			// 参会证书
			showCertificate() {
				uni.showToast({
					icon: "none",
					title: "暂无参会证书，请稍后再试"
				})
			},
		}
	}
</script>

<style lang="scss">
	.container {
		.container-main {
			padding: 32rpx 32rpx 144rpx;

			.main-reason {
				color: #FF626E;
				font-size: 28rpx;
				line-height: 40rpx;
				padding: 32rpx;
				border-radius: 16rpx;
				background: #FFF3F3;
				margin-bottom: 32rpx;
			}

			.main-info {
				border-radius: 16rpx;
				background: #ffffff;
				overflow: hidden;
				margin-top: 32rpx;

				.info-header {
					background: linear-gradient(134.71deg, var(--theme-color) -1.001%, #ffffff 300%);
					padding: 24rpx 32rpx;
					position: relative;

					.header-bg {
						position: absolute;
						top: 0;
						left: 0;
						right: 0;
						bottom: 0;
					}

					.header-icon {
						width: 48rpx;
						height: 48rpx;
						position: relative;
						z-index: 1;
					}

					.header-box {
						position: relative;
						z-index: 1;

						.text {
							color: #ffffff;
							font-size: 24rpx;
							line-height: 34rpx;
							margin-left: 8rpx;
						}

						.cell {
							color: #ffffff;
							font-size: 24rpx;
							height: 48rpx;
							line-height: 48rpx;
							padding: 0 8rpx;
							min-width: 48rpx;
							border-radius: 4rpx;
							backdrop-filter: blur(20rpx);
							background: rgba(255, 255, 255, 0.4);
							margin-left: 8rpx;
							text-align: center;
						}
					}
				}

				.info-box {
					padding: 32rpx;

					.box-title {
						color: #5A5B6E;
						font-size: 32rpx;
						font-weight: 600;
						line-height: 44rpx;
					}

					.box-row {
						margin-top: 24rpx;

						.price {
							color: var(--theme-color);
							font-size: 40rpx;
							font-weight: 600;
							line-height: 50rpx;

							text {
								font-size: 22rpx
							}
						}

						.label {
							margin-left: 16rpx;

							text {
								display: block;
								color: var(--theme-color);
								font-size: 24rpx;
								line-height: 34rpx;
								padding: 6rpx 14rpx;
								border: 2rpx solid var(--theme-color);
								border-radius: 4rpx;
							}

							.type-1 {
								color: #FFA820;
								border-color: #FFA820;
							}

							.type-2 {
								color: #00AE84;
								border-color: #00AE84;
							}

							.type-3 {
								color: #E60012;
								border-color: #E60012;
							}
						}
					}

					.box-column {
						margin-top: 24rpx;

						.column-icon {
							width: 32rpx;
							height: 40rpx;
							background-size: 32rpx 40rpx;
						}

						.column-text {
							margin-left: 10rpx;
							color: #666666;
							font-size: 28rpx;
							line-height: 40rpx;
						}

						.column-navigation {
							margin-left: 16rpx;

							.icon {
								width: 32rpx;
								height: 32rpx;
								background-size: 32rpx;
							}

							.text {
								margin-left: 8rpx;
								color: var(--theme-color);
								font-size: 28rpx;
								line-height: 40rpx;
							}
						}
					}
				}
			}

			.main-record {
				padding: 12rpx 32rpx;
				border-radius: 16rpx;
				background: #ffffff;
				margin-top: 32rpx;

				.record-bubble {
					color: #ffffff;
					font-size: 20rpx;
					line-height: 28rpx;
					padding: 8rpx 16rpx;
					background: var(--theme-color);
					border-radius: 8rpx;
					display: flex;
					align-items: center;

					&::after {
						content: "";
						display: block;
						width: 0;
						height: 0;
						border-top: 12rpx solid transparent;
						border-bottom: 12rpx solid transparent;
						border-left: 12rpx solid var(--theme-color);
					}
				}

				.record-list {
					padding: 16rpx;
					width: 452rpx;
					border-radius: 8rpx;
					// background: #F6F7FB;

					.list-item {
						width: 48rpx;
						height: 48rpx;
						border-radius: 50%;
						overflow: hidden;
						margin-left: -7rpx;
						border: 2rpx solid #ffffff;

						.item-more {
							width: 100%;
							height: 100%;
							background: var(--theme-color);
							padding: 0 6rpx;

							.point {
								width: 6rpx;
								height: 6rpx;
								background: #ffffff;
								border-radius: 50%;
							}
						}
					}
				}
			}

			.main-content {
				padding: 32rpx;
				border-radius: 16rpx;
				background: #ffffff;
				color: #5A5B6E;
				font-size: 28rpx;
				line-height: 48rpx;
				margin-top: 32rpx;
			}

			.main-footer {
				position: fixed;
				left: 0;
				right: 0;
				bottom: 0;
				z-index: 99;
				padding: 12rpx 32rpx 12rpx 48rpx;
				background: #ffffff;
				border-top: 1rpx solid #F6F7FB;

				.footer-menu {
					.menu-btn {
						display: flex;
						flex-direction: column;
						align-items: center;
						margin-right: 32rpx;
						background: transparent;
						padding: 0;

						.icon {
							width: 52rpx;
							height: 52rpx;
						}

						.text {
							color: #5A5B6E;
							font-size: 20rpx;
							line-height: 28rpx;
						}
					}
				}

				.footer-btn {
					.btn {
						color: #ffffff;
						font-size: 32rpx;
						line-height: 44rpx;
						padding: 22rpx 24rpx;
						border-radius: 16rpx;
						background: var(--theme-color);
						text-align: center;
						width: 100%;
						margin-left: 8rpx;

						&:first-child {
							margin-left: 0;
						}
					}
				}
			}
		}
	}
</style>