<template>
	<view class="points-page">
		<title-bar title="积分明细"></title-bar>
		<view class="points-header">
			<view class="total-points">
				<text class="label">当前积分</text>
				<text class="value">{{totalPoints}}</text>
			</view>
		</view>
		<!-- 加载中 -->
		<view class="loading-box" v-if="isLoading && page === 1">
			<uni-load-more status="loading" :iconSize="24"></uni-load-more>
		</view>
		<!-- 空数据 -->
		<view class="empty-box" v-else-if="pointsList.length === 0">
			<image src="/static/empty.png" mode="aspectFit" class="empty-image"></image>
			<text class="empty-text">暂无积分记录</text>
		</view>
		<!-- 积分列表 -->
		<view class="points-list" v-else>
			<view class="points-item" v-for="(item, index) in pointsList" :key="index">
				<view class="left">
					<view class="title">{{item.remark}}</view>
					<view class="time">{{item.createtime}}</view>
				</view>
				<view class="right" :class="{'plus': item.type === 1}">
					{{item.type === 1 ? '+' : '-'}}{{item.points}}
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
				<text class="no-more" v-else-if="!hasMore && pointsList.length > 0">没有更多了</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				// 总积分
				totalPoints: 0,
				// 积分列表
				pointsList: [],
				// 分页参数
				page: 1,
				pageSize: 10,
				// 加载状态
				loadMoreStatus: 'more',
				// 是否还有更多
				hasMore: true,
				// 是否加载中
				isLoading: false
			}
		},
		onLoad() {
			this.getPointsDetail()
		},
		// 下拉刷新
		onPullDownRefresh() {
			this.page = 1
			this.pointsList = []
			this.hasMore = true
			this.loadMoreStatus = 'more'
			this.getPointsDetail().then(() => {
				uni.stopPullDownRefresh()
			})
		},
		// 上拉加载
		onReachBottom() {
			if (this.hasMore && this.loadMoreStatus !== 'loading') {
				this.page++
				this.getPointsDetail()
			}
		},
		methods: {
			// 获取积分明细
			async getPointsDetail() {
				if (!this.hasMore) return
				
				this.loadMoreStatus = 'loading'
				this.isLoading = true
				
				try {
					const res = await this.$util.request("mine.pointsList", {
						page: this.page,
						pageSize: this.pageSize
					})
					
					if (res.code === 1) {
						this.totalPoints = res.data.total_points
						
						if (this.page === 1) {
							this.pointsList = res.data.items
						} else {
							this.pointsList = [...this.pointsList, ...res.data.items]
						}
						
						// 判断是否还有更多数据
						this.hasMore = this.pointsList.length < res.data.total
						this.loadMoreStatus = this.hasMore ? 'more' : 'noMore'
					} else {
						this.loadMoreStatus = 'more'
						uni.showToast({
							title: res.msg || '获取失败',
							icon: 'none'
						})
					}
				} catch (e) {
					this.loadMoreStatus = 'more'
					uni.showToast({
						title: '获取失败',
						icon: 'none'
					})
				} finally {
					this.isLoading = false
				}
			}
		}
	}
</script>

<style lang="scss">
	.points-page {
		min-height: 100vh;
		background: #f5f5f5;
		
		.points-header {
			background: #ffffff;
			padding: 30rpx;
			margin-bottom: 20rpx;
			
			.total-points {
				text-align: center;
				
				.label {
					font-size: 28rpx;
					color: #666;
					margin-bottom: 10rpx;
					display: block;
				}
				
				.value {
					font-size: 48rpx;
					color: #333;
					font-weight: bold;
				}
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
		
		.points-list {
			background: #ffffff;
			padding: 0 30rpx;
			
			.points-item {
				display: flex;
				justify-content: space-between;
				align-items: center;
				padding: 30rpx 0;
				border-bottom: 1px solid #f5f5f5;
				
				.left {
					.title {
						font-size: 28rpx;
						color: #333;
						margin-bottom: 6rpx;
					}
					
					.time {
						font-size: 24rpx;
						color: #999;
					}
				}
				
				.right {
					font-size: 32rpx;
					color: #ff4d4f;
					font-weight: bold;
					
					&.plus {
						color: #52c41a;
					}
				}
				
				&:last-child {
					border-bottom: none;
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