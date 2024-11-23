<template>
	<view class="page">
		<title-bar title="电费充值"></title-bar>
 
		<view class="container">
			<!-- 输入框部分 -->
			<view class="input-section">
				<view class="input-card">
					<view class="input-group">
						<text class="label">电表号码</text>
						<view class="input-wrapper">
							<input 
								type="number" 
								v-model="electricity" 
								placeholder="请输入12位电表号" 
								@input="checkLength"
								class="custom-input"
							/>
							<view class="scan-btn" @click="scanCode">
								<image src="/static/scan.png" mode="aspectFit"></image>
							</view>
						</view>
					</view>
					
					<view class="input-group">
						<text class="label">备注信息</text>
						<input 
							type="text" 
							v-model="notes" 
							placeholder="填写备注信息"
							class="custom-input"
						/>
					</view>
				</view>
			</view>

			<!-- 电表信息卡片 -->
			<view class="info-card">
				<view class="card-title">电表详情</view>
				<view class="info-item">
					<text class="info-label">当前余额</text>
					<text class="info-value highlight">¥{{ meterInfo.balance||'0.00' }}</text>
				</view>
				<view class="info-item">
					<text class="info-label">电表信息</text>
					<text class="info-value">{{ meterInfo.meter_num||'等待查询' }}</text>
				</view>
				<view class="info-item">
					<text class="info-label">所属公司</text>
					<text class="info-value">{{ meterInfo.meter_company||'等待查询' }}</text>
				</view>
				<view class="info-item">
					<text class="info-label">电表位置</text>
					<text class="info-value">{{ meterInfo.meter_place||'等待查询' }}</text>
				</view>
			</view>

			<!-- 提交按钮 -->
			<view class="submit-section">
				<button 
					class="submit-btn" 
					:class="{'submit-btn-active': meterInfo}"
					v-if="meterInfo" 
					@click="submit"
				>确定绑定</button>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				electricity: '',
				notes:'',
				meterInfo: null
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
				that.$util.request("mall.balance", {
					electricity: this.electricity
				}).then(res => {
					if (res.code === 1) {
						res.data.balance  =  (res.data.balance/100).toFixed(2)
						this.meterInfo = res.data;
					} else {
						uni.showToast({
							title: res.msg,
							icon: 'none'
						});
					}
				}).catch(err => {
					console.error('Error querying balance:', err);
				});
			},
			submit() {
				var that = this
				if (!this.meterInfo) {
					uni.showToast({
						title: '请先查询电表信息',
						icon: 'none'
					});
					return;
				}
				if(!that.notes){
					uni.showToast({
						title: '请填写备注',
						icon: 'none'
					});
					return;
				}
				// 这里可以添加提交绑定的接口调用
				that.$util.request('mall.binding',{
					id:that.meterInfo.id,
					meter_num:that.meterInfo.meter_num,
					notes:that.notes
				}).then(res=>{
					uni.showToast({
						icon:"none",
						title:res.msg,
						success() {
							setTimeout(() => {
								uni.navigateBack();
							}, 2000);
							
						}
					})
					
				})
				
				
			}
		}
	};
</script>

<style>
	.page {
		min-height: 100vh;
		background-color: #f5f6fa;
	}

	.container {
		padding: 30rpx;
	}

	/* 输入框卡片样式 */
	.input-section {
		margin-bottom: 30rpx;
	}

	.input-card {
		background: #ffffff;
		border-radius: 16rpx;
		padding: 30rpx;
		box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.05);
	}

	.input-group {
		margin-bottom: 30rpx;
	}

	.input-group:last-child {
		margin-bottom: 0;
	}

	.label {
		font-size: 28rpx;
		color: #333;
		margin-bottom: 16rpx;
		display: block;
	}

	.input-wrapper {
		display: flex;
		align-items: center;
		border-bottom: 2rpx solid #eee;
	}

	.custom-input {
		flex: 1;
		height: 80rpx;
		font-size: 30rpx;
		color: #333;
	}

	.scan-btn {
		width: 60rpx;
		height: 60rpx;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.scan-btn image {
		width: 40rpx;
		height: 40rpx;
	}

	/* 信息卡片样式 */
	.info-card {
		background: #ffffff;
		border-radius: 16rpx;
		padding: 30rpx;
		margin-bottom: 60rpx;
		box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.05);
	}

	.card-title {
		font-size: 32rpx;
		font-weight: 500;
		color: #333;
		margin-bottom: 30rpx;
		padding-bottom: 20rpx;
		border-bottom: 2rpx solid #f5f5f5;
	}

	.info-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 20rpx;
	}

	.info-label {
		font-size: 28rpx;
		color: #666;
	}

	.info-value {
		font-size: 28rpx;
		color: #333;
	}

	.highlight {
		color: #007AFF;
		font-weight: 500;
		font-size: 32rpx;
	}

	/* 提交按钮样式 */
	.submit-section {
		padding: 40rpx 0;
	}

	.submit-btn {
		width: 90%;
		height: 88rpx;
		background: linear-gradient(to right, #007AFF, #0056b3);
		color: white;
		font-size: 32rpx;
		border-radius: 44rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		margin: 0 auto;
		transition: opacity 0.3s;
	}

	.submit-btn-active:active {
		opacity: 0.8;
	}
</style>