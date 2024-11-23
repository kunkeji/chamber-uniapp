<template>
	<view class="container" v-if="diyData">
		<!-- 标题栏 -->
		<title-bar :frontColor="diyData.page.style.titleTextColor" :backgroundColor="diyData.page.style.titleBackgroundColor" :title="diyData.page.params.title"></title-bar>
		<!-- 内容区 -->
		<diy-mode :show-data="diyData" @setShareData="setShareData"></diy-mode>
		<!-- 底部导航 -->
		<tab-bar></tab-bar>
	</view>
</template>
<script>
	import diyMode from '@/pages/component/diy/index.vue';
	// #ifdef H5
	import wx from 'weixin-js-sdk';
	// #endif
	import {
		mapState
	} from "vuex"
	export default {
		components: {
			diyMode
		},
		data() {
			return {
				// 页面ID
				pageId: null,
				// 自定义数据
				diyData: null,
				// 分享数据
				shareData: {},
			}
		},
		computed: {
			...mapState({
				shareImage: state => state.app.shareImage,
				shareTitle: state => state.app.shareTitle,
			})
		},
		onLoad(option) {
			this.pageId = option.page_id;
			this.getDiyData();
			// #ifdef H5
			this.initConfig()
			// #endif
		},
		onPullDownRefresh() {
			this.getDiyData(() => {
				uni.stopPullDownRefresh();
			});
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
			// 获取自定义数据
			getDiyData(fn) {
				this.$util.request("main.diyData", {
					page_id: this.pageId
				}).then(res => {
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
			// 设置分享数据
			setShareData(data) {
				this.shareData = data
			},
		}
	}
</script>