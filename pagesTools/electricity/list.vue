<template>
	<view class="page-container">
		<title-bar title="电费充值"></title-bar>

		<view class="container">
			<block v-if="list.length > 0">
				<view class="list-item" v-for="(item, index) in list" :key="index" @click="goToDetail(item)">
					<view class="item-content">
						<view class="item-icon">
							<image src="/static/mine/member_7.png" mode="aspectFit"></image>
						</view>
						<view class="info-content">
							<view class="meter-number">
								<text class="label">电表号</text>
								<text class="number">{{ item.electricity }}</text>
							</view>
							<view class="location">{{ item.notes }}</view>
							<view class="hint">
								<text class="hint-icon">💡</text>
								轻触查询余额
							</view>
						</view>
						<view class="arrow-right">
							<text class="arrow">›</text>
						</view>
					</view>
				</view>
			</block>

			<!-- 添加新电表 -->
			<view class="add-meter" @click="navigateToAdd()">
				<view class="add-content">
					<view class="item-icon add-icon">
						<image src="/static/mine/member_7.png" mode="aspectFit"></image>
					</view>
					<view class="add-text">添加新电表</view>
				</view>
				<view class="add-hint">
					<text>去添加</text>
					<text class="arrow">›</text>
				</view>
			</view>
		</view>

		<!-- 底部按钮改为右下角浮动按钮 -->
		<view class="footer">
			<button class="record-btn" @click="getorder()">
				<text class="btn-icon">📋</text>
				<text class="btn-text">缴费记录</text>
			</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				list: []
			};
		},
		onShow() {
			this.fetchList();
		},
		methods: {
			getorder() {
				uni.navigateTo({
					url:"/pagesTools/electricity/orderlist"
				})
			},
			fetchList() {
				var that = this
				that.$util.request("mall.get_binding").then(res => {
					if (res.code === 1) {
						this.list = res.data;
					} else {
						uni.showToast({
							title: res.msg,
							icon: 'none'
						});
					}
				}).catch(err => {
					console.error('Error fetching data:', err);
				});
			},
			goToDetail(item) {
				// 跳转到充值详情页
				uni.navigateTo({
					url: `/pagesTools/electricity/electricity?electricity=${item.electricity}`
				});
			},
			navigateToAdd() {
				// 跳转到添加页面
				uni.navigateTo({
					url: '/pagesTools/electricity/add'
				});
			}
		}
	};
</script>

<style>
	.page-container {
		min-height: 100vh;
		background-color: #f5f7fa;
		padding-bottom: 40rpx;
	}

	.container {
		padding: 30rpx;
	}

	/* 列表项样式 */
	.list-item {
		background: #ffffff;
		border-radius: 16rpx;
		margin-bottom: 24rpx;
		box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.05);
		transition: all 0.3s ease;
	}

	.list-item:active {
		transform: scale(0.98);
		opacity: 0.9;
	}

	.item-content {
		padding: 24rpx;
		display: flex;
		align-items: center;
	}

	.item-icon {
		width: 88rpx;
		height: 88rpx;
		background: #e6f7ff;
		border-radius: 44rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
	}

	.item-icon image {
		width: 56rpx;
		height: 56rpx;
	}

	.info-content {
		flex: 1;
		margin-left: 24rpx;
		min-width: 0;
	}

	.meter-number {
		display: flex;
		align-items: center;
		margin-bottom: 8rpx;
	}

	.label {
		font-size: 26rpx;
		color: #666;
		margin-right: 12rpx;
	}

	.number {
		font-size: 30rpx;
		color: #333;
		font-weight: 500;
	}

	.location {
		font-size: 26rpx;
		color: #666;
		margin-bottom: 8rpx;
	}

	.hint {
		font-size: 24rpx;
		color: #07c160;
		display: flex;
		align-items: center;
	}

	.hint-icon {
		margin-right: 6rpx;
	}

	.arrow-right {
		width: 60rpx;
		display: flex;
		justify-content: flex-end;
		align-items: center;
	}

	.arrow {
		font-size: 40rpx;
		color: #999;
		font-weight: 300;
	}

	/* 添加新电表样式 */
	.add-meter {
		background: #ffffff;
		border-radius: 16rpx;
		padding: 24rpx;
		margin-top: 30rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.05);
	}

	.add-content {
		display: flex;
		align-items: center;
	}

	.add-icon {
		background: #f0f0f0;
		opacity: 0.8;
	}

	.add-text {
		font-size: 30rpx;
		color: #666;
		margin-left: 24rpx;
	}

	.add-hint {
		display: flex;
		align-items: center;
		font-size: 28rpx;
		color: #999;
	}

	.add-hint .arrow {
		margin-left: 8rpx;
	}

	/* 修改底部按钮样式 */
	.footer {
		position: fixed;
		right: 30rpx;
		bottom: 60rpx;
		z-index: 99;
	}

	.record-btn {
		height: 72rpx;
		padding: 0 32rpx;
		background: rgba(255, 255, 255, 0.95);
		border-radius: 36rpx;
		color: #666;
		font-size: 26rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		border: 2rpx solid #eee;
		box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
	}

	.btn-icon {
		font-size: 28rpx;
		margin-right: 6rpx;
	}

	.btn-text {
		color: #666;
	}

	.record-btn:active {
		transform: scale(0.95);
		opacity: 0.8;
	}
</style>