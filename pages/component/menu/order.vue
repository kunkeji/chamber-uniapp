
<template>
	<view class="component-menu-order">
		<view class="order-cloumn" :style="{width: boxWidth}" v-for="(item, index) in showData" :key="index">
			<view class="cloumn-item" @click="toPage(item.info)">
				<view class="item-image" :style="{width: iconWidth, height: iconWidth}">
					<image class="image" :src="item.image" mode="aspectFit"></image>
				</view>
				<view class="item-text" :style="{fontSize: fontSize}">{{item.text}}</view>
				<view class="item-count" v-if="userInfo.order && parseInt(userInfo.order[item.count]) > 0">{{parseInt(userInfo.order[item.count]) > 99 ? '99+' : userInfo.order[item.count]}}</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		mapState
	} from "vuex"
	export default {
		name: "menuOrder",
		props: {
			showData: {
				type: Array,
				default () {
					return []
				}
			},
			boxWidth: {
				type: String,
				default: "25%"
			},
			iconWidth: {
				type: String,
				default: "64rpx"
			},
			fontSize: {
				type: String,
				default: "24rpx"
			},
		},
		computed: {
			...mapState({
				userInfo: state => state.user.userInfo,
			})
		},
		methods: {
			// 跳转页面
			toPage(e) {
				this.$util.toPage(e)
			}
		},
	}
</script>

<style lang="scss">
	.component-menu-order {
		width: 100%;
		display: flex;

		.order-cloumn {
			width: 25%;

			.cloumn-item {
				margin: 0 auto;
				position: relative;

				.item-image {
					margin: 0 auto;

					.image {
						width: 100%;
						height: 100%;
					}
				}

				.item-text {
					text-align: center;
					line-height: 1.4;
					margin-top: 8rpx;
					color: #5A5B6E;
					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;
					word-break: break-all;
				}

				.item-count {
					position: absolute;
					top: -8rpx;
					left: 50%;
					margin-left: 16rpx;
					color: #FFF;
					text-align: center;
					font-size: 20rpx;
					line-height: 26rpx;
					padding: 0 8rpx;
					min-width: 26rpx;
					background: #FF4646;
					border-radius: 26rpx;
				}
			}
		}
	}
</style>