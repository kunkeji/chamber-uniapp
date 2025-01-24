<template>
	<view class="page-container">
		<title-bar title="管理员充值"></title-bar>
		
		<view class="main-content">
			<!-- 输入区域 -->
			<view class="input-section">
				<view class="input-card">
					<view class="input-wrapper">
						<text class="input-label">电表号码</text>
						<view class="input-box flex-row">
							<input type="number" 
								   v-model="electricity" 
								   placeholder="请输入12位电表号" 
								   @input="checkLength" />
							<view class="scan-btn" @click="scanCode">
								<image src="/static/scan.png" mode="aspectFit"></image>
							</view>
						</view>
					</view>
				</view>

				<view class="input-card">
					<view class="input-wrapper">
						<text class="input-label">充值/扣款金额</text>
						<view class="input-box">
							<text class="currency-symbol">￥</text>
							<input type="digit" 
								   v-model="amount" 
								   placeholder="请输入金额" />
						</view>
					</view>
				</view>
			</view>

			<!-- 电表信息卡片 -->
			<view class="info-card" :class="{'info-card-active': meterInfo}">
				<view class="info-header">
					<text class="info-title">电表信息</text>
					<text class="balance-text">当前余额：{{ meterInfo.balance||'0.00' }}元</text>
				</view>
				<view class="info-content">
					<view class="info-item">
						<text class="info-label">电表号码：</text>
						<text class="info-value">{{ meterInfo.meter_num||'等待查询' }}</text>
					</view>
					<view class="info-item">
						<text class="info-label">负责人名：</text>
						<text class="info-value">{{ meterInfo.room_person||'等待查询' }}</text>
					</view>
					<view class="info-item">
						<text class="info-label">联系电话：</text>
						<text class="info-value">{{ meterInfo.count_phone||'等待查询' }}</text>
					</view>
					<view class="info-item">
						<text class="info-label">所属公司：</text>
						<text class="info-value">{{ meterInfo.meter_company||'等待查询' }}</text>
					</view>
					<view class="info-item">
						<text class="info-label">电表位置：</text>
						<text class="info-value">{{ meterInfo.meter_place||'等待查询' }}</text>
					</view>
				</view>
			</view>

			<!-- 操作按钮区 -->
			<view class="operation-section" v-if="meterInfo">
				<view class="main-actions">
					<button class="action-btn charge" 
							:class="{ disabled: submitting }"
							@click="!submitting && handleOperation('charge')">
						<text class="btn-icon">💰</text>
						{{ submitting ? '处理中...' : '立即充值' }}
					</button>
					<button class="action-btn deduct" 
							:class="{ disabled: submitting }"
							@click="!submitting && handleOperation('deduct')">
						<text class="btn-icon">➖</text>
						{{ submitting ? '处理中...' : '余额扣除' }}
					</button>
				</view>
				
				<view class="sub-actions">
					<button class="action-btn warning" 
							:class="{ disabled: submitting }"
							@click="!submitting && handleOperation('close')">
						<text class="btn-icon">🔒</text>
						{{ submitting ? '处理中...' : '拉闸' }}
					</button>
					<button class="action-btn success" 
							:class="{ disabled: submitting }"
							@click="!submitting && handleOperation('open')">
						<text class="btn-icon">🔓</text>
						{{ submitting ? '处理中...' : '合闸' }}
					</button>
					<button class="action-btn danger" 
							:class="{ disabled: submitting }"
							@click="!submitting && handleOperation('clear')">
						<text class="btn-icon">🔄</text>
						{{ submitting ? '处理中...' : '清零' }}
					</button>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				electricity: '',
				amount: '',
				meterInfo: null,
				submitting: false,
				querying: false,
			};
		},
		methods: {
			scanCode() {
				uni.scanCode({
					success: (res) => {
						this.electricity = res.result;
						this.checkLength();
					},
					fail: (err) => {
						console.error('Scan failed:', err);
					}
				});
			},
			checkLength() {
				if (this.electricity.length === 12) {
					this.queryBalance();
				}
			},
			queryBalance() {
				var that = this
				that.querying = true;
				
				uni.showLoading({
					title: '正在查询...',
					mask: true
				});
				
				that.$util.request("mall.balance",{
					electricity: this.electricity
				}).then(res => {
					if (res.code === 1) {
						res.data.balance = (res.data.balance / 100).toFixed(2)
						this.meterInfo = res.data;
					} else {
						uni.showToast({
							title: res.msg,
							icon: 'none'
						});
					}
				}).catch(err => {
					uni.showToast({
						title: '查询失败，请重试',
						icon: 'none'
					});
				}).finally(() => {
					that.querying = false;
					uni.hideLoading();
				});
			},
			handleOperation(type) {
				if (!this.meterInfo) {
					uni.showToast({
						title: '请先查询电表信息',
						icon: 'none'
					});
					return;
				}
				const operations = {
					charge: { title: '充值', amount: true, api: 'mall.direct_charge' },
					deduct: { title: '扣款', amount: true, api: 'mall.deduct' },
					close: { title: '拉闸', api: 'mall.close' },
					open: { title: '合闸', api: 'mall.open' },
					clear: { title: '清零', api: 'mall.clear' }
				};

				const operation = operations[type];
				
				if (operation.amount && !this.amount) {
					uni.showToast({
						title: '请输入金额',
						icon: 'none'
					});
					return;
				}

				let confirmContent = `确认要对电表${this.electricity}进行${operation.title}操作吗？\n`;
				if (operation.amount) {
					confirmContent += `金额：${this.amount}元\n`;
				}
				confirmContent += `用户：${this.meterInfo.room_person}\n位置：${this.meterInfo.meter_place}`;

				uni.showModal({
					title: '操作确认',
					content: confirmContent,
					success: (res) => {
						if (res.confirm && !this.submitting) {
							this.submitOperation(operation.api, type);
						}
					}
				});
			},
			submitOperation(api, type) {
				var that = this
				that.submitting = true;
				
				uni.showLoading({
					title: '处理中...',
					mask: true
				});

				const params = {
					electricity: that.electricity
				};
				
				if (['charge', 'deduct'].includes(type)) {
					params.amount = that.amount;
				}
				
				that.$util.request(api, params).then(res => {
					uni.showToast({
						icon: "none",
						title: res.msg
					});
					if (res.code === 1) {
						setTimeout(() => {
							that.amount = '';
							that.queryBalance();
						}, 1500);
					}
				}).finally(() => {
					that.submitting = false;
					uni.hideLoading();
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

.main-content {
	padding: 30rpx;
}

/* 输入区域样式 */
.input-section {
	margin-bottom: 30rpx;
}

.input-card {
	background: #ffffff;
	border-radius: 16rpx;
	padding: 30rpx;
	margin-bottom: 20rpx;
	box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.05);
}

.input-wrapper {
	display: flex;
	flex-direction: column;
}

.input-label {
	font-size: 28rpx;
	color: #666;
	margin-bottom: 16rpx;
}

.input-box {
	display: flex;
	align-items: center;
	border-bottom: 2rpx solid #eee;
	padding: 16rpx 0;
}

.currency-symbol {
	font-size: 36rpx;
	color: #333;
	margin-right: 16rpx;
}

.scan-btn {
	width: 48rpx;
	height: 48rpx;
	padding: 8rpx;
}

.scan-btn image {
	width: 100%;
	height: 100%;
}

/* 信息卡片样式 */
.info-card {
	background: #ffffff;
	border-radius: 16rpx;
	padding: 30rpx;
	margin-bottom: 30rpx;
	box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.05);
	transform: translateY(0);
	transition: all 0.3s ease;
}

.info-card-active {
	transform: translateY(0);
	box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.1);
}

.info-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 30rpx;
	padding-bottom: 20rpx;
	border-bottom: 2rpx solid #f5f5f5;
}

.info-title {
	font-size: 32rpx;
	font-weight: bold;
	color: #333;
}

.balance-text {
	font-size: 32rpx;
	color: #07c160;
	font-weight: bold;
}

.info-item {
	display: flex;
	margin-bottom: 20rpx;
	font-size: 28rpx;
	line-height: 1.5;
}

.info-label {
	color: #666;
	width: 160rpx;
}

.info-value {
	color: #333;
	flex: 1;
}

/* 操作按钮样式 */
.operation-section {
	padding: 20rpx 0;
}

.main-actions {
	display: flex;
	gap: 20rpx;
	margin-bottom: 20rpx;
}

.sub-actions {
	display: flex;
	gap: 20rpx;
}

.action-btn {
	flex: 1;
	height: 88rpx;
	border: none;
	border-radius: 12rpx;
	font-size: 28rpx;
	font-weight: 500;
	color: #fff;
	display: flex;
	align-items: center;
	justify-content: center;
	transition: all 0.2s ease;
}

.btn-icon {
	font-size: 32rpx;
	margin-right: 8rpx;
}

.charge {
	background: linear-gradient(135deg, #07c160, #0ab956);
}

.deduct {
	background: linear-gradient(135deg, #ff4d4f, #ff7875);
}

.warning {
	background: linear-gradient(135deg, #faad14, #ffc53d);
}

.success {
	background: linear-gradient(135deg, #1890ff, #40a9ff);
}

.danger {
	background: linear-gradient(135deg, #ff4d4f, #ff7875);
}

.action-btn:active {
	transform: scale(0.98);
	opacity: 0.9;
}

.disabled {
	opacity: 0.6;
	pointer-events: none;
}

.flex-row{
	justify-content: space-between;
}
</style>


