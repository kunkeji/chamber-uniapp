<template>
	<view class="container">
		<!-- 标题栏 -->
		<title-bar :title="screenName"></title-bar>
		<!-- 内容区 -->
		<view class="container-main" v-if="loadEnd">
			<goods-list ref="goodsList" v-if="goodsList.length"></goods-list>
			<empty top="36%" title="分类下暂无相关商品~" v-else></empty>
		</view>
		<!-- 底部导航 -->
		<tab-bar></tab-bar>
	</view>
</template>

<script>
	import goodsList from '@/pages/component/goods/list.vue'
	// #ifdef H5
	import wx from 'weixin-js-sdk';
	// #endif
	import {
		mapState
	} from "vuex"
	export default {
		components: {
			goodsList
		},
		data() {
			return {
				// 是否加载完成
				loadEnd: false,
				// 分类Id
				screenId: '',
				// 分类名称
				screenName: "",
				// 请求页数
				page: 1,
				// 请求参数
				limit: 10,
				// 是否有下一页
				hasMore: false,
				// 商品列表
				goodsList: [],
			};
		},
		computed: {
			...mapState({
				shareImage: state => state.app.shareImage,
				shareTitle: state => state.app.shareTitle,
			})
		},
		onLoad(option) {
			uni.showLoading({
				title: "加载中"
			})
			this.screenId = option.id
			this.screenName = option.name || "商品列表"
			this.getGoodsList(() => {
				this.loadEnd = true
				uni.hideLoading()
			})
			// #ifdef H5
			this.initConfig()
			// #endif
		},
		onPullDownRefresh() {
			this.page = 1
			if (this.goodsList.length) this.$refs.goodsList.clearList()
			this.getGoodsList(() => {
				uni.stopPullDownRefresh();
			});
		},
		onReachBottom() {
			if (this.hasMore) {
				this.page++
				this.getGoodsList();
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
			// 获取分类筛选的商品
			getGoodsList(fn) {
				this.$util.request("mall.goodsList", {
					page: this.page,
					limit: this.limit,
					category_id: this.screenId
				}).then(res => {
					if (fn) fn()
					if (res.code == 1) {
						let list = res.data.data
						this.hasMore = this.page < res.data.total / this.limit ? true : false
						this.goodsList = this.page == 1 ? list : [...this.goodsList, ...list];
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
					if (fn) fn()
					console.error('获取商品列表', error)
				})
			},
			// 瀑布流加载完成
			waterfallLoadEnd() {
				this.waterfallData.reset = false;
				if (this.hasMore) this.waterfallData.status = 'await';
				else this.waterfallData.status = "finish"
			}
		}
	}
</script>

<style lang="scss">
	.container {
		.container-main {
			padding: 32rpx;
		}
	}
</style>