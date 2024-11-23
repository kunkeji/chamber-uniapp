<template>
	<view class="page-container">
		<title-bar title="电费充值记录"></title-bar>
		
		<view class="container">
			<scroll-view scroll-y @scrolltolower="loadMore" :style="{height: windowHeight + 'px'}" class="scroll-container">
				<!-- 月份分组 -->
				<block v-for="(monthGroup, index) in groupedData" :key="index">
					<!-- 月份标题 -->
					<view class="month-header">
						<view class="month-info">
							<text class="month-text">{{ monthGroup.month }}</text>
							<text class="month-amount">总计：¥{{ monthGroup.totalAmount }}</text>
						</view>
					</view>
					
					<!-- 订单列表 -->
					<view class="order-list">
						<view class="order-item" v-for="item in monthGroup.items" :key="item.id">
							<view class="order-header">
								<text class="order-number">订单号：{{ item.order_number }}</text>
								<text class="order-status" :style="{color: '#07c160'}">充值成功</text>
							</view>
							
							<view class="order-content">
								<view class="meter-info">
									<view class="info-row">
										<text class="label">电表号码：</text>
										<text class="value">{{ item.electricity }}</text>
									</view>
									<view class="info-row">
										<text class="label">电表位置：</text>
										<text class="value">{{ item.meter_place }}</text>
									</view>
									<view class="info-row">
										<text class="label">充值时间：</text>
										<text class="value">{{ formatTime(item.createtime) }}</text>
									</view>
								</view>
								<view class="amount-box">
									<text class="amount">¥{{ item.total_amount }}</text>
								</view>
							</view>
						</view>
					</view>
				</block>
				
				<!-- 加载状态 -->
				<view v-if="loading" class="loading-box">
					<view class="loading-spinner"></view>
					<text class="loading-text">加载中...</text>
				</view>
				
				<!-- 无数据提示 -->
				<view v-if="!loading && groupedData.length === 0" class="empty-box">
					<image src="/static/empty.png" mode="aspectFit" class="empty-image"></image>
					<text class="empty-text">暂无充值记录~</text>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<style>
.page-container {
	min-height: 100vh;
	background-color: #f5f7fa;
}

.scroll-container {
	padding: 16rpx;
	box-sizing: border-box;
	width: 100%;
}

/* 月份头部样式 */
.month-header {
	margin: 16rpx 0;
	padding: 0 16rpx;
}

.month-info {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 0 4rpx;
}

.month-text {
	font-size: 30rpx;
	font-weight: bold;
	color: #333;
}

.month-amount {
	font-size: 26rpx;
	color: #666;
}

/* 订单列表样式 */
.order-list {
	margin-bottom: 24rpx;
	width: 100%;
}

.order-item {
	background: #fff;
	border-radius: 16rpx;
	padding: 20rpx;
	margin-bottom: 16rpx;
	box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.05);
	box-sizing: border-box;
}

.order-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding-bottom: 16rpx;
	border-bottom: 2rpx solid #f5f5f5;
}

.order-number {
	font-size: 26rpx;
	color: #666;
	flex: 1;
	min-width: 0;
	margin-right: 16rpx;
}

.order-status {
	font-size: 26rpx;
	font-weight: 500;
	flex-shrink: 0;
}

.order-content {
	padding-top: 20rpx;
	display: flex;
	justify-content: space-between;
	align-items: flex-start;
}

.meter-info {
	flex: 1;
	min-width: 0;
}

.info-row {
	display: flex;
	margin-bottom: 12rpx;
	font-size: 28rpx;
	line-height: 1.5;
	flex-wrap: nowrap;
}

.info-row:last-child {
	margin-bottom: 0;
}

.label {
	color: #666;
	min-width: 140rpx;
	flex-shrink: 0;
}

.value {
	color: #333;
	flex: 1;
	min-width: 0;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}

.amount-box {
	flex-shrink: 0;
	padding-left: 20rpx;
	display: flex;
	align-items: center;
}

.amount {
	font-size: 32rpx;
	font-weight: bold;
	color: #07c160;
}

/* 加载状态样式 */
.loading-box {
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 30rpx 0;
}

.loading-spinner {
	width: 40rpx;
	height: 40rpx;
	border: 4rpx solid #f3f3f3;
	border-top: 4rpx solid #07c160;
	border-radius: 50%;
	animation: spin 1s linear infinite;
}

.loading-text {
	font-size: 28rpx;
	color: #999;
	margin-top: 16rpx;
}

/* 空状态样式 */
.empty-box {
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 100rpx 0;
}

.empty-image {
	width: 240rpx;
	height: 240rpx;
	margin-bottom: 20rpx;
}

.empty-text {
	font-size: 28rpx;
	color: #999;
}

@keyframes spin {
	0% { transform: rotate(0deg); }
	100% { transform: rotate(360deg); }
}
</style>

<script>
	export default {
		data() {
			return {
				electricity: null,
				offset: 0,
				pagesize: 10,
				loading: false,
				data: [],
				windowHeight: 0
			};
		},
		computed: {
			// 按月份分组数据
			groupedData() {
				const grouped = {};
				this.data.forEach(item => {
					const month = this.formatMonth(item.createtime);
					if (!grouped[month]) {
						grouped[month] = {
							month: month,
							totalAmount: 0,
							items: []
						};
					}
					grouped[month].items.push(item);
					grouped[month].totalAmount += parseFloat(item.total_amount);
					grouped[month].totalAmount = parseFloat(grouped[month].totalAmount.toFixed(2));
				});
				return Object.values(grouped);
			}
		},
		methods: {
			// 格式化时间戳为日期格式
			formatTime(timestamp) {
			    const date = new Date(timestamp * 1000);
			    const year = date.getFullYear();
			    const month = (date.getMonth() + 1).toString().padStart(2, '0');
			    const day = date.getDate().toString().padStart(2, '0');
			    const hours = date.getHours().toString().padStart(2, '0');
			    const minutes = date.getMinutes().toString().padStart(2, '0');
			    const seconds = date.getSeconds().toString().padStart(2, '0');
			
			    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
			  },
			// 格式化时间戳为月份格式
			formatMonth(timestamp) {
				const date = new Date(timestamp * 1000);
				return `${date.getFullYear()}-${date.getMonth()+1}`;
			},
			// 加载更多数据
			loadMore() {
				if (this.loading) return;
				this.loading = true;
				this.loadBindingList();
			},
			// 加载绑定列表
			async loadBindingList() {
				try {
					const res = await this.$util.request("mall.get_order", {
						electricity: this.electricity?this.electricity:'',
						offset: this.offset,
						pagesize: this.pagesize
					});
					if (res.code === 1) {
						this.data = [...this.data, ...res.data];
						this.offset += this.pagesize;
					}
				} catch (error) {
					console.error('请求失败', error);
				} finally {
					this.loading = false;
				}
			}
		},
		onLoad(options) {
			if (options.electricity) {
				this.electricity = options.electricity;
			}
			// 初始化加载数据
			this.loadBindingList();
			// 获取屏幕高度以设置滚动视图的高度
			uni.getSystemInfo({
				success: (res) => {
					this.windowHeight = res.windowHeight;
				}
			});
		}
	};
</script>