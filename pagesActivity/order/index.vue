<template>
	<view class="container" :style="{'--theme-color': themeColor}">
		<!-- 标题栏 -->
		<title-bar title="我的活动"></title-bar>
		<!-- 内容区 -->
		<view class="container-main" v-if="loadEnd">
			<!-- 顶部导航 -->
			<view class="main-screen" :style="{top: titleBarHeight + 'px'}">
				<scroll-view scroll-x style="white-space: nowrap;">
					<view class="screen-item" v-for="(item, index) in screenList" :key="item.id" @click="changeScreen(index)">
						<view class="text" :class="{active: selectScreen == index}">{{item.name}}</view>
					</view>
				</scroll-view>
			</view>
			<!-- 活动列表 -->
			<view class="main-list">
				<activity-item :show-data="orderList" show-type="2" @getOrderList="getOrderList"></activity-item>
				<empty top="36%" title="暂无相关活动~" v-if="orderList.length == 0"></empty>
			</view>
		</view>
		<!-- 底部导航 -->
		<tab-bar></tab-bar>
	</view>
</template>

<script>
	import activityItem from "@/pages/component/activity/index.vue"
	import {
		mapState
	} from "vuex"
	export default {
		components: {
			activityItem,
		},
		data() {
			return {
				// 加载完成
				loadEnd: false,
				// 标题栏高度
				titleBarHeight: 0,
				// 分类列表
				screenList: [{
						id: 0,
						name: "全部"
					},
					{
						id: 1,
						name: "待付款",
						pay_state: 1
					},
					{
						id: 2,
						name: "报名中",
						pay_state: 2,
						activity_state: 1,
					},
					{
						id: 3,
						name: "进行中",
						pay_state: 2,
						activity_state: 2,
					},
					{
						id: 4,
						name: "已结束",
						pay_state: 2,
						activity_state: 3,
					},
					{
						id: 5,
						name: "已退款",
						pay_state: 4,
					},
					{
						id: 6,
						name: "已驳回",
						pay_state: 5,
					},
				],
				// 已选分类
				selectScreen: 0,
				// 活动列表
				orderList: [],
				// 分类查询参数
				page: 1,
				limit: 10,
				hasMore: false,
			}
		},
		computed: {
			...mapState({
				themeColor: state => state.app.themeColor,
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
			if (uni.getStorageSync("token")) {
				uni.showLoading({
					title: "加载中"
				})
				this.getOrderList(() => {
					uni.hideLoading()
					this.loadEnd = true
				})
			} else {
				this.$util.toPage({
					mode: 2,
					path: "/pages/login/index"
				})
			}
		},
		onShow() {
			if (this.loadEnd) {
				uni.pageScrollTo({
					scrollTop: 0,
					duration: 0
				});
				this.page = 1
				this.getOrderList()
			}
		},
		onPullDownRefresh() {
			this.page = 1
			this.getOrderList(() => {
				uni.stopPullDownRefresh()
			})
		},
		onReachBottom() {
			if (this.hasMore) {
				this.page++
				this.getOrderList()
			}
		},
		methods: {
			// 更改分类
			changeScreen(index) {
				this.selectScreen = index
				this.page = 1
				this.getOrderList()
			},
			// 获取订单列表
			getOrderList(fn) {
				let data = {
					page: this.page,
					limit: this.limit,
				}
				if (this.screenList[this.selectScreen].activity_state) data.activity_state = this.screenList[this.selectScreen].activity_state
				if (this.screenList[this.selectScreen].pay_state) data.pay_state = this.screenList[this.selectScreen].pay_state
				this.$util.request("activity.orderList", data).then(res => {
					if (fn) fn()
					if (res.code == 1) {
						let list = res.data.data
						this.hasMore = this.page < res.data.total / this.limit ? true : false
						this.orderList = this.page == 1 ? list : [...this.orderList, ...list];
					} else {
						uni.showToast({
							title: res.msg,
							icon: 'none'
						})
					}
				}).catch(error => {
					if (fn) fn()
					console.error('获取订单列表 ', error)
				})
			},
		}
	}
</script>

<style lang="scss">
	.container {
		.container-main {
			.main-screen {
				background: #ffffff;
				position: sticky;
				top: 0;
				z-index: 99;
				padding: 0 32rpx;

				.screen-item {
					padding: 0 32rpx;
					display: inline-flex;
					justify-content: center;

					.text {
						padding: 36rpx 0;
						color: #5A5B6E;
						font-size: 28rpx;
						line-height: 40rpx;
						text-align: center;
						border-bottom: 4rpx solid transparent;

						&.active {
							color: var(--theme-color);
							border-color: var(--theme-color);
						}
					}
				}
			}

			.main-list {
				padding: 32rpx;
			}
		}
	}
</style>