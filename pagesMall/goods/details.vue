<template>
	<view class="container">
		<!-- 标题栏 -->
		<title-bar :showBack="true" title="商品详情"></title-bar>
		<!-- 内容区 -->
		<view class="container-main" v-if="loadEnd">
			<!-- 顶部轮播图 -->
			<carousel :show-data="carouselList" height="660rpx" radius="0rpx"></carousel>
			<!-- 商品规格 -->
			<view class="main-specs">
				<view class="main-specs-price">
					<view class="price" :style="{ color: themeColor }">
						<view class="symbol">￥</view>
						<view class="value">{{goodsDetails.price}}</view>
					</view>
					<view class="old-price">￥{{goodsDetails.oldPrice}}</view>
				</view>
				<view class="main-specs-introduce">
					{{goodsDetails.name}}
				</view>
				<view class="main-specs-parameter" @click="handleExpand()">
					<view class="title">参数</view>
					<view class="value" id="text" :class="{'text-ellipsis' : !isExpand}">
						{{goodsDetails.paramJson}}
					</view>
					<view class="more" :class="{rotate : isExpand}" v-if="isMultiLine">
						<image src="/static/mall/icon-down.png" mode="widthFix"></image>
					</view>
				</view>
			</view>
			<!-- 商品详情 -->
			<view class="main-details">
				<view class="main-details-title">
					商品详情
				</view>
				<mp-html :content="goodsDetails.content" />
			</view>
			<!-- 底部按钮 -->
			<view class="main-bottom">
				<view class="flex">
					<!-- #ifdef MP-WEIXIN -->
					<button class="main-bottom-share" open-type="share">
						<image src="/static/share.png" mode="aspectFit" class="shareImg"></image>
						<view class="shareTxt">
							分享
						</view>
					</button>
					<!-- #endif -->
					<view class="main-bottom-button" :style="{ background: themeColor }" @click="toOrder()">立即购买</view>
				</view>
				<view class="safe-padding"></view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		mapState
	} from "vuex"
	// #ifdef H5
	import wx from 'weixin-js-sdk';
	// #endif
	import carousel from "@/pages/component/carousel/carousel.vue"
	export default {
		components: {
			carousel
		},
		data() {
			return {
				// 是否加载完成
				loadEnd: false,
				// 商品Id 
				goodsId: '',
				// 商品详情
				goodsDetails: {},
				// 商品参数是否展开
				isExpand: false,
				// 商品参数是否存在多行
				isMultiLine: true,
				// 轮播图列表
				carouselList: [],
			}
		},
		computed: {
			...mapState({
				themeColor: state => state.app.themeColor,
			})
		},
		onLoad(option) {
			this.goodsId = option.id
			uni.showLoading({
				title: "加载中"
			})
			this.getGoodsDetails(() => {
				uni.hideLoading()
				this.loadEnd = true
				// #ifdef H5
				this.initConfig()
				// #endif
			})
		},
		onShareAppMessage() {
			return {
				title: this.goodsDetails.name,
				path: '/pagesMall/goods/details?id=' + this.goodsId,
				imageUrl: this.carouselList[0].image,
			}
		},
		onShareTimeline() {
			return {
				title: this.goodsDetails.name,
				path: '/pagesMall/goods/details?id=' + this.goodsId,
				imageUrl: this.carouselList[0].image,
			}
		},
		methods: {
			// #ifdef H5
			// 微信公众号初始化方法
			initConfig() {
				this.$util.request("main.WeChatConfig", {
					url: location.href.split("?")[0]
				}).then(res => {
					if (res.code == 1) {
						wx.config({
							debug: false,
							appId: res.data.appId,
							timestamp: Number(res.data.timestamp),
							nonceStr: res.data.nonceStr,
							signature: res.data.signature,
							jsApiList: ["updateAppMessageShareData", "updateTimelineShareData", "wx-open-launch-weapp"],
							openTagList: ["updateAppMessageShareData", "updateTimelineShareData", 'wx-open-launch-weapp'],
						})
						wx.ready(() => {
							wx.updateAppMessageShareData({
								title: this.goodsDetails.name,
								desc: "",
								link: window.location.href,
								imgUrl: this.carouselList[0].image,
							});
							wx.updateTimelineShareData({
								title: this.goodsDetails.name,
								link: window.location.href,
								imgUrl: this.carouselList[0].image,
							});
						});
					} else {
						uni.hideLoading()
						uni.showToast({
							title: res.msg,
							icon: 'none'
						})
					}
				}).catch(error => {
					uni.hideLoading()
					console.error('通过config接口注入权限验证配置 ', error)
				})
			},
			// #endif
			// 获取商品详情
			getGoodsDetails(fn) {
				this.$util.request("mall.goodsDetails", {
					id: this.goodsId
				}).then(res => {
					if (fn) fn()
					if (res.code == 1) {
						this.goodsDetails = res.data
						this.goodsDetails.oldPrice = res.data.ot_price
						let temp_data = (res.data.slider_images).split(",")
						for (var i = 0; i < temp_data.length; i++) {
							let item = {
								id: i + 1,
								image: temp_data[i]
							}
							this.carouselList.push(item)
						}
						let paramJsons = JSON.parse(this.goodsDetails.param_json);
						let tempJson = "";
						for (let key in paramJsons) {
							tempJson += key + ':' + paramJsons[key] + ' ';
						}
						this.goodsDetails.paramJson = tempJson.trim();
					} else {
						uni.showToast({
							title: res.msg,
							icon: 'none'
						})
					}
				}).catch(error => {
					if (fn) fn()
					console.error('获取商品详情', error)
				})
			},
			// 前往订单确认 
			toOrder() {
				this.$util.toPage({
					mode: 1,
					path: "/pagesMall/goods/order?id=" + this.goodsId
				})
			},
			// 展示更多切换事件
			handleExpand() {
				this.isExpand = !this.isExpand
			},
			// 获取文字是否存在折叠
			getCollapse(fn) {
				uni.createSelectorQuery().select('#text').boundingClientRect((rect) => {
					let lineHeight = parseInt(rect.height / uni.upx2px(40));
					if (lineHeight > 1) {
						this.isMultiLine = true
						this.isExpand = false
					} else {
						this.isMultiLine = false
						this.isExpand = true
					}
					fn()
				}).exec();
			},
		}
	}
</script>

<style lang="scss">
	.container {
		.container-main {
			.main-specs {
				z-index: 99;
				flex-shrink: 0;
				margin-top: -74rpx;
				padding: 32rpx 40rpx;
				border-radius: 40rpx 40rpx 0 0;
				background: #FFF;
				display: flex;
				flex-direction: column;
				position: relative;

				.main-specs-price {
					display: flex;
					align-items: flex-end;

					.price {
						display: flex;
						font-weight: 600;

						.symbol {
							align-self: flex-end;
							font-size: 28rpx;
							line-height: 28rpx;
						}

						.value {
							font-size: 48rpx;
							line-height: 48rpx;
						}
					}

					.old-price {
						margin-left: 24rpx;
						color: #8D929C;
						font-size: 28rpx;
						text-decoration-line: line-through; //文本装饰 字体删除线
					}
				}

				.main-specs-introduce {
					margin-top: 32rpx;
					font-size: 32rpx;
					font-weight: 600;
					color: #5A5B6E;
				}

				.main-specs-parameter {
					margin-top: 32rpx;
					display: flex;

					.title {
						color: #5A5B6E;
						font-size: 28rpx;
						line-height: 40rpx;
						font-weight: 600;
						width: 64rpx;
						margin-right: 24rpx
					}

					.value {
						flex: 1;
						color: #8D929C;
						font-size: 28rpx;
						line-height: 40rpx;
						overflow: hidden;
					}

					.text-ellipsis {
						white-space: nowrap;
						overflow: hidden;
						text-overflow: ellipsis;
						word-break: break-all;
					}

					.more {
						width: 24rpx;
						height: 40rpx;
						margin-left: 24rpx;
						display: flex;
						align-items: center;
						justify-content: flex-end;

						&.rotate {
							transform: rotate(180deg);
						}

						image {
							width: 100%;
							height: 100%;
						}
					}
				}
			}

			.main-details {
				flex: 1;
				display: flex;
				flex-direction: column;
				padding: 48rpx 40rpx 132rpx;
				background: #FFFFFF;

				.main-details-title {
					font-size: 28rpx;
					font-weight: 600;
					padding-bottom: 16rpx;
					color: #5A5B6E;
				}

				.empty {
					display: flex;
					flex-direction: column;
					justify-content: center;
					align-items: center;

					.goods-empty {
						width: 360rpx;
						height: 360rpx;
					}

					.text {
						padding: 8rpx;
						font-size: 24rpx;
						color: #8D929C;
					}
				}
			}

			.main-bottom {
				position: fixed;
				bottom: 0;
				width: 100%;
				text-align: center;
				background: #FFF;
				padding: 16rpx 24rpx;
				z-index: 1;

				.main-bottom-share {
					background-color: transparent;
					margin-right: 28rpx;

					.shareTxt {
						font-size: 20rpx;
						line-height: 28rpx;
						color: #5A5B6E;
					}

					.shareImg {
						width: 52rpx;
						height: 52rpx;
					}
				}

				.main-bottom-button {
					flex: 1;
					height: 80rpx;
					background: #999999;
					color: rgba(255, 255, 255, 1);
					text-align: center;
					line-height: 80rpx;
					border-radius: 16rpx;
				}

			}
		}
	}
</style>