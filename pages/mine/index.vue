<template>
	<page-meta :page-style="'overflow:' + (pageShow ? 'hidden' : 'visible')"></page-meta>
	<view class="container">
		<!-- 标题栏 -->
		<title-bar title="我的"></title-bar>
		<!-- 背景图 -->
		<image class="container-image" src="/static/mine_bg.png" mode="widthFix"></image>
		<!-- 页面内容 -->
		<view class="container-main" v-if="loadEnd">
			<!-- 用户信息 -->
			<user-info @getPoster="$refs.memberPoster.getPoster()"></user-info>
			<!-- 商城订单 -->
			<view class="main-column" style="margin-top: 0;">
				<view class="column-title flex justify-content-between align-items-center">
					<view class="title">商城订单</view>
					<view class="btn" @click="toOrder()">查看全部</view>
				</view>
				<view class="column-content">
					<order-menu :show-data="orderList"></order-menu>
				</view>
			</view>
			<!-- 会员中心 -->
			<view class="main-column">
				<view class="column-title">
					<view class="title">会员中心</view>
				</view>
				<view class="column-content" style="padding: 0 16rpx;">
					<menu-center :show-data="memberMenu" icon-size="80rpx"></menu-center>
				</view>
			</view>
			<!-- 管理员中心 -->
			<view class="main-column" v-if="token && adminMenu.length">
				<view class="column-title">
					<view class="title">管理员中心</view>
				</view>
				<view class="column-content" style="padding: 0 16rpx;">
					<menu-center :show-data="adminMenu" icon-size="80rpx"></menu-center>
				</view>
			</view>
			<!-- 系统中心 -->
			<view class="main-column">
				<view class="column-title">
					<view class="title">系统中心</view>
				</view>
				<view class="column-content" style="padding: 0 16rpx;">
					<menu-center :show-data="systemMenu" icon-size="80rpx"></menu-center>
				</view>
			</view>
			<!-- 备案号 -->
			<view class="main-statement" v-if="statement">备案号：{{statement}}</view>
			<!-- 技术支持 -->
			<view class="main-support flex justify-content-center" @click="toSupport" v-if="support && support.image">
				<!-- #ifdef MP-WEIXIN -->
				<button class="clear" open-type="contact" v-if="support.type == 1">
					<image class="image" :src="support.image" mode="widthFix"></image>
				</button>
				<image class="image" :src="support.image" mode="widthFix" v-else></image>
				<!-- #endif -->
				<!-- #ifndef MP-WEIXIN -->
				<image class="image" :src="support.image" mode="widthFix"></image>
				<!-- #endif -->
			</view>
		</view>
		<!-- 底部导航 -->
		<tab-bar></tab-bar>
		<!-- 电子会牌 -->
		<member-poster ref="memberPoster" @onChange="pageChange"></member-poster>
	</view>
</template>

<script>
	import userInfo from "@/pages/component/user-info/user-info.vue"
	import orderMenu from "@/pages/component/menu/order.vue"
	import menuCenter from "@/pages/component/menu/menu.vue"
	import memberPoster from "@/pages/component/member/poster.vue"
	// #ifdef H5
	import wx from 'weixin-js-sdk';
	// #endif
	import {
		mapState
	} from "vuex"
	export default {
		components: {
			userInfo,
			orderMenu,
			menuCenter,
			memberPoster,
		},
		data() {
			return {
				// 页面是否阻止滚动
				pageShow: false,
				// 加载完成
				loadEnd: false,
				// 订单列表 
				orderList: [{
						id: 1,
						image: "/static/mine/order_1.png",
						text: "待付款",
						info: {
							mode: 1,
							path: "/pagesMall/order/list?id=1",
						},
						count: "unpaid_count",
					},
					{
						id: 2,
						image: "/static/mine/order_2.png",
						text: "待发货",
						info: {
							mode: 1,
							path: "/pagesMall/order/list?id=2",
						},
						count: "to_be_shipped_count",
					},
					{
						id: 3,
						image: "/static/mine/order_3.png",
						text: "待收货",
						info: {
							mode: 1,
							path: "/pagesMall/order/list?id=3",
						},
						count: "to_be_received_count",
					},
					{
						id: 4,
						image: "/static/mine/order_4.png",
						text: "退款",
						info: {
							mode: 1,
							path: "/pagesMall/order/refundList",
						},
						count: "refund_count",
					}
				],
				// 会员中心
				memberMenu: [{
						id: 1,
						icon: "/static/mine/member_1.png",
						name: "编辑资料",
						info: {
							mode: 1,
							path: "/pages/member/information",
						}
					},
					{
						id: 2,
						icon: "/static/mine/member_2.png",
						name: "推广会员",
						info: {
							mode: 1,
							path: "/pagesTools/publicize/index",
						}
					},
					{
						id: 3,
						icon: "/static/mine/member_3.png",
						name: "我的发布",
						info: {
							mode: 1,
							path: "/pagesDemand/demand/list",
						}
					},
					{
						id: 4,
						icon: "/static/mine/member_4.png",
						name: "我的活动",
						info: {
							mode: 1,
							path: "/pagesActivity/order/index",
						}
					},
					{
						id: 5,
						icon: "/static/mine/member_5.png",
						name: "我的报修",
						info: {
							mode: 1,
							path: "/pagesTools/record/record",
						}
					},
					{
						id: 6,
						icon: "/static/mine/member_6.png",
						name: "我的预约",
						info: {
							mode: 1,
							path: "/pagesTools/record/yyrecord",
						}
					},
					{
						id: 7,
						icon: "/static/mine/member_7.png",
						name: "电费充值",
						info: {
							mode: 1,
							path: "/pagesTools/electricity/list",
						}
					}
				],
				// 系统中心
				systemMenu: [{
						id: 1,
						icon: "/static/mine/system_1.png",
						name: "地址管理",
						info: {
							mode: 1,
							path: "/pagesMall/address/index",
						}
					},
					{
						id: 2,
						icon: "/static/mine/system_2.png",
						name: "平台客服",
						info: "contact"
					},
					{
						id: 3,
						icon: "/static/mine/system_3.png",
						name: "常见问题",
						info: {
							mode: 1,
							path: "/pages/mine/problem/index",
						}
					},
					{
						id: 4,
						icon: "/static/mine/system_4.png",
						name: "系统设置",
						info: {
							mode: 1,
							path: "/pages/mine/settings/system",
						}
					},
				],
			}
		},
		computed: {
			...mapState({
				themeColor: state => state.app.themeColor,
				token: state => state.user.token,
				adminMenu: state => {
					let list = []
					// #ifdef MP-WEIXIN
					if (state.user.userInfo.set_admin == 1) {
						list.push({
							id: 1,
							icon: "/static/mine/admin_1.png",
							name: "消息订阅",
							info: {
								mode: 1,
								path: "/pages/mine/subscribe/index",
							}
						},{
							id: 2,
							icon: "/static/mine/member_7.png",
							name: "电费直冲",
							info: {
								mode: 1,
								path: "/pagesTools/electricity/adminelectricity",
							}
						})
					}
					// #endif
					if (state.user.userInfo.is_verifying == 1) {
						list.push({
							id: 2,
							icon: "/static/mine/admin_2.png",
							name: "核销活动",
							info: {
								mode: 1,
								path: "/pagesActivity/verification/index",
							}
						})
					}
					return list
				},
				userInfo: state => state.user.userInfo,
				statement: state => state.app.statement,
				support: state => state.app.support,
				shareImage: state => state.app.shareImage,
				shareTitle: state => state.app.shareTitle,
			})
		},
		onReady() {
			this.loadEnd = true
			// #ifdef H5
			this.initConfig()
			// #endif
		},
		onShow() {
			if (uni.getStorageSync("token")) {
				this.getUserInfo()
			}
		},
		onPullDownRefresh() {
			this.getUserInfo(() => {
				uni.stopPullDownRefresh();
			})
		},
		onShareAppMessage() {
			return {
				title: this.shareTitle,
				imageUrl: this.shareImage,
				path: "/pages/index/index",
			}
		},
		onShareTimeline() {
			return {
				title: this.shareTitle,
				imageUrl: this.shareImage,
				path: "/pages/index/index",
			}
		},
		methods: {
			// 改变页面滚动状态
			pageChange(state) {
				this.pageShow = state
			},
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
			// 获取用户信息
			getUserInfo(fn) {
				this.$util.request("mine.user").then(res => {
					if (fn) fn()
					if (res.code == 1) {
						uni.setStorageSync("userInfo", res.data)
						this.$store.commit('user/setUserInfo', res.data)
					} else {
						uni.showToast({
							title: res.msg,
							icon: 'none'
						})
					}
				}).catch(error => {
					if (fn) fn()
					console.error('获取用户信息 ', error)
				})
			},
			// 跳转全部订单
			toOrder() {
				this.$util.toPage({
					mode: 1,
					path: '/pagesMall/order/list',
				})
			},
			// 跳转我的发布
			toRelease() {
				this.$util.toPage({
					mode: 1,
					path: '/pagesDemand/demand/list',
				})
			},
			// 跳转我的活动
			toActivity() {
				this.$util.toPage({
					mode: 1,
					path: '/pagesActivity/order/index',
				})
			},
			// 跳转技术支持
			toSupport() {
				if (this.support.type == 2) {
					// 拨打电话
					this.$util.toPage({
						mode: 6,
						phone: this.support.mobile,
					})
				} else if (this.support.type == 3) {
					// 外部链接
					this.$util.toPage({
						mode: 4,
						path: this.support.link,
					})
				}
			},
		}
	}
</script>

<style lang="scss">
	.container {
		position: relative;
		min-height: 100vh;
		background: #f5f6fa;

		.container-image {
			position: absolute;
			top: 0;
			left: 0;
			right: 0;
			// 添加渐变遮罩
			&::after {
				content: '';
				position: absolute;
				left: 0;
				right: 0;
				top: 0;
				bottom: 0;
				background: linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0) 100%);
			}
		}

		.container-main {
			position: relative;
			z-index: 1;
			padding: 48rpx 32rpx 32rpx;

			.main-column {
				padding: 28rpx 0 36rpx;
				border-radius: 24rpx;
				background: #ffffff;
				margin-top: 32rpx;
				box-shadow: 0 4rpx 16rpx rgba(0,0,0,0.05);
				transition: all 0.3s ease;

				&:active {
					transform: scale(0.98);
				}

				.column-title {
					padding: 0 32rpx;

					.title {
						color: #333;
						font-size: 32rpx;
						font-weight: 600;
						line-height: 44rpx;
					}

					.btn {
						color: #666;
						font-size: 28rpx;
						line-height: 40rpx;
						padding: 4rpx 16rpx;
						border-radius: 20rpx;
						background: #f5f6fa;
						
						&:active {
							opacity: 0.8;
						}
					}
				}

				.column-content {
					margin-top: 26rpx;
				}
			}

			.main-statement {
				font-size: 24rpx;
				line-height: 34rpx;
				color: #999;
				margin-top: 40rpx;
				text-align: center;
			}

			.main-support {
				margin-top: 40rpx;

				.image {
					width: 400rpx;
					height: auto;
					border-radius: 20rpx;
					box-shadow: 0 4rpx 16rpx rgba(0,0,0,0.08);
					transition: all 0.3s ease;

					&:active {
						transform: scale(0.95);
					}
				}
			}
		}
	}
</style>