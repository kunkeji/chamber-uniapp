<template>
	<view class="container">
		<!-- 标题栏 -->
		<title-bar :frontColor="diyData.page.style.titleTextColor" :backgroundColor="diyData.page.style.titleBackgroundColor" :title="diyData.page.params.title || appletName" v-if="diyData && showMode == 2"></title-bar>
		<title-bar :title="appletName || '首页'" v-else></title-bar>
		<!-- 内容区 -->
		<block v-if="loadEnd">
			<!-- 自定义模板 -->
			<diy-mode :show-data="diyData" @setShareData="setShareData" v-if="showMode == 2"></diy-mode>
			<!-- 固定模板 -->
			<block v-else>
				<!-- 轮播图 -->
				<view class="container-carousel">
					<carousel :show-data="carouselList" height="436rpx" radius="0" bottom="72rpx" right="32rpx"></carousel>
				</view>
				<!-- 主体内容 -->
				<view class="container-main" :style="{'--theme-color': themeColor}">
					<!-- 园区信息 -->
					<view class="main-card flex align-items-center" @click="toIntroduce()">
						<image class="card-image" :src="appletLogo" mode="aspectFill"></image>
						<text class="card-title flex-item">{{appletName}}</text>
						<view class="card-btn">{{organize}}介绍</view>
					</view>
					<!-- 导航菜单 -->
					<view class="main-menu" v-if="menuList.length">
						<menu-nav :show-data="menuList" @toPage="toImageText"></menu-nav>
					</view>
					<!-- 会员风采 -->
					<view class="main-column">
						<view class="column-title flex align-items-center">
							<view class="title flex-item">会员风采</view>
							<view class="btn" @click="toMember()">更多+</view>
						</view>
						<view class="column-box">
							<member-item ref="memberItem" :show-data="memberList" @scrolltolower="loadNextMember" v-if="memberList.length"></member-item>
							<empty top="0" padding="0" width="200rpx" size="28rpx" title="暂无相关内容~" v-else></empty>
						</view>
					</view>
					<!-- 园区活动 -->
					<view class="main-column">
						<view class="column-title flex align-items-center">
							<view class="title flex-item">{{organize}}活动</view>
							<view class="btn" @click="toActivity()">更多+</view>
						</view>
						<view class="column-box">
							<activity-item :show-data="activityList" show-type="1" v-if="activityList.length"></activity-item>
							<empty top="0" padding="0" width="200rpx" size="28rpx" title="暂无相关内容~" v-else></empty>
						</view>
					</view>
					<!-- 活动接龙 -->
					<view class="main-column">
						<view class="column-title flex align-items-center">
							<view class="title flex-item">活动接龙</view>
							<view class="btn" @click="toChains()">更多+</view>
						</view>
						<view class="column-box">
							<chains-item :show-data="chainsList" v-if="chainsList.length" @setShareData="setShareData"></chains-item>
							<empty top="0" padding="0" width="200rpx" size="28rpx" title="暂无相关内容~" v-else></empty>
						</view>
					</view>
					<!-- 园区相册 -->
					<view class="main-column">
						<view class="column-title flex align-items-center">
							<view class="title flex-item">{{organize}}相册</view>
							<view class="btn" @click="toAlbum()">更多+</view>
						</view>
						<view class="column-box">
							<album-item :show-data="albumList" v-if="albumList.length"></album-item>
							<empty top="0" padding="0" width="200rpx" size="28rpx" title="暂无相关内容~" v-else></empty>
						</view>
					</view>
					<!-- 商城商品 -->
					<view class="main-column">
						<view class="column-title flex align-items-center">
							<view class="title flex-item">商城商品</view>
							<view class="btn" @click="toMall()">更多+</view>
						</view>
						<view class="column-box">
							<goods-item :show-data="goodsList" v-if="goodsList.length"></goods-item>
							<empty top="0" padding="0" width="200rpx" size="28rpx" title="暂无相关内容~" v-else></empty>
						</view>
					</view>
					<!-- 新闻资讯 -->
					<view class="main-column">
						<view class="column-title flex align-items-center">
							<view class="title flex-item">新闻资讯</view>
							<view class="btn" @click="toArticle()">更多+</view>
						</view>
						<scroll-view scroll-x class="column-screen">
							<view class="screen-item" :class="{active: articleSelect == item.id}" v-for="item in articleCategory" :key="item.id" @click="changeArticle(item.id)">{{item.name}}</view>
						</scroll-view>
						<view class="column-box">
							<article-item :show-data="articleList" show-type="1" v-if="articleList.length"></article-item>
							<empty top="0" padding="0" width="200rpx" size="28rpx" title="暂无相关内容~" v-else></empty>
						</view>
					</view>
				</view>
			</block>
		</block>
		<!-- 底部导航 -->
		<tab-bar></tab-bar>
	</view>
</template>

<script>
	import diyMode from '@/pages/component/diy/index.vue';
	import carousel from "@/pages/component/carousel/carousel.vue"
	import menuNav from "@/pages/component/menu/carousel.vue"
	import memberItem from "@/pages/component/member/scroll.vue"
	import activityItem from "@/pages/component/activity/index.vue"
	import chainsItem from "@/pages/component/chains/index.vue"
	import albumItem from "@/pages/component/album/index.vue"
	import goodsItem from "@/pages/component/goods/index.vue"
	import articleItem from "@/pages/component/article/index.vue"
	// #ifdef H5
	import wx from 'weixin-js-sdk';
	// #endif
	import {
		mapState
	} from "vuex"
	export default {
		components: {
			diyMode,
			carousel,
			menuNav,
			memberItem,
			activityItem,
			chainsItem,
			albumItem,
			goodsItem,
			articleItem,
		},
		data() {
			return {
				// 显示模式 1.固定样式，2.装修自定义
				showMode: 1,
				// 加载完成
				loadEnd: false,
				// 自定义模式
				diyData: null,
				// 轮播图列表
				carouselList: [],
				// 菜单列表
				menuList: [],
				// 会员列表
				memberList: [],
				// 会员分类查询参数
				memberPage: 1,
				memberLimit: 10,
				memberHasMore: false,
				// 活动列表
				activityList: [],
				// 接龙列表
				chainsList: [],
				// 相册列表
				albumList: [],
				// 商品列表 
				goodsList: [],
				// 文章分类
				articleCategory: [],
				// 已选文章分类
				articleSelect: 1,
				// 文章列表 
				articleList: [],
				// 分享数据
				shareData: {},
			}
		},
		computed: {
			...mapState({
				themeColor: state => state.app.themeColor,
				organize: state => state.app.organize,
				appletName: state => state.app.appletName,
				appletLogo: state => state.app.appletLogo,
				shareImage: state => state.app.shareImage,
				shareTitle: state => state.app.shareTitle,
			})
		},
		async onLoad(option) {
			await this.$onLaunched
			// 扫码进入小程序
			// #ifdef MP-WEIXIN
			if (option.scene) {
				uni.setStorageSync('parentWechatId', option.scene);
			}
			// #endif
			// #ifdef H5
			uni.setStorageSync('parentWechatId', option.parent_wechat_id);
			// #endif
			uni.showLoading({
				title: "加载中"
			})
			this.getShowMode(() => {
				uni.hideLoading()
				this.loadEnd = true
			})
			// #ifdef H5
			this.initConfig()
			// #endif
		},
		onShow() {
			if (this.loadEnd) {
				this.getShowMode(() => {
					uni.hideLoading()
					this.loadEnd = true
				})
			}
		},
		onPullDownRefresh() {
			this.getShowMode(() => {
				uni.stopPullDownRefresh()
			})
		},
		onShareAppMessage(res) {
			if (res.from == "button") {
				return {
					title: this.shareData.title,
					path: this.shareData.path,
					imageUrl: this.shareData.imageUrl || this.shareImage,
				}
			} else {
				return {
					title: this.shareTitle,
					imageUrl: this.shareImage,
				}
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
							jsApiList: ["updateAppMessageShareData", "updateTimelineShareData", "wx-open-launch-weapp"],
							openTagList: ["updateAppMessageShareData", "updateTimelineShareData", 'wx-open-launch-weapp'],
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
			// 获取首页模式 
			getShowMode(fn) {
				this.$util.request("main.homeMode").then(res => {
					if (res.code == 1) {
						this.showMode = res.data.home_mode
						if (this.showMode == 1) {
							this.getCarouselList()
							this.getMenuList(fn)
							if (this.loadEnd) {
								this.memberPage = 1
								if (this.$refs.memberItem) this.$refs.memberItem.resetScrollLeft()
							} else {
								uni.setNavigationBarTitle({
									title: this.appletName || "首页"
								})
							}
							this.getMemberList()
							this.getActivityList()
							this.getChainsList()
							this.getAlbumList()
							this.getGoodsList()
							this.getArticleCategory()
						} else {
							this.getDiyData(fn)
						}
					} else {
						if (fn) fn()
						uni.showToast({
							title: res.msg,
							icon: 'none'
						})
					}
				}).catch(error => {
					if (fn) fn()
					console.error('获取显示模式 ', error)
				})
			},
			// 获取自定义数据
			getDiyData(fn) {
				this.$util.request("main.diyData").then(res => {
					if (fn) fn()
					if (res.code == 1) {
						this.diyData = res.data
						let page = res.data.page
						// #ifdef MP-WEIXIN
						// 设置navbar标题、颜色
						uni.setNavigationBarColor({
							frontColor: page.style.titleTextColor === 'white' ? '#ffffff' : '#000000',
							backgroundColor: page.style.titleBackgroundColor
						})
						// #endif
						uni.setNavigationBarTitle({
							title: page.params.title || this.appletName || "首页"
						})
					} else {
						uni.showToast({
							title: res.msg,
							icon: 'none'
						})
					}
				}).catch(error => {
					if (fn) fn()
					console.error('获取自定义数据 ', error)
				})
			},
			// 获取轮播图列表
			getCarouselList() {
				this.$util.request("main.carousel").then(res => {
					if (res.code == 1) {
						this.carouselList = res.data
					} else {
						uni.showToast({
							title: res.msg,
							icon: 'none'
						})
					}
				}).catch(error => {
					console.error('获取轮播图列表 ', error)
				})
			},
			// 获取快速导航
			getMenuList(fn) {
				this.$util.request("main.menu").then(res => {
					if (fn) fn()
					if (res.code == 1) {
						this.menuList = res.data
						this.menuList.forEach(item => {
							if (item.skip_type == 1) {
								item.info = {
									mode: 1,
									path: item.content,
								}
							} else if (item.skip_type == 3) {
								item.info = {
									mode: 5,
									appId: item.content.appid,
									path: item.content.path
								}
							} else if (item.skip_type == 4) {
								item.info = {
									mode: 4,
									path: item.content,
								}
							}
						})
					} else {
						uni.showToast({
							title: res.msg,
							icon: 'none'
						})
					}
				}).catch(error => {
					if (fn) fn()
					console.error('获取快速导航 ', error)
				})
			},
			// 获取会员列表
			getMemberList() {
				this.$util.request("member.list", {
					page: this.memberPage,
					limit: this.memberLimit
				}).then(res => {
					if (res.code == 1) {
						let list = res.data.data
						this.memberHasMore = this.memberPage < res.data.total / this.memberLimit ? true : false
						this.memberList = this.memberPage == 1 ? list : [...this.memberList, ...list];
					} else {
						uni.showToast({
							title: res.msg,
							icon: 'none'
						})
					}
				}).catch(error => {
					console.error('获取会员列表 ', error)
				})
			},
			// 获取活动列表
			getActivityList() {
				this.$util.request("activity.list", {
					page: 1,
					limit: 2
				}).then(res => {
					if (res.code == 1) {
						this.activityList = res.data.data
					} else {
						uni.showToast({
							title: res.msg,
							icon: 'none'
						})
					}
				}).catch(error => {
					console.error('获取活动列表 ', error)
				})
			},
			// 获取活动接龙
			getChainsList() {
				this.$util.request("sequence.chainsList", {
					page: 1,
					limit: 2,
				}).then(res => {
					if (res.code == 1) {
						this.chainsList = res.data.data
					} else {
						uni.showToast({
							title: res.msg,
							icon: 'none'
						})
					}
				}).catch(error => {
					console.error('获取接龙列表', error)
				})
			},
			// 获取园区相册
			getAlbumList() {
				this.$util.request("album.albumList", {
					page: 1,
					limit: 2,
				}).then(res => {
					if (res.code == 1) {
						this.albumList = res.data.data
					} else {
						uni.showToast({
							title: res.msg,
							icon: 'none'
						})
					}
				}).catch(error => {
					console.error('获取相册列表', error)
				})
			},
			// 获取商城商品
			getGoodsList() {
				this.$util.request("mall.goodsList", {
					page: 1,
					limit: 4
				}).then(res => {
					if (res.code == 1) {
						this.goodsList = res.data.data
					} else {
						uni.showToast({
							title: res.msg,
							icon: 'none'
						})
					}
				}).catch(error => {
					console.error('获取推荐商品', error)
				})
			},
			// 获取文章分类
			getArticleCategory() {
				this.$util.request("main.article.category").then(res => {
					if (res.code == 1) {
						this.articleCategory = res.data
						if (this.articleCategory && this.articleCategory.length) {
							this.articleSelect = this.articleCategory[0].id
							this.getArticleList()
						}
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
			getArticleList() {
				this.$util.request("main.article.list", {
					page: 1,
					limit: 3,
					cat_id: this.articleSelect
				}).then(res => {
					if (res.code == 1) {
						this.articleList = res.data.data
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
			// 加载下一页会员
			loadNextMember() {
				if (this.memberHasMore) {
					this.memberPage++
					this.getMemberList()
				}
			},
			// 更换文章分类
			changeArticle(id) {
				this.articleSelect = id
				this.getArticleList()
			},
			// 跳转园区介绍
			toIntroduce() {
				this.$util.toPage({
					mode: 1,
					path: "/pages/index/association"
				})
			},
			// 跳转图文详情
			toImageText(info) {
				this.$util.toPage({
					mode: 1,
					path: "/pages/webview/imageText?type=2&id=" + info.id
				})
			},
			// 跳转会员风采
			toMember() {
				this.$util.toPage({
					mode: 1,
					path: "/pages/member/index"
				})
			},
			// 跳转园区活动
			toActivity() {
				this.$util.toPage({
					mode: 1,
					path: "/pagesActivity/index/index"
				})
			},
			// 跳转活动接龙
			toChains() {
				this.$util.toPage({
					mode: 1,
					path: "/pagesTools/sequence/index"
				})
			},
			// 跳转园区相册
			toAlbum() {
				this.$util.toPage({
					mode: 1,
					path: "/pagesTools/album/index"
				})
			},
			// 跳转园区商城
			toMall() {
				this.$util.toPage({
					mode: 1,
					path: "/pages/mall/index"
				})
			},
			// 跳转新闻资讯
			toArticle() {
				this.$util.toPage({
					mode: 1,
					path: "/pages/article/index"
				})
			},
			// 设置分享数据
			setShareData(data) {
				this.shareData = data
			},
		}
	}
</script>

<style lang="scss">
	.container {
		.container-main {
			position: relative;
			z-index: 8;
			border-radius: 16rpx 16rpx 0 0;
			background: #F6F7FB;
			margin-top: -30rpx;
			padding: 20rpx 16rpx;

			.main-card {
				border-radius: 12rpx;
				background: #ffffff;
				padding: 12rpx 20rpx;
				box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.05);

				.card-image {
					width: 72rpx;
					height: 72rpx;
					border-radius: 6rpx;
				}

				.card-title {
					margin-left: 16rpx;
					color: #5A5B6E;
					font-size: 28rpx;
					font-weight: 600;
					line-height: 40rpx;
				}

				.card-btn {
					margin-left: 16rpx;
					color: #ffffff;
					font-size: 24rpx;
					line-height: 36rpx;
					padding: 10rpx 32rpx;
					border-radius: 12rpx;
					background: var(--theme-color);
				}
			}

			.main-menu {
				border-radius: 12rpx;
				background: #ffffff;
				padding: 24rpx 8rpx 32rpx;
				margin-top: 20rpx;
				box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.05);
			}

			.main-column {
				border-radius: 12rpx;
				background: #ffffff;
				padding: 20rpx;
				margin-top: 20rpx;
				box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.05);

				.column-title {
					margin-bottom: 16rpx;

					.title {
						color: #5A5B6E;
						font-size: 30rpx;
						font-weight: 600;
						line-height: 44rpx;
					}

					.btn {
						font-weight: 600;
						color: var(--theme-color);
						font-size: 26rpx;
						line-height: 40rpx;
						opacity: 0.9;
						transition: opacity 0.3s;

						&:active {
							opacity: 0.7;
						}
					}
				}

				.column-box {
					margin-top: 24rpx;
				}

				.column-screen {
					white-space: nowrap;
					margin-top: 24rpx;
					padding: 0 4rpx;

					.screen-item {
						display: inline-block;
						color: #5A5B6E;
						font-size: 26rpx;
						line-height: 40rpx;
						padding-left: 24rpx;
						transition: all 0.3s;

						&:first-child {
							padding-left: 0;
						}

						&.active {
							color: var(--theme-color);
							font-weight: 600;
							font-size: 30rpx;
							line-height: 44rpx;
						}
					}
				}
			}
		}
	}
</style>