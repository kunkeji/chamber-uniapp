<template>
	<view class="container">
		<!-- 标题栏 -->
		<title-bar title="商城"></title-bar>
		<!-- 内容区 -->
		<view class="container-main" v-if="loadEnd">
			<!-- 顶部轮播图 -->
			<view class="main-carousel">
				<carousel :show-data="carouselList" height="280rpx" radius="20rpx"></carousel>
			</view>
			<!-- 商品分类 -->
			<view class="main-screen">
				<scroll-view scroll-x class="screen-scroll">
					<view class="screen-item" v-for="(item,index) in screenList" :key="index" @click="toDetails(item)">
						<view class="screen-item-img">
							<image :src="item.image" mode="aspectFill" class="screen-item-img-size"></image>
						</view>
						<view class="screen-item-txt text-ellipsis">{{ item.name }}</view>
					</view>
				</scroll-view>
			</view>
			<!-- 热销产品 -->
			<view class="main-column" v-if="hotGoods && hotGoods.length">
				<view class="main-title">
					<text class="main-title-txt">热销商品</text>
					<view class="main-title-hot-label">
						<text>热销</text>
						<image src="/static/mall/icon_hot.png" mode="aspectFit"></image>
					</view>
				</view>
				<hot-goods :show-data="hotGoods" @nextPage="hotNextPage()"></hot-goods>
			</view>
			<!-- 商品列表 -->
			<view class="main-column">
				<view class="main-title">
					<text class="main-title-txt">商品列表</text>
				</view>
				<goods-list ref="goodsList" v-if="goodsList.length"></goods-list>
				<empty top="0%" title="暂无商品~" v-else></empty>
			</view>
		</view>
		<!-- 底部导航 -->
		<tab-bar></tab-bar>
	</view>
</template>

<script>
	import {
		mapState
	} from "vuex"
	import carousel from "@/pages/component/mall/carousel.vue"
	import hotGoods from '@/pages/component/goods/hot.vue'
	import goodsList from '@/pages/component/goods/list.vue'
	// #ifdef H5
	import wx from 'weixin-js-sdk';
	// #endif
	export default {
		components: {
			carousel,
			hotGoods,
			goodsList
		},
		data() {
			return {
				// 加载完成
				loadEnd: false,
				// 轮播图列表
				carouselList: [],
				// 商品分类列表
				screenList: [],
				// 商品列表
				goodsList: [],
				// 当前分页-推荐
				recPage: 1,
				// 限制数量-推荐
				recLimit: 10,
				// 是否有下一页-推荐
				recHasMore: false,
				// 热销产品列表
				hotGoods: [],
				// 当前分页-热销
				hotPage: 1,
				// 是否有下一页-热销
				hotHasMore: false,
				// 限制数量-热销
				hotLimit: 10,
			}
		},
		computed: {
			...mapState({
				themeColor: state => state.app.themeColor,
				shareImage: state => state.app.shareImage,
				shareTitle: state => state.app.shareTitle,
			})
		},
		onLoad() {
			uni.showLoading({
				title: "加载中"
			})
			// 获取轮播图
			this.getCarousel()
			// 获取商品分类
			this.getCategoay()
			// 获取商品列表
			this.getRecGoodsList(() => {
				uni.hideLoading()
				this.loadEnd = true
			});
			this.getHotGoodsList()
			// #ifdef H5
			this.initConfig()
			// #endif
		},
		onPullDownRefresh() {
			this.recPage = 1
			if (this.goodsList.length) this.$refs.goodsList.clearList()
			this.hotPage = 1
			// 获取轮播图
			this.getCarousel()
			// 获取商品分类
			this.getCategoay()
			this.getRecGoodsList(() => {
				uni.stopPullDownRefresh();
			});
			this.getHotGoodsList()
		},
		onReachBottom() {
			if (this.recHasMore) {
				this.recPage++
				this.getRecGoodsList();
			}
		},
		onShareAppMessage() {
			return {
				title: this.shareTitle,
				imageUrl: this.shareImage,
			}
		},
		onShareTimeline() {
			return {
				title: this.shareTitle,
				imageUrl: this.shareImage,
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
							jsApiList: ["updateAppMessageShareData", "updateTimelineShareData"],
							openTagList: ["updateAppMessageShareData", "updateTimelineShareData"],
						})
						wx.ready(() => {
							wx.updateAppMessageShareData({
								title: this.shareTitle,
								desc: "",
								link: window.location.href,
								imgUrl: this.shareImage,
							});
							wx.updateTimelineShareData({
								title: this.shareTitle,
								link: window.location.href,
								imgUrl: this.shareImage,
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
			//获取热销商品
			getHotGoodsList() {
				this.$util.request("mall.goodsList", {
					is_hot: 1,
					page: this.hotPage,
					limit: this.hotLimit
				}).then(res => {
					if (res.code == 1) {
						let list = res.data.data
						this.hotHasMore = this.hotPage < res.data.total / this.hotLimit ? true : false
						this.hotGoods = this.hotPage == 1 ? list : [...this.hotGoods, ...list];
					} else {
						uni.showToast({
							title: res.msg,
							icon: 'none'
						})
					}
				}).catch(error => {
					console.error('获取热销商品', error)
				})
			},
			//获取商品列表
			getRecGoodsList(fn) {
				this.$util.request("mall.goodsList", {
					page: this.recPage,
					limit: this.recLimit
				}).then(res => {
					if (fn) fn()
					if (res.code == 1) {
						let list = res.data.data
						this.recHasMore = this.recPage < res.data.total / this.recLimit ? true : false
						this.goodsList = this.recPage == 1 ? list : [...this.goodsList, ...list];
						this.$nextTick(() => {
							if (this.goodsList.length) this.$refs.goodsList.getList(this.goodsList)
						})
					} else {
						uni.showToast({
							title: res.msg,
							icon: 'none'
						})
					}
				}).catch(error => {
					console.error('获取商品列表', error)
				})
			},
			// 获取商品分类
			getCategoay() {
				this.$util.request("mall.categoay").then(res => {
					if (res.code == 1) {
						this.screenList = res.data
					} else {
						uni.showToast({
							title: res.msg,
							icon: 'none'
						})
					}
				}).catch(error => {
					console.error('获取商品分类', error)
				})
			},
			// 获取轮播图
			getCarousel() {
				this.$util.request("mall.carousel").then(res => {
					if (res.code == 1) {
						this.carouselList = res.data
					} else {
						uni.showToast({
							title: res.msg,
							icon: 'none'
						})
					}
				}).catch(error => {
					console.error('获取轮播图', error)
				})
			},
			// 跳转详情
			toDetails(item) {
				this.$util.toPage({
					mode: 1,
					path: "/pagesMall/goods/list?id=" + item.id + "&name=" + item.name
				})
			},
			// 热销产品下一页
			hotNextPage() {
				if (this.hotHasMore) {
					this.hotPage++
					this.getHotGoodsList()
				}
			},
		}
	}
</script>

<style lang="scss">
	.container {
		.container-main {
			padding: 32rpx;

			.main-carousel {
				padding-bottom: 32rpx;
			}

			.main-screen {
				padding: 32rpx;
				border-radius: 20rpx;
				background: #FFFFFF;

				.screen-scroll {
					white-space: nowrap;

					.screen-item {
						width: 25%;
						display: inline-block;
						text-align: center;

						.screen-item-img {
							display: inline-block;
							vertical-align: middle;

							.screen-item-img-size {
								width: 96rpx;
								height: 96rpx;
							}
						}

						.screen-item-txt {
							padding-top: 8rpx;
							font-size: 24rpx;
							line-height: 34rpx;
							color: #5A5B6E;
						}
					}
				}

			}

			.main-column {
				margin-top: 32rpx;
				padding: 24rpx 32rpx 32rpx;
				background: #fff;
				border-radius: 20rpx;

				.main-title {
					font-weight: 600;
					font-size: 36rpx;
					line-height: 50rpx;
					color: #000000;
					display: flex;
					align-items: center;
					margin-bottom: 20rpx;

					.main-title-txt {
						font-size: 32rpx;
						font-weight: 600;
						line-height: 44rpx;
						color: #5A5B6E;
					}

					.main-title-hot-label {
						margin-left: 18rpx;
						height: 36rpx;
						width: 104rpx;
						background: linear-gradient(95.66deg, #FF6E6E 0%, #FF0000 100%);
						border-radius: 20rpx;
						border: 2rpx solid #FFE6A8;
						display: flex;
						align-items: center;
						justify-content: center;

						text {
							font-size: 24rpx;
							line-height: 24rpx;
							color: #FFFFFF;
						}

						image {
							margin-left: 4rpx;
							width: 24rpx;
							height: 24rpx;
						}
					}
				}
			}
		}
	}
</style>