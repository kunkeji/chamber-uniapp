<template>
	<view class="container" :style="{'--theme-color': themeColor}">
		<!-- 标题栏 -->
		<title-bar :title="pageTitle || '新闻资讯'"></title-bar>
		<!-- 内容区 -->
		<view class="container-main" v-if="loadEnd">
			<!-- 顶部导航 -->
			<scroll-view scroll-x class="main-screen" :style="{top: titleBarHeight + 'px'}" v-if="screenList.length">
				<view class="screen-wrapper">
					<view class="screen-item" @click="changeScreen(0)">
						<view class="text" :class="{active: selectScreen == 0}">全部</view>
					</view>
					<view class="screen-item" v-for="item in screenList" :key="item.id" @click="changeScreen(item.id)">
						<view class="text" :class="{active: selectScreen == item.id}">{{item.name}}</view>
					</view>
				</view>
			</scroll-view>
			<!-- 新闻列表 -->
			<view class="main-list">
				<article-item :show-data="articleList" v-if="articleList.length"></article-item>
				<empty top="30%" title="暂无相关内容~" v-else></empty>
			</view>
		</view>
		<!-- 底部导航 -->
		<tab-bar></tab-bar>
	</view>
</template>

<script>
	import articleItem from "@/pages/component/article/index.vue"
	// #ifdef H5
	import wx from 'weixin-js-sdk';
	// #endif
	import {
		mapState
	} from "vuex"
	export default {
		components: {
			articleItem,
		},
		data() {
			return {
				// 加载完成
				loadEnd: false,
				// 标题栏高度
				titleBarHeight: 0,
				// 分类列表
				screenList: [],
				// 已选分类
				selectScreen: 0,
				// 页面标题
				pageTitle: "",
				// 新闻列表
				articleList: [],
				// 分类查询参数
				page: 1,
				limit: 10,
				hasMore: false,
			}
		},
		computed: {
			...mapState({
				themeColor: state => state.app.themeColor,
				shareImage: state => state.app.shareImage,
				shareTitle: state => state.app.shareTitle,
			})
		},
		mounted() {
			// #ifdef MP-WEIXIN
			let statusBarHeight = uni.getSystemInfoSync().statusBarHeight
			let menuButtonInfo = uni.getMenuButtonBoundingClientRect()
			this.titleBarHeight = statusBarHeight + (menuButtonInfo.top - statusBarHeight) * 2 + menuButtonInfo.height
			// #endif
		},
		onLoad(option) {
			uni.showLoading({
				title: "加载中"
			})
			if (option.id) {
				this.selectScreen = option.id
			} else {
				this.getArticleCategory()
			}
			if (option.title) this.pageTitle = option.title
			this.getArticleList(() => {
				uni.hideLoading()
				this.loadEnd = true
			})
			// #ifdef H5
			this.initConfig()
			// #endif
		},
		onPullDownRefresh() {
			this.page = 1
			this.getArticleList(() => {
				uni.stopPullDownRefresh()
			})
		},
		onReachBottom() {
			if (this.hasMore) {
				this.page++
				this.getArticleList()
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
			// 更改分类
			changeScreen(id) {
				this.selectScreen = id
				this.page = 1
				this.getArticleList()
			},
			// 获取文章分类
			getArticleCategory() {
				this.$util.request("main.article.category").then(res => {
					if (res.code == 1) {
						this.screenList = res.data
					} else {
						uni.showToast({
							title: res.msg,
							icon: 'none'
						})
					}
				}).catch(error => {
					console.error('获取文章列表 ', error)
				})
			},
			// 获取文章列表
			getArticleList(fn) {
				let data = {
					page: this.page,
					limit: this.limit,
				}
				if (this.selectScreen) data.cat_id = this.selectScreen
				this.$util.request("main.article.list", data).then(res => {
					if (fn) fn()
					if (res.code == 1) {
						let list = res.data.data
						this.hasMore = this.page < res.data.total / this.limit ? true : false
						this.articleList = this.page == 1 ? list : [...this.articleList, ...list];
					} else {
						uni.showToast({
							title: res.msg,
							icon: 'none'
						})
					}
				}).catch(error => {
					if (fn) fn()
					console.error('获取文章列表 ', error)
				})
			},
		}
	}
</script>

<style lang="scss">
	.container {
		.container-main {
			background: #f5f6fa;
			min-height: 100vh;
			
			.main-screen {
				white-space: nowrap;
				background: #ffffff;
				position: sticky;
				top: 0;
				z-index: 99;
				box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.05);
				
				.screen-wrapper {
					padding: 0 16rpx;
					display: flex;
					
					.screen-item {
						padding: 0 24rpx;
						display: inline-flex;
						justify-content: center;
						min-width: 160rpx;
						transition: all 0.3s;
						
						&:active {
							opacity: 0.7;
						}

						.text {
							padding: 24rpx 0;
							color: #666;
							font-size: 28rpx;
							line-height: 40rpx;
							text-align: center;
							position: relative;
							font-weight: 500;
							transition: all 0.3s;

							&.active {
								color: var(--theme-color);
								font-weight: 600;
								
								&::after {
									content: '';
									position: absolute;
									bottom: 0;
									left: 50%;
									transform: translateX(-50%);
									width: 40rpx;
									height: 4rpx;
									background: var(--theme-color);
									border-radius: 4rpx;
								}
							}
						}
					}
				}
			}

			.main-list {
				padding: 24rpx;
				
				:deep(.article-item) {
					background: #fff;
					border-radius: 16rpx;
					margin-bottom: 24rpx;
					padding: 24rpx;
					box-shadow: 0 2rpx 12rpx rgba(0,0,0,0.04);
					transition: all 0.3s;
					
					&:active {
						transform: scale(0.98);
					}
				}
			}
		}
	}
</style>