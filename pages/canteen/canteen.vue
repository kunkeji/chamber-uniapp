<template>
	<view>
		<title-bar :title="navigationBarTitle"></title-bar>
		<view class="container">
			<!-- 店铺列表 -->
			<view class="store-list">
				<block v-for="store in stores" :key="store.id">
					<view class="store-card" @click="details(store.id)">
						<view class="store-card-imgage">
							<!-- <view class="pinfen">4.1</view> -->
							<image :src="store.shop_image" class="store-image" mode="aspectFill"></image>
						</view>
						<view class="store-info">
							<view class="store-title-box">
								<view class="store-title">{{ store.title }}</view>
								<view
									:class="['store-delivery', { 'delivery-yes': store.delivery, 'delivery-no': !store.delivery }]">
									{{ store.delivery ? '支持' : '不支持' }}配送
								</view>
							</view>
							<view class="store-time">产出时间: {{ store.produce }}分钟</view>
							<view class="pingjia">
								<view class="pingjia_li">“{{store.slogan}}”</view>
							</view>
						</view>

					</view>
				</block>
			</view>
		</view>
		<view class="operate">
			<view class="guanli" @click="goshopList" v-if="shopList != ''">
				<image :src="guanliimage" mode=""></image>
			</view>
			<view class="canpan" @click="goorderlist">
				<image :src="dingdanimage" mode=""></image>
			</view>
		</view>

		<!-- 底部导航 -->
		<tab-bar></tab-bar>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				navigationBarTitle: "食堂",
				dingdanimage: "",
				guanliimage: '',
				stores: [],
				shopList: ''
			};
		},
		onShow() {
			this.getIndex()
			this.dingdanimage = getApp().globalData.adminPath + '/uploads/20241024/e6da93cbf9c7df07ad1e7bf28b9d456b.png'
			this.guanliimage = getApp().globalData.adminPath + '/uploads/20241028/42c918881c09c67d13b148fa7fc7c301.png'
		},
		methods: {
			
			
			details(id) {
				uni.navigateTo({
					url: "/pages/canteen/details?id=" + id
				})
			},
			// 获取店铺列表
			getIndex() {
				var that = this
				that.$util.request("main.Shop.getIndex").then(res => {
					if (res.code == 1) {
						that.stores = res.data
					}
				})

				that.$util.request("main.Shop.getIndex").then(res => {
					that.shopList = res.data
				})
			},
			goorderlist() {
				uni.navigateTo({
					url: "/pagesDemand/canteen/canteenDetails"
				})
			},
			goshopList() {
				var that = this
				if (that.shopList.length != 0) {
					uni.navigateTo({
						url: "/pagesDemand/canteen/shopList"
					})
				}
			}
		}
	};
</script>

<style scoped>
	.container {
		background-color: #F6F7FB;
		padding: 20rpx;
	}

	.store-list {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.store-card {
		display: flex;
		align-items: center;
		width: 710rpx;
		background-color: #ffffff;
		border-radius: 10rpx;
		padding: 20rpx;
		margin-bottom: 20rpx;
		box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.1);
	}

	.store-card-imgage {
		position: relative;
	}

	.pinfen {
		position: absolute;
		background: #00000082;
		padding: 0 10rpx;
		color: #ffbc00;
		border-top-left-radius: 10rpx;
	}

	.store-image {
		width: 200rpx;
		height: 200rpx;
		border-radius: 10rpx;
		margin-right: 20rpx;
	}

	.store-info {
		flex: 1;
	}

	.store-title-box {
		display: flex;
	}

	.store-title {
		color: #FF8000;
		font-size: 30rpx;
		font-weight: bold;
		margin-bottom: 10rpx;
	}

	.store-time {
		font-size: 24rpx;
		color: #666;
	}

	.store-delivery {
		font-size: 22rpx;
		line-height: 40rpx;
		padding-left: 15rpx;
		min-width: 100rpx;
	}

	.delivery-yes {
		color: #28a745;
		/* 绿色 */
	}

	.delivery-no {
		color: #dc3545;
		/* 红色 */
	}

	.pingjia {
		margin-top: 10rpx;
		background: #c5c5c570;
		padding: 10rpx;
		border-radius: 5rpx;
		color: #ff00e0;
		font-size: 20rpx;
	}

	.operate {
		position: fixed;
		bottom: 230rpx;
		right: 20rpx;

	}

	.canpan {
		width: 80rpx;
		height: 80rpx;
	}

	.guanli {
		width: 80rpx;
		height: 80rpx;
		padding: 16rpx;
		background: #ff8000;
		border-radius: 80rpx;
		margin-bottom: 10rpx;
	}
</style>