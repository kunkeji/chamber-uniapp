<template>
	<view class="page-container">
		<title-bar :title="navigationBarTitle"></title-bar>
		<!-- 顶部店铺信息卡片 -->
		<view class="shop-header">
			<view class="shop-info">
				<view class="dropdown" @click="toggleDropdown">
					<image class="shop-logo" :src="selectedShop.shop_image" mode="aspectFill"></image>
					<text class="shop-name">{{ selectedShop.title }}</text>
					<text class="dropdown-icon" :class="{ 'active': showDropdown }">▼</text>
				</view>
				<view class="business-status">
					<text :class="{ 'open': isBusinessOpen }">{{isBusinessOpen ? '营业中' : '休息中'}}</text>
					<switch :checked="isBusinessOpen" @change="toggleBusinessStatus" color="#07c160"/>
				</view>
			</view>
			
			<!-- 店铺选择下拉菜单 -->
			<view class="dropdown-menu" v-if="showDropdown">
				<view class="dropdown-item" 
					  v-for="shop in shops" 
					  :key="shop.id" 
					  @click="selectShop(shop)">
					<image class="shop-logo" :src="shop.shop_image" mode="aspectFill"></image>
					<text class="shop-name">{{ shop.title }}</text>
				</view>
			</view>
		</view>
 
		<!-- 营业额统计卡片 -->
		<view class="revenue-cards">
			<view class="revenue-card">
				<text class="revenue-value">¥{{ selectedShop.total_day }}</text>
				<text class="revenue-label">今日营业额</text>
			</view>
			<view class="revenue-card">
				<text class="revenue-value">¥{{ selectedShop.total_month }}</text>
				<text class="revenue-label">本月营业额</text>
			</view>
			<view class="revenue-card">
				<text class="revenue-value">¥{{ selectedShop.total_all }}</text>
				<text class="revenue-label">总营业额</text>
			</view>
		</view>

		<!-- 快捷功能按钮 -->
		<view class="quick-actions">
			<view class="action-btn" @click="navigateTo('menu1')">
				<text class="action-icon">🍽️</text>
				<text>菜品管理</text>
			</view>
			<view class="action-btn" @click="navigateTo('menu2')">
				<text class="action-icon">⚙️</text>
				<text>店铺设置</text>
			</view>
			<view class="action-btn" @click="navigateTo('menu3')">
				<text class="action-icon">📋</text>
				<text>订单核销</text>
			</view>
		</view>

		<!-- 订单状态切换 -->
		<view class="order-status-tabs">
			<view class="status-tab" 
					v-for="status in ['1', '2', '3', '4', '5']" 
					:key="status"
					:class="{ 'active': currentStatus === status }"
					@click="changeStatus(status)">
				{{ getStatusText(status) }}
			</view>
		</view>

		<!-- 订单列表 -->
		<scroll-view scroll-y class="order-list">
			<template v-if="hasOrders">
				<view class="order-card" v-for="order in filteredOrders" :key="order.id">
					<view class="order-header">
						<text class="order-number">订单号：{{ order.order_number }}</text>
						<text class="order-type">{{ getOrderTypeText(order.order_type) }}</text>
					</view>
					
					<view class="order-info">
						<view class="time-info" v-if="order.order_type != '3'">
							<text class="info-label">预计用餐时间：</text>
							<text class="info-value">{{ order.expected_time }}</text>
						</view>
						<view class="address-info" v-if="order.order_type == '3'">
							<text class="info-label">配送地址：</text>
							<text class="info-value">{{ order.address }}</text>
						</view>
						
						<view class="goods-list">
							<view class="goods-item" v-for="detail in order.order_details" :key="detail.id">
								<text class="goods-name">{{ detail.name }}</text>
								<text class="goods-quantity">x{{ detail.quantity }}</text>
								<text class="goods-price">¥{{ detail.price }}</text>
							</view>
						</view>
						
						<view class="order-total">
							<text>实付金额：</text>
							<text class="total-amount">¥{{ order.total_amount }}</text>
						</view>
					</view>

					<view class="order-actions">
						<button class="action-button" 
								v-if="order.status === '1'"
								:disabled="order.isProcessing"
								@click="handleOrderAction(order.order_number, '2')">
								{{ order.isProcessing ? '处理中...' : '立即接单' }}
						</button>
						<button class="action-button" 
								v-if="order.status === '2' && order.order_type != '3'"
								:disabled="order.isProcessing"
								@click="handleOrderAction(order.order_number, '3')">
								{{ order.isProcessing ? '处理中...' : '准备就绪' }}
						</button>
						<button class="action-button" 
								v-if="order.status === '2' && order.order_type == '3'"
								:disabled="order.isProcessing"
								@click="handleOrderAction(order.order_number, '4')">
								{{ order.isProcessing ? '处理中...' : '开始配送' }}
						</button>
					</view>
				</view>
			</template>
			<view v-else class="empty-state">
				<text class="empty-text">暂无订单</text>
			</view>
		</scroll-view>
	</view>
</template>

<style scoped>
.page-container {
	min-height: 100vh;
	background: #f5f7fa;
	padding-bottom: env(safe-area-inset-bottom);
}

/* 店铺头部样式 */
.shop-header {
	background: #fff;
	padding: 30rpx;
	position: relative;
	box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.05);
}

.shop-info {
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.dropdown {
	display: flex;
	align-items: center;
	padding: 12rpx 24rpx;
	background: #f8f9fa;
	border-radius: 12rpx;
}

.shop-logo {
	width: 60rpx;
	height: 60rpx;
	border-radius: 50%;
	margin-right: 16rpx;
}

.shop-name {
	font-size: 32rpx;
	font-weight: 500;
	color: #333;
	margin-right: 12rpx;
}

.dropdown-icon {
	font-size: 24rpx;
	color: #999;
	transition: transform 0.3s;
}

.dropdown-icon.active {
	transform: rotate(180deg);
}

.business-status {
	display: flex;
	align-items: center;
	gap: 16rpx;
}

.business-status text {
	font-size: 28rpx;
	color: #999;
}

.business-status text.open {
	color: #07c160;
}

/* 营业额卡片样式 */
.revenue-cards {
	display: flex;
	padding: 20rpx;
	gap: 20rpx;
}

.revenue-card {
	flex: 1;
	background: linear-gradient(135deg, #1890ff, #40a9ff);
	padding: 30rpx 20rpx;
	border-radius: 16rpx;
	display: flex;
	flex-direction: column;
	align-items: center;
	color: #fff;
}

.revenue-value {
	font-size: 36rpx;
	font-weight: bold;
	margin-bottom: 8rpx;
}

.revenue-label {
	font-size: 24rpx;
	opacity: 0.9;
}

/* 快捷功能按钮 */
.quick-actions {
	display: flex;
	padding: 30rpx;
	gap: 30rpx;
}

.action-btn {
	flex: 1;
	background: #fff;
	padding: 24rpx;
	border-radius: 16rpx;
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 12rpx;
	box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.05);
}

.action-icon {
	font-size: 40rpx;
}

.action-btn text:last-child {
	font-size: 28rpx;
	color: #666;
}

/* 订单状态切换 */
.order-status-tabs {
	display: flex;
	background: #fff;
	padding: 20rpx;
	gap: 20rpx;
	margin: 20rpx 0;
	overflow-x: auto;
	white-space: nowrap;
}

.status-tab {
	padding: 16rpx 32rpx;
	font-size: 28rpx;
	color: #666;
	border-radius: 8rpx;
	transition: all 0.3s;
}

.status-tab.active {
	background: #1890ff;
	color: #fff;
}

/* 订单列表样式 */
.order-list {
	height: calc(100vh - 450rpx);
	padding: 20rpx;
	box-sizing: border-box;
}

.order-card {
	background: #fff;
	border-radius: 16rpx;
	padding: 30rpx;
	margin-bottom: 20rpx;
	box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.05);
	width: auto;
	box-sizing: border-box;
}

.order-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 20rpx;
	padding-bottom: 20rpx;
	border-bottom: 2rpx solid #f5f5f5;
}

.order-number {
	font-size: 28rpx;
	color: #666;
}

.order-type {
	font-size: 26rpx;
	color: #1890ff;
	background: rgba(24, 144, 255, 0.1);
	padding: 6rpx 16rpx;
	border-radius: 6rpx;
}

.order-info {
	font-size: 28rpx;
}

.time-info, .address-info {
	margin-bottom: 16rpx;
}

.info-label {
	color: #999;
}

.info-value {
	color: #333;
}

.goods-list {
	background: #f8f9fa;
	padding: 20rpx;
	border-radius: 8rpx;
	margin: 16rpx 0;
	width: 100%;
	box-sizing: border-box;
}

.goods-item {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 12rpx;
	flex-wrap: nowrap;
}

.goods-name {
	flex: 1;
	color: #333;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
	margin-right: 20rpx;
}

.goods-quantity {
	color: #666;
	margin: 0 20rpx;
}

.goods-price {
	color: #ff4d4f;
}

.order-total {
	text-align: right;
	margin-top: 16rpx;
}

.total-amount {
	font-size: 32rpx;
	font-weight: bold;
	color: #ff4d4f;
}

.order-actions {
	margin-top: 20rpx;
	display: flex;
	justify-content: flex-end;
}

.action-button {
	background: #07c160;
	color: #fff;
	font-size: 28rpx;
	padding: 16rpx 32rpx;
	border-radius: 8rpx;
	border: none;
	min-width: 160rpx;
	transition: all 0.3s ease;
}

.action-button:disabled {
	background: #a8e6c1;
	cursor: not-allowed;
	opacity: 0.7;
}

.action-button:active:not(:disabled) {
	opacity: 0.8;
}

/* 下拉菜单样式 */
.dropdown-menu {
	position: absolute;
	top: 100%;
	left: 30rpx;
	right: 30rpx;
	background: #fff;
	border-radius: 16rpx;
	box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.1);
	z-index: 100;
	max-height: 400rpx;
	overflow-y: auto;
}

.dropdown-item {
	display: flex;
	align-items: center;
	padding: 24rpx;
	border-bottom: 2rpx solid #f5f5f5;
}

.dropdown-item:last-child {
	border-bottom: none;
}

.dropdown-item:active {
	background: #f8f9fa;
}

/* 添加空状态样式 */
.empty-state {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 60rpx 0;
}

.empty-text {
	font-size: 28rpx;
	color: #999;
}

/* 添加加载状态样式 */
.loading {
	opacity: 0.6;
	pointer-events: none;
}
</style>

<script>
	export default {
		data() {
			return {
				navigationBarTitle: "商家管理",
				shops: [],
				selectedShop: {},
				showDropdown: false,
				isBusinessOpen: true,
				currentStatus: '1',
				orders: [],
				processingOrders: new Set(),
				isLoading: false,
			};
		},
		computed: {
			filteredOrders() {
				return this.orders.filter(order => order.status === this.currentStatus);
			},
			hasOrders() {
				return this.filteredOrders.length > 0;
			}
		},
		watch: {
			selectedShop: {
				handler(newShop) {
					if (newShop.id) {
						this.fetchOrders();
					}
				},
				immediate: true
			}
		},
		methods: {
			getOrderTypeText(type) {
				const orderTypes = {
					'1': '到店吃',
					'2': '到店取',
					'3': '外卖'
				};
				return orderTypes[type] || '未知类型';
			},
			toggleDropdown() {
				this.showDropdown = !this.showDropdown;
			},
			selectShop(shop) {
				this.selectedShop = shop;
				this.showDropdown = false;
				this.fetchOrders();
			},
			toggleBusinessStatus(e) {
				this.isBusinessOpen = e.detail.value;
				// updateStatusByShopId
				this.$util.request("main.Shop.updateStatusByShopId",{shop_id:this.selectedShop['id']}).then(res => {
					if (res.code === 1) {
						uni.showToast({
							title: '状态已更新',
							duration: 2000,
						})
					}
				})
			},
			changeStatus(status) {
				this.currentStatus = status;
				this.fetchOrders();
			},
			async fetchShops() {
				try {
					const res = await this.$util.request("main.Shop.getShopByUserId");
					if (res.code === 1) {
						this.shops = res.data;
						this.selectedShop = this.shops[0];
						this.isBusinessOpen = this.selectedShop['status'] === '1';
						await this.fetchOrders();
					}
				} catch (error) {
					console.error('获取店铺列表失败:', error);
					uni.showToast({
						title: '获取店铺失败',
						icon: 'error',
						duration: 2000
					});
				}
			},
			async fetchOrders() {
				try {
					const params = {
						shop_id: this.selectedShop.id,
						type: 'all',
						page: 1,
						limit: 10
					};

					const res = await this.$util.request("main.Shop.getOrderListByShopIdPage", params);
					if (res.code === 1) {
						this.orders = res.data.map(order => ({
							...order,
							isProcessing: false
						}));
					}
				} catch (error) {
					console.error('获取订单列表失败:', error);
					uni.showToast({
						title: '获取订单失败',
						icon: 'error',
						duration: 2000
					});
				}
			},
			async handleOrderAction(orderId, type) {
				if (this.processingOrders.has(orderId)) {
					return;
				}
				
				this.processingOrders.add(orderId);
				const targetOrder = this.orders.find(o => o.order_number === orderId);
				if (targetOrder) {
					this.$set(targetOrder, 'isProcessing', true);
				}
				
				try {
					const params = {
						order_number: orderId,
						status: type
					};
					
					const res = await this.$util.request("main.Shop.changeStatus", params);
					
					if (res.code === 1) {
						uni.showToast({
							title: '操作成功',
							icon: 'success',
							duration: 2000
						});
						await this.fetchOrders();
					} else {
						uni.showToast({
							title: '操作失败',
							icon: 'error',
							duration: 2000
						});
					}
				} catch (error) {
					console.error('操作失败:', error);
					uni.showToast({
						title: '操作失败',
						icon: 'error',
						duration: 2000
					});
				} finally {
					this.processingOrders.delete(orderId);
					const order = this.orders.find(o => o.order_number === orderId);
					if (order) {
						this.$set(order, 'isProcessing', false);
					}
				}
			},
			navigateTo(menu) {
				// 这里可以添加导航到不同菜单的逻辑
				var shopid = this.selectedShop['id']
				switch (menu){
					case 'menu1':uni.navigateTo({url:'/pagesDemand/shopDetails/goodsDetails?id='+shopid})
						break;
					case 'menu2':uni.navigateTo({url:'/pagesDemand/shopDetails/shopDetails?id='+shopid})
						break;
					case 'menu3':uni.navigateTo({url:'/pagesDemand/shopDetails/completeOrder'})
						break;
					default:
						break;
				}
			},
			// 新增获取状态文字方法
			getStatusText(status) {
				const statusMap = {
					'1': '已支付',
					'2': '已接单',
					'3': '已准备',
					'4': '配送中',
					'5': '已完成'
				};
				return statusMap[status] || status;
			}
		},
		onShow() {
			this.fetchShops();
		}
	};
</script>