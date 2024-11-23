<template>
	<view class="container">
		<!-- 标题栏 -->
		<title-bar :showBack="true" title="订单确认"></title-bar>
		<!-- 内容区 -->
		<view class="container-main" v-if="loadEnd">
			<!-- 地址选择 -->
			<view class="main-address" @click="chooseAddress()">
				<view class="main-address-area">
					<view class="area-text">
						{{addressData.address || "请选择收货地址"}}
					</view>
					<view class="area-icon" :style="{'background-image': 'url('+ iconMore +')'}" v-if="iconMore"></view>
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
				<store :show-data="goodsData"></store>
			</view>
			<!-- 商品金额/配送费 -->
			<view class="main-cost">
				<view class="main-cost-info">
					<view class="main-cost-info-txt">商品金额</view>
					<view class="main-cost-info-money" :style="{ color:themeColor }">￥{{goodsData.price}}</view>
				</view>
				<view class="main-cost-info pt32">
					<view class="main-cost-info-txt">运费总额</view>
					<view class="main-cost-info-money" :style="{ color:themeColor }">￥{{freight}}</view>
				</view>
			</view>
			<!-- 底部按钮 -->
			<view class="main-bottom">
				<view class="alignment">
					<view class="main-bottom-money" :style="{ color: themeColor }"><text class="main-bottom-money-unit">￥</text>{{parseFloat(Number(goodsData.price) + Number(freight)).toFixed(2)}}</view>
					<view class="main-bottom-button" :style="{ background: themeColor }" @click="submitOrder()">提交订单</view>
				</view>
				<view class="safe-padding"></view>
			</view>
		</view>
		<!-- 选择地址弹窗 -->
		<address-modal ref="addressModal" @confirm="changeAddress"></address-modal>
	</view>
</template>

<script>
	import svgData from "@/common/svg.js"
	import store from "@/pagesMall/component/store/store.vue"
	import addressModal from "@/pagesMall/component/modal/address.vue"
	import {
		mapState
	} from "vuex"
	export default {
		components: {
			store,
			addressModal,
		},
		data() {
			return {
				// 是否加载完成
				loadEnd: false,
				// 商品id
				goodsId: null,
				// 商品数据
				goodsData: {},
				// 地址数组
				addressData: {},
				// 运费
				freight: 0
			};
		},
		computed: {
			...mapState({
				themeColor: state => state.app.themeColor,
				iconMore: state => {
					return svgData.svgToUrl("more", state.app.themeColor)
				},
			})
		},
		onLoad(option) {
			uni.showLoading({
				title: "加载中"
			})
			this.goodsId = option.id
			this.getGoodsDetails(() => {
				uni.hideLoading()
				this.loadEnd = true
			})
			this.getAddress()
		},
		methods: {
			// 获取商品详情
			getGoodsDetails(fn) {
				this.$util.request("mall.goodsDetails", {
					id: this.goodsId
				}).then(res => {
					if (res.code == 1) {
						this.goodsData = res.data
						this.goodsData.images = res.data.image
						this.getPostage(fn)
					} else {
						if (fn) fn()
						uni.showToast({
							title: res.msg,
							icon: 'none'
						})
					}
				}).catch(error => {
					if (fn) fn()
					console.error('获取商品详情', error)
				})
			},
			// 获取默认地址
			getAddress() {
				this.$util.request("mall.addressList", {
					is_default: 1
				}).then(res => {
					if (res.code == 1) {
						if (res.data[0]) {
							this.addressData = res.data[0]
						}
					} else {
						uni.showToast({
							title: res.msg,
							icon: 'none'
						})
					}
				}).catch(error => {
					console.error('获取默认地址', error)
				})
			},
			// 获取运费
			getPostage(fn) {
				this.$util.request("mall.getPostage", {
					pay_price: this.goodsData.price
				}).then(res => {
					if (fn) fn()
					if (res.code == 1) {
						this.freight = res.data.price
					} else {
						uni.showToast({
							title: res.msg,
							icon: 'none'
						})
					}
				}).catch(error => {
					if (fn) fn()
					console.error('获取运费', error)
				})
			},
			// 提交订单
			submitOrder() {
				if (!this.addressData || !this.addressData.id) {
					uni.showToast({
						title: "请选择收货地址",
						icon: "none"
					})
					return;
				}
				uni.showLoading({
					title: "提交中",
					mask: true
				})
				// 创建订单
				this.$util.request("mall.createOrder", {
					goods_id: this.goodsId,
					address_id: this.addressData.id
				}).then(res => {
					uni.hideLoading()
					if (res.code == 1) {
						let money = parseFloat(Number(this.goodsData.price) + Number(this.freight))
						this.$util.toPage({
							mode: 2,
							path: "/pagesMall/order/pay?money=" + money + "&id=" + res.data.order_id
						})
					} else {
						uni.showToast({
							title: res.msg,
							icon: 'none'
						})
					}
				}).catch(error => {
					console.error('创建订单', error)
				})

			},
			// 选择地址
			chooseAddress() {
				this.$refs.addressModal.open(this.addressData.id)
			},
			// 改变选择的地址
			changeAddress(item) {
				this.addressData = item
			},
		}
	}
</script>

<style lang="scss">
	.container {
		.container-main {
			padding: 32rpx 32rpx 144rpx;

			.main-address {
				border-radius: 20rpx;
				padding: 32rpx;
				background: #FFF;

				.main-address-area {
					display: flex;
					align-items: center;

					.area-text {
						flex: 1;
						align-self: flex-start;
						color: #5A5B6E;
						font-size: 32rpx;
						line-height: 44rpx;
						margin-right: 80rpx;
					}

					.area-icon {
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

					.main-bottom-money-unit {
						font-size: 32rpx;
						line-height: 44rpx;
					}
				}

				.main-bottom-button {
					flex: 1;
					margin-left: 24rpx;
					padding: 22rpx 0rpx 22rpx;
					background: #999999;
					color: #FFFFFF;
					text-align: center;
					line-height: 44rpx;
					border-radius: 16rpx;
				}

			}
		}
	}
</style>