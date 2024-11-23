<template>
	<view class="page-container">
		<title-bar :title="navigationBarTitle"></title-bar>
		<view class="container">
			<view class="info-card">
				<view class="upload-section" @click="chooseImage">
					<image v-if="shopImage" :src="shopImage" class="store-image-preview" mode="aspectFill"></image>
					<view v-else class="upload-placeholder">
						<uni-icons type="camera-filled" size="40" color="#CCCCCC"></uni-icons>
						<text class="upload-text">点击上传店铺图片</text>
					</view>
				</view>

				<view class="form-section">
					<view class="form-item">
						<text class="label">店铺名称</text>
						<input class="input" v-model="shop.title" placeholder="请输入店铺名称" />
					</view>

					<view class="form-item">
						<text class="label">店铺标语</text>
						<input class="input" v-model="shop.slogan" placeholder="请输入店铺标语" />
					</view>

					<view class="form-item switch-item">
						<text class="label">配送服务</text>
						<switch class="custom-switch" :checked="shop.delivery == 1" @change="toggleDelivery" color="#00BFFF" />
					</view>

					<view class="form-item switch-item">
						<text class="label">营业状态</text>
						<switch class="custom-switch" :checked="shop.status == 1" @change="toggleStatus" color="#00BFFF" />
					</view>

					<view class="form-item">
						<text class="label">产出时间</text>
						<input class="input" v-model="shop.produce" type="number" placeholder="请输入产出时间" />
					</view>
				</view>
			</view>
			<view class="action-buttons">
				<button class="submit-btn" @click="updateShop">保存修改</button>
			</view>
		</view>
	</view>
</template>
<script>
	export default {
		data() {
			return {
				navigationBarTitle: "店铺管理",
				shop: {
					id: null,
					title: "",
					shop_image: "",
					delivery: 0,
					slogan: "",
					status: 0,
					produce: 0,
				},
				shopId: null,
				selectImages: [],
			};
		},
		computed: {
			shopImage() {
				if (this.shop.shop_image) {
					return getApp().globalData.adminPath + this.shop.shop_image;
				}
				return "";
			},
		},
		methods: {
			getShopInfo() {
				this.$util.request("main.Shop.getShopByShopId", {
					shop_id: this.shopId
				}).then(res => {
					if (res.code === 1) {
						this.shop = {
							...res.data,
							delivery: parseInt(res.data.delivery),
							status: parseInt(res.data.status)
						};
					} else {
						uni.showToast({
							title: '获取店铺信息失败',
							icon: 'none',
							duration: 2000,
						});
					}
				}).catch(error => {
					console.error('请求失败', error);
					uni.showToast({
						title: '请求失败',
						icon: 'none',
						duration: 2000,
					});
				});
			},
			chooseImage() {
				uni.chooseImage({
					count: 1,
					success: (res) => {
						this.selectImages = res.tempFilePaths;
						this.shop.shop_image = res.tempFilePaths[0];
						this.$util.uploadFile(res.tempFilePaths[0]).then(res => {
							this.shop.shop_image = res.data['url']; // 更新图片路径
						}).catch(error => {
							console.error('上传图片失败', error);
							uni.showToast({
								title: '上传图片失败',
								icon: 'none',
								duration: 2000,
							});
						});
					},
				});
			},
			toggleDelivery(value) {
				this.shop.delivery = value.detail.value ? 1 : 0;
			},
			toggleStatus(value) {
				this.shop.status = value.detail.value ? 1 : 0;
			},
			updateShop() {
				this.sendUpdateRequest();
			},
			sendUpdateRequest() {
				const params = {
					id: this.shop.id,
					title: this.shop.title,
					shop_image: this.shop.shop_image,
					delivery: this.shop.delivery.toString(),
					slogan: this.shop.slogan,
					status: this.shop.status.toString(),
					produce: this.shop.produce,
				};

				this.$util.request("main.Shop.updateShopById", params).then(res => {
					if (res.code === 1) {
						uni.showToast({
							title: '更新成功',
							icon: 'success',
							duration: 2000,
						});
						uni.navigateBack();
					} else {
						uni.showToast({
							title: '更新失败',
							icon: 'none',
							duration: 2000,
						});
					}
				}).catch(error => {
					console.error('请求失败', error);
					uni.showToast({
						title: '请求失败',
						icon: 'none',
						duration: 2000,
					});
				});
			},
		},
		onLoad(options) {
			this.shopId = options.id;
			this.getShopInfo();
		},
	};
</script>


<style scoped>
	.page-container {
		min-height: 100vh;
		background-color: #F5F6FA;
	}

	.container {
		padding: 30rpx;
	}

	.info-card {
		background-color: #FFFFFF;
		border-radius: 20rpx;
		padding: 40rpx;
		margin: 20rpx;
		box-shadow: 0 2rpx 20rpx rgba(0, 0, 0, 0.05);
	}

	.upload-section {
		display: flex;
		flex-direction: column;
		align-items: center;
		margin-bottom: 40rpx;
	}

	.upload-placeholder {
		width: 240rpx;
		height: 240rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		background-color: #F8F9FA;
		border-radius: 20rpx;
		border: 2rpx dashed #E0E0E0;
	}

	.store-image-preview {
		width: 240rpx;
		height: 240rpx;
		border-radius: 20rpx;
		box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
	}

	.upload-text {
		margin-top: 20rpx;
		font-size: 26rpx;
		color: #999999;
	}

	.form-section {
		margin-top: 30rpx;
	}

	.form-item {
		margin-bottom: 30rpx;
	}

	.label {
		display: block;
		font-size: 28rpx;
		color: #333333;
		margin-bottom: 15rpx;
		font-weight: 500;
	}

	.input {
		height: 80rpx;
		padding: 0 20rpx;
		background-color: #F8F9FA;
		border-radius: 12rpx;
		font-size: 28rpx;
		color: #333333;
	}

	.switch-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 20rpx 0;
	}

	.custom-switch {
		transform: scale(0.9);
	}

	.submit-btn {
		width: 90%;
		height: 90rpx;
		line-height: 90rpx;
		background: linear-gradient(45deg, #00BFFF, #1E90FF);
		color: #FFFFFF;
		border-radius: 45rpx;
		font-size: 32rpx;
		font-weight: 500;
		margin-top: 60rpx;
		box-shadow: 0 6rpx 20rpx rgba(0, 191, 255, 0.3);
	}

	.submit-btn:active {
		transform: scale(0.98);
	}
</style>