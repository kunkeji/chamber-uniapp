<template>
	<view class="container">
		<title-bar :title="navigationBarTitle"></title-bar>
		
		<!-- 顶部操作栏 -->
		<view class="header-bar">
			<view class="add-btn" @click="addGoods">
				<text class="iconfont icon-add"></text>
				<text>新增商品</text>
			</view>
		</view>

		<!-- 商品列表 -->
		<view class="goods-list">
			<view class="goods-item" v-for="item in goodsList" :key="item.id">
				<view class="goods-main">
					<image class="goods-image" :src="shopImage(item.goods_image)" mode="aspectFill"></image>
					<view class="goods-content">
						<view class="goods-title">
							<text class="name">{{ item.goods_name }}</text>
							<text :class="['status-tag', `status-${item.status}`]">
								{{ getStatusText(item.status) }}
							</text>
						</view>
						<view class="goods-specs">{{ item.norms }}</view>
						<text class="goods-desc">{{ item.slogan }}</text>
						<view class="goods-bottom">
							<text class="price">¥{{ item.price }}</text>
							<view class="action-group">
								<view class="action-btn edit" @click="editGoods(item)">
									<text class="icon">✎</text>
								</view>
								<view class="action-btn delete" @click="deleteGoods(item.id)">
									<text class="icon">🗑</text>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>

		<!-- 优化后的弹出层 -->
		<view class="popup" v-if="showPopup">
			<view class="popup-mask" @click="showPopup = false"></view>
			<view class="popup-content">
				<view class="popup-header">
					<text class="popup-title">{{ operate === 'addDish' ? '添加商品' : '编辑商品' }}</text>
					<text class="close-icon" @click="showPopup = false">×</text>
				</view>
				
				<view class="form-content">
					<view class="upload-section">
						<view class="upload-box" @click="selectImage">
							<image v-if="currentGoods.goods_image" :src="shopImage(currentGoods.goods_image)" mode="aspectFill"></image>
							<view v-else class="upload-placeholder">
								<text class="iconfont icon-camera"></text>
								<text class="upload-text">上传图片</text>
							</view>
						</view>
					</view>

					<view class="form-group">
						<view class="input-item">
							<text class="label">商品名称</text>
							<input type="text" v-model="currentGoods.goods_name" placeholder="请输入商品名称" />
						</view>
						
						<view class="input-item">
							<text class="label">规格</text>
							<input type="text" v-model="currentGoods.norms" placeholder="请输入规格" />
						</view>

						<view class="input-item">
							<text class="label">简介</text>
							<input type="text" v-model="currentGoods.slogan" placeholder="请输入商品简介" />
						</view>

						<view class="input-item">
							<text class="label">价格</text>
							<input type="digit" v-model="currentGoods.price" placeholder="请输入价格" />
						</view>

						<view class="input-item">
							<text class="label">状态</text>
							<radio-group class="status-group" @change="radiostatus">
								<label class="radio-item">
									<radio value="1" :checked="currentGoods.status == '1'" />
									<text>上架</text>
								</label>
								<label class="radio-item">
									<radio value="2" :checked="currentGoods.status == '2'" />
									<text>缺货</text>
								</label>
								<label class="radio-item">
									<radio value="0" :checked="currentGoods.status == '0'" />
									<text>下架</text>
								</label>
							</radio-group>
						</view>
					</view>

					<view class="form-actions">
						<button class="submit-btn" @click="submitForm">确认</button>
						<button class="cancel-btn" @click="showPopup = false">取消</button>
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
				navigationBarTitle: "商品管理",
				shopId: null,
				goodsList: [],
				showPopup: false,
				currentGoods: {
					goods_image: '',
					goods_name: '',
					norms: '',
					slogan: '',
					price: '',
					status: '1'
				},
				operate: ''
			};
		},

		methods: {
			radiostatus(res) {
				this.currentGoods.status = res.detail.value
			},
			shopImage(res) {
				return getApp().globalData.adminPath + res;
			},
			getStatusText(status) {
				const statusTexts = ['下架', '上架', '缺货'];
				return statusTexts[status];
			},
			loadGoodsList() {
				this.$util.request("main.Shop.goodsListByShangjia", {
					id: this.shopId
				}).then(res => {
					if (res.code === 1) {
						this.goodsList = res.data.goods;
					}
				});
			},
			addGoods() {
				this.operate = 'addDish'
				this.currentGoods = {
					goods_image: '',
					goods_name: '',
					norms: '',
					slogan: '',
					price: '',
					status: '1',
					wdsxh_shop_id: this.shopId
				};
				this.showPopup = true;
			},
			editGoods(item) {
				this.operate = 'updateDish'
				this.showPopup = true;
				this.currentGoods = {
					...item
				};
			},
			submitForm() {

				delete this.currentGoods.weigh;
				delete this.currentGoods.deletetime;
				delete this.currentGoods.score;
				if (this.operate != 'updateDish') {
					delete this.currentGoods.id;
				}
				console.log(this.currentGoods)
				// 这里区分是新增还是更新
				const method = this.operate;
				this.$util.request(`main.Shop.${method}`, {
					...this.currentGoods
				}).then(res => {
					if (res.code === 1) {
						this.showPopup = false;
						this.loadGoodsList();
					}
				});
			},
			deleteGoods(id) {
				uni.showModal({
					title: '提示',
					content: '确定要删除这个商品吗？',
					success: (res) => {
						if (res.confirm) {
							this.$util.request("main.Shop.deleteDish", {
								id
							}).then(res => {
								if (res.code === 1) {
									this.loadGoodsList();
								}
							});
						}
					}
				});
			},
			selectImage() {
				uni.chooseImage({
					count: 1,
					success: (res) => {
						this.$util.uploadFile(res.tempFilePaths[0]).then(uploadRes => {
							if (uploadRes.code === 1) {
								this.currentGoods.goods_image = uploadRes.data.url;
							}
						});
					}
				});
			}
		},
		onLoad(options) {
			this.shopId = options.id;
			this.loadGoodsList();
		}
	};
</script>

<style scoped>
	/* 顶部操作栏样式 */
	.header-bar {
		padding: 24rpx;
		background: #fff;
		position: sticky;
		top: 0;
		z-index: 100;
		display: flex;
		justify-content: flex-end;
	}

	.add-btn {
		display: flex;
		align-items: center;
		gap: 12rpx;
		background: #007AFF;
		color: #fff;
		padding: 16rpx 32rpx;
		border-radius: 32rpx;
		font-size: 28rpx;
	}

	/* 弹出层样式优化 */
	.popup {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 999;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.popup-mask {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.6);
		backdrop-filter: blur(4px);
	}

	.popup-content {
		position: relative;
		width: 90%;
		max-height: 90vh;
		background: #fff;
		border-radius: 24rpx;
		overflow: hidden;
		z-index: 1000;
		animation: popIn 0.3s ease;
	}

	@keyframes popIn {
		from {
			opacity: 0;
			transform: scale(0.9);
		}
		to {
			opacity: 1;
			transform: scale(1);
		}
	}

	.goods-list {
		padding: 24rpx;
	}

	.goods-item {
		background: #fff;
		border-radius: 20rpx;
		margin-bottom: 24rpx;
		overflow: hidden;
		box-shadow: 0 2rpx 12rpx rgba(0,0,0,0.05);
	}

	.goods-main {
		display: flex;
		padding: 24rpx;
	}

	.goods-image {
		width: 160rpx;
		height: 160rpx;
		border-radius: 12rpx;
		object-fit: cover;
	}

	.goods-content {
		flex: 1;
		margin-left: 24rpx;
		display: flex;
		flex-direction: column;
	}

	.goods-title {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.name {
		font-size: 32rpx;
		font-weight: 600;
		color: #333;
	}

	.status-tag {
		padding: 4rpx 16rpx;
		border-radius: 24rpx;
		font-size: 24rpx;
	}

	.status-0 { background: #f5f5f5; color: #999; }
	.status-1 { background: #e8f5e9; color: #4caf50; }
	.status-2 { background: #fff3e0; color: #ff9800; }

	.goods-specs {
		font-size: 26rpx;
		color: #666;
		margin-top: 8rpx;
	}

	.goods-desc {
		font-size: 26rpx;
		color: #999;
		margin-top: 8rpx;
	}

	.goods-bottom {
		margin-top: auto;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.price {
		font-size: 36rpx;
		font-weight: 600;
		color: #ff4d4f;
	}

	.action-group {
		display: flex;
		gap: 16rpx;
	}

	.action-btn {
		width: 64rpx;
		height: 64rpx;
		border-radius: 32rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		color: #fff;
		font-size: 32rpx;
		transition: all 0.3s ease;
	}

	.action-btn:active {
		transform: scale(0.95);
	}

	.edit { 
		background: #007AFF; 
	}

	.delete { 
		background: #ff4d4f; 
	}

	.icon {
		font-size: 36rpx;
		line-height: 1;
	}

	.popup-header {
		padding: 32rpx;
		border-bottom: 2rpx solid #f5f5f5;
	}

	.popup-title {
		font-size: 36rpx;
		font-weight: 600;
	}

	.form-content {
		padding: 32rpx;
	}

	.upload-section {
		display: flex;
		justify-content: center;
		margin-bottom: 32rpx;
	}

	.upload-box {
		width: 200rpx;
		height: 200rpx;
		border-radius: 16rpx;
		border: 2rpx dashed #ddd;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 12rpx;
	}

	.upload-placeholder {
		color: #999;
		text-align: center;
	}

	.form-group {
		display: flex;
		flex-direction: column;
		gap: 24rpx;
	}

	.input-item {
		display: flex;
		flex-direction: column;
		gap: 12rpx;
	}

	.label {
		font-size: 28rpx;
		color: #666;
	}

	input {
		height: 80rpx;
		background: #f5f5f5;
		border-radius: 12rpx;
		padding: 0 24rpx;
		font-size: 28rpx;
	}

	.status-group {
		display: flex;
		gap: 32rpx;
	}

	.radio-item {
		display: flex;
		align-items: center;
		gap: 8rpx;
	}

	.form-actions {
		margin-top: 48rpx;
		display: flex;
		gap: 24rpx;
	}

	button {
		flex: 1;
		height: 88rpx;
		border-radius: 44rpx;
		font-size: 32rpx;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.submit-btn {
		background: #007AFF;
		color: #fff;
	}

	.cancel-btn {
		background: #f5f5f5;
		color: #666;
	}
</style>