<template>
	<view class="container">
		<!-- 标题栏 -->
		<title-bar title="供需"></title-bar>
		<!-- 内容区 -->
		<view class="container-main">
			<block v-if="loadEnd">
				<!-- 顶部搜索 -->
				<view class="top-sticky" :style="{top: titleBarHeight + 'px'}">
					<view class="main-search alignments">
						<view class="main-search-box alignments" @click="goSearch()">
							<image src="/static/search.png" mode="aspectFit" class="box-img"></image>
							<view class="box-txt">
								<input placeholder="请输入关键词搜索" placeholder-class="placeholder" v-model="keywords" @confirm="serachlist()" disabled="true" />
							</view>
						</view>
						<view class="main-search-right alignments" @click="toPublish()">
							<view class="right-icon" :style="{'background-image': 'url('+ iconRelease +')'}" v-if="iconRelease"></view>
							<view class="right-txt" :style="{ color: themeColor }">发布</view>
						</view>
					</view>
					<!-- 导航菜单 -->
					<scroll-view scroll-x class="scroll-nav">
						<view class="column" :style="{ color: item.id === selectId ? themeColor : '' }" @click="screenChange(item.id)" v-for="item in demandNav" :key="item.id">{{ item.name }}</view>
					</scroll-view>
				</view>
				<!-- 供需列表 -->
				<view class="main-list">
					<view class="demand-main" v-for="item in demandList" :key="item.id" @click="toDetails(item.id)">
						<!-- 顶部发布人信息 -->
						<view class="demand-person alignments">
							<image :src="item.member.avatar" mode="aspectFill" class="demand-person-img"></image>
							<view class="demand-person-info">
								<view class="info-name">{{ item.member.name }}</view>
								<view class="info-level">
									<text class="info-level-rank">{{ item.member.level_name }}</text>|<text class="info-level-time">{{ getDateBefore(item.createtime) }}</text>
								</view>
							</view>
							<!-- <view class="demand-person-contact" :style="{ background:themeColor }" @click.stop="onContact(item.member.mobile)">联系TA</view> -->
						</view>
						<!-- 供需内容 -->
						<view class="demand-info">
							<view class="demand-info-title">
								{{ item.title }}
							</view>
							<view class="demand-info-introduce text-ellipsis-more">
								{{ item.content }}
							</view>
							<view class="demand-info-img" :class="{ 'two-images': splitImages(item.images).length == 2 }" v-if="splitImages(item.images).length > 1">
								<image :src="items" mode="aspectFill" class="info-img-size" v-for="(items, index) in splitImages(item.images)" :key="items.id"></image>
							</view>
							<view class="demand-info-img" v-if="splitImages(item.images).length == 1 && splitImages(item.images) != ''">
								<image :src="item.images" mode="aspectFill" class="info-img-size-one"></image>
							</view>
						</view>
						<!-- 浏览以及分享 -->
						<view class="demand-browse">
							<view class="demand-browse-num">浏览{{ item.page_view }}</view>
							<view class="demand-browse-share alignments">
								<image src="/static/share.png" mode="aspectFill" class="share-img"></image>
								<text class="share-txt">分享</text>
							</view>
						</view>
					</view>
					<!-- 为空占位 -->
					<empty top="32%" title="暂无相关内容~" v-if="demandList.length == 0"></empty>
				</view>
			</block>
			<view class="main-login" v-else-if="showLogin">
				<image class="login-image" :src="loginImg" mode="aspectFit"></image>
				<view class="login-tips">小程序需要登录注册才能使用相关功能，请登录后查看该页面</view>
				<view class="login-btn" :style="{ background:themeColor }" @click="toLogin()">前往登录</view>
				<view class="login-btn cancel" @click="toBack()">返回上一页</view>
			</view>
		</view>
		<!-- 底部导航 -->
		<tab-bar></tab-bar>
	</view>
</template>

<script>
	// #ifdef H5
	import wx from 'weixin-js-sdk';
	// #endif
	import {
		mapState
	} from "vuex"
	import svgData from "@/common/svg.js"
	export default {
		data() {
			return {
				// 加载完成
				loadEnd: false,
				// 标题栏高度
				titleBarHeight: 0,
				// 已选状态 
				selectId: '0',
				// 搜索关键词
				keywords: '',
				// 当前页
				page: 1,
				// 限制条数
				limit: 10,
				// 是否存在下一页
				hasMore: false,
				// 供需筛选
				demandNav: [{
					id: "0",
					name: "全部",
				}],
				// 供需列表
				demandList: [],
				// 是否显示登录提示
				showLogin: false,
			}
		},
		computed: {
			...mapState({
				themeColor: state => state.app.themeColor,
				iconRelease: state => {
					return svgData.svgToUrl("release", state.app.themeColor)
				},
				shareImage: state => state.app.shareImage,
				shareTitle: state => state.app.shareTitle,
				loginImg: state => state.app.loginImg,
			})
		},
		mounted() {
			// #ifdef MP-WEIXIN
			let statusBarHeight = uni.getSystemInfoSync().statusBarHeight
			let menuButtonInfo = uni.getMenuButtonBoundingClientRect()
			this.titleBarHeight = statusBarHeight + (menuButtonInfo.top - statusBarHeight) * 2 + menuButtonInfo.height
			// #endif
		},
		onLoad() {
			uni.showLoading({
				title: "加载中"
			})
			this.getDemandNav()
			this.getDemandList(() => {
				uni.hideLoading()
				this.loadEnd = true
			})
			// #ifdef H5
			this.initConfig()
			// #endif
		},
		onShow() {
			if (this.loadEnd) {
				this.page = 1
				this.getDemandList()
			}
		},
		onPullDownRefresh() {
			this.page = 1
			this.getDemandList(() => {
				uni.stopPullDownRefresh();
			})
		},
		onReachBottom() {
			if (this.hasMore) {
				this.page++
				this.getDemandList();
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
			// 获取供需列表 
			getDemandList(fn) {
				this.$util.request("demand.businessIndexList", {
					category_id: this.selectId,
					page: this.page,
					limit: this.limit
				}).then(res => {
					if (fn) fn()
					if (res.code == 1) {
						let list = res.data.data
						this.hasMore = this.page < res.data.total / this.limit ? true : false
						this.demandList = this.page == 1 ? list : [...this.demandList, ...list];
					} else {
						uni.showToast({
							title: res.msg,
							icon: 'none'
						})
					}
				}).catch(error => {
					if (error == 401) {
						this.showLogin = true
					} else {
						if (fn) fn()
						console.error('获取供需列表', error)
					}
				})
			},
			// 获取商圈分类
			getDemandNav() {
				this.$util.request("demand.businessCat", {}).then(res => {
					if (res.code == 1) {
						let allCategory = this.demandNav[0];
						this.demandNav = [allCategory, ...res.data];
					} else {
						uni.showToast({
							title: res.msg,
							icon: 'none'
						})
					}
				}).catch(error => {
					console.error('获取商圈分类', error)
				})
			},
			// 字符串转数组格式图片
			splitImages(images) {
				return images.split(',');
			},
			// 时间戳转换
			getDateBefore(time) {
				if (time) return this.$util.getDateBeforeNow(time)
				else return ""
			},
			// 去详情
			toDetails(id) {
				this.$util.toPage({
					mode: 1,
					path: "/pagesDemand/demand/details?type=1&id=" + id
				})
			},
			// 联系ta 
			onContact(phone) {
				// 获取商圈限制
				this.$util.request("demand.businessLimit", {
					type: 2
				}).then(res => {
					if (res.code == 1) {
						if (res.data.show_status == 1) {
							this.$util.toPage({
								mode: 6,
								phone: phone,
							})
						} else {
							uni.showModal({
								title: "系统提示",
								content: "联系电话需成为会员后可拨打!",
								confirmColor: this.themeColor,
								confirmText: "去加入",
								success: (res) => {
									if (res.confirm) {
										uni.switchTab({
											url: "/pages/mine/index"
										})
									}
								}
							})
						}

					} else {
						uni.showToast({
							title: res.msg,
							icon: 'none'
						})
					}
				}).catch(error => {
					console.error('获取商圈分类', error)
				})

			},
			// 发布供需
			toPublish() {
				this.$util.toPage({
					mode: 1,
					path: "/pagesDemand/demand/add"
				})
			},
			// 顶部导航筛选
			screenChange(id) {
				if (this.selectId === id) {
					return
				}
				this.selectId = id
				this.page = 1
				this.getDemandList()
			},
			// 去搜索
			goSearch() {
				this.$util.toPage({
					mode: 1,
					path: "/pages/demand/search/index"
				})
			},
			// 前往登录
			toLogin() {
				uni.navigateTo({
					url: "/pages/login/index",
				})
			},
			// 返回上一页
			toBack() {
				if (getCurrentPages().length == 1) {
					this.$util.toPage({
						mode: 1,
						path: "/pages/index/index"
					})
				} else {
					uni.navigateBack()
				}
			},
		}
	}
</script>

<style lang="scss">
	.container {
		.container-main {
			.top-sticky {
				position: sticky;
				top: 0;
				z-index: 99;

				.main-search {
					padding: 16rpx 32rpx;
					background: #fff;

					.main-search-box {
						padding: 26rpx 32rpx;
						border-radius: 16rpx;
						width: 550rpx;
						background: #F9F9F9;

						.box-img {
							width: 40rpx;
							height: 40rpx;
						}

						.box-txt {
							padding-left: 24rpx;
							font-size: 32rpx;

							.placeholder {
								font-size: 28rpx;
								line-height: 40rpx;
								color: #BBBBBB;
							}
						}
					}

					.main-search-right {
						padding-left: 32rpx;

						.right-icon {
							width: 40rpx;
							height: 40rpx;
							background-size: 40rpx;
						}

						.right-txt {
							padding-left: 8rpx;
							font-size: 28rpx;
						}
					}
				}

				.scroll-nav {
					white-space: nowrap;
					background: #fff;

					.column {
						width: 25%;
						display: inline-block;
						font-size: 28rpx;
						line-height: 40rpx;
						text-align: center;
						padding: 24rpx 16rpx;
						box-sizing: border-box;
						color: #5A5B6E;
					}
				}
			}

			.main-list {
				padding: 32rpx;

				.demand-main {
					margin-top: 32rpx;
					padding: 32rpx;
					border-radius: 16rpx;
					background: #FFFFFF;

					&:first-child {
						margin-top: 0;
					}

					.demand-person {
						.demand-person-img {
							width: 96rpx;
							height: 96rpx;
							border-radius: 50%;
						}

						.demand-person-info {
							flex: 1;
							padding-left: 24rpx;
							color: #666666;

							.info-name {
								font-size: 32rpx;
								font-weight: 600;
								line-height: 44rpx;
								color: #5A5B6E;
							}

							.info-level {
								display: flex;
								padding-top: 12rpx;
								font-size: 28rpx;
								line-height: 40rpx;
								color: #666666;

								.info-level-rank {
									padding-right: 8rpx;
								}

								.info-level-time {
									padding-left: 8rpx;
								}
							}
						}

						.demand-person-contact {
							padding: 8rpx 16rpx;
							border-radius: 8rpx;
							font-size: 24rpx;
							background: #325DFF;
							color: #FFFFFF;
						}
					}

					.demand-info {
						padding-top: 32rpx;

						.demand-info-title {
							font-size: 32rpx;
							font-weight: 600;
							line-height: 44rpx;
							color: #5A5B6E;
						}

						.demand-info-introduce {
							padding-top: 24rpx;
							font-size: 28rpx;
							line-height: 40rpx;
							color: #5A5B6E;
						}

						.demand-info-img {
							display: flex;
							justify-content: space-between;
							padding-top: 16rpx;

							.info-img-size {
								border-radius: 16rpx;
								width: 200rpx;
								height: 200rpx;
							}

							.info-img-size-one {
								border-radius: 16rpx;
								width: 100%;
								height: 200rpx;
							}
						}

						.two-images::after {
							width: 200rpx;
							content: '';
						}
					}

					.demand-browse {
						padding-top: 24rpx;
						display: flex;

						.demand-browse-num {
							flex: 1;
							font-size: 24rpx;
							line-height: 34rpx;
							color: #999999;
						}

						.demand-browse-share {
							display: flex;
							font-size: 28rpx;
							line-height: 40rpx;
							color: #5A5B6E;

							.share-img {
								width: 32rpx;
								height: 32rpx;
							}

							.share-txt {
								padding-left: 8rpx;
								font-size: 28rpx;
								line-height: 40rpx;
								color: #5A5B6E;
							}
						}
					}
				}
			}

			.main-login {
				padding: 96rpx 60rpx 0;

				.login-image {
					width: 100%;
					height: 500rpx;
				}

				.login-tips {
					color: #585858;
					font-size: 36rpx;
					line-height: 50rpx;
					margin-top: 48rpx;
					text-align: center;
				}

				.login-btn {
					margin-top: 56rpx;
					height: 88rpx;
					line-height: 88rpx;
					font-size: 28rpx;
					border-radius: 16rpx;
					text-align: center;
					background: var(--theme-color);
					color: #ffffff;

					&.cancel {
						background: #dedede;
						color: #999;
						margin-top: 48rpx;
					}
				}
			}
		}
	}
</style>