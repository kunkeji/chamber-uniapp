<template>
	<view class="container">
		<!-- 标题栏 -->
		<title-bar :showBack="true" title="搜索结果"></title-bar>
		<!-- 供需列表 -->
		<view class="container-main" v-if="loadEnd">
			<view class="main-demand" v-for="item in demandList" :key="item.id" @click="toDetails(item.id)">
				<!-- 顶部发布人信息 -->
				<view class="demand-person alignments">
					<image :src="item.member.avatar" mode="aspectFill" class="demand-person-img"></image>
					<view class="demand-person-info">
						<view class="info-name">{{ item.member.name }}</view>
						<view class="info-level">
							<text class="info-level-rank">{{ item.member.level_name }}</text>|<text class="info-level-time">{{ getDateBefore(item.createtime) }}</text>
						</view>
					</view>
					<view class="demand-person-contact" :style="{ background:themeColor }" @click.stop="onContact(item.member.mobile)">联系TA</view>
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
						<image :src="items" mode="aspectFill" class="info-img-size" v-for="(items, index) in splitImages(item.images).slice(0, 3)" :key="items.id"></image>
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
			<empty top="36%" title="暂无相关内容~" v-if="demandList.length == 0"></empty>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				// 加载完成
				loadEnd: false,
				// 搜索关键词
				keywords: '',
				// 分页参数
				page: 1,
				limit: 10,
				hasMore: false,
				// 供需列表
				demandList: []
			}
		},
		onLoad(option) {
			uni.showLoading({
				title: "加载中"
			})
			this.keywords = option.keyword
			if (this.keywords) {
				this.getDemandList()
			}
		},
		onReachBottom() {
			if (this.hasMore) {
				this.page++
				this.getDemandList();
			}
		},
		methods: {
			// 获取供需列表
			getDemandList(fn) {
				this.$util.request("demand.businessIndexList", {
					title: this.keywords,
					page: this.page,
					limit: this.limit
				}).then(res => {
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
				if (fn) fn()
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
				this.$util.toPage({
					mode: 6,
					phone: phone,
				})
			},
		}
	}
</script>

<style lang="scss">
	.container {
		.container-main {
			padding: 32rpx;

			.main-demand {
				margin-bottom: 32rpx;
				padding: 32rpx;
				border-radius: 16rpx;
				background: #FFFFFF;

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
	}
</style>