<template>
	<view class="container">
		<!-- 标题栏 -->
		<title-bar :showBack="true" title="我的发布"></title-bar>
		<!-- 内容区 -->
		<view class="container-main" v-if="loadEnd">
			<view class="main-function alignments" :style="{top: titleBarHeight + 'px'}">
				<view class="main-function-screen">
					<view class="column" :style="{ color: item.id === selectId ? themeColor : '' }" @click="screenChange(item.id)" v-for="item in demandNav" :key="item.id">{{ item.text }}</view>
				</view>
				<view class="main-search-right alignments" @click="publish()">
					<view class="right-icon" :style="{'background-image': 'url('+ iconRelease +')'}" v-if="iconRelease"></view>
					<view class="right-txt" :style="{ color: themeColor }">发布</view>
				</view>
			</view>
			<view class="main-list" v-if="demandList.length">
				<view class="list-item" v-for="(item, index) in demandList" :key="item.id" @click="toDetails(item.id)">
					<view class="item-title flex">
						<view class="alignments flex-item">
							<view class="item-title-txt">编号:</view>
							<view class="item-title-number">{{ item.number }}</view>
						</view>
						<view class="item-title-status" v-if="item.state == 1">审核中</view>
						<view class="item-title-status" style="color: #325DFF;" :style="{ color: themeColor }" v-else-if="item.state == 2">发布中</view>
						<view class="item-title-status" style="color: #5A5B6E;" v-else>已驳回</view>
					</view>
					<!-- 供需内容 -->
					<view class="demand-info">
						<view class="demand-info-title">
							{{ item.title }}
						</view>
						<view class="demand-info-introduce text-ellipsis-more">
							{{ item.content }}
						</view>
						<view :class="{'demand-info-img': true, 'two-images': splitImages(item.images).length % 3 == 2}" v-if="splitImages(item.images).length > 1">
							<image :src="items" mode="aspectFill" class="info-img-size" v-for="(items, index) in splitImages(item.images)" :key="items.id"></image>
						</view>
						<view class="demand-info-img" v-if="splitImages(item.images).length == 1 && splitImages(item.images) != ''">
							<image :src="item.images" mode="aspectFill" class="info-img-size-one"></image>
						</view>
					</view>
					<!-- 修改/删除按钮 -->
					<view class="demand-button flex" v-if="item.status != 3">
						<view class="flex-item"></view>
						<view class="alignments">
							<view class="demand-button-edit" :style="{ background: themeColor }" @click.stop="editDemand(item.id)">修改</view>
							<view class="demand-button-delete" @click.stop="delDemand(item.id)">删除</view>
						</view>
					</view>
				</view>
			</view>
			<empty top="36%" title="暂无相关内容~" v-else></empty>
		</view>
		<!-- 底部导航 -->
		<tab-bar></tab-bar>
	</view>
</template>

<script>
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
				// 当前页
				page: 1,
				// 限制条数
				limit: 10,
				// 是否存在下一页
				hasMore: false,
				// 供需筛选
				demandNav: [{
						id: "0",
						text: "全部",
					},
					{
						id: "1",
						text: "审核中",
					},
					{
						id: "2",
						text: "发布中",
					},
					{
						id: "3",
						text: "已驳回",
					}
				],
				// 供需列表
				demandList: []

			};
		},
		computed: {
			...mapState({
				themeColor: state => state.app.themeColor,
				iconRelease: state => {
					return svgData.svgToUrl("release", state.app.themeColor)
				},
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
		},
		onShow() {
			// 获取供需列表
			this.getDemandList(() => {
				uni.hideLoading()
				this.loadEnd = true
			})
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
		methods: {
			// 获取列表
			getDemandList(fn) {
				this.$util.request("demand.businessList", {
					state: this.selectId,
					page: this.page,
					limit: this.limit
				}).then(res => {
					if (fn) fn()
					if (res.code == 1) {
						let list = res.data.data
						this.hasMore = this.page < res.data.total / this.limit ? true : false
						this.demandList = this.page == 1 ? list : [...this.demandList, ...list];
						uni.hideLoading()
						this.loadEnd = true
					} else {
						uni.showToast({
							title: res.msg,
							icon: 'none'
						})
					}
				}).catch(error => {
					console.error('获取供需列表', error)
				})
			},
			// 修改供需
			editDemand(id) {
				this.$util.toPage({
					mode: 1,
					path: "/pagesDemand/demand/edit?id=" + id
				})
			},
			// 删除供需
			delDemand(id) {
				uni.showModal({
					title: '提示',
					content: '确认删除此条吗?',
					confirmText: '确认删除',
					confirmColor: '#E50002',
					cancelText: '我再想想',
					cancelColor: '#999999',
					success: (res) => {
						if (res.confirm) {
							this.$util.request("demand.businessDel", {
								id: id,
							}).then(res => {
								if (res.code == 1) {
									uni.showToast({
										title: "删除成功"
									})
									this.getDemandList()
								} else {
									uni.showToast({
										title: res.msg,
										icon: 'none'
									})
								}
							}).catch(error => {
								console.error('获取供需列表', error)
							})

						}
					}
				})
			},
			// 发布供需
			publish() {
				this.$util.toPage({
					mode: 1,
					path: "/pagesDemand/demand/add"
				})
			},
			// 前往详情
			toDetails(id) {
				this.$util.toPage({
					mode: 1,
					path: "/pagesDemand/demand/details?type=2&id=" + id
				})
			},
			// 字符串转数组格式图片
			splitImages(images) {
				return images.split(',');
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
		}
	}
</script>

<style lang="scss">
	.container {
		.container-main {
			.main-function {
				position: sticky;
				top: 0;
				z-index: 99;
				background: #FFFFFF;

				.main-function-screen {
					flex: 1;
					padding-right: 16rpx;
					color: #5A5B6E;

					.column {
						padding: 36rpx 0rpx;
						width: 25%;
						display: inline-block;
						font-size: 30rpx;
						text-align: center;
						box-sizing: border-box;
					}
				}

				.main-search-right {
					padding: 0rpx 32rpx;
					border-left: 1rpx solid rgba(0, 0, 0, 0.1);

					.right-icon {
						width: 40rpx;
						height: 40rpx;
						background-size: 40rpx;
					}

					.right-txt {
						padding-left: 8rpx;
						font-size: 30rpx;
					}
				}
			}

			.main-list {
				.list-item {
					margin: 32rpx;
					padding: 32rpx;
					border-radius: 16rpx;
					background: #FFFFFF;

					.item-title {
						padding-bottom: 32rpx;
						border-bottom: 1rpx solid rgba(0, 0, 0, 0.1);

						.item-title-txt {
							font-size: 28rpx;
							line-height: 40rpx;
							color: #979797;
						}

						.item-title-number {
							padding-left: 16rpx;
							font-size: 28rpx;
							line-height: 40rpx;
							color: #979797;
						}

						.item-title-status {
							font-size: 28rpx;
							line-height: 40rpx;
							color: #FF9100;
						}
					}

					.demand-info {
						padding-top: 32rpx;

						.demand-info-title {
							font-weight: 600;
							font-size: 32rpx;
							line-height: 44rpx;
							color: #5A5B6E;
						}

						.demand-info-introduce {
							padding-top: 24rpx;
							font-size: 28rpx;
							line-height: 20px;
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

					.demand-button {
						padding-top: 32rpx;
						text-align: right;

						.demand-button-edit {
							padding: 16rpx 32rpx;
							border-radius: 8rpx;
							background: #FFB656;
							color: #FFFFFF;
						}

						.demand-button-delete {
							margin-left: 16rpx;
							padding: 16rpx 32rpx;
							border-radius: 8rpx;
							background: #FF626E;
							color: #FFFFFF;
						}
					}
				}
			}
		}
	}
</style>