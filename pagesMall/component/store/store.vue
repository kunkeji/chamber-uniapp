<template>
	<view class="component-store-index">
		<view class="store-index-content">
			<image class="content-image" :src="showData.images" mode="aspectFill"></image>
			<view class="content-goods">
				<view class="goods-name text-ellipsis-more">{{showData.name}}</view>
				<view class="goods-info">
					<view class="goods-info-price">
						<view class="price-symbol" :style="{ color: themeColor }">￥</view>
						<view class="price-number" :style="{ color: themeColor }">{{showData.price}}</view>
					</view>
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
		props: ["showData"],
		data() {
			return {

			}
		},
		computed: {
			...mapState({
				themeColor: state => state.app.themeColor,
			})
		},
	}
</script>

<style lang="scss">
	.component-store-index {
		margin-top: 32rpx;
		border-radius: 20rpx;
		background: #FFF;

		.store-index-content {
			padding: 32rpx;
			display: flex;
			align-items: center;

			.content-image {
				flex-shrink: 0;
				width: 160rpx;
				height: 160rpx;
				border-radius: 20rpx;
			}

			.content-goods {
				flex: 1;
				height: 160rpx;
				margin-left: 32rpx;
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				overflow: hidden;

				.goods-name {
					color: #5A5B6E;
					font-size: 28rpx;
					line-height: 40rpx;
				}

				.goods-info {
					display: flex;
					justify-content: space-between;
					align-items: center;

					.goods-info-price {
						display: flex;
						align-items: center;

						.price-symbol {
							color: #E60012;
							font-size: 24rpx;
							font-weight: 600;
							line-height: 24rpx;
							align-self: flex-end;
						}

						.price-number {
							color: #E60012;
							font-size: 40rpx;
							font-weight: 600;
							line-height: 40rpx;
						}
					}

					.goods-info-number {
						align-self: flex-end;
						color: #5A5B6E;
						font-size: 28rpx;
						line-height: 28rpx;
					}
				}
			}
		}
	}
</style>