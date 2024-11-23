<template>
	<view class="container">
		<!-- 标题栏 -->
		<title-bar :showBack="true" title="订单详情"></title-bar>
		<!-- 内容区 -->
		<view class="container-main" v-if="loadEnd">
			<!-- 订单状态 -->
			<view class="main-status">
				<view v-if="orderDetail.state == 1">
					<view class="main-status-txt">待付款</view>
					<view class="main-status-item flex alignments">
						<view class="item-icon" :style="{'background-image': 'url('+ iconClock +')'}" v-if="iconClock"></view>
						<view class="item-txt" :style="{ color:themeColor }">商品未付款,请及时付款</view>
					</view>
				</view>
				<view v-if="orderDetail.state == 2">
					<view class="main-status-txt">待发货</view>
					<view class="main-status-item flex alignments">
						<view class="item-icon" :style="{'background-image': 'url('+ iconClock +')'}" v-if="iconClock"></view>
						<view class="item-txt" :style="{ color:themeColor }">商品待发货</view>
					</view>
				</view>
				<view v-if="orderDetail.state == 3">
					<view class="main-status-txt">待收货</view>
					<view class="main-status-item flex alignments">
						<view class="item-icon" :style="{'background-image': 'url('+ iconClock +')'}" v-if="iconClock"></view>
						<view class="item-txt" :style="{ color:themeColor }">商品已发货,请及时收货</view>
					</view>
				</view>
				<view v-if="orderDetail.state == 4">
					<view class="main-status-txt">已完成</view>
					<view class="main-status-item flex alignments">
						<view class="item-icon" :style="{'background-image': 'url('+ iconClock +')'}" v-if="iconClock"></view>
						<view class="item-txt" :style="{ color:themeColor }">商品已完成收货</view>
					</view>
				</view>
			</view>
			<!-- 收货地址 -->
			<view class="main-address" @click="chooseAddress">
				<view class="main-address-area">
					<view class="area-text">
						{{addressData.defaultAddress}}
					</view>
					<view class="area-icon" :style="{'background-image': 'url('+ iconMore +')'}" v-if="iconMore && orderDetail.state == 1"></view>
				</view>
				<view class="main-address-personal" v-if="addressData.name && addressData.tel">
					<view class="personal-content">
						{{addressData.name || ""}}
					</view>
					<view class="personal-content">
						{{addressData.tel || ""}}
					</view>
				</view>
			</view>
			<!-- 商品信息 -->
			<view class="main-goods">
				<store :show-data="orderData"></store>
			</view>
			<!-- 商品金额/配送费 -->
			<view class="main-cost">
				<view class="main-cost-info">
					<view class="main-cost-info-txt">商品金额</view>
					<view class="main-cost-info-money" :style="{ color:themeColor }">￥{{orderDetail.goods_price}}</view>
				</view>
				<view class="main-cost-info pt32">
					<view class="main-cost-info-txt">运费总额</view>
					<view class="main-cost-info-money" :style="{ color:themeColor }">￥{{orderDetail.pay_postage}}</view>
				</view>
			</view>
			<!-- 底部按钮 -->
			<view class="main-bottom" v-if="orderDetail.state == 1">
				<view class="alignment">
					<view class="main-bottom-money" :style="{ color: themeColor }"><text style="font-size: 32rpx;">￥</text>{{orderDetail.total_price}}</view>
					<view class="main-bottom-buttons" :style="{ background: themeColor }" @click="pay()">立即支付</view>
					<view class="main-bottom-buttons" style="background: #FF626E;" @click="payCancel(orderDetail.id)">取消订单</view>
				</view>
				<view class="safe-padding"></view>
			</view>
			<view class="main-bottom" v-if="orderDetail.state == 2">
				<view class="alignment">
					<view class="main-bottom-button" style="background: #FF626E;" @click="toRefund(orderDetail.id)">申请退款</view>
				</view>
				<view class="safe-padding"></view>
			</view>
			<view class="main-bottom" v-if="orderDetail.state == 3">
				<view class="alignment justify-content-between">
					<view class="main-bottom-button" style="background: #FF626E;" @click="toRefund(orderDetail.id)">申请退款</view>
					<view class="main-bottom-buttons" :style="{'background': themeColor  }" @click="signFor(orderDetail.id)">确认收货</view>
				</view>
				<view class="safe-padding"></view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		mapState
	} from "vuex"
	import store from "@/pagesMall/component/store/store.vue"
	import svgData from "@/common/svg.js"
	export default {
		components: {
			store
		},
		data() {
			return {
				// 订单id 
				id: '',
				// 是否加载完成
				loadEnd: false,
				// 订单详情
				orderDetail: {},
				// 商品数据
				orderData: {},
				// 地址数组
				addressData: {}
			};
		},
		onLoad(option) {
			if (uni.getStorageSync("token")) {
				uni.showLoading({
					title: "加载中"
				})
				this.id = option.id;
				this.getOrderDetail()
			} else {
				this.$util.toPage({
					mode: 2,
					path: "/pages/login/index"
				})
			}
		},
		computed: {
			...mapState({
				themeColor: state => state.app.themeColor,
				iconClock: state => {
					return svgData.svgToUrl("clock", state.app.themeColor)
				},
				iconMore: state => {
					return svgData.svgToUrl("more", state.app.themeColor)
				},
			})
		},
		methods: {
			// 获取订单详情 
			getOrderDetail() {
				this.$util.request("mall.orderDetails", {
					order_id: this.id
				}).then(res => {
					if (res.code == 1) {
						this.orderDetail = res.data
						this.addressData.defaultAddress = res.data.user_address
						this.addressData.name = res.data.real_name
						this.addressData.tel = res.data.user_phone
						this.orderData.images = res.data.image
						this.orderData.name = res.data.name
						this.orderData.price = res.data.goods_price
						uni.hideLoading()
						this.loadEnd = true
					} else {
						uni.showToast({
							title: res.msg,
							icon: 'none'
						})
					}
				}).catch(error => {
					console.error('获取订单详情', error)
				})
			},
			// 取消订单
			payCancel(id) {
				uni.showModal({
					title: '提示',
					content: '确认取消该订单吗?',
					confirmText: '确认取消',
					confirmColor: this.themeColor,
					cancelText: '我再想想',
					cancelColor: '#999999',
					success: (res) => {
						if (res.confirm) {
							this.$util.request("mall.delOrder", {
								order_id: id,
							}).then(res => {
								if (res.code == 1) {
									uni.showToast({
										title: "取消成功",
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
								console.error('取消订单', error)
							})
						}
					}
				})
			},
			// 立即支付
			pay() {
				this.$util.toPage({
					mode: 2,
					path: "/pagesMall/order/pay?money=" + this.orderDetail.total_price + "&id=" + this.id
				})
			},
			// 申请退款
			toRefund(id) {
				this.$util.toPage({
					mode: 1,
					path: "/pagesMall/order/refund?id=" + id
				})
			},
			// 确认收货
			signFor(id) {
				uni.showModal({
					title: '提示',
					content: '确认此商品已收货,点击确认收货后订单完成?',
					confirmText: '确认收货',
					confirmColor: this.themeColor,
					cancelText: '我再想想',
					cancelColor: '#999999',
					success: (res) => {
						if (res.confirm) {
							if (res.confirm) {
								this.$util.request("mall.orderCollect", {
									id: id,
								}).then(res => {
									if (res.code == 1) {
										uni.showToast({
											title: "签收成功",
											duration: 1000
										})
										uni.navigateBack()
									} else {
										uni.showToast({
											title: res.msg,
											icon: 'none'
										})
									}
								}).catch(error => {
									console.error('确认收货', error)
								})
							}
						}
					}
				})
			},
			// 选择地址
			chooseAddress() {
				// 待付款状态时可切地址
				if (this.orderDetail.state == 1) {
					this.$util.toPage({
						mode: 1,
						path: "/pagesMall/address/index"
					})
				}
			},
		}
	}
</script>

<style lang="scss">
	.container {
		.container-main {
			padding: 32rpx 32rpx 144rpx;

			.main-status {
				padding: 16rpx;

				.main-status-txt {
					font-size: 48rpx;
					line-height: 64rpx;
					color: #5A5B6E;
				}

				.main-status-item {
					padding-top: 16rpx;

					.item-icon {
						width: 32rpx;
						height: 32rpx;
						background-size: 32rpx;
					}

					.item-txt {
						padding-left: 16rpx;
						font-size: 28rpx;
						line-height: 40rpx;
					}
				}

			}

			.main-reason {
				margin-top: 32rpx;
				margin-bottom: 32rpx;
				border-radius: 20rpx;
				padding: 24rpx 32rpx;
				font-size: 28rpx;
				line-height: 40rpx;
				color: #FF626E;
				background: #FFFFFF;
			}

			.main-address {
				border-radius: 20rpx;
				padding: 32rpx;
				background: #FFF;

				.main-address-area {
					display: flex;
					align-items: center;

					.area-text {
						flex: 1;
						color: #5A5B6E;
						font-size: 32rpx;
						line-height: 44rpx;
					}

					.area-icon {
						margin-left: 80rpx;
						width: 32rpx;
						height: 32rpx;
						background-size: 32rpx;
					}
				}

				.main-address-personal {
					margin-top: 24rpx;
					display: flex;
					align-items: center;

					.personal-content {
						color: #979797;
						font-size: 30rpx;

						&:last-child {
							margin-left: 16rpx;
						}
					}
				}
			}

			.main-cost {
				padding: 32rpx;
				margin-top: 32rpx;
				border-radius: 16rpx;
				background: #FFFFFF;

				.pt32 {
					padding-top: 32rpx;
				}

				.main-cost-info {
					display: flex;

					.main-cost-info-txt {
						flex: 1;
						font-size: 28rpx;
						color: #979797;
					}

					.main-cost-info-money {
						font-size: 28rpx;
						color: #325DFF;
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

				.main-bottom-money {
					font-size: 40rpx;
					line-height: 56rpx;
				}

				.main-bottom-button {
					flex: 1;
					padding: 22rpx 0rpx 22rpx;
					background: #999999;
					color: rgba(255, 255, 255, 1);
					text-align: center;
					line-height: 44rpx;
					border-radius: 16rpx;
					font-size: 32rpx;
				}

				.main-bottom-buttons {
					flex: 1;
					padding: 22rpx 0rpx 22rpx;
					margin-left: 24rpx;
					background: #999999;
					color: rgba(255, 255, 255, 1);
					text-align: center;
					line-height: 44rpx;
					border-radius: 16rpx;
					font-size: 32rpx;
				}
			}
		}
	}
</style>