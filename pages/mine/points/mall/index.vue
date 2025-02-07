<template>
    <view>
        <title-bar title="积分商城"></title-bar>
	<view class="points-mall">
		<!-- 顶部订单入口 -->
		<view class="order-entry" @click="toOrders">
			<text class="entry-text">我的订单</text>
			<text class="entry-arrow">></text>
		</view>
		
		<!-- 加载中 -->
		<view class="loading-box" v-if="isLoading && page === 1">
			<uni-load-more status="loading" :iconSize="24"></uni-load-more>
		</view>
		<!-- 空数据 -->
		<view class="empty-box" v-else-if="goodsList.length === 0">
			<image src="/static/empty.png" mode="aspectFit" class="empty-image"></image>
			<text class="empty-text">暂无商品</text>
		</view>
		<!-- 商品列表 -->
		<view class="goods-list" v-else>
			<view class="goods-item" v-for="(item, index) in goodsList" :key="index" @click="toDetail(item)">
				<image class="goods-image" :src="item.image" mode="aspectFill"></image>
				<view class="goods-info">
					<view class="goods-name">{{item.title}}</view>
					<view class="goods-points">
						<text class="points">{{item.points}}</text>
						<text class="unit">积分</text>
					</view>
					<view class="goods-stock">库存: {{item.stock}}</view>
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
				<text class="no-more" v-else-if="!hasMore && goodsList.length > 0">没有更多了</text>
			</view>
		</view>
	</view>
    </view>
</template>

<script>
	export default {
		data() {
			return {
				// 商品列表
				goodsList: [],
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
			this.getGoodsList()
		},
		// 下拉刷新
		onPullDownRefresh() {
			this.page = 1
			this.goodsList = []
			this.hasMore = true
			this.getGoodsList().then(() => {
				uni.stopPullDownRefresh()
			})
		},
		// 上拉加载
		onReachBottom() {
			if (this.hasMore && !this.isLoading) {
				this.page++
				this.getGoodsList()
			}
		},
		methods: {
			// 获取商品列表
			async getGoodsList() {
				if (!this.hasMore) return
				
				this.isLoading = true
				try {
					const res = await this.$util.request('points.goodsList', {
						page: this.page,
						pageSize: this.pageSize
					})
					
					if (res.code === 1) {
						const items = res.data.items || []
						
						if (this.page === 1) {
							this.goodsList = items
						} else {
							this.goodsList = [...this.goodsList, ...items]
						}
						
						// 判断是否还有更多数据
						this.hasMore = this.goodsList.length < (res.data.total || 0)
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
			// 跳转到商品详情
			toDetail(item) {
				uni.navigateTo({
					url: `/pages/mine/points/mall/detail?id=${item.id}`
				})
			},
			// 跳转到订单列表
			toOrders() {
				uni.navigateTo({
					url: '/pages/mine/points/mall/orders'
				})
			}
		}
	}
</script>

<style lang="scss">
	.points-mall {
		min-height: 100vh;
		background: #f5f5f5;
		padding: 20rpx;
		
		.order-entry {
			background: #ffffff;
			border-radius: 12rpx;
			padding: 24rpx 30rpx;
			margin-bottom: 20rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			
			.entry-text {
				font-size: 28rpx;
				color: #333;
				font-weight: 500;
			}
			
			.entry-arrow {
				font-size: 28rpx;
				color: #999;
			}
			
			&:active {
				opacity: 0.7;
			}
		}
		
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
		
		.goods-list {
			.goods-item {
				background: #ffffff;
				border-radius: 12rpx;
				margin-bottom: 20rpx;
				overflow: hidden;
				
				.goods-image {
					width: 100%;
					height: 320rpx;
				}
				
				.goods-info {
					padding: 20rpx;
					
					.goods-name {
						font-size: 28rpx;
						color: #333;
						line-height: 40rpx;
						margin-bottom: 16rpx;
					}
					
					.goods-points {
						margin-bottom: 12rpx;
						
						.points {
							font-size: 36rpx;
							color: #325DFF;
							font-weight: bold;
						}
						
						.unit {
							font-size: 24rpx;
							color: #325DFF;
							margin-left: 4rpx;
						}
					}
					
					.goods-stock {
						font-size: 24rpx;
						color: #999;
					}
				}
				
				&:active {
					opacity: 0.8;
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