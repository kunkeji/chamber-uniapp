<template>
	<view>
		<title-bar :title="navigationBarTitle"></title-bar>
		<view class="container">
			<view class="order-type-selection">
				<view 
					v-for="(type, index) in orderTypes" 
					:key="index"
					class="order-type-wrapper"
				>
					<view 
						class="order-type" 
						:class="{'order-type-active': selectedOrderType == type.value}"
						@click="selectOrderType(type.value)"
					>
						<text class="order-type-icon">{{ type.icon }}</text>
						<text>{{ type.label }}</text>
					</view>
					<!-- 上次选择提示气泡 -->
					<view v-if="lastOrderType === type.value" class="last-selected-tip">
						上次选择
					</view>
				</view>
			</view>

			<view v-if="selectedOrderType === '1' || selectedOrderType === '2'" class="time-selection animate-fade-in">
				<view class="time-label">
					<text class="icon">🕒</text>
					预计用餐时间
				</view>
				<picker mode="time" :value="expectedTime" @change="onTimeChange">
					<view class="time-picker">{{ expectedTime }}</view>
				</picker>
			</view>

			<view v-if="selectedOrderType === '3'" class="address-selection">
				<view class="address-label">外卖地址</view>
				<view class="address-input" @click="showAddressPopup">
					<text>{{ deliveryAddress.name }} - {{ deliveryAddress.phone }} -
						{{ deliveryAddress.address }}</text>
				</view>
			</view>

			<!-- 商品详情列表 -->
			<view class="product-list" v-if="cart.length > 0">
				<view class="product-item" v-for="item in cart" :key="item.id">
					<view class="product-info">
						<view class="product-name">{{ item.goods_name }}</view>
						<view class="product-meta">
							<view class="product-quantity">
								<text class="quantity-label">数量:</text>
								<text class="quantity-value">{{ item.quantity }}</text>
							</view>
							<view class="price-info">
								<view class="unit-price">
									<text class="price-symbol">¥</text>
									<text class="price-value">{{ item.price }}</text>
									<text class="price-unit">/份</text>
								</view>
								<view class="total-price">
									<text class="total-label">小计:</text>
									<text class="price-symbol">¥</text>
									<text class="total-value">{{ (item.price * item.quantity).toFixed(2) }}</text>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>

			<view class="order-summary">
				<view class="summary-item">
					<text>商品总价</text>
					<text>¥{{ totalPrice }}</text>
				</view>
				<view class="summary-item">
					<text>配送费</text>
					<text>¥{{ deliveryFee }}</text>
				</view>
				<view class="summary-item">
					<text>订单价</text>
					<text>¥{{ totalOrderPrice }}</text>
				</view>
			</view>

			<view class="order-button-box">
				<view @click="submitOrder" class="order-button">确认点餐</view>
			</view>

			<!-- 地址弹出层 -->
			<view v-if="isAddressPopupVisible" class="address-popup">
				<view class="address-content" @click.stop>
					<view class="address-header">
						<text class="header-title">填写配送地址</text>
						<text class="close-icon" @click="closeAddressPopup">×</text>
					</view>
					<view class="address-form">
						<view class="form-group">
							<text class="form-label required">姓名</text>
							<input 
								v-model="deliveryAddress.name" 
								placeholder="请输入姓名" 
								class="form-input"
								@blur="validateName"
							/>
							<text v-if="errors.name" class="error-tip">{{ errors.name }}</text>
						</view>
						
						<view class="form-group">
							<text class="form-label">性别</text>
							<radio-group @change="onGenderChange" class="gender-group">
								<label class="radio-label" v-for="item in genderOptions" :key="item.value">
									<radio 
										:value="item.value" 
										:checked="deliveryAddress.gender === item.value" 
										color="#ff8000"
									/>
									<text>{{ item.label }}</text>
								</label>
							</radio-group>
						</view>
						
						<view class="form-group">
							<text class="form-label required">电话</text>
							<input 
								v-model="deliveryAddress.phone" 
								placeholder="请输入手机号码" 
								class="form-input"
								type="number"
								maxlength="11"
								@blur="validatePhone"
							/>
							<text v-if="errors.phone" class="error-tip">{{ errors.phone }}</text>
						</view>
						
						<view class="form-group">
							<text class="form-label required">详细地址</text>
							<textarea 
								v-model="deliveryAddress.address" 
								placeholder="请输入详细地址" 
								class="form-textarea"
								@blur="validateAddress"
							/>
							<text v-if="errors.address" class="error-tip">{{ errors.address }}</text>
						</view>
					</view>
					
					<view class="address-buttons">
						<button class="save-button" @click="saveAddress">保存地址</button>
						<button class="cancel-button" @click="closeAddressPopup">取消</button>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>


<script>
	export default {
		data() {
			return {
				navigationBarTitle: '下单页面',
				selectedOrderType: '',
				expectedTime: this.getDefaultTime(),
				deliveryFee: 0.00,
				isAddressPopupVisible: false,
				deliveryAddress: {
					name: '',
					gender: '0', // 默认值为男
					phone: '',
					address: ''
				},
				cart: [],
				orderTypes: [
					{ value: '1', label: '到店吃', icon: '🍽️' },
					{ value: '2', label: '到店取', icon: '🥡' },
					{ value: '3', label: '外卖', icon: '🛵' }
				],
				genderOptions: [
					{ value: '0', label: '男' },
					{ value: '1', label: '女' },
					{ value: '2', label: '超人' }
				],
				lastOrderType: '', // 上次的订单类型
				errors: {
					name: '',
					phone: '',
					address: ''
				}
			};
		},
		computed: {
			totalPrice() {
				return this.cart.reduce((total, item) => total + item.price * item.quantity, 0);
			},
			totalOrderPrice() {
				return this.totalPrice + (this.selectedOrderType === '3' ? this.deliveryFee : 0);
			}
		},
		methods: {
			selectOrderType(type) {
				this.selectedOrderType = type;
				this.saveOrderType(type); // 保存当前选择的类型
				
				if (type === '1' || type === '2') {
					this.expectedTime = this.getDefaultTime();
				}
				if (type === '3') {
					// 检查是否有本地保存的地址
					if (!this.getLocalAddress()) {
						this.showAddressPopup();
					}
				}
			},
			onTimeChange(e) {
				this.expectedTime = e.detail.value;
			},
			onGenderChange(e) {
				this.deliveryAddress.gender = e.detail.value;
			},
			showAddressPopup() {
				this.isAddressPopupVisible = true;
			},
			closeAddressPopup() {
				this.isAddressPopupVisible = false;
			},
			saveAddress() {
				if (!this.deliveryAddress.name || !this.deliveryAddress.phone || !this.deliveryAddress.address) {
					uni.showToast({
						title: '请填写完整信息',
						icon: 'none'
					});
					return;
				}
				
				// 保存到本地
				uni.setStorageSync('deliveryAddress', this.deliveryAddress);
				this.isAddressPopupVisible = false;
				
				uni.showToast({
					title: '地址保存成功',
					icon: 'success'
				});
			},
			getLocalAddress() {
				const savedAddress = uni.getStorageSync('deliveryAddress');
				if (savedAddress) {
					this.deliveryAddress = savedAddress;
					return true;
				}
				return false;
			},
			saveOrderType(type) {
				uni.setStorageSync('lastOrderType', type);
			},
			getLastOrderType() {
				return uni.getStorageSync('lastOrderType');
			},
			submitOrder() {
				if (this.selectedOrderType === '') {
					uni.showToast({
						icon: 'none',
						title: "请选择订单类型",
						duration: 2000
					});
					return;
				}

				if ((this.selectedOrderType === 'dine-in' || this.selectedOrderType === 'takeaway') && this
					.expectedTime === '请选择时间') {
					uni.showToast({
						icon: 'none',
						title: "请选择预计用餐时间",
						duration: 2000
					});
					return;
				}

				if (this.selectedOrderType === 'delivery' && (!this.deliveryAddress.name || !this.deliveryAddress.phone ||
						!this.deliveryAddress.address)) {
					uni.showToast({
						icon: 'none',
						title: "请填写完整的外卖地址",
						duration: 2000
					});
					return;
				}

				// 这里可以添加实际的提交订单逻辑
				var deliveryAddress = toString(this.deliveryAddress)
				var gender = ""
				switch (this.deliveryAddress['gender']) {
					case "0":
						gender = '先生'
						break;
					case "1":
						gender = '女士'
						break;
					case "2":
						gender = '超人'
						break;
				}
				var deliveryAddress = this.deliveryAddress['name'] + gender + " " + this.deliveryAddress['phone'] + " " +
					this.deliveryAddress['address']
				var data = {
					'shop_id': this.shop_id,
					'goods': JSON.stringify(this.cart),
					'address': deliveryAddress,
					'expected_time': this.expectedTime,
					'total_amount': this.totalOrderPrice,
					'remark': '',
					'order_type': this.selectedOrderType,
				}
				this.$util.request("main.Shop.createOrder", data).then(res => {
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
									uni.navigateTo({
										url: "/pagesDemand/canteen/canteenDetails"
									})
								}
								
								console.log('success', result)
								// 支付成功跳转结果页
							},
							fail: (err) => {
								console.log('fail', err)
								uni.showToast({
									title: '支付失败',
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
				uni.showToast({
					icon: 'success',
					title: "订单提交成功",
					duration: 2000
				});
			},
			getDefaultTime() {
				const now = new Date();
				now.setMinutes(now.getMinutes() + 20);
				const hours = String(now.getHours()).padStart(2, '0');
				const minutes = String(now.getMinutes()).padStart(2, '0');
				return `${hours}:${minutes}`;
			},
			validateName() {
				if (!this.deliveryAddress.name.trim()) {
					this.errors.name = '请输入姓名';
					return false;
				}
				this.errors.name = '';
				return true;
			},
			
			validatePhone() {
				const phoneReg = /^1[3-9]\d{9}$/;
				if (!this.deliveryAddress.phone) {
					this.errors.phone = '请输入手机号码';
					return false;
				}
				if (!phoneReg.test(this.deliveryAddress.phone)) {
					this.errors.phone = '请输入正确的手机号码';
					return false;
				}
				this.errors.phone = '';
				return true;
			},
			
			validateAddress() {
				if (!this.deliveryAddress.address.trim()) {
					this.errors.address = '请输入详细地址';
					return false;
				}
				this.errors.address = '';
				return true;
			},
			
			validateForm() {
				const nameValid = this.validateName();
				const phoneValid = this.validatePhone();
				const addressValid = this.validateAddress();
				return nameValid && phoneValid && addressValid;
			}
		},
		onLoad(options) {
			// 从 URL 参数中获取购物车数据
			if (options.cart) {
				this.cart = JSON.parse(decodeURIComponent(options.cart));
			}
			this.shop_id = options.shopid
			
			// 获取上次的订单类型
			this.lastOrderType = this.getLastOrderType();
			if (this.lastOrderType) {
				this.selectOrderType(this.lastOrderType);
			}
		}
	};
</script>
<style scoped>
	.container {
		padding: 30rpx;
		background-color: #FAFAFA;
	}

	.order-type-selection {
		display: flex;
		justify-content: space-around;
		margin-bottom: 30rpx;
	}

	.order-type-wrapper {
		position: relative;
		flex: 1;
	}

	.order-type {
		flex: 1;
		margin: 0 10rpx;
		background: linear-gradient(to bottom, #ffffff, #f8f8f8);
		border: 2rpx solid #eaeaea;
		padding: 25rpx 15rpx;
		border-radius: 15rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 10rpx;
	}

	.order-type-active {
		background: linear-gradient(to bottom, #ff8000, #ff9933);
		border-color: #ff8000;
		color: #fff;
		transform: translateY(-2rpx);
		box-shadow: 0 4rpx 12rpx rgba(255, 128, 0, 0.2);
	}

	.order-type-icon {
		font-size: 40rpx;
		margin-bottom: 8rpx;
	}

	.time-selection,
	.address-selection {
		background: linear-gradient(to bottom, #ffffff, #fafafa);
		border: 2rpx solid #eaeaea;
		border-radius: 15rpx;
		padding: 25rpx;
		margin: 20rpx 0;
	}

	.animate-fade-in {
		animation: fadeIn 0.3s ease-in-out;
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
			transform: translateY(20rpx);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.time-label,
	.address-label {
		font-size: 32rpx;
		font-weight: 600;
		color: #333333;
		margin-bottom: 15rpx;
	}

	.time-picker,
	.address-input {
		font-size: 28rpx;
		color: #666666;
		padding: 10rpx;
		border: 1rpx solid #E0E0E0;
		border-radius: 5rpx;
		cursor: pointer;
		transition: border-color 0.3s;
		width: 100%;
	}

	.time-picker:hover,
	.address-input:hover {
		border-color: #00BFFF;
	}

	.order-summary {
		background-color: #FFFFFF;
		padding: 20rpx;
		border-radius: 10rpx;
		margin-bottom: 30rpx;
		box-shadow: 0 4rpx 10rpx rgba(0, 0, 0, 0.05);
	}

	.summary-item {
		display: flex;
		justify-content: space-between;
		font-size: 28rpx;
		color: #333333;
		margin-bottom: 15rpx;
	}

	.order-button-box {
		display: flex;
		justify-content: center;
		margin-bottom: 30rpx;
	}

	.order-button {
		width: 90%;
		background: linear-gradient(to right, #ff8000, #ff9933);
		padding: 25rpx;
		border-radius: 50rpx;
		font-weight: bold;
		letter-spacing: 2rpx;
		box-shadow: 0 4rpx 15rpx rgba(255, 128, 0, 0.3);
		color: #FFFFFF;
		cursor: pointer;
		transition: background-color 0.3s, box-shadow 0.3s;
		font-size: 32rpx;
		text-align: center;
		box-shadow: 0 2rpx 5rpx rgba(0, 0, 0, 0.1);
	}

	.order-button:hover {
		background-color: #00A2E8;
		box-shadow: 0 4rpx 10rpx rgba(0, 0, 0, 0.15);
	}

	.address-popup {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: rgba(0, 0, 0, 0.6);
		backdrop-filter: blur(5rpx);
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 999;
	}

	.address-content {
		position: relative;
		width: 85%;
		max-height: 80vh;
		background: #fff;
		border-radius: 20rpx;
		padding: 40rpx;
		overflow-y: auto;
	}

	.address-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 30rpx;
	}

	.header-title {
		font-size: 36rpx;
		font-weight: 600;
		color: #333;
	}

	.close-icon {
		font-size: 40rpx;
		color: #999;
		padding: 10rpx;
	}

	.form-group {
		margin-bottom: 30rpx;
	}

	.form-label {
		display: block;
		font-size: 28rpx;
		color: #666;
		margin-bottom: 10rpx;
	}

	.form-input {
		width: calc(100% - 40rpx);
		box-sizing: border-box;
		height: 80rpx;
		background: #f8f8f8;
		border: 2rpx solid #eee;
		border-radius: 12rpx;
		padding: 0 20rpx;
		font-size: 28rpx;
		transition: all 0.3s ease;
	}

	.form-input:focus {
		border-color: #ff8000;
		background: #fff;
	}

	.form-textarea {
		width: calc(100% - 40rpx);
		box-sizing: border-box;
		height: 120rpx;
		background: #f8f8f8;
		border: 2rpx solid #eee;
		border-radius: 12rpx;
		padding: 20rpx;
		font-size: 28rpx;
	}

	.gender-group {
		display: flex;
		gap: 30rpx;
	}

	.radio-label {
		display: flex;
		align-items: center;
		gap: 8rpx;
		font-size: 28rpx;
	}

	.address-buttons {
		display: flex;
		gap: 20rpx;
		margin-top: 40rpx;
	}

	.save-button,
	.cancel-button {
		flex: 1;
		height: 80rpx;
		border-radius: 40rpx;
		font-size: 30rpx;
		font-weight: 500;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: all 0.3s ease;
	}

	.save-button {
		background: linear-gradient(to right, #ff8000, #ff9933);
		color: #fff;
		border: none;
	}

	.save-button:active {
		transform: scale(0.98);
		opacity: 0.9;
	}

	.cancel-button {
		background: #f5f5f5;
		color: #666;
		border: 2rpx solid #eee;
	}

	.cancel-button:active {
		background: #eee;
	}

	.orderTypeclick {
		background-color: #00A2E8;
	}

	.cancel-button {
		background-color: #FF5722;
	}

	.cancel-button:hover {
		background-color: #E64A19;
	}

	.product-list {
		margin: 30rpx 0;
		border-radius: 20rpx;
		background: #fff;
		box-shadow: 0 2rpx 20rpx rgba(0, 0, 0, 0.05);
		overflow: hidden;
	}

	.product-item {
		padding: 30rpx;
		border-bottom: 2rpx solid #f5f5f5;
		background: #fff;
		transition: all 0.3s ease;
	}

	.product-item:last-child {
		border-bottom: none;
	}

	.product-item:active {
		background: #f9f9f9;
	}

	.product-info {
		display: flex;
		flex-direction: column;
		gap: 15rpx;
	}

	.product-name {
		font-size: 32rpx;
		font-weight: 600;
		color: #333;
	}

	.product-meta {
		display: flex;
		justify-content: space-between;
		align-items: flex-end;
	}

	.product-quantity {
		display: flex;
		align-items: center;
		gap: 10rpx;
	}

	.quantity-label {
		font-size: 26rpx;
		color: #666;
	}

	.quantity-value {
		font-size: 28rpx;
		color: #333;
		font-weight: 500;
	}

	.price-info {
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		gap: 8rpx;
	}

	.unit-price {
		display: flex;
		align-items: baseline;
		color: #666;
		font-size: 24rpx;
	}

	.total-price {
		display: flex;
		align-items: baseline;
		color: #ff6b6b;
	}

	.total-label {
		font-size: 24rpx;
		color: #666;
		margin-right: 8rpx;
	}

	.price-symbol {
		font-size: 24rpx;
		margin-right: 2rpx;
	}

	.price-value {
		font-size: 28rpx;
		font-weight: 500;
	}

	.total-value {
		font-size: 32rpx;
		font-weight: 600;
		color: #ff6b6b;
	}

	.price-unit {
		margin-left: 4rpx;
		color: #999;
	}

	.required:after {
		content: '*';
		color: #ff4d4f;
		margin-left: 4rpx;
	}

	.error-tip {
		font-size: 24rpx;
		color: #ff4d4f;
		margin-top: 4rpx;
	}

	.form-input,
	.form-textarea {
		border: 2rpx solid #dcdfe6;
		transition: all 0.3s;
	}

	.form-input:focus,
	.form-textarea:focus {
		border-color: #ff8000;
		box-shadow: 0 0 0 2rpx rgba(255, 128, 0, 0.2);
	}

	.form-input.error,
	.form-textarea.error {
		border-color: #ff4d4f;
	}

	.last-selected-tip {
		position: absolute;
		top: -20rpx;
		right: -10rpx;
		background: #ff8000;
		color: #fff;
		font-size: 20rpx;
		padding: 4rpx 12rpx;
		border-radius: 20rpx;
		transform: scale(0.8);
		z-index: 1;
	}

	/* 添加气泡尾巴 */
	.last-selected-tip:after {
		content: '';
		position: absolute;
		bottom: -6rpx;
		right: 15rpx;
		width: 0;
		height: 0;
		border-left: 6rpx solid transparent;
		border-right: 6rpx solid transparent;
		border-top: 8rpx solid #ff8000;
	}
</style>