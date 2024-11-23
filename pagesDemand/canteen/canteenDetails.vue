<template>
	<view class="page">
		<title-bar :title="navigationBarTitle"></title-bar>
		<view v-if="!orders.length" class="empty-state">
			<image class="empty-image" src="https://association.kunkeji.com/uploads/20241027/fb6b1cdc4fd133ee1826da9b41418f96.png" mode="aspectFit" />
			<text class="empty-text">暂无订单</text>
		</view>
		<scroll-view v-else scroll-y class="order-list" @scrolltolower="onLoadMore" refresher-enabled @refresherrefresh="onRefresh">
			<view v-for="order in orders" :key="order.id" class="order-item" @click.stop="order.status !== '-1' && orderDetails(order.id)" :class="{ 'disabled': order.status === '-1' }">
				<view class="order-header">
					<text class="order-id">订单号: {{ order.order_number }}</text>
					<text :class="['order-status', `status-${order.status}`]">{{ getOrderStatusText(order.status) }}</text>
				</view>
				<view class="order-type">
					<text>订单类型: {{ getOrderTypeText(order.order_type) }}</text>
				</view>
				<view class="order-details">
					<view v-for="item in order.order_details" :key="item.id" class="order-detail-item">
						<view class="product-name">{{ item.name }}</view>
						<view class="product-quantity">x{{ item.quantity }}</view>
						<view class="product-price">¥{{ item.price }}</view>
					</view>
				</view>
				<view class="order-summary">
					<view>订单总价: ¥{{ order.total_amount }}</view>
					<view v-if="order.order_type === '3'">配送地址: {{ order.address }}</view>
					<view v-if="order.order_type !== '3'">预计用餐时间: {{ order.expected_time }}</view>
				</view>
				<view class="order-footer">
					<text class="order-time">{{ formatDate(order.created_at) }}</text>
					<view class="order-actions">
						<button 
							class="action-btn" 
							v-if="order.status === '-1'" 
							@click.stop="goToPayment(order)"
						>去支付</button>
						<button class="action-btn" v-if="order.status === '3'">确认收货</button>
					</view>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				navigationBarTitle: '订单列表',
				orders: [],
				refreshInterval: null,
				loading: false,
				page: 1,
				hasMore: true
			};
		},
		created() {
			this.fetchOrderList();
			this.startRefreshInterval();
		},
		beforeDestroy() {
			this.stopRefreshInterval();
		},
		methods: {
			async fetchOrderList(isRefresh = false) {
				if (this.loading) return;
				this.loading = true;
				
				try {
					if (isRefresh) {
						this.page = 1;
						this.hasMore = true;
					}
					
					const res = await this.$util.request("main.Shop.getOrderList", {
						page: this.page
					});
					
					if (isRefresh) {
						this.orders = res;
					} else {
						this.orders = [...this.orders, ...res];
					}
					
					this.hasMore = res.length > 0;
					this.page++;
				} catch (error) {
					uni.showToast({
						title: '获取订单列表失败',
						icon: 'none'
					});
				} finally {
					this.loading = false;
				}
			},
			getOrderStatusText(status) {
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
			getOrderTypeText(orderType) {
				switch (orderType) {
					case '1':
						return '到店吃';
					case '2':
						return '自取';
					case '3':
						return '外卖';
					default:
						return orderType;
				}
			},
			formatDate(dateString) {
				const date = new Date(dateString);
				return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
			},
			startRefreshInterval() {
				this.refreshInterval = setInterval(() => {
					this.fetchOrderList();
				}, 60000); // 每60秒（1分钟）刷新一次
			},
			stopRefreshInterval() {
				if (this.refreshInterval) {
					clearInterval(this.refreshInterval);
				}
			},
			orderDetails(orderId) {
				uni.navigateTo({
					url: '/pagesDemand/canteen/orderDetails?id=' + orderId
				});
			},
			async onRefresh() {
				await this.fetchOrderList(true);
				uni.stopPullDownRefresh();
			},
			onLoadMore() {
				if (this.hasMore && !this.loading) {
					this.fetchOrderList();
				}
			},
			goToPayment(order) {
				const cart = order.order_details.map(item => ({
					goods_name: item.name,
					quantity: item.quantity,
					price: item.price,
					id: item.id
				}));
				
				const encodedCart = encodeURIComponent(JSON.stringify(cart));
				
				uni.navigateTo({
					url: `/pagesDemand/canteen/userorder?cart=${encodedCart}&shopid=${order.shop_id}`
				});
			}
		}
	};
</script>

<style scoped>
	.page {
		min-height: 100vh;
		background-color: #f5f6fa;
	}

	.empty-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding-top: 200rpx;
	}

	.empty-image {
		width: 300rpx;
		height: 300rpx;
	}

	.empty-text {
		margin-top: 30rpx;
		color: #999;
		font-size: 28rpx;
	}

	.order-list {
		height: calc(100vh - 88rpx);
		padding: 20rpx;
		box-sizing: border-box;
	}

	.order-item {
		background-color: #fff;
		border-radius: 16rpx;
		padding: 24rpx;
		margin-bottom: 20rpx;
		box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);
		transition: all 0.3s;
		width: 100%;
		box-sizing: border-box;
		cursor: pointer;
	}

	.order-item:active {
		transform: scale(0.98);
	}

	.order-status {
		padding: 4rpx 12rpx;
		border-radius: 8rpx;
		font-size: 24rpx;
	}

	.status--1 { background: #ffeee9; color: #ff4d4f; }
	.status-1 { background: #e6f7ff; color: #1890ff; }
	.status-2 { background: #f6ffed; color: #52c41a; }
	.status-3 { background: #fff7e6; color: #faad14; }
	.status-4 { background: #f9f0ff; color: #722ed1; }
	.status-5 { background: #f5f5f5; color: #666666; }
	.status-0 { background: #f5f5f5; color: #999999; }

	.order-actions {
		display: flex;
		gap: 16rpx;
		margin-top: 16rpx;
	}

	.action-btn {
		font-size: 24rpx;
		padding: 8rpx 24rpx;
		background: #1890ff;
		color: #fff;
		border-radius: 24rpx;
		border: none;
		min-width: 120rpx;
		text-align: center;
	}

	.action-btn:active {
		opacity: 0.8;
	}

	.order-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		flex-wrap: wrap;
		gap: 10rpx;
		font-size: 32rpx;
		font-weight: 600;
		color: #333333;
		margin-bottom: 15rpx;
	}

	.order-id {
		color: #333333;
		word-break: break-all;
		flex: 1;
	}

	.order-type {
		font-size: 28rpx;
		color: #333333;
		margin-bottom: 15rpx;
	}

	.order-details {
		margin-bottom: 15rpx;
	}

	.order-detail-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: 28rpx;
		color: #333333;
		margin-bottom: 10rpx;
		flex-wrap: wrap;
	}

	.product-name {
		flex: 1;
		margin-right: 10rpx;
		word-break: break-all;
		min-width: 0;
	}

	.product-quantity {
		margin-right: 10rpx;
	}

	.order-summary {
		font-size: 28rpx;
		color: #333333;
		margin-bottom: 15rpx;
		word-break: break-all;
	}

	.order-summary view {
		margin-bottom: 8rpx;
	}

	.order-footer {
		display: flex;
		justify-content: space-between;
		align-items: center;
		flex-wrap: wrap;
		gap: 10rpx;
		font-size: 28rpx;
		color: #666666;
	}

	.order-time {
		font-size: 24rpx;
	}

	.order-item.disabled {
		cursor: default;
		pointer-events: none;  /* 禁用鼠标事件 */
	}

	.order-item.disabled:active {
		transform: none;  /* 禁用点击效果 */
	}
</style>