<template>
	<view scroll-x class="component-activity" :style="{'--theme-color': themeColor}">
		<view class="activity-item" :class="{special: showType == 1}" v-for="item in showData" :key="item.id" @click="toDetails(item)">
			<view class="item-header flex justify-content-between align-items-center" v-if="showType == 2">
				<view class="header-number">订单号：{{item.order_no}}</view>
				<view class="header-status">
					<text style="color: #FF626E;" v-if="item.pay_state == 1">待付款</text>
					<block v-else-if="item.pay_state == 2">
						<text style="color: #FF9100;" v-if="item.activity_state == 1">报名中</text>
						<text v-else-if="item.activity_state == 2">进行中</text>
						<text style="color: #666666;" v-else-if="item.activity_state == 3">已结束</text>
					</block>
					<text style="color: #FF9100;" v-else-if="item.pay_state == 3">退款中</text>
					<text style="color: #666666;" v-else-if="item.pay_state == 4">已退款</text>
					<text style="color: #FF626E;" v-else-if="item.pay_state == 5">已驳回</text>
				</view>
			</view>
			<view class="item-info flex">
				<image class="info-image" :src="item.images" mode="aspectFill"></image>
				<view class="info-box flex-item">
					<view class="box-title text-ellipsis">{{item.name}}</view>
					<view class="box-tag flex align-items-center">
						<view class="icon" :style="{'background-image': 'url('+ iconTime +')'}" v-if="iconTime"></view>
						<text class="text flex-item text-ellipsis">{{item.start_time}} | {{item.week}}</text>
					</view>
					<view class="box-tag flex align-items-center" v-if="item.organizing_method == 1">
						<view class="icon" :style="{'background-image': 'url('+ iconNetwork +')'}" v-if="iconNetwork"></view>
						<text class="text flex-item text-ellipsis">报名成功后查看</text>
					</view>
					<view class="box-tag flex align-items-center" v-else-if="item.organizing_method == 2">
						<view class="icon" :style="{'background-image': 'url('+ iconLocation +')'}" v-if="iconLocation"></view>
						<text class="text flex-item text-ellipsis">{{item.address}}</text>
					</view>
				</view>
			</view>
			<view class="item-footer flex align-items-center" v-if="showType == 2">
				<view class="footer-label">
					<text v-if="item.organizing_method == 1">线上活动</text>
					<text v-else-if="item.organizing_method == 2">线下活动</text>
				</view>
				<view class="footer-price flex-item">
					<block v-if="item.fees > 0">
						<text>￥</text>{{item.fees}}
					</block>
					<block v-else>免费</block>
				</view>
				<view class="footer-btn flex">
					<!-- 报名中 -->
					<block v-if="item.activity_state == 1">
						<!-- 待付款 -->
						<block v-if="item.pay_state == 1">
							<view class="btn" style="background: #FF626E;" @click.stop="toCancel(item.id)">取消参加</view>
							<view class="btn" @click.stop="toPayment(item.activity_id)">去支付</view>
						</block>
						<!-- 已付款 -->
						<block v-else-if="item.pay_state == 2">
							<view style="background: #FF626E;" class="btn" @click.stop="handleCancel(item.id)" v-if="parseFloat(item.fees) == 0">取消参加</view>
							<view style="background: #FF626E;" class="btn" @click.stop="handleRefund(item.id,item.activity_id)" v-else-if="item.refund == 1">申请退款</view>
							<view class="btn" style="background: #FFB656;" @click.stop="showWebsite(item.url)" v-if="item.organizing_method == 1">线上地址</view>
							<view class="btn" style="background: #FFB656;" @click.stop="$refs.activityPoster.getPoster(item.activity_id)" v-else-if="item.organizing_method == 2 && item.is_verifying == 1 && item.is_sign_in == 2">参会凭证</view>
						</block>
						<!-- 已驳回 -->
						<block v-else-if="item.pay_state == 5">
							<view class="btn" style="background: #FF626E;">驳回原因</view>
						</block>
					</block>
					<!-- 进行中 -->
					<block v-else-if="item.activity_state == 2">
						<view class="btn" style="background: #FFB656;" @click.stop="showWebsite(item.url)" v-if="item.organizing_method == 1">线上地址</view>
						<view class="btn" style="background: #FFB656;" @click.stop="$refs.activityPoster.getPoster(item.activity_id)" v-else-if="item.organizing_method == 2 && item.is_verifying == 1 && item.is_sign_in == 2">参会凭证</view>
					</block>
					<!-- 已结束 -->
					<!-- <block v-else-if="item.activity_state == 3">
						<view class="btn">参会证书</view>
					</block> -->
				</view>
			</view>
		</view>
		<!-- 参会凭证 -->
		<activity-poster ref="activityPoster" @onChange="pageChange"></activity-poster>
	</view>
</template>

<script>
	import activityPoster from "@/pages/component/activity/poster.vue"
	import svgData from "@/common/svg.js"
	import {
		mapState
	} from "vuex"
	export default {
		name: "activityIndex",
		props: ["showData", "showType"],
		components: {
			activityPoster,
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
				iconNetwork: state => {
					return svgData.svgToUrl("network", state.app.themeColor)
				},
			})
		},
		methods: {
			// 改变页面滚动状态
			pageChange(state) {
				this.$emit("onChange", state)
			},
			// 申请退款
			handleRefund(applyId, activity_id) {
				uni.showModal({
					content: "确认申请退款此活动？退款后无法再次报名该活动",
					confirmColor: "#FF626E",
					confirmText: "确认退款",
					cancelColor: "#999999",
					cancelText: "取消退款",
					success: (res) => {
						if (res.confirm) {
							this.$util.request("activity.applyRefund", {
								activity_id: activity_id,
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
									this.$emit("getOrderList");
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
			// 去支付
			toPayment(activityId) {
				this.$util.toPage({
					mode: 1,
					path: "/pagesActivity/index/order?id=" + activityId
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
									this.$emit("getOrderList");
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
			// 线上地址
			showWebsite(url) {
				if (url) {
					uni.showModal({
						content: url,
						confirmColor: this.themeColor,
						confirmText: "复制链接",
						cancelColor: "#999999",
						cancelText: "关闭页面",
						success: (res) => {
							if (res.confirm) {
								uni.setClipboardData({
									data: url,
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
			// 跳转详情
			toDetails(item) {
				if (this.showType == 2) {
					this.$util.toPage({
						mode: 1,
						path: `/pagesActivity/order/details?order_id=${item.id}&activity_id=${item.activity_id}`
					})
				} else if (this.showType == 3) {
					this.$util.toPage({
						mode: 1,
						path: "/pagesActivity/verification/details?id=" + item.id
					})
				} else {
					if (item.activity_auth == 2) {
						this.getMemberState(() => {
							this.$util.toPage({
								mode: 1,
								path: "/pagesActivity/index/details?id=" + item.id
							})
						})
					} else {
						this.$util.toPage({
							mode: 1,
							path: "/pagesActivity/index/details?id=" + item.id
						})
					}
				}
			},
			// 获取会员状态
			getMemberState(fn) {
				uni.showLoading({
					title: "加载中",
					mask: true,
				})
				this.$util.request("member.state").then(res => {
					uni.hideLoading()
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
		},
	}
</script>

<style lang="scss">
	.component-activity {
		.activity-item {
			margin-top: 32rpx;
			background: #ffffff;
			border-radius: 10rpx;
			padding: 32rpx;

			&:first-child {
				margin-top: 0;
			}

			&.special {
				background: transparent;
				border-radius: 0;
				padding: 0;
			}

			.item-header {
				padding-bottom: 32rpx;
				border-bottom: 1rpx solid #E4E4E4;
				margin-bottom: 32rpx;

				.header-number {
					color: #999999;
					font-size: 28rpx;
					line-height: 40rpx;
				}

				.header-status {
					color: var(--theme-color);
					font-size: 28rpx;
					line-height: 40rpx;
				}
			}

			.item-info {
				.info-image {
					width: 220rpx;
					height: 160rpx;
					border-radius: 16rpx;
				}

				.info-box {
					margin-left: 32rpx;
					display: flex;
					flex-direction: column;
					justify-content: space-between;

					.box-title {
						color: #5A5B6E;
						font-size: 28rpx;
						font-weight: 600;
						line-height: 40rpx;
					}

					.box-tag {
						.icon {
							width: 32rpx;
							height: 32rpx;
							background-size: 32rpx;
							margin-right: 10rpx;
						}

						.text {
							color: #8D929C;
							font-size: 24rpx;
							line-height: 34rpx;
						}
					}
				}
			}

			.item-footer {
				margin-top: 32rpx;

				.footer-label {
					color: var(--theme-color);
					font-size: 24rpx;
					line-height: 34rpx;
					padding: 8rpx 16rpx;
					border-radius: 8rpx;
					background: #F6F7FB;
				}

				.footer-price {
					margin-left: 16rpx;
					color: var(--theme-color);
					font-size: 36rpx;
					font-weight: 600;
					line-height: 50rpx;

					text {
						font-size: 22rpx;
					}
				}

				.footer-btn {
					margin-left: 16rpx;

					.btn {
						color: #ffffff;
						font-size: 28rpx;
						line-height: 40rpx;
						padding: 14rpx 24rpx;
						border-radius: 8rpx;
						background: var(--theme-color);
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