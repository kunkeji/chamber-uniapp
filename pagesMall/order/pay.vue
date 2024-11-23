<template>
	<view class="container">
		<!-- 标题栏 -->
		<title-bar :showBack="true" title="订单支付"></title-bar>
		<!-- 内容区 -->
		<view class="container-main" v-if="loadEnd">
			<view class="main-info">
				<view class="label">订单需要支付</view>
				<view class="value">
					<text class="symbol">￥</text>
					{{money}}
				</view>
			</view>
			<view class="main-bottom">
				<button class="submit-btn" :style="{ background: themeColor }" @click="payBtn">立即支付</button>
				<view class="safe-padding"></view>
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
				// 支付金额
				money: "",
				// 订单id
				id: "",
			}
		},
		onLoad(option) {
			this.money = option.money
			this.id = option.id
			this.$nextTick(() => {
				this.loadEnd = true
			})
			// #ifdef H5
			this.initConfig()
			// #endif
		},
		computed: {
			...mapState({
				themeColor: state => state.app.themeColor,
			})
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
							jsApiList: ['chooseWXPay']
						})
					} else {
						uni.showToast({
							title: res.msg,
							icon: 'none'
						})
					}
				}).catch(error => {
					console.error('通过config接口注入权限验证配置 ', error)
				})
			},
			// #endif
			// 支付
			payBtn() {
				uni.showLoading({
					title: "加载中",
					mask: true
				})
				// 获取支付参数
				this.$util.request("mall.preparePay", {
					order_id: this.id
				}).then(res => {
					if (res.code == 1) {
						let payConfig = res.data;
						// #ifdef MP-WEIXIN
						uni.requestPayment({
							timeStamp: payConfig.timeStamp,
							nonceStr: payConfig.nonceStr,
							package: payConfig.package,
							signType: payConfig.signType,
							paySign: payConfig.paySign,
							success: (res) => {
								uni.hideLoading();
								if (res.errMsg == "requestPayment:ok") {
									uni.redirectTo({
										url: "/pagesMall/order/success?type=0"
									})
								}
							},
							fail: () => {
								uni.hideLoading();
								uni.showToast({
									title: "支付已取消",
									icon: "none",
									duration: 1000
								})
							},
							complete: res => {
								uni.hideLoading();
							}
						})
						// #endif
						// #ifdef H5
						wx.ready(() => {
							uni.hideLoading()
							wx.chooseWXPay({
								timestamp: payConfig.timeStamp,
								package: payConfig.package,
								nonceStr: payConfig.nonceStr,
								signType: payConfig.signType,
								paySign: payConfig.paySign,
								success: (res) => {
									if (res.errMsg == "chooseWXPay:ok") {
										uni.redirectTo({
											url: "/pagesMall/order/success?type=0"
										})
									} else {
										uni.showToast({
											title: '支付失败',
											icon: 'error'
										})
									}
								},
								fail: () => {
									uni.showToast({
										title: '支付已取消',
										icon: 'none'
									})
								},
							});
						});
						// #endif
					} else {
						uni.showToast({
							title: res.msg,
							icon: 'none'
						})
					}
				}).catch(error => {
					console.error('获取支付参数', error)
				})
			}
		}
	}
</script>

<style lang="scss">
	page {
		background: #F6F7FB;
	}

	.container {
		.container-main {
			padding: 32rpx 24rpx 144rpx;

			.main-info {
				background: #fff;
				padding: 48rpx 0;

				.label {
					color: #000;
					text-align: center;
					font-size: 32rpx;
				}

				.value {
					padding-top: 16rpx;
					color: #E10602;
					font-size: 72rpx;
					font-weight: bold;
					text-align: center;

					.symbol {
						color: #E10602;
						font-size: 32rpx;
						font-weight: bold;
						display: inline-block;
					}
				}
			}

			.main-bottom {
				width: 100%;
				position: fixed;
				bottom: 0;
				left: 0;
				padding: 16rpx 24rpx;

				.submit-btn {
					height: 80rpx;
					line-height: 80rpx;
					border-radius: 16rpx;
					color: #FFF;
					text-align: center;
					font-size: 28rpx;
					padding: 0;
					margin: 0;
				}
			}
		}
	}
</style>