<template>
	<view>
		<title-bar title="订单核销"></title-bar>

		<view class="container">
			<view class="tixingyixia">提醒：请确认好商品信息再核销！！！</view>
			<!-- 商品信息 -->
			<view class="goods-info" v-if="orderInfo">
				<text class="goods-title">商品信息</text>
				<view v-for="item in orderInfo.goodsinfo" :key="item.id" class="goods-item">
					<view class="info-item">
						<text class="info-label">商品名称</text>
						<text class="info-value">{{ item.name }}</text>
					</view>
					<view class="info-item">
						<text class="info-label">数量</text>
						<text class="info-value">{{ item.quantity }}</text>
					</view>
					<view class="info-item">
						<text class="info-label">单价</text>
						<text class="info-value">{{ item.price }} 元</text>
					</view>
				</view>
			</view>

			<!-- 订单信息 -->
			<view class="order-info" v-if="orderInfo">
				<view class="info-item">
					<text class="info-label">订单编号</text>
					<text class="info-value">{{ orderInfo.order_number }}</text>
				</view>
				<view class="info-item">
					<text class="info-label">总金额</text>
					<text class="info-value">{{ orderInfo.total_amount }} 元</text>
				</view>
				<view class="info-item">
					<text class="info-label">订单类型</text>
					<text class="info-value">{{ getOrderType(orderInfo.order_type) }}</text>
				</view>
				<template v-if="orderInfo.order_type !== '3'">
					<view class="info-item">
						<text class="info-label">期望时间</text>
						<text class="info-value">{{ orderInfo.expected_time }}</text>
					</view>
				</template>
				<template v-if="orderInfo.order_type === '3'">
					<view class="info-item">
						<text class="info-label">配送地址</text>
						<text class="info-value">{{ orderInfo.address }}</text>
					</view>
				</template>
				<view class="info-item">
					<text class="info-label">备注</text>
					<text class="info-value">{{ orderInfo.remark || '无' }}</text>
				</view>
				<view class="info-item">
					<text class="info-label">订单状态</text>
					<text class="info-value">{{ getOrderStatus(orderInfo.status) }}</text>
				</view>
				<view class="info-item">
					<text class="info-label">创建时间</text>
					<text class="info-value">{{ orderInfo.created_at }}</text>
				</view>
				<view class="info-item">
					<text class="info-label">更新时间</text>
					<text class="info-value">{{ orderInfo.updated_at }}</text>
				</view>
			</view>

			<!-- 确认核销按钮 -->
			<button class="write-off-button" @click="confirmWriteOff" v-if="orderInfo">确认核销</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				orderId: '',
				orderInfo: null
			};
		},
		methods: {
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
					case '1':
						return '已支付';
					case '2':
						return '已接单';
					case '3':
						return '已备齐';
					case '4':
						return '正在配送';
					case '5':
						return '已完成';
					default:
						return '未知';
				}
			},
			fetchOrderDetail() {
				this.$util.request("main.Shop.getOrderDetail", {
					id: this.orderId
				}).then(res => {
					if (res.code === 1) {
						this.orderInfo = res.data;
					} else {
						uni.showToast({
							title: '获取订单详情失败',
							icon: 'none'
						});
					}
				});
			},
			confirmWriteOff() {
				const orderNumber = this.orderInfo.order_number;
				this.$util.request("main.Shop.writeOff", {
					order_number: orderNumber
				}).then(res => {
					if (res.code === 1) {
						uni.showToast({
							title: '核销成功',
							icon: 'success',
							success() {
								uni.navigateBack();
							}
						});
						// 重新获取订单详情以更新状态
						this.fetchOrderDetail();
					} else {
						uni.showToast({
							title: res.msg,
							icon: 'none'
						});
					}
				});
			},
			startScan() {
				uni.scanCode({
					onlyFromCamera: true,
					success: (res) => {
						this.orderId = res.result;
						this.fetchOrderDetail();
					},
					fail: (err) => {
						uni.showToast({
							title: '扫码失败，请重试',
							icon: 'none',
							success() {
								uni.navigateBack();
							}
						});
					}
				});
			}
		},
		onLoad() {
			// 页面加载时自动调用微信扫码
			this.startScan();
		}
	};
</script>

<style scoped>
	.container {
		padding: 20rpx;
		background-color: #f5f5f5;
	}

	.goods-info,
	.order-info {
		background-color: #fff;
		padding: 20rpx;
		border-radius: 16rpx;
		margin-bottom: 20rpx;
	}

	.goods-title {
		font-weight: bold;
		margin-bottom: 10rpx;
		font-size: 32rpx;
	}

	.info-item {
		display: flex;
		align-items: center;
		margin-bottom: 10rpx;
		font-size: 28rpx;
	}

	.info-label {
		flex-basis: 30%;
		/* 根据需要调整宽度 */
		text-align-last: justify;
		white-space: nowrap;
		color: #505050;
		margin-right: 20rpx;
		/* 防止标签换行 */
	}

	.info-value {
		flex-basis: 70%;
		/* 根据需要调整宽度 */
		text-align: left;
		white-space: nowrap;
		
		/* 防止值换行 */
	}

	.write-off-button {
		width: 100%;
		background-color: #1aad19;
		color: #fff;
		font-size: 32rpx;
		padding: 20rpx 0;
		border-radius: 16rpx;
		margin-top: 20rpx;
	}
	.tixingyixia{
		color: #ff0000;
		font-weight: bold;
		width: 710rpx;
		height: 80rpx;
		background: #fff;
		margin: 20rpx auto;
		line-height: 80rpx;
		padding-left: 20rpx;
		border-radius: 10rpx;
	}
	.goods-item{
		margin-top: 20rpx;
	}
</style>