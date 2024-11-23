<template>
	<view class="container">
		<!-- 标题栏 -->
		<title-bar :showBack="true" title="填写信息"></title-bar>
		<!-- 内容区 -->
		<view class="container-main" v-if="loadEnd">
			<!-- 商品信息 -->
			<view class="main-goods">
				<store :show-data="orderData"></store>
			</view>
			<!-- 填写快递单号 -->
			<view class="main-trackingNumber">
				<view class="trackingNumber-title">
					填写快递单号
				</view>
				<input class="trackingNumber-code" type="text" v-model="trackingNumber" placeholder="填写快递单号" />
			</view>
			<!-- 提交按钮 -->
			<view class="main-bottom">
				<view class="harmless-content-button" :style="{ background: themeColor }" @click="submit()">提交信息</view>
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
	export default {
		components: {
			store
		},
		data() {
			return {
				// 加载完成
				loadEnd: false,
				// 订单id
				orderId: '',
				// 快递单号
				trackingNumber: '',
				// 商品数据
				orderData: {},
				// 退款信息
				orderItem: {}
			};
		},
		computed: {
			...mapState({
				themeColor: state => state.app.themeColor,
			})
		},
		onLoad(option) {
			this.orderItem = JSON.parse(option.item);
			this.orderId = this.orderItem.id;
			this.orderData.images = this.orderItem.goods.image;
			this.orderData.name = this.orderItem.goods.name;
			this.orderData.price = this.orderItem.pay_price;
			this.$nextTick(() => {
				this.loadEnd = true
			})
		},
		methods: {
			// 提交快递信息
			submit() {
				if (this.trackingNumber == '') {
					uni.showToast({
						title: "请填写快递单号",
						icon: "none",
						duration: 1000
					})
					return
				}
				this.$util.request("mall.receipt", {
					order_id: this.orderId,
					refund_express_no: this.trackingNumber
				}).then(res => {
					if (res.code == 1) {
						uni.redirectTo({
							url: "/pagesMall/order/success?type=1"
						})
					} else {
						uni.showToast({
							title: res.msg,
							icon: 'none'
						})
					}
				}).catch(error => {
					console.error('提交快递信息', error)
				})

			}
		}
	}
</script>

<style lang="scss">
	.container {
		.container-main {
			padding-bottom: 144rpx;

			.main-goods {
				margin: 32rpx;
			}

			.main-trackingNumber {
				margin: 32rpx;
				border-radius: 20rpx;
				padding: 32rpx;
				background: #FFF;

				.trackingNumber-title {
					color: #5A5B6E;
					font-size: 28rpx;
					font-weight: 600;
				}

				.trackingNumber-code {
					margin-top: 24rpx;
					color: #999;
					font-size: 28rpx;
					border-radius: 10rpx;
					padding: 20rpx 32rpx;
					background: #F6F7FB;
				}

				.placeholder-class {
					color: #999;
					font-size: 28rpx;
				}
			}

			.main-bottom {
				padding-top: 16rpx;
				padding-bottom: 16rpx;
				position: fixed;
				bottom: 0;
				left: 0;
				right: 0;
				width: 100%;
				text-align: center;
				background: #FFF;
				z-index: 99;

				.harmless-content-button {
					margin-left: 26rpx;
					margin-right: 26rpx;
					width: 700rpx;
					height: 80rpx;
					background: rgba(50, 93, 255, 1);
					color: rgba(255, 255, 255, 1);
					text-align: center;
					line-height: 80rpx;
					border-radius: 16rpx;
				}

				.safe-padding {
					width: 100%;
					padding-bottom: constant(safe-area-inset-bottom);
					/* 兼容 iOS < 11.2 */
					padding-bottom: env(safe-area-inset-bottom);
					/* 兼容 iOS >= 11.2 */
				}

			}
		}
	}
</style>