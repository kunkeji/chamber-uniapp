<template>
	<view class="container">
		<!-- 标题栏 -->
		<title-bar title="新闻资讯"></title-bar>
		<!-- 内容区 -->
		<view class="container-main" v-if="loadEnd">
			<view class="main-title">{{articleInfo.title}}</view>
			<view class="main-tag flex justify-content-between align-items-center">
				<view class="tag-item flex-item">
					<text class="item-name" :style="{color: themeColor}">{{articleInfo.release}}</text>
					<text class="item-time">{{articleInfo.createtime}}</text>
				</view>
				<view class="tag-item flex align-items-center">
					<image class="item-icon" src="/static/see.png" mode="aspectFit"></image>
					<text class="item-number">{{articleInfo.read_num}}</text>
				</view>
			</view>
			<view class="main-content">
				<mp-html :content="articleInfo.content"></mp-html>
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
	// #ifdef H5
	import wx from 'weixin-js-sdk';
	// #endif
	export default {
		data() {
			return {
				// 加载完成
				loadEnd: false,
				// 新闻id
				articleId: null,
				// 新闻详情
				articleInfo: "",
			}
		},
		computed: {
			...mapState({
				themeColor: state => state.app.themeColor,
			})
		},
		onLoad(option) {
			this.articleId = option.id
			uni.showLoading({
				title: "加载中"
			})
			this.getArticle(() => {
				this.loadEnd = true
				uni.hideLoading()
				// #ifdef H5
				this.initConfig()
				// #endif
			})
		},
		onShareAppMessage() {
			return {
				title: this.articleInfo.title,
				imageUrl: this.articleInfo.image,
			}
		},
		onShareTimeline() {
			return {
				title: this.articleInfo.title,
				imageUrl: this.articleInfo.image,
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
								title: this.articleInfo.title,
								desc: "",
								link: window.location.href,
								imgUrl: this.articleInfo.image,
							});
							wx.updateTimelineShareData({
								title: this.articleInfo.title,
								link: window.location.href,
								imgUrl: this.articleInfo.image,
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
			// 获取文章详情
			getArticle(fn) {
				this.$util.request("main.article.details", {
					id: this.articleId
				}).then(res => {
					if (fn) fn()
					if (res.code == 1) {
						this.articleInfo = res.data
					} else {
						uni.showToast({
							title: res.msg,
							icon: 'none'
						})
					}
				}).catch(error => {
					if (fn) fn()
					console.error('获取文章详情 ', error)
				})
			},
		}
	}
</script>

<style lang="scss">
	page {
		background: #ffffff;
	}

	.container {
		.container-main {
			padding: 32rpx;

			.main-title {
				font-weight: 600;
				font-size: 36rpx;
				line-height: 60rpx;
				color: #5A5B6E;
			}

			.main-tag {
				margin-top: 16rpx;

				.tag-item {
					.item-name {
						font-size: 28rpx;
						line-height: 40rpx;
					}

					.item-time {
						font-size: 28rpx;
						line-height: 40rpx;
						color: #8D929C;
						margin-left: 16rpx;
					}

					.item-icon {
						width: 32rpx;
						height: 32rpx;
						margin-left: 16rpx;
					}

					.item-number {
						margin-left: 8rpx;
						font-size: 28rpx;
						line-height: 40rpx;
						color: #8D929C;
					}
				}
			}

			.main-content {
				margin-top: 32rpx;
			}
		}
	}
</style>