<template>
	<view class="container">
		<!-- 标题栏 -->
		<title-bar title="通讯录"></title-bar>
		<!-- 内容区 -->
		<view class="container-main" v-if="loadEnd">
			<!-- 顶部搜索 -->
			<view class="main-search" :style="{top: titleBarHeight + 'px'}">
				<view class="main-search-box alignments">
					<image src="/static/search.png" mode="aspectFit" class="box-img"></image>
					<view class="box-txt">
						<input placeholder="请输入关键词搜索" placeholder-class="placeholder" v-model="keyword" @confirm="onSearch()" />
					</view>
				</view>
			</view>
			<!-- 通讯录列表 -->
			<view class="main-phoneList" :style="{'--theme-color': themeColor}" v-if="Object.keys(phoneList).length > 0">
				<view v-for="(item, index) in phoneList" :key="index">
					<!-- 分组名 -->
					<view class="main-phoneList-title">{{index}}</view>
					<!-- 人员列表 -->
					<view class="main-phoneList-info">
						<view class="info-box alignments" v-for="(items, indexs) in item" :key="indexs" @click="onContact(items.mobile)">
							<image :src="items.avatar" mode="aspectFill" class="info-img"></image>
							<view class="info-personal">
								<view class="alignments">
									<view class="info-personal-name">{{items.name}}</view>
									<view class="info-personal-level">{{items.level_name}}</view>
								</view>
								<view class="info-personal-phone">{{items.mobile}}</view>
							</view>
							<!-- 电话图标 -->
							<view class="info-icon">
								<image src="/static/contact/phone.png" mode="aspectFit"></image>
							</view>
						</view>
					</view>
				</view>
			</view>
			<empty top="36%" title="暂无通讯人员~" v-else></empty>
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
				// 搜索关键词  
				keyword: "",
				phoneList: []
			};
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
			uni.showLoading({
				title: "加载中"
			})
			this.getPhoneList()
		},
		methods: {
			// 获取通讯录
			getPhoneList() {
				this.$util.request("member.addressBook", {
					keywords: this.keyword,
				}).then(res => {
					if (res.code == 1) {
						this.phoneList = res.data
						uni.hideLoading()
						this.loadEnd = true
					} else {
						uni.showToast({
							title: res.msg,
							icon: 'none'
						})
					}
				}).catch(error => {
					console.error('获取通讯录', error)
				})
			},
			// 拨打电话
			onContact(phone) {
				this.$util.toPage({
					mode: 6,
					phone: phone,
				})
			},
			// 搜索
			onSearch() {
				this.getPhoneList()
			}
		}
	}
</script>

<style lang="scss">
	.container {
		.container-main {
			.main-search {
				position: sticky;
				top: 0;
				z-index: 99;
				background: #ffffff;
				padding: 16rpx 32rpx;

				.main-search-box {
					padding: 20rpx 32rpx;
					border-radius: 16rpx;
					background: #F9F9F9;
					color: #999999;

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

			.main-phoneList {
				margin: 32rpx;
				padding: 32rpx;
				border-radius: 12rpx;
				background: #FFFFFF;

				.main-phoneList-title {
					padding-bottom: 32rpx;
					font-size: 28rpx;
					line-height: 40rpx;
					color: #5A5B6E;
				}

				.main-phoneList-info {
					.info-box {
						padding-bottom: 32rpx;

						.info-img {
							width: 84rpx;
							height: 84rpx;
							border-radius: 50%;
						}

						.info-personal {
							flex: 1;
							padding-left: 32rpx;

							.info-personal-name {
								font-size: 32rpx;
								font-weight: 600;
								line-height: 44rpx;
								color: #5A5B6E;
							}

							.info-personal-level {
								padding-left: 16rpx;
								font-size: 28rpx;
								line-height: 40rpx;
								color: #8D929C;
							}

							.info-personal-phone {
								font-size: 28rpx;
								line-height: 40rpx;
								color: #5A5B6E;
							}
						}

						.info-icon {
							padding: 8rpx;
							border-radius: 50%;
							background: var(--theme-color);

							image {
								width: 48rpx;
								height: 48rpx;
							}
						}
					}

				}


			}
		}
	}
</style>