<template>
	<view class="component-article">
		<view class="article-item flex" :class="{special: showType == 1}" v-for="item in showData" :key="item.id" @click="toDetails(item)">
			<image class="item-image" :src="item.image" mode="aspectFill"></image>
			<view class="item-box flex-item flex-direction-column justify-content-between">
				<view class="title text-ellipsis-more">{{item.title}}</view>
				<view class="time">{{item.createtime}}</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "articleIndex",
		props: ["showData", "showType"],
		data() {
			return {

			};
		},
		methods: {
			// 跳转详情
			toDetails(item) {
				if (item.type == 2) {
					this.$util.toPage({
						mode: 4,
						path: item.link,
					})
				} else {
					this.$util.toPage({
						mode: 1,
						path: "/pages/article/details?id=" + item.id
					})
				}
			},
		}
	}
</script>

<style lang="scss">
	.component-article {
		.article-item {
			margin-top: 32rpx;
			background: #ffffff;
			border-radius: 10rpx;
			padding: 32rpx;

			&:first-child {
				margin-top: 0;
			}

			&.special {
				background: transparent;
				border-radius: 0;
				padding: 0;
			}

			.item-image {
				width: 220rpx;
				height: 192rpx;
				border-radius: 10rpx;
			}

			.item-box {
				margin-left: 16rpx;

				.title {
					color: #5A5B6E;
					font-size: 28rpx;
					line-height: 40rpx;
				}

				.time {
					color: #999999;
					font-size: 28rpx;
					line-height: 40rpx;
				}
			}
		}
	}
</style>