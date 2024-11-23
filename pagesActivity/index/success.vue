<template>
	<view class="container" :style="{'--theme-color': themeColor}">
		<!-- 标题栏 -->
		<title-bar :showBack="true" title="支付成功"></title-bar>
		<!-- 内容区 -->
		<view class="container-main" v-if="loadEnd">
			<view class="main-image">
				<image class="icon" src="/static/check.png" mode="aspectFit"></image>
			</view>
			<view class="main-title" v-if="freeType == 1">报名成功</view>
			<view class="main-title" v-else>支付成功</view>
			<view class="main-subtitle">请前往个人中心查看活动详情</view>
			<view class="main-btn" @click="toOrder">前往查看</view>
			<view class="main-back" @click="toIndex">返回首页</view>
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
				// 支付类型
				payType: null,
				// 是否免费
				freeType: null
			}
		},
		onLoad(option) {
			this.payType = option.type
			this.freeType = option.freeType
			this.$nextTick(() => {
				this.loadEnd = true
			})
		},
		computed: {
			...mapState({
				themeColor: state => state.app.themeColor,
			})
		},
		methods: {
			// 跳转我的活动
			toOrder() {
				this.$util.toPage({
					mode: 2,
					path: "/pagesActivity/order/index"
				})
			},
			// 返回首页
			toIndex() {
				uni.switchTab({
					url: "/pages/index/index"
				})
			},
		}
	}
</script>

<style lang="scss">
	page {
		background: #ffffff;
	}

	.container {
		.container-main {
			padding: 144rpx 48rpx 32rpx;

			.main-image {
				width: 200rpx;
				height: 200rpx;
				margin: 0 auto;
				padding: 48rpx;
				background: var(--theme-color);
				border-radius: 50%;
			}

			.main-title {
				color: #333;
				font-size: 36rpx;
				font-weight: 600;
				line-height: 50rpx;
				margin-top: 48rpx;
				text-align: center;
			}

			.main-subtitle {
				color: #999;
				font-size: 24rpx;
				line-height: 34rpx;
				margin-top: 24rpx;
				text-align: center;
			}

			.main-btn {
				color: #FFF;
				font-size: 32rpx;
				line-height: 44rpx;
				padding: 34rpx;
				border-radius: 16rpx;
				text-align: center;
				margin-top: 48rpx;
				background: var(--theme-color);
			}

			.main-back {
				color: #979797;
				font-size: 32rpx;
				line-height: 44rpx;
				padding: 32rpx;
				text-align: center;
				margin-top: 16rpx;
			}
		}
	}
</style>