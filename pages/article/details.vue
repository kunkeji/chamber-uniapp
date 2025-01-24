<template>
	<view class="container">
		<title-bar title="新闻资讯" :transparent="true"></title-bar>
		
		<view class="container-main" v-if="loadEnd">
			<!-- 封面区域 -->
			<view class="hero-section" v-if="articleInfo.image">
				<image class="main-cover" :src="articleInfo.image" mode="aspectFill"></image>
				<view class="overlay"></view>
			</view>
			
			<!-- 内容区域 -->
			<view class="content-wrapper">
				<!-- 标题区 -->
				<view class="main-title">{{articleInfo.title}}</view>
				
				<!-- 作者信息 - 简化版 -->
				<view class="author-section">
					<view class="left-info">
						<text class="author-name" :style="{color: themeColor}">{{articleInfo.release}}</text>
						<text class="dot">·</text>
						<text class="publish-time">{{articleInfo.createtime}}</text>
					</view>
					<view class="read-count">
						<image class="read-icon" src="/static/see.png" mode="aspectFit"></image>
						<text>{{articleInfo.read_num}}阅读</text>
					</view>
				</view>
				
				<!-- 文章内容 -->
				<view class="article-content">
					<mp-html domain="https://x.cxcepark.cc" :content="articleInfo.content"></mp-html>
				</view>
			</view>
		</view>
		
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
		.hero-section {
			position: relative;
			height: 460rpx;
			overflow: hidden;
			
			.main-cover {
				width: 100%;
				height: 100%;
				object-fit: cover;
			}
			
			.overlay {
				position: absolute;
				bottom: 0;
				left: 0;
				right: 0;
				height: 120rpx;
				background: linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,1));
			}
		}
		
		.content-wrapper {
			position: relative;
			padding: 40rpx;
			background: #fff;
			border-radius: 40rpx 40rpx 0 0;
			box-shadow: 0 -4rpx 20rpx rgba(0,0,0,0.05);
			
			.main-title {
				font-size: 44rpx;
				font-weight: 700;
				color: #333;
				line-height: 1.4;
				margin-bottom: 40rpx;
				letter-spacing: 1rpx;
			}
			
			.author-section {
				display: flex;
				justify-content: space-between;
				align-items: center;
				margin-bottom: 40rpx;
				padding-bottom: 30rpx;
				border-bottom: 1px solid rgba(0,0,0,0.05);
				
				.left-info {
					display: flex;
					align-items: center;
					
					.author-name {
						font-size: 28rpx;
						font-weight: 500;
					}
					
					.dot {
						margin: 0 12rpx;
						color: #999;
						font-weight: bold;
					}
					
					.publish-time {
						font-size: 28rpx;
						color: #999;
					}
				}
				
				.read-count {
					display: flex;
					align-items: center;
					color: #999;
					font-size: 26rpx;
					
					.read-icon {
						width: 32rpx;
						height: 32rpx;
						margin-right: 8rpx;
					}
				}
			}
			
			.article-content {
				line-height: 1.8;
				color: #4a4a4a;
				font-size: 30rpx;
				
				:deep(img) {
					max-width: 100%;
					border-radius: 12rpx;
					margin: 20rpx 0;
				}
				
				:deep(p) {
					margin-bottom: 24rpx;
				}
			}
		}
	}
</style>