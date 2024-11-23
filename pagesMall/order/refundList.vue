<template>
	<view class="container" v-if="loadEnd">
		<!-- 标题栏 -->
		<title-bar title="退款列表"></title-bar>
		<!-- 内容区 -->
		<view class="container-main" v-if="loadEnd">
			<!-- 导航菜单 -->
			<scroll-view scroll-x class="scroll-nav" :style="{top: titleBarHeight + 'px'}">
				<block>
					<view class="column" :style="item.id === selectId ? 'color:' + themeColor : ''" @click="screenChange(item.id)" v-for="item in refundNav" :key="item.id">{{item.text}}</view>
				</block>
			</scroll-view>
			<!-- 订单列表 -->
			<view class="main-list" v-if="orderList && orderList.length > 0">
				<view class="component-order-list">
					<view class="list-item" v-for="(item, index) in orderList" :key="index" @click="toDetail(item)">
						<view class="item-header">
							<view class="header-number">订单编号：{{item.order_no}}</view>
							<!-- 退款状态 -->
							<view class="header-status">
								<text style="color: #FF626E;" v-if="item.refund_status == 2">申请中</text>
								<text style="color: #FF9100;" v-if="item.refund_status == 3">待退货</text>
								<text style="color: #325DFF;" v-if="item.refund_status == 4" :style="{color: themeColor}">退款中</text>
								<text style="color: #979797;" v-if="item.refund_status == 5">已退款</text>
							</view>
						</view>
						<!-- 单商品 -->
						<view class="item-goods">
							<image class="goods-image" :src="item.goods.image" mode="aspectFill"></image>
							<view class="goods-info">
								<view class="info-name text-ellipsis-more">{{item.goods.name}}</view>
								<view class="info-box">
									<view class="price" :style="{color: themeColor}">￥{{item.pay_price}}</view>
								</view>
							</view>
						</view>
						<!-- 退款按钮 -->
						<view class="item-btn" v-if="item.refund_status == 2 || item.refund_status == 3">
							<view class="btn" @click.stop="refundcancel(item.id)" v-if="item.refund_status == 2">取消退款</view>
							<view class="btn" @click.stop="rejected(item)" :style="{background: themeColor}" v-if="item.refund_status == 3">填写信息</view>
						</view>
					</view>
				</view>
			</view>
			<view class="main-empty" v-else>
				<empty top="36%" title="暂无相关订单~"></empty>
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
	export default {
		data() {
			return {
				// 是否加载完成
				loadEnd: false,
				// 标题栏高度
				titleBarHeight: 0,
				// 退款筛选
				refundNav: [{
						id: "",
						text: "全部",
					},
					{
						id: "2",
						text: "申请中",
					},
					{
						id: "3",
						text: "待退货",
					},
					{
						id: "4",
						text: "退款中",
					},
					{
						id: "5",
						text: "已退款",
					}
				],
				// 已选状态
				selectId: '',
				// 订单列表
				orderList: [],
				// 当前页
				page: 1,
				// 限制条数
				limit: 10,
				// 是否存在下一页
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
		onLoad(option) {
			uni.showLoading({
				title: "加载中"
			})
			this.selectId = option.id || ''
		},
		onPullDownRefresh() {
			this.page = 1
			this.getOrderList(() => {
				uni.stopPullDownRefresh();
			})
		},
		onReachBottom() {
			if (this.hasMore) {
				this.page++
				this.getOrderList();
			}
		},
		onShow() {
			this.getOrderList();
		},
		methods: {
			// 获取退款列表
			getOrderList(fn) {
				this.$util.request("mall.refundList", {
					refund_status: this.selectId,
					page: this.page,
					limit: this.limit
				}).then(res => {
					if (res.code == 1) {
						let list = res.data.data
						this.hasMore = this.page < res.data.total / this.limit ? true : false
						this.orderList = this.page == 1 ? list : [...this.orderList, ...list];
						uni.hideLoading()
						this.loadEnd = true
					} else {
						uni.showToast({
							title: res.msg,
							icon: 'none'
						})
					}
				}).catch(error => {
					console.error('获取退款列表', error)
				})
				if (fn) fn()
			},
			// 跳转详情
			toDetail(item) {
				this.$util.toPage({
					mode: 1,
					path: `/pagesMall/order/refundDetail?id=` + item.id
				})
			},
			// 填写快递
			rejected(item) {
				this.$util.toPage({
					mode: 1,
					path: "/pagesMall/order/rejected?item=" + JSON.stringify(item)
				})
			},
			// 取消退款
			refundcancel(id) {
				uni.showModal({
					title: "提示",
					content: "确定取消退款申请?点击取消退款后取消申请",
					confirmText: '取消退款',
					confirmColor: this.themeColor,
					cancelText: '我再想想',
					cancelColor: '#999999',
					success: (res) => {
						if (res.confirm) {
							this.$util.request("mall.cancelRefund", {
								id: id
							}).then(res => {
								if (res.code == 1) {
									uni.showToast({
										title: "取消退款成功",
										icon: "none"
									})
									this.getOrderList()
								} else {
									uni.showToast({
										title: res.msg,
										icon: 'none'
									})
								}
							}).catch(error => {
								console.error('取消退款', error)
							})
						}
					}
				})
			},
			// 筛选
			screenChange(id) {
				if (this.selectId === id) {
					return
				}
				this.selectId = id
				this.page = 1
				this.getOrderList()
			}
		}
	}
</script>

<style lang="scss">
	page {
		background: #F6F7FB;
	}

	.container {
		.container-main {
			padding-bottom: 32rpx;

			.scroll-nav {
				position: sticky;
				top: 0;
				z-index: 99;
				white-space: nowrap;
				background: #fff;

				.column {
					width: 20%;
					display: inline-block;
					font-size: 28rpx;
					line-height: 40rpx;
					text-align: center;
					padding: 44rpx 16rpx;
					box-sizing: border-box;
				}
			}

			.main-list {
				padding: 0 29rpx;

				.component-order-list {
					.list-item {
						margin-top: 32rpx;
						padding: 32rpx;
						background: #fff;
						border-radius: 20rpx;

						.item-header {
							margin-bottom: 32rpx;
							display: flex;
							justify-content: space-between;
							align-items: center;

							.header-number {
								font-size: 28rpx;
								line-height: 40rpx;
								color: #999999;
							}

							.header-status {
								font-size: 28rpx;
								line-height: 40rpx;
							}
						}

						.item-goods {
							padding: 32rpx 0rpx;
							border-top: 1px solid rgba(0, 0, 0, 0.10);
							display: flex;
							align-items: center;

							.goods-image {
								width: 160rpx;
								height: 160rpx;
								border-radius: 20rpx;
							}

							.goods-info {
								flex: 1;
								display: flex;
								flex-direction: column;
								justify-content: space-between;
								margin-left: 32rpx;
								height: 160rpx;

								.info-name {
									font-size: 28rpx;
									font-weight: 600;
									line-height: 40rpx;
									color: #5A5B6E;
								}

								.info-box {
									display: flex;
									align-items: center;
									justify-content: space-between;

									.price {
										color: #E60012;
										font-size: 32rpx;
										font-weight: 600;
										line-height: 40rpx;
									}

									.number {
										font-size: 28rpx;
										line-height: 32rpx;
									}
								}
							}
						}

						.item-scroll {
							padding-left: 32rpx;
							box-sizing: border-box;
							position: relative;

							.scroll-goods {
								display: inline-block;
								padding: 24rpx 200rpx 24rpx 0;

								.goods-box {
									display: inline-block;
									margin-left: 32rpx;

									&:first-child {
										margin-left: 0;
									}

									.image {
										display: block;
										width: 160rpx;
										height: 160rpx;
										border-radius: 20rpx;
									}

									.name {
										display: block;
										width: 160rpx;
										font-size: 24rpx;
										font-weight: 600;
										line-height: 34rpx;
										margin-top: 12rpx;
										white-space: nowrap;
										overflow: hidden;
										text-overflow: ellipsis;
									}
								}
							}

							.scroll-total {
								position: absolute;
								right: 0;
								top: 0;
								bottom: 0;
								z-index: 9;
								min-width: 200rpx;
								padding: 0 16rpx;
								box-sizing: border-box;
								display: flex;
								flex-direction: column;
								align-items: center;
								justify-content: center;
								background: rgba(255, 255, 255, 0.70);

								.num {
									font-size: 32rpx;
									line-height: 40rpx;
								}

								.price {
									color: #E60012;
									font-size: 36rpx;
									font-weight: 600;
									line-height: 44rpx;
									margin-top: 52rpx;
								}
							}
						}

						.item-btn {
							padding: 8rpx 0rpx 24rpx;
							display: flex;
							justify-content: flex-end;
							align-items: center;

							.btn {
								color: #FFF;
								font-size: 28rpx;
								line-height: 40rpx;
								padding: 16rpx 32rpx;
								min-width: 144rpx;
								box-sizing: border-box;
								text-align: center;
								border-radius: 8rpx;
								background: #FF2525;
								margin-left: 24rpx;
							}
						}
					}
				}
			}

			.main-empty {
				.image {
					width: 600rpx;
					height: 600rpx;
					display: block;
					margin: 48rpx auto 0;
				}

				.cont {
					color: #999;
					text-align: center;
					font-size: 28rpx;
					line-height: 40rpx;
				}
			}
		}
	}
</style>