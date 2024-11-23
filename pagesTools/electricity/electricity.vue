<template>
	<view class="page-container">
		<title-bar title="电费充值"></title-bar>
		<view class="main-content">
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
						<text class="info-label">所属公司：</text>
						<text class="info-value">{{ meterInfo.meter_company||'等待查询' }}</text>
					</view>
					<view class="info-item">
						<text class="info-label">电表位置：</text>
						<text class="info-value">{{ meterInfo.meter_place||'等待查询' }}</text>
					</view>
				</view>
			</view>

			<!-- 充值金额输入 -->
			<view class="input-card">
				<view class="input-wrapper">
					<text class="input-label">充值金额</text>
					<view class="input-box">
						<text class="currency-symbol">￥</text>
						<input type="digit" 
							v-model="amount" 
							placeholder="请输入充值金额" />
					</view>
				</view>
			</view>

			<!-- 充值按钮 -->
			<view class="operation-section">
				<button class="action-btn charge" @click="startScan">
					<text class="btn-icon">💰</text>
					立即充值
				</button>
			</view>

			<!-- 底部操作栏 -->
			<view class="footer-actions">
				<view class="footer-btn" @click="getorder">
					<text class="btn-icon">📋</text>
					缴费记录
				</view>
				<view class="footer-divider">|</view>
				<view class="footer-btn" @click="unbinding">
					<text class="btn-icon">🔓</text>
					解除绑定
				</view>
			</view>
		</view>
	</view>
</template>

<style>
.page-container {
	min-height: 100vh;
	background-color: #f5f7fa;
	padding-bottom: 40rpx;
}

.main-content {
	padding: 30rpx;
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

/* 输入卡片样式 */
.input-card {
	background: #ffffff;
	border-radius: 16rpx;
	padding: 30rpx;
	margin-bottom: 30rpx;
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

/* 充值按钮样式 */
.operation-section {
	padding: 20rpx 0;
}

.action-btn {
	width: 100%;
	height: 88rpx;
	border: none;
	border-radius: 12rpx;
	font-size: 32rpx;
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

.action-btn:active {
	transform: scale(0.98);
	opacity: 0.9;
}

/* 底部操作栏样式 */
.footer-actions {
	width: 70%;
    position: fixed;
    bottom: 100rpx;
    left: 0;
    right: 0;
    margin: auto;
    display: flex;
    align-items: center;
    background: #ffffff;
    border-radius: 40rpx;
    padding: 16rpx 40rpx;
    box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.1);
}

.footer-btn {
	display: flex;
	align-items: center;
	font-size: 28rpx;
	color: #1890ff;
	padding: 0 20rpx;
}

.footer-divider {
	color: #ddd;
	margin: 0 10rpx;
}

.footer-btn:active {
	opacity: 0.8;
}
</style>
<script>
	export default {
		data() {
			return {
				amount: '',
				meterInfo: null,
				electricity: null
			};
		},
		onShow() {
			this.queryBalance()
		},
		onLoad(e) {
			this.electricity = e.electricity
			this.queryBalance()
		},
		methods: {
			getorder() {
				uni.navigateTo({
					url:"/pagesTools/electricity/orderlist?electricity="+this.electricity
				})
			},
			// 获取电表信息
			queryBalance() {
				var that = this
				that.$util.request("mall.balance", {
					electricity: that.electricity
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
					console.error('Error querying balance:', err);
				});
			},
			//解除绑定
			unbinding(){
				var that = this
				uni.showModal({
					confirmText:'确定解除',
					confirmColor:"#E60012",
					content:"确认解除绑定此电表吗？",
					success(res) {
						if(res.confirm){
							that.$util.request("mall.unbinding", {
								electricity: that.electricity
							}).then(res => {
								uni.showToast({
									title: res.msg,
									icon: 'none',
									success() {
										setTimeout(function(){
											uni.navigateBack()
										},2000)
									}
								});
							}).catch(err => {
								console.error('Error querying balance:', err);
							});
						}else{
							console.log("取消解除")
						}
					}
				})
			},
			startScan() {
				var that = this
				if (that.amount == '' || that.amount == 0) {
					uni.showToast({
						title: "请输入充值金额",
						icon: 'none'
					})
					return false;
				}

				// 这里可以处理扫描后的逻辑，比如显示电表信息和输入充值金额等
				that.$util.request("mall.electricity", {
					amount: that.amount,
					electricity: this.electricity
				}).then(res => {
					if (res.code === 200) {
						uni.requestPayment({
							provider: 'wxpay', // 看需求，每个端都有各自的值，eg: 'alipay'
							timeStamp: res.data.timeStamp, // 当前时间戳（从1970年1月1日至今的秒数）
							nonceStr: res.data.nonceStr, // 随机字符串 - 也可以后端返回
							package: res.data.package, // 后端接口返回
							paySign: res.data.paySign, // 后端返回
							signType: 'MD5', // 签名的算法，默认值 ’MD5‘
							success: (result) => {
								// result成功返回内容 errMsg: "requestPayment:ok"
								if (result.errMsg == "requestPayment:ok") {
									uni.showToast({
										title: "充值成功",
										icon: 'none',
										duration: 2000,
										success() {
											setTimeout(() => {
												uni.navigateBack();
											}, 2000);
										}
									})
								}

								// 支付成功跳转结果页
							},
							fail: (err) => {
								console.log('fail', err)
								uni.showToast({
									title: '订单已生成，支付失败',
									icon: 'none',
									duration: 2000
								})
							}
						})

					} else {
						uni.showToast({
							title: "订单生成失败",
							icon: 'none',
							duration: 2000
						})
					}
				})

			}
		}
	};
</script>
