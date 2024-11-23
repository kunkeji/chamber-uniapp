<template>
	<view class="container">
		<!-- 标题栏 -->
		<title-bar :showBack="true" :title="type == 1 ? '提交成功' : '支付成功'"></title-bar>
		<!-- 内容区 -->
		<view class="container-main" v-if="loadEnd">
			<!-- type=0时,跳我的订单 -->
			<view class="main-pay" v-if="type == 0">
				<view class="image" :style="{background: themeColor}">
					<image src="/static/check.png" mode="aspectFit"></image>
				</view>
				<view class="text_black">
					支付成功
				</view>
				<view class="text_size_28">
					请前往我的订单查看订单详情
				</view>
				<view class="back" @click="goOrderDetail(0)" :style="{background: themeColor}">
					前往查看
				</view>
				<view class="text_size_32" @click="backHome">
					返回首页
				</view>
			</view>
			<!-- type=1时,跳退款列表 -->
			<view class="main-pay" v-if="type == 1">
				<view class="image" :style="{background: themeColor}">
					<image src="/static/check.png" mode="aspectFit"></image>
				</view>
				<view class="text_black">
					提交成功
				</view>
				<view class="text_size_28">
					请前往退款列表查看退款进度
				</view>
				<view class="back" @click="goOrderDetail(1)" :style="{background: themeColor}">
					前往查看
				</view>
				<view class="text_size_32" @click="backHome">
					返回首页
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		mapState
	} from "vuex"
	export default {
		data() {
			return {
				// 加载完成
				loadEnd: false,
				// 详情id
				id: 0,
				// 类型 
				type: 0,
			}
		},
		onLoad(option) {
			this.$nextTick(() => {
				this.loadEnd = true
			})
			this.id = option.id
			this.type = option.type
		},
		computed: {
			...mapState({
				themeColor: state => state.app.themeColor
			})
		},
		methods: {
			// 前往我的订单
			goOrderDetail(type) {
				switch (type) {
					case 0:
						this.$util.toPage({
							mode: 2,
							path: "/pagesMall/order/list"
						})
						break;
					case 1:
						this.$util.toPage({
							mode: 2,
							path: "/pagesMall/order/refundList"
						})
						break;
				}
			},
			// 返回首页
			backHome() {
				uni.switchTab({
					url: "/pages/index/index"
				})
			}
		}
	}
</script>

<style lang="scss">
	page {
		background: #FFF;
	}

	.container {
		.container-main {
			.main-pay {
				padding: 0 24rpx;
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;

				.image {
					margin-top: 96rpx;
					width: 160rpx;
					height: 160rpx;
					border-radius: 50%;
					padding: 40rpx;
				}

				.back {
					margin-top: 64rpx;
					padding: 22rpx 0rpx 22rpx;
					width: 100%;
					line-height: 44rpx;
					color: #FFF;
					font-size: 32rpx;
					text-align: center;
					border-radius: 16rpx;
				}

				.text_black {
					margin-top: 32rpx;
					color: #000000;
					font-size: 36rpx;
					line-height: 50rpx;
				}

				.text_size_28 {
					margin-top: 16rpx;
					color: #979797;
					font-size: 28rpx;
					line-height: 40rpx;
				}

				.text_size_32 {
					margin-top: 48rpx;
					color: #979797;
					font-size: 32rpx;
					line-height: 44rpx;
				}
			}
		}
	}
</style>