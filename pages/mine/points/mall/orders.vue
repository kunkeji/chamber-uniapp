<template>
    <view>
        <title-bar title="积分订单"></title-bar>
        <view class="points-orders">
            
		<!-- 加载中 -->
		<view class="loading-box" v-if="isLoading && page === 1">
			<uni-load-more status="loading" :iconSize="24"></uni-load-more>
		</view>
		<!-- 空数据 -->
		<view class="empty-box" v-else-if="orderList.length === 0">
			<image src="/static/empty.png" mode="aspectFit" class="empty-image"></image>
			<text class="empty-text">暂无订单</text>
		</view>
		<!-- 订单列表 -->
		<view class="order-list" v-else>
			<view class="order-item" v-for="(item, index) in orderList" :key="index" @click="toDetail(item)">
				<view class="order-header">
					<text class="order-no">订单号：{{item.order_no}}</text>
					<text class="order-status" :class="'status-' + item.status">{{item.status_text}}</text>
				</view>
				<view class="goods-info">
					<image class="goods-image" :src="item.goods_image" mode="aspectFill"></image>
					<view class="info-right">
						<view class="goods-name">{{item.goods_title}}</view>
						<view class="goods-points">
							<text class="points">{{item.points}}</text>
							<text class="unit">积分</text>
						</view>
						<view class="goods-num">×{{item.num}}</view>
					</view>
				</view>
				<view class="order-footer">
					<view class="total">
						<text class="label">总积分：</text>
						<text class="value">{{Number(item.points) * item.num}}</text>
					</view>
					<view class="btn-group">
						<view class="btn cancel-btn" v-if="item.status === 0" @click.stop="cancelOrder(item)">取消订单</view>
						<view class="btn detail-btn">查看详情</view>
					</view>
				</view>
			</view>
			<!-- 加载更多 -->
			<view class="load-more">
				<view class="loading-icon" v-if="isLoading && page > 1">
					<view class="loading-dot"></view>
					<view class="loading-dot"></view>
					<view class="loading-dot"></view>
				</view>
				<text class="loading-text" v-if="isLoading && page > 1">加载中...</text>
				<text class="no-more" v-else-if="!hasMore && orderList.length > 0">没有更多了</text>
			</view>
		</view>
	</view>
    </view>
</template>

<script>
	export default {
		data() {
			return {
				// 订单列表
				orderList: [],
				// 分页参数
				page: 1,
				pageSize: 10,
				// 是否还有更多
				hasMore: true,
				// 是否加载中
				isLoading: false
			}
		},
		onLoad() {
			this.getOrderList()
		},
		// 下拉刷新
		onPullDownRefresh() {
			this.page = 1
			this.orderList = []
			this.hasMore = true
			this.getOrderList().then(() => {
				uni.stopPullDownRefresh()
			})
		},
		// 上拉加载
		onReachBottom() {
			if (this.hasMore && !this.isLoading) {
				this.page++
				this.getOrderList()
			}
		},
		methods: {
			// 获取订单列表
			async getOrderList() {
				if (!this.hasMore) return
				
				this.isLoading = true
				try {
					const res = await this.$util.request('points.orderList', {
						page: this.page,
						pageSize: this.pageSize
					})
					
					if (res.code === 1) {
						if (this.page === 1) {
							this.orderList = res.data.items
						} else {
							this.orderList = [...this.orderList, ...res.data.items]
						}
						
						// 判断是否还有更多数据
						this.hasMore = this.orderList.length < res.data.total
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
			// 获取状态文本
			getStatusText(status) {
				const statusMap = {
					0: '待发货',
					1: '已发货',
					2: '已完成',
					3: '已取消'
				}
				return statusMap[status] || '未知状态'
			},
			// 取消订单
			async cancelOrder(item) {
				uni.showModal({
					title: '提示',
					content: '确定要取消该订单吗？',
					success: async (res) => {
						if (res.confirm) {
							try {
								const res = await this.$util.request('points.cancelOrder', {
									id: item.id
								})
								
								if (res.code === 1) {
									uni.showToast({
										title: '取消成功',
										icon: 'success'
									})
									// 刷新列表
									this.page = 1
									this.orderList = []
									this.hasMore = true
									this.getOrderList()
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
			// 跳转到订单详情
			toDetail(item) {
				uni.navigateTo({
					url: `/pages/mine/points/mall/order-detail?id=${item.id}`
				})
			}
		}
	}
</script>

<style lang="scss">
	.points-orders {
		min-height: 100vh;
		background: #f5f5f5;
		padding: 20rpx;
		
		.loading-box {
			margin-top: 200rpx;
		}
		
		.empty-box {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			padding-top: 200rpx;
			
			.empty-image {
				width: 200rpx;
				height: 200rpx;
				margin-bottom: 20rpx;
			}
			
			.empty-text {
				font-size: 28rpx;
				color: #999;
			}
		}
		
		.order-list {
			.order-item {
				background: #ffffff;
				border-radius: 12rpx;
				margin-bottom: 20rpx;
				padding: 30rpx;
				
				.order-header {
					display: flex;
					align-items: center;
					justify-content: space-between;
					margin-bottom: 20rpx;
					
					.order-no {
						font-size: 26rpx;
						color: #666;
					}
					
					.order-status {
						font-size: 26rpx;
						
						&.status-0 {
							color: #325DFF;
						}
						
						&.status-1 {
							color: #FF9500;
						}
						
						&.status-2 {
							color: #52C41A;
						}
						
						&.status-3 {
							color: #999;
						}
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
				
				.order-footer {
					display: flex;
					align-items: center;
					justify-content: space-between;
					padding-top: 20rpx;
					border-top: 1px solid #f5f5f5;
					
					.total {
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
					
					.btn-group {
						display: flex;
						align-items: center;
						
						.btn {
							padding: 12rpx 24rpx;
							border-radius: 30rpx;
							font-size: 26rpx;
							margin-left: 16rpx;
							
							&.cancel-btn {
								color: #666;
								background: #f5f5f5;
							}
							
							&.detail-btn {
								color: #325DFF;
								background: rgba(50, 93, 255, 0.1);
							}
							
							&:active {
								opacity: 0.8;
							}
						}
					}
				}
			}
			
			.load-more {
				display: flex;
				align-items: center;
				justify-content: center;
				padding: 30rpx 0;
				
				.loading-icon {
					display: flex;
					align-items: center;
					margin-right: 12rpx;
					
					.loading-dot {
						width: 8rpx;
						height: 8rpx;
						border-radius: 50%;
						background-color: #325DFF;
						margin: 0 4rpx;
						animation: loading 1.4s infinite ease-in-out;
						
						&:nth-child(1) {
							animation-delay: 0s;
						}
						
						&:nth-child(2) {
							animation-delay: 0.2s;
						}
						
						&:nth-child(3) {
							animation-delay: 0.4s;
						}
					}
				}
				
				.loading-text {
					font-size: 24rpx;
					color: #666;
				}
				
				.no-more {
					font-size: 24rpx;
					color: #999;
				}
			}
		}
	}
	
	@keyframes loading {
		0%, 100% {
			transform: scale(0.6);
			opacity: 0.6;
		}
		50% {
			transform: scale(1);
			opacity: 1;
		}
	}
</style> 