<template>
	<view class="component-carousel" :style="{height: height}">
		<swiper class="carousel-swiper" :style="{'border-radius': radius}" autoplay circular :interval="4000" :duration="500" @change="imgChange">
			<swiper-item v-for="(item, index) in showData" :key="index">
				<view class="swiper-item" :style="{'border-radius': radius}" @click="toDetails(index)">
					<image class="item-thumb" :src="item.image || item" mode="aspectFill"></image>
					<!-- <view class="item-title" v-if="item.title">{{item.title}}</view> -->
					<!-- #ifdef H5 -->
					<wx-open-launch-weapp class="item-absolute" :appid="stringifyToParse(item.content).appid" :path="stringifyToParse(item.content).path" v-if="item.jump_type == 3">
						<script type="text/wxtag-template">
							<style> .btn { position: absolute; top: 0; left: 0; right: 0; bottom: 0; } </style>
						  <view class="btn"></view>
						</script>
					</wx-open-launch-weapp>
					<!-- #endif -->
				</view>
			</swiper-item>
		</swiper>
		<view class="carousel-dots" :style="{right: right, bottom: bottom, '--theme-color': themeColor}">
			<view class="dots-item" :class="{active: imgIndex == index}" v-for="(item, index) in showData" :key="index"></view>
		</view>
	</view>
</template>

<script>
	import {
		mapState
	} from "vuex"
	export default {
		name: "carouselIndex",
		props: {
			// 组件内容
			showData: {
				type: Array,
				default () {
					return []
				}
			},
			// 组件高度
			height: {
				type: String,
				default: "334rpx",
			},
			// 组件圆角
			radius: {
				type: String,
				default: "16rpx",
			},
			// 指示点位置
			right: {
				type: String,
				default: "16rpx",
			},
			// 指示点距底部距离
			bottom: {
				type: String,
				default: "16rpx",
			},
		},
		data() {
			return {
				imgIndex: 0,
			};
		},
		computed: {
			...mapState({
				themeColor: state => state.app.themeColor
			})
		},
		methods: {
			// JSON字符串转对象
			stringifyToParse(str) {
				try {
					return JSON.parse(str)
				} catch (e) {
					return {}
				}
			},
			// 轮播图切换
			imgChange(e) {
				this.imgIndex = e.detail.current
			},
			// 跳转页面
			toDetails(index) {
				if (this.showData[index].jump_type == 1) {
					// 图文
					uni.navigateTo({
						url: "/pages/webview/imageText?type=1&id=" + this.showData[index].id
					})
				} else if (this.showData[index].jump_type == 2) {
					// 内部页面
					this.$util.toPage({
						path: this.showData[index].content,
						mode: 1,
					})
				} else if (this.showData[index].jump_type == 3) {
					// #ifdef MP-WEIXIN
					// 小程序
					this.$util.toPage({
						appId: JSON.parse(this.showData[index].content).appid,
						path: JSON.parse(this.showData[index].content).path,
						mode: 5,
					})
					// #endif
				} else if (this.showData[index].jump_type == 4) {
					// 外部链接
					this.$util.toPage({
						path: this.showData[index].content,
						mode: 4,
					})
				}
			},
		},
	}
</script>

<style lang="scss">
	.component-carousel {
		position: relative;
		width: 100%;

		.carousel-swiper {
			width: 100%;
			height: 100%;
			overflow: hidden;
			box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.1);

			.swiper-item {
				position: relative;
				display: block;
				width: 100%;
				height: 100%;
				transition: all 0.3s ease;

				.item-thumb {
					width: 100%;
					height: 100%;
					background-color: #f5f5f5;
					transition: transform 0.3s ease;
					
					&:hover {
						transform: scale(1.02);
					}
				}

				.item-title {
					position: absolute;
					bottom: 0;
					left: 0;
					right: 0;
					padding: 20rpx;
					background: linear-gradient(transparent, rgba(0,0,0,0.7));
					color: #fff;
					font-size: 28rpx;
				}

				.item-absolute {
					display: block;
					position: absolute;
					top: 0;
					left: 0;
					right: 0;
					bottom: 0;
				}
			}
		}

		.carousel-dots {
			position: absolute;
			z-index: 1;
			display: flex;
			padding: 12rpx;
			background: rgba(0,0,0,0.2);
			border-radius: 20rpx;

			.dots-item {
				width: 12rpx;
				height: 12rpx;
				border-radius: 50%;
				background: rgba(255,255,255,0.6);
				margin-right: 8rpx;
				transition: all 0.3s ease;

				&:last-child {
					margin-right: 0;
				}

				&.active {
					width: 24rpx;
					background: var(--theme-color);
					border-radius: 6rpx;
				}
			}
		}
	}
</style>