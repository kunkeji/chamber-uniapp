<template>
    <view>
        <title-bar title="商品详情"></title-bar>
	<view class="goods-detail">
		<!-- 加载中 -->
		<view class="loading-box" v-if="isLoading">
			<uni-load-more status="loading" :iconSize="24"></uni-load-more>
		</view>
		<block v-else>
			<!-- 商品信息 -->
			<view class="goods-info">
				<image class="goods-image" :src="goodsInfo.image" mode="aspectFill"></image>
				<view class="info-content">
					<view class="goods-name">{{goodsInfo.title}}</view>
					<view class="goods-points">
						<text class="points">{{goodsInfo.points}}</text>
						<text class="unit">积分</text>
					</view>
					<view class="goods-stock">库存: {{goodsInfo.stock}}</view>
				</view>
			</view>
			<!-- 商品详情 -->
			<view class="goods-content">
				<view class="content-title">商品详情</view>
				<rich-text :nodes="goodsInfo.content"></rich-text>
			</view>
			<!-- 底部操作栏 -->
			<view class="footer-bar">
				<view class="my-points">
					<text class="label">我的积分</text>
					<text class="value">{{totalPoints}}</text>
				</view>
				<view class="exchange-btn" :class="{'disabled': !canExchange}" @click="showExchangePopup">
					立即兑换
				</view>
			</view>
		</block>
		
		<!-- 兑换弹窗 -->
		<uni-popup ref="exchangePopup" type="bottom">
			<view class="exchange-popup">
				<view class="popup-header">
					<text class="title">确认兑换</text>
					<text class="close" @click="closeExchangePopup">×</text>
				</view>
				<view class="popup-content">
					<view class="goods-info">
						<image class="goods-image" :src="goodsInfo.image" mode="aspectFill"></image>
						<view class="info-right">
							<view class="goods-name">{{goodsInfo.title}}</view>
							<view class="goods-points">
								<text class="points">{{goodsInfo.points}}</text>
								<text class="unit">积分</text>
							</view>
						</view>
					</view>
					<view class="form-item">
						<text class="label">数量</text>
						<view class="number-box">
							<text class="minus" :class="{'disabled': num <= 1}" @click="changeNum(-1)">-</text>
							<input type="number" v-model="num" class="input" />
							<text class="plus" :class="{'disabled': num >= goodsInfo.stock}" @click="changeNum(1)">+</text>
						</view>
					</view>
					<view class="form-item">
						<text class="label">收货人</text>
						<input type="text" v-model="form.name" placeholder="请输入收货人姓名" class="input" />
					</view>
					<view class="form-item">
						<text class="label">手机号</text>
						<input type="number" v-model="form.mobile" placeholder="请输入手机号" class="input" />
					</view>
					<view class="form-item">
						<text class="label">收货地址</text>
						<textarea v-model="form.address" placeholder="请输入详细地址" class="textarea" />
					</view>
				</view>
				<view class="popup-footer">
					<view class="total">
						<text class="label">所需积分</text>
						<text class="value">{{needPoints}}</text>
					</view>
					<view class="confirm-btn" @click="submitExchange">确认兑换</view>
				</view>
			</view>
		</uni-popup>
	</view>
    </view>
</template>

<script>
	import { mapState } from 'vuex'
	
	export default {
		data() {
			return {
				id: '',
				isLoading: true,
				goodsInfo: {},
				num: 1,
				form: {
					name: '',
					mobile: '',
					address: ''
				},
				totalPoints: 0 // 用户总积分
			}
		},
		computed: {
			...mapState({
				userInfo: state => state.user.userInfo
			}),
			// 用户积分
			userPoints() {
				return this.userInfo ? Number(this.userInfo.points || 0) : 0
			},
			// 是否可以兑换
			canExchange() {
				if (!this.goodsInfo) return false
				return this.goodsInfo.stock > 0 && this.totalPoints >= Number(this.goodsInfo.points || 0)
			},
			// 所需积分
			needPoints() {
				if (!this.goodsInfo) return 0
				return Number(this.goodsInfo.points || 0) * this.num
			}
		},
		onLoad(options) {
			this.id = options.id
			this.getGoodsDetail()
			this.getPointsSummary()
		},
		methods: {
			// 获取积分概况
			async getPointsSummary() {
				try {
					const res = await this.$util.request('points.summary')
					if (res.code === 1) {
						this.totalPoints = Number(res.data.total_points || 0)
					}
				} catch (e) {
					console.error('获取积分失败', e)
				}
			},
			// 获取商品详情
			async getGoodsDetail() {
				this.isLoading = true
				try {
					const res = await this.$util.request('points.goodsDetail', {
						id: this.id
					})
					
					if (res.code === 1) {
						this.goodsInfo = res.data
						// 如果商品已下架，显示提示
						if (this.goodsInfo.status !== 1) {
							uni.showToast({
								title: '商品已下架',
								icon: 'none'
							})
							setTimeout(() => {
								uni.navigateBack()
							}, 1500)
							return
						}
					} else {
						uni.showToast({
							title: res.msg || '获取失败',
							icon: 'none'
						})
					}
				} catch (e) {
					uni.showToast({
						title: '获取失败',
						icon: 'none'
					})
				} finally {
					this.isLoading = false
				}
			},
			// 显示兑换弹窗
			showExchangePopup() {
				if (!this.canExchange) {
					if (this.goodsInfo.stock <= 0) {
						uni.showToast({
							title: '商品库存不足',
							icon: 'none'
						})
					} else {
						uni.showToast({
							title: '积分不足',
							icon: 'none'
						})
					}
					return
				}
				// 重新获取最新积分
				this.getPointsSummary().then(() => {
					if (this.canExchange) {
						this.$refs.exchangePopup.open()
					} else {
						uni.showToast({
							title: '积分不足',
							icon: 'none'
						})
					}
				})
			},
			// 关闭兑换弹窗
			closeExchangePopup() {
				this.$refs.exchangePopup.close()
			},
			// 修改数量
			changeNum(delta) {
				const newNum = this.num + delta
				if (newNum >= 1 && newNum <= this.goodsInfo.stock) {
					this.num = newNum
				}
			},
			// 提交兑换
			async submitExchange() {
				if (!this.form.name) {
					uni.showToast({
						title: '请输入收货人姓名',
						icon: 'none'
					})
					return
				}
				if (!this.form.mobile) {
					uni.showToast({
						title: '请输入手机号',
						icon: 'none'
					})
					return
				}
				if (!this.form.address) {
					uni.showToast({
						title: '请输入收货地址',
						icon: 'none'
					})
					return
				}
				
				try {
					const res = await this.$util.request('points.createOrder', {
						goods_id: this.id,
						num: this.num,
						...this.form
					})
					
					if (res.code === 1) {
						uni.showToast({
							title: '兑换成功',
							icon: 'success'
						})
						this.closeExchangePopup()
						// 跳转到订单列表
						setTimeout(() => {
							uni.redirectTo({
								url: '/pages/mine/points/mall/orders'
							})
						}, 1500)
					} else {
						uni.showToast({
							title: res.msg || '兑换失败',
							icon: 'none'
						})
					}
				} catch (e) {
					uni.showToast({
						title: '兑换失败',
						icon: 'none'
					})
				}
			}
		}
	}
</script>

<style lang="scss">
	.goods-detail {
		min-height: 100vh;
		background: #f5f5f5;
		padding-bottom: 120rpx;
		
		.loading-box {
			margin-top: 200rpx;
		}
		
		.goods-info {
			background: #ffffff;
			
			.goods-image {
				width: 100%;
				height: 600rpx;
			}
			
			.info-content {
				padding: 30rpx;
				
				.goods-name {
					font-size: 32rpx;
					color: #333;
					line-height: 44rpx;
					margin-bottom: 20rpx;
				}
				
				.goods-points {
					margin-bottom: 16rpx;
					
					.points {
						font-size: 40rpx;
						color: #325DFF;
						font-weight: bold;
					}
					
					.unit {
						font-size: 26rpx;
						color: #325DFF;
						margin-left: 4rpx;
					}
				}
				
				.goods-stock {
					font-size: 26rpx;
					color: #999;
				}
			}
		}
		
		.goods-content {
			background: #ffffff;
			margin-top: 20rpx;
			padding: 30rpx;
			
			.content-title {
				font-size: 30rpx;
				color: #333;
				font-weight: bold;
				margin-bottom: 20rpx;
			}
		}
		
		.footer-bar {
			position: fixed;
			left: 0;
			right: 0;
			bottom: 0;
			height: 100rpx;
			background: #ffffff;
			display: flex;
			align-items: center;
			padding: 0 30rpx;
			box-shadow: 0 -2rpx 10rpx rgba(0,0,0,0.05);
			
			.my-points {
				flex: 1;
				
				.label {
					font-size: 26rpx;
					color: #666;
					margin-right: 12rpx;
				}
				
				.value {
					font-size: 32rpx;
					color: #325DFF;
					font-weight: bold;
				}
			}
			
			.exchange-btn {
				width: 240rpx;
				height: 72rpx;
				background: #325DFF;
				color: #ffffff;
				font-size: 28rpx;
				border-radius: 36rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				
				&.disabled {
					background: #cccccc;
				}
				
				&:active {
					opacity: 0.8;
				}
			}
		}
		
		.exchange-popup {
			background: #ffffff;
			border-radius: 24rpx 24rpx 0 0;
			
			.popup-header {
				display: flex;
				align-items: center;
				justify-content: space-between;
				padding: 30rpx;
				border-bottom: 1px solid #f5f5f5;
				
				.title {
					font-size: 32rpx;
					color: #333;
					font-weight: bold;
				}
				
				.close {
					font-size: 40rpx;
					color: #999;
					padding: 0 20rpx;
				}
			}
			
			.popup-content {
				padding: 30rpx;
				max-height: 800rpx;
				overflow-y: auto;
				
				.goods-info {
					display: flex;
					margin-bottom: 30rpx;
					
					.goods-image {
						width: 160rpx;
						height: 160rpx;
						border-radius: 12rpx;
						margin-right: 20rpx;
					}
					
					.info-right {
						flex: 1;
						
						.goods-name {
							font-size: 28rpx;
							color: #333;
							line-height: 40rpx;
							margin-bottom: 16rpx;
						}
						
						.goods-points {
							.points {
								font-size: 36rpx;
								color: #325DFF;
								font-weight: bold;
							}
							
							.unit {
								font-size: 24rpx;
								color: #325DFF;
								margin-left: 4rpx;
							}
						}
					}
				}
				
				.form-item {
					margin-bottom: 30rpx;
					
					.label {
						font-size: 28rpx;
						color: #333;
						margin-bottom: 16rpx;
						display: block;
					}
					
					.input {
						width: 100%;
						height: 80rpx;
						background: #f5f5f5;
						border-radius: 12rpx;
						padding: 0 24rpx;
						font-size: 28rpx;
					}
					
					.textarea {
						width: 100%;
						height: 160rpx;
						background: #f5f5f5;
						border-radius: 12rpx;
						padding: 24rpx;
						font-size: 28rpx;
					}
					
					.number-box {
						display: flex;
						align-items: center;
						
						.minus, .plus {
							width: 60rpx;
							height: 60rpx;
							background: #f5f5f5;
							border-radius: 30rpx;
							display: flex;
							align-items: center;
							justify-content: center;
							font-size: 36rpx;
							color: #333;
							
							&.disabled {
								color: #999;
							}
						}
						
						.input {
							width: 100rpx;
							text-align: center;
							margin: 0 20rpx;
						}
					}
				}
			}
			
			.popup-footer {
				padding: 30rpx;
				border-top: 1px solid #f5f5f5;
				display: flex;
				align-items: center;
				justify-content: space-between;
				
				.total {
					.label {
						font-size: 26rpx;
						color: #666;
						margin-right: 12rpx;
					}
					
					.value {
						font-size: 36rpx;
						color: #325DFF;
						font-weight: bold;
					}
				}
				
				.confirm-btn {
					width: 240rpx;
					height: 72rpx;
					background: #325DFF;
					color: #ffffff;
					font-size: 28rpx;
					border-radius: 36rpx;
					display: flex;
					align-items: center;
					justify-content: center;
					
					&:active {
						opacity: 0.8;
					}
				}
			}
		}
	}
</style> 