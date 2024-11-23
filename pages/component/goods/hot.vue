<template>
	<view class="recommend-box">
		<scroll-view ref="scrollView" scroll-x class="scroll-nav" @scrolltolower="nextPage">
			<view @click="toDetail(item.id)" class="nav-column" v-for="(item,index) in showData" :key="index">
				<image class="column-bg" :src="item.image" mode="aspectFill"></image>
				<view class="column-name">{{item.name}}</view>
				<view class="column-price" :style="{ color: themeColor }">￥{{item.price}}</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	import {
		mapState
	} from "vuex"
	export default {
		name: "goodsHot",
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
			// 下一页
			nextPage(e) {
				this.$emit("nextPage")
			},
			// 跳转详情页 
			toDetail(id) {
				this.$util.toPage({
					mode: 1,
					path: "/pagesMall/goods/details?id=" + id
				})
			},
		},
	}
</script>

<style lang="scss">
	.recommend-box {
		.scroll-nav {
			white-space: nowrap;

			.nav-column {
				width: 240rpx;
				display: inline-block;
				margin-left: 32rpx;
				background: #F6F7FB;
				box-shadow: 0px 0px 20rpx rgba(0, 0, 0, 0.04);
				border-radius: 20rpx;
				padding-bottom: 10rpx;
				overflow: hidden;

				&:first-child {
					margin-left: 0;
				}

				.column-bg {
					width: 100%;
					height: 200rpx;
					display: block;
				}

				.column-name {
					margin-top: 20rpx;
					font-weight: 600;
					font-size: 28rpx;
					line-height: 40rpx;
					color: #5A5B6E;
					padding: 0 16rpx;
					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;
					word-break: break-all;
				}

				.column-price {
					margin-top: 8rpx;
					font-weight: 600;
					font-size: 24rpx;
					line-height: 34rpx;
					color: #325DFF;
					padding: 0 16rpx;
				}
			}
		}
	}
</style>