<template>
	<view>
		<title-bar :title="store.title"></title-bar>
		<!-- 店铺大图 -->
		<image :src="store.shop_image" class="store-image" mode="aspectFill"></image>
		<view class="container">
			<!-- 店铺信息卡片 -->
			<view class="info-card">
				<view class="store-name">{{ store.title }}</view>
				<view class="store-rating">
					<!-- <text>评分: {{ store.produce }}</text> -->
					<text class="delivery-status">{{ store.delivery ? '支持配送' : '不支持配送' }}</text>
					<text>产出时间: {{ store.produce }}</text>
				</view>
				<view class="store-announcement">{{ store.slogan }}</view>
			</view>
			<!-- 商品卡片列表 -->
			<view class="product-list">
				<block v-for="product in products" :key="product.id">
					<view class="product-card">
						<view class="product-image-box">
							<image :src="product.goods_image" class="product-image" mode="aspectFill">
							</image>
						</view>

						<view class="product-info">
							<view class="product-name">{{ product.goods_name }}</view>
							<view class="product-weight">{{ product.norms }}</view>
							<view class="product-description">{{ product.slogan }}</view>

							<view class="add-to-cart-box">
								<view class="product-price">¥{{ product.price }}</view>
								<quantity-control :value="getProductQuantity(product)" :product-id="product.id"
									@input="updateQuantity(product, $event)"></quantity-control>
							</view>
						</view>
					</view>
				</block>
			</view>

			<!-- 固定底部 -->
			<view class="footer">
				<view @click="showCart" class="total-price">总价: ¥{{ totalPrice }}</view>
				<view class="order-button-box">
					<view @click="placeOrder" class="order-button">立即下单</view>
				</view>
			</view>
		</view>

		<!-- 购物车弹出层 -->
		<view v-if="isCartVisible" class="cart-popup cart-visible" @click="closeCart">
			<view class="cart-content" @click.stop>
				<view class="cart-header">
					<text>购物车</text>
					<view>
						<view @click="clearCart" class="clear-button">清空菜单</view>
					</view>
				</view>
				<scroll-view class="cart-list" scroll-y>
					<block v-for="(item, index) in cart" :key="item.id">
						<view class="cart-item">
							<view class="cart-product-image-box">
								<image :src="item.goods_image" class="cart-product-image" mode="aspectFill"></image>
							</view>
							<view class="cart-product-info">
								<view class="cart-product-name">{{ item.goods_name }}</view>
								<view class="cart-product-controls">
									<quantity-control :value="item.quantity" :product-id="item.id"
										@input="updateQuantity(item, $event)"></quantity-control>
									<view class="remove-button" @click="removeFromCart(index)">移除</view>
								</view>
								<view class="cart-product-total-price">小计: ¥{{ toFixed(item.price * item.quantity) }}
								</view>
							</view>
						</view>
					</block>
				</scroll-view>
				<view class="cart-total-price">总价: ¥{{ totalPrice }}</view>
			</view>
		</view>
	</view>
</template>
<script>
	import QuantityControl from '@/components/QuantityControl.vue';

	export default {
		components: {
			QuantityControl
		},
		data() {
			return {
				shopid: null,
				navigationBarTitle: '店铺名称',
				store: {},
				products: [],
				cart: [],
				isCartVisible: false
			};
		},
		onLoad(e) {
			this.shopid = e.id
			this.getGoodsList(e.id)
		},
		methods: {
			shopImage(res) {
				return getApp().globalData.adminPath + res;
			},
			getGoodsList(id) {
				var that = this
				that.$util.request("main.Shop.getGoodsList", {
					"id": id
				}).then(res => {
					if (res.code == 1) {
						that.store = res.data
						
						for(let i=0;i<res.data.goods.length;i++){
							res.data.goods[i].goods_image = that.shopImage(res.data.goods[i].goods_image)
						}
						that.products = res.data.goods
						
					}
				})
			},
			updateQuantity(product, quantity) {
				const existingItem = this.cart.find(item => item.id === product.id);
				if (existingItem) {
					existingItem.quantity = quantity;
					if (existingItem.quantity <= 0) {
						this.removeFromCart(this.cart.indexOf(existingItem));
					}
				} else if (quantity > 0) {
					this.cart.push({
						...product,
						quantity: 1
					});
				}
			},
			removeFromCart(index) {
				this.cart.splice(index, 1);
			},
			showCart() {
				this.isCartVisible = true;
			},
			closeCart(event) {
				this.isCartVisible = false;
			},
			clearCart() {
				this.cart = [];
				this.isCartVisible = false;
			},
			toFixed(num) {
				return (Math.round(num * 100) / 100).toFixed(2);
			},
			placeOrder() {
				if (this.cart.length === 0) {
					uni.showToast({
						icon: 'none',
						title: "请先添加商品到购物车",
						duration: 2000
					});
					return;
				}
				uni.navigateTo({
					url: `/pagesDemand/canteen/userorder?shopid=${this.shopid}&cart=${encodeURIComponent(JSON.stringify(this.cart))}`
				});
			},
			getProductQuantity(product) {
				const existingItem = this.cart.find(item => item.id === product.id);
				return existingItem ? existingItem.quantity : 0;
			}
		},
		computed: {
			totalPrice() {
				var that = this
				return that.toFixed(this.cart.reduce((total, item) => {
					return total + item.price * item.quantity;
				}, 0));
			}
		}
	};
</script>
<style scoped>
	.container {
		padding: 30rpx;
		background-color: #F8F9FA;
		min-height: 100vh;
	}

	.store-image {
		width: 100%;
		height: 360rpx;
		border-radius: 0;
		position: relative;
	}

	.info-card {
		width: 690rpx;
		background-color: #FFFFFF;
		border-radius: 20rpx;
		padding: 40rpx;
		margin: -60rpx auto 0;
		position: relative;
		box-shadow: 0 8rpx 20rpx rgba(0, 0, 0, 0.08);
	}

	.store-name {
		font-size: 40rpx;
		font-weight: 800;
		margin-bottom: 20rpx;
		color: #2C3E50;
	}

	.store-rating {
		display: flex;
		align-items: center;
		font-size: 28rpx;
		color: #5D6D7E;
		margin-bottom: 20rpx;
		justify-content: space-between;
	}

	.delivery-status {
		background-color: #E3F2FD;
		color: #1976D2;
		padding: 6rpx 16rpx;
		border-radius: 30rpx;
		font-size: 24rpx;
	}

	.product-list {
		margin-top: 30rpx;
	}

	.product-card {
		display: flex;
		align-items: center;
		background-color: #FFFFFF;
		border-radius: 20rpx;
		padding: 30rpx;
		margin-bottom: 30rpx;
		box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.04);
		transition: transform 0.2s ease;
	}

	.product-card:active {
		transform: scale(0.98);
	}

	.product-image {
		width: 200rpx;
		height: 200rpx;
		border-radius: 16rpx;
		object-fit: cover;
	}

	.product-info {
		flex: 1;
		padding-left: 20rpx;
	}

	.product-name {
		font-size: 34rpx;
		font-weight: 700;
		color: #2C3E50;
		margin-bottom: 12rpx;
	}

	.product-weight,
	.product-description {
		font-size: 24rpx;
		color: #666666;
		margin-bottom: 10rpx;
	}

	.add-to-cart-box {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.product-price {
		color: #FF6B6B;
		font-size: 36rpx;
		font-weight: 700;
		margin-right: 10rpx;
	}

	.quantity-controls {
		display: flex;
		align-items: center;
	}

	.quantity-button {
		background-color: #00BFFF;
		color: #FFFFFF;
		border: none;
		padding: 10rpx 15rpx;
		border-radius: 5rpx;
		cursor: pointer;
		transition: background-color 0.3s;
		font-size: 24rpx;
		width: 50rpx;
		height: 50rpx;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.quantity-button:hover {
		background-color: #00A2E8;
	}

	.quantity-display {
		background-color: #F5F5F5;
		color: #333333;
		border: 1rpx solid #E0E0E0;
		padding: 10rpx 15rpx;
		border-radius: 5rpx;
		font-size: 24rpx;
		width: 50rpx;
		height: 50rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		margin: 0 10rpx;
	}

	.footer {
		display: flex;
		justify-content: space-between;
		padding: 30rpx;
		background-color: rgba(255, 255, 255, 0.98);
		backdrop-filter: blur(10px);
		border-top: 1rpx solid rgba(0, 0, 0, 0.05);
		position: fixed;
		width: 100%;
		left: 0;
		bottom: 0;
		box-shadow: 0 -4rpx 16rpx rgba(0, 0, 0, 0.06);
	}

	.total-price {
		font-size: 32rpx;
		font-weight: 700;
		color: #333333;
		cursor: pointer;
	}

	.order-button {
		background: linear-gradient(135deg, #00BFFF, #2196F3);
		color: #FFFFFF;
		padding: 20rpx 40rpx;
		border-radius: 50rpx;
		font-weight: 600;
		font-size: 32rpx;
		box-shadow: 0 4rpx 12rpx rgba(33, 150, 243, 0.3);
		transition: all 0.3s ease;
	}

	.order-button:active {
		transform: scale(0.95);
		box-shadow: 0 2rpx 8rpx rgba(33, 150, 243, 0.2);
	}

	.cart-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 20rpx;
	}

	.clear-button {
		background-color: #FF6B6B;
		padding: 12rpx 24rpx;
		border-radius: 30rpx;
		font-size: 26rpx;
		transition: all 0.3s ease;
	}

	.clear-button:hover {
		background-color: #E64A19;
	}

	.cart-list {
		max-height: 500rpx;
		
		overflow-y: auto;
	}

	.cart-item {
		display: flex;
		align-items: center;
		margin-bottom: 20rpx;
	}

	.cart-product-image-box {
		width: 120rpx;
		height: 120rpx;
		border-radius: 10rpx;
		overflow: hidden;
		margin-right: 20rpx;
	}

	.cart-product-image {
		width: 100%;
		height: 100%;
	}

	.cart-product-info {
		flex: 1;
	}

	.cart-product-name {
		font-size: 28rpx;
		color: #333333;
		margin-bottom: 10rpx;
	}

	.cart-product-controls {
		display: flex;
		align-items: center;
	}

	.remove-button {
		background-color: #FF6B6B;
		padding: 8rpx 20rpx;
		border-radius: 30rpx;
		font-size: 24rpx;
	}

	.remove-button:hover {
		background-color: #E64A19;
	}

	.cart-product-total-price {
		font-size: 24rpx;
		color: #FF5722;
		margin-top: 10rpx;
	}

	.cart-total-price {
		margin-top: 20rpx;
		font-size: 32rpx;
		font-weight: 700;
		color: #333333;
	}

	/* 添加动画相关的样式 */
	.cart-popup {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		top: 0;
		background-color: rgba(0, 0, 0, 0.5);
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 1000;
		transition: opacity 0.3s ease;
		backdrop-filter: blur(8px);
	}

	.cart-content {
		background-color: #FFFFFF;
		border-radius: 24rpx;
		padding: 40rpx;
		width: 92%;
		max-height: 80vh;
		animation: slideUp 0.3s ease;
	}

	.cart-visible .cart-content {
		transform: translateY(0);
		opacity: 1;
	}

	@keyframes slideUp {
		from {
			transform: translateY(100%);
			opacity: 0;
		}
		to {
			transform: translateY(0);
			opacity: 1;
		}
	}
</style>