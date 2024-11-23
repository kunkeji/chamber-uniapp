<template>
	<view class="page">
		<title-bar title="订单详情"></title-bar>

		<scroll-view scroll-y class="container">
			<!-- 订单状态展示 -->
			<view class="status-card">
				<text :class="['status-text', `status-${orderInfo.status}`]">
					{{ getOrderStatus(orderInfo.status) }}
				</text>
			</view>

			<!-- 订单二维码 - 只在特定状态显示 -->
			<view class="qrcode" v-if="showQrcode">
				<text class="qrcode-title">取餐码</text>
				<image :src="orderInfo.qrcode" mode="aspectFit" class="qrcode-image"></image>
				<text class="qrcode-tip">请向商家出示此二维码</text>
			</view>

			<!-- 店铺信息卡片 -->
			<view class="info-card shop-card">
				<view class="shop-info">
					<image :src="shopImage(shopInfo.shop_image)" mode="aspectFill" class="shop-image"></image>
					<view class="shop-detail">
						<text class="shop-name">{{ shopInfo.title }}</text>
						<text class="order-number">订单号：{{ orderInfo.order_number }}</text>
					</view>
				</view>
			</view>

			<!-- 订单信息卡片 -->
			<view class="info-card">
				<view class="card-title">订单信息</view>
				<view class="info-item">
					<text class="info-label">订单类型</text>
					<text class="info-value">{{ getOrderType(orderInfo.order_type) }}</text>
				</view>

				<template v-if="orderInfo.order_type !== '3'">
					<view class="info-item">
						<text class="info-label">预计时间</text>
						<text class="info-value highlight">{{ orderInfo.expected_time }}</text>
					</view>
				</template>

				<template v-if="orderInfo.order_type === '3'">
					<view class="info-item">
						<text class="info-label">配送地址</text>
						<text class="info-value address">{{ orderInfo.address }}</text>
					</view>
				</template>

				<view class="info-item">
					<text class="info-label">备注信息</text>
					<text class="info-value">{{ orderInfo.remark || '无' }}</text>
				</view>
			</view>

			<!-- 商品信息卡片 -->
			<view class="info-card">
				<view class="card-title">商品信息</view>
				<view v-for="item in orderInfo.goodsinfo" :key="item.id" class="goods-item">
					<view class="goods-name">{{ item.name }}</view>
					<view class="goods-detail">
						<text class="goods-quantity">x{{ item.quantity }}</text>
						<text class="goods-price">¥{{ item.price }}</text>
					</view>
				</view>

				<view class="price-summary">
					<text class="total-label">订单总价</text>
					<text class="total-price">¥{{ orderInfo.total_amount }}</text>
				</view>
			</view>

			<!-- 订单时间信息 -->
			<view class="info-card">
				<view class="time-item">
					<text class="time-label">创建时间</text>
					<text class="time-value">{{ orderInfo.created_at }}</text>
				</view>
				<view class="time-item">
					<text class="time-label">更新时间</text>
					<text class="time-value">{{ orderInfo.updated_at }}</text>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				orderId: '',
				orderInfo: {},
				shopInfo: {}
			};
		},
		computed: {
			// 控制二维码显示的计算属性
			showQrcode() {
				const validStatus = ['1', '2', '3', '4'];
				return validStatus.includes(this.orderInfo.status);
			}
		},
		methods: {
			shopImage(res) {
				return getApp().globalData.adminPath + res;
			},
			getOrderType(type) {
				switch (type) {
					case '1':
						return '到店吃';
					case '2':
						return '到店取';
					case '3':
						return '外卖';
					default:
						return '未知';
				}
			},
			getOrderStatus(status) {
				switch (status) {
					case '-1':
						return '未支付';
					case '1':
						return '已支付';
					case '2':
						return '已接单';
					case '3':
						return '准备好了';
					case '4':
						return '正在配送';
					case '5':
						return '已完成';
					case '0':
						return '已取消';
					default:
						return status;
				}
			},
			fetchOrderDetail() {
				this.$util.request("main.Shop.getOrderDetail", {
					id: this.orderId
				}).then(res => {
					if (res.code === 1) {
						this.orderInfo = res.data;
						this.shopInfo = res.data.shopinfo;
					} else {
						uni.showToast({
							title: '获取订单详情失败',
							icon: 'none'
						});
					}
				});
			}
		},
		onLoad(options) {
			console.log(options);
			this.orderId = options.id;
			this.fetchOrderDetail();
		}
	};
</script>

<style scoped>
	.page {
		min-height: 100vh;
		background: #f5f7fa;
	}

	.container {
		padding: 20rpx;
		box-sizing: border-box;
		height: calc(100vh - 88rpx);
	}

	.status-card {
		background: #fff;
		padding: 40rpx 0;
		text-align: center;
		border-radius: 16rpx;
		margin-bottom: 20rpx;
	}

	.status-text {
		font-size: 36rpx;
		font-weight: 600;
		padding: 12rpx 30rpx;
		border-radius: 30rpx;
	}

	.status--1 { background: #ffeee9; color: #ff4d4f; }
	.status-1 { background: #e6f7ff; color: #1890ff; }
	.status-2 { background: #f6ffed; color: #52c41a; }
	.status-3 { background: #fff7e6; color: #faad14; }
	.status-4 { background: #f9f0ff; color: #722ed1; }
	.status-5 { background: #f5f5f5; color: #666666; }
	.status-0 { background: #f5f5f5; color: #999999; }

	.qrcode {
		background: #fff;
		padding: 30rpx;
		border-radius: 16rpx;
		margin-bottom: 20rpx;
		text-align: center;
	}

	.qrcode-title {
		font-size: 32rpx;
		font-weight: 600;
		margin-bottom: 20rpx;
		display: block;
	}

	.qrcode-image {
		width: 300rpx;
		height: 300rpx;
		margin: 20rpx  auto;
	}

	.qrcode-tip {
		font-size: 24rpx;
		color: #666;
	}

	.info-card {
		background: #fff;
		padding: 30rpx;
		border-radius: 16rpx;
		margin-bottom: 20rpx;
	}

	.card-title {
		font-size: 32rpx;
		font-weight: 600;
		margin-bottom: 20rpx;
		color: #333;
	}

	.shop-info {
		display: flex;
		align-items: center;
	}

	.shop-image {
		width: 100rpx;
		height: 100rpx;
		border-radius: 12rpx;
	}

	.shop-detail {
		margin-left: 20rpx;
	}

	.shop-name {
		font-size: 32rpx;
		font-weight: 600;
		color: #333;
	}

	.order-number {
		font-size: 24rpx;
		color: #666;
		margin-top: 8rpx;
		display: block;
	}

	.info-item {
		display: flex;
		justify-content: space-between;
		margin-bottom: 16rpx;
		font-size: 28rpx;
	}

	.info-label {
		color: #666;
	}

	.info-value {
		color: #333;
		max-width: 70%;
		text-align: right;
	}

	.info-value.highlight {
		color: #1890ff;
		font-weight: 500;
	}

	.info-value.address {
		word-break: break-all;
	}

	.goods-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 16rpx 0;
		border-bottom: 1rpx solid #f5f5f5;
	}

	.goods-name {
		font-size: 28rpx;
		color: #333;
		flex: 1;
	}

	.goods-detail {
		display: flex;
		align-items: center;
		gap: 20rpx;
	}

	.goods-quantity {
		font-size: 26rpx;
		color: #666;
	}

	.goods-price {
		font-size: 28rpx;
		color: #ff4d4f;
		font-weight: 500;
	}

	.price-summary {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-top: 20rpx;
		padding-top: 20rpx;
		border-top: 1rpx solid #f5f5f5;
	}

	.total-label {
		font-size: 28rpx;
		color: #333;
	}

	.total-price {
		font-size: 36rpx;
		color: #ff4d4f;
		font-weight: 600;
	}

	.time-item {
		display: flex;
		justify-content: space-between;
		font-size: 24rpx;
		color: #999;
		margin-bottom: 10rpx;
	}
</style>