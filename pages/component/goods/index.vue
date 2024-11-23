<template>
	<view class="component-goods flex flex-wrap justify-content-between">
		<view class="goods-item" v-for="item in showData" :key="item.id" @click="toDetail(item.id)">
			<image class="item-image" :src="item.image" mode="aspectFill"></image>
			<view class="item-name text-ellipsis-more">{{item.name}}</view>
			<view class="item-price" :style="{ color: themeColor }">￥{{item.price}}</view>
		</view>
	</view>
</template>

<script>
	import {
		mapState
	} from "vuex"
	export default {
		name: "goodsIndex",
		props: ["showData"],
		data() {
			return {

			};
		},
		computed: {
			...mapState({
				themeColor: state => state.app.themeColor,
			})
		},
		methods: {
			// 跳转详情页
			toDetail(id) {
				this.$util.toPage({
					mode: 1,
					path: "/pagesMall/goods/details?id=" + id
				})
			}
		}
	}
</script>

<style lang="scss">
	.component-goods {
		.goods-item {
			width: calc(50% - 16rpx);
			border-radius: 20rpx;
			overflow: hidden;
			background: #FFFFFF;
			// box-shadow: 0 0 20rpx rgba(0, 0, 0, 0.05);
			border-radius: 20rpx;
			padding-bottom: 20rpx;
			margin-top: 20rpx;

			&:first-child,
			&:nth-child(2) {
				margin-top: 0;
			}

			.item-image {
				width: 100%;
				height: 296rpx;
			}

			.item-name {
				font-weight: 600;
				font-size: 28rpx;
				line-height: 40rpx;
				height: 80rpx;
				color: #000000;
				margin-top: 16rpx;
				padding: 0 16rpx;
			}

			.item-price {
				margin-top: 16rpx;
				font-weight: 600;
				font-size: 28rpx;
				line-height: 40rpx;
				padding: 0 16rpx;
			}
		}
	}
</style>