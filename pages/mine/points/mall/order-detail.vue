<template>
    <view>
        <title-bar title="订单详情"></title-bar>
        <view class="order-detail">
            <!-- 加载中 -->
            <view class="loading-box" v-if="isLoading">
			<uni-load-more status="loading" :iconSize="24"></uni-load-more>
		</view>
		<block v-else>
			<!-- 订单状态 -->
			<view class="status-box">
				<text class="status">{{orderInfo.status_text}}</text>
				<text class="desc">{{getStatusDesc(orderInfo.status)}}</text>
			</view>
			<!-- 收货信息 -->
			<view class="info-card">
				<view class="card-title">收货信息</view>
				<view class="info-item">
					<text class="label">收货人：</text>
					<text class="value">{{orderInfo.name}}</text>
				</view>
				<view class="info-item">
					<text class="label">手机号：</text>
					<text class="value">{{orderInfo.mobile}}</text>
				</view>
				<view class="info-item">
					<text class="label">收货地址：</text>
					<text class="value">{{orderInfo.address}}</text>
				</view>
			</view>
			<!-- 商品信息 -->
			<view class="info-card">
				<view class="card-title">商品信息</view>
				<view class="goods-info">
					<image class="goods-image" :src="orderInfo.goods_image" mode="aspectFill"></image>
					<view class="info-right">
						<view class="goods-name">{{orderInfo.goods_title}}</view>
						<view class="goods-points">
							<text class="points">{{orderInfo.points}}</text>
							<text class="unit">积分</text>
						</view>
						<view class="goods-num">×{{orderInfo.num}}</view>
					</view>
				</view>
				<view class="total">
					<text class="label">总积分：</text>
					<text class="value">{{Number(orderInfo.points) * orderInfo.num}}</text>
				</view>
			</view>
			<!-- 订单信息 -->
			<view class="info-card">
				<view class="card-title">订单信息</view>
				<view class="info-item">
					<text class="label">订单编号：</text>
					<text class="value">{{orderInfo.order_no}}</text>
				</view>
				<view class="info-item">
					<text class="label">创建时间：</text>
					<text class="value">{{orderInfo.createtime_text || '--'}}</text>
				</view>
				<view class="info-item" v-if="orderInfo.status >= 1">
					<text class="label">发货时间：</text>
					<text class="value">{{orderInfo.send_time_text || '--'}}</text>
				</view>
				<view class="info-item" v-if="orderInfo.status >= 2">
					<text class="label">完成时间：</text>
					<text class="value">{{orderInfo.finish_time_text || '--'}}</text>
				</view>
				<view class="info-item" v-if="orderInfo.status === 3">
					<text class="label">取消时间：</text>
					<text class="value">{{orderInfo.cancel_time_text || '--'}}</text>
				</view>
				<view class="info-item" v-if="orderInfo.status === 1 && orderInfo.express_name">
					<text class="label">快递公司：</text>
					<text class="value">{{orderInfo.express_name}}</text>
				</view>
				<view class="info-item" v-if="orderInfo.status === 1 && orderInfo.express_no">
					<text class="label">快递单号：</text>
					<text class="value">{{orderInfo.express_no}}</text>
				</view>
			</view>
			<!-- 底部按钮 -->
			<view class="footer-bar" v-if="orderInfo.status === 0 || orderInfo.status === 1">
				<template v-if="orderInfo.status === 0">
					<view class="cancel-btn" @click="cancelOrder">取消订单</view>
				</template>
				<template v-else>
					<view class="confirm-btn" @click="confirmOrder">确认收货</view>
				</template>
			</view>
		</block>
	</view>
    </view>
</template>

<script>
	export default {
		data() {
			return {
				id: '',
				isLoading: true,
				orderInfo: {}
			}
		},
		onLoad(options) {
			this.id = options.id
			this.getOrderDetail()
		},
		methods: {
			// 获取订单详情
			async getOrderDetail() {
				this.isLoading = true
				try {
					const res = await this.$util.request('points.orderDetail', {
						id: this.id
					})
					
					if (res.code === 1) {
						this.orderInfo = res.data
					} else {
						uni.showToast({
							title: res.msg || '获取失败',
							icon: 'none'
						})
					}
				} catch (e) {
					uni.showToast({
						title: '获取失败',
						icon: 'none'
					})
				} finally {
					this.isLoading = false
				}
			},
			// 获取状态描述
			getStatusDesc(status) {
				const descMap = {
					0: '商家正在处理您的订单',
					1: '商品已发出，请耐心等待',
					2: '订单已完成',
					3: '订单已取消'
				}
				return descMap[status] || ''
			},
			// 取消订单
			async cancelOrder() {
				uni.showModal({
					title: '提示',
					content: '确定要取消该订单吗？',
					success: async (res) => {
						if (res.confirm) {
							try {
								const res = await this.$util.request('points.cancelOrder', {
									id: this.id
								})
								
								if (res.code === 1) {
									uni.showToast({
										title: '取消成功',
										icon: 'success'
									})
									// 刷新详情
									this.getOrderDetail()
								} else {
									uni.showToast({
										title: res.msg || '取消失败',
										icon: 'none'
									})
								}
							} catch (e) {
								uni.showToast({
									title: '取消失败',
									icon: 'none'
								})
							}
						}
					}
				})
			},
			// 确认收货
			async confirmOrder() {
				uni.showModal({
					title: '提示',
					content: '确定要确认收货吗？',
					success: async (res) => {
						if (res.confirm) {
							try {
								const res = await this.$util.request('points.confirmOrder', {
									id: this.id
								})
								
								if (res.code === 1) {
									uni.showToast({
										title: '确认成功',
										icon: 'success'
									})
									// 刷新详情
									this.getOrderDetail()
								} else {
									uni.showToast({
										title: res.msg || '确认失败',
										icon: 'none'
									})
								}
							} catch (e) {
								uni.showToast({
									title: '确认失败',
									icon: 'none'
								})
							}
						}
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	.order-detail {
		min-height: 100vh;
		background: #f5f5f5;
		padding-bottom: 120rpx;
		
		.loading-box {
			margin-top: 200rpx;
		}
		
		.status-box {
			background: #325DFF;
			padding: 40rpx 30rpx;
			
			.status {
				font-size: 36rpx;
				color: #ffffff;
				font-weight: bold;
				margin-bottom: 12rpx;
				display: block;
			}
			
			.desc {
				font-size: 26rpx;
				color: rgba(255,255,255,0.8);
			}
		}
		
		.info-card {
			background: #ffffff;
			margin-top: 20rpx;
			padding: 30rpx;
			
			.card-title {
				font-size: 30rpx;
				color: #333;
				font-weight: bold;
				margin-bottom: 20rpx;
			}
			
			.info-item {
				margin-bottom: 16rpx;
				
				.label {
					font-size: 26rpx;
					color: #666;
				}
				
				.value {
					font-size: 26rpx;
					color: #333;
				}
				
				&:last-child {
					margin-bottom: 0;
				}
			}
			
			.goods-info {
				display: flex;
				margin-bottom: 20rpx;
				
				.goods-image {
					width: 160rpx;
					height: 160rpx;
					border-radius: 12rpx;
					margin-right: 20rpx;
				}
				
				.info-right {
					flex: 1;
					position: relative;
					
					.goods-name {
						font-size: 28rpx;
						color: #333;
						line-height: 40rpx;
						margin-bottom: 16rpx;
					}
					
					.goods-points {
						.points {
							font-size: 32rpx;
							color: #325DFF;
							font-weight: bold;
						}
						
						.unit {
							font-size: 24rpx;
							color: #325DFF;
							margin-left: 4rpx;
						}
					}
					
					.goods-num {
						position: absolute;
						right: 0;
						bottom: 0;
						font-size: 26rpx;
						color: #999;
					}
				}
			}
			
			.total {
				padding-top: 20rpx;
				border-top: 1px solid #f5f5f5;
				text-align: right;
				
				.label {
					font-size: 26rpx;
					color: #666;
				}
				
				.value {
					font-size: 32rpx;
					color: #325DFF;
					font-weight: bold;
				}
			}
		}
		
		.footer-bar {
			position: fixed;
			left: 0;
			right: 0;
			bottom: 0;
			height: 100rpx;
			background: #ffffff;
			display: flex;
			align-items: center;
			justify-content: flex-end;
			padding: 0 30rpx;
			box-shadow: 0 -2rpx 10rpx rgba(0,0,0,0.05);
			
			.cancel-btn, .confirm-btn {
				width: 160rpx;
				height: 64rpx;
				border-radius: 32rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				font-size: 26rpx;
				
				&:active {
					opacity: 0.8;
				}
			}
			
			.cancel-btn {
				background: #f5f5f5;
				color: #666;
			}
			
			.confirm-btn {
				background: #325DFF;
				color: #ffffff;
			}
		}
	}
</style> 