<template>
	<view scroll-x class="diy-activity" :style="{padding: paddingTop + ' ' + paddingLeft, background: showStyle.background, borderRadius: itemBorderRadius}">
		<view class="activity-title" :style="{marginBottom: titleSpace}" v-if="showParams.showTitle">
			<view :style="{fontSize: titleFontSize,fontWeight: showStyle.titleFontStyle, color: showStyle.titleColor}">{{showParams.titleText}}</view>
			<view :style="{fontSize: titleBtnSize, color: showStyle.titleBtnColor}" @click="toMore()">
				<text v-if="showParams.titleBtnType == 'text'">{{showParams.titleBtnText}}</text>
				<view :style="{'background-image': 'url('+ titleIconMore +')', width: titleIconSize, height: titleIconSize, backgroundSize: titleIconSize}" v-else-if="titleIconMore"></view>
			</view>
		</view>
		<view class="activity-list" v-if="activityList.length">
			<view class="list-item flex" :style="{marginTop: itemSpace}" v-for="item in activityList" :key="item.id" @click="toDetails(item.id, item.activity_auth)">
				<image class="item-image" :src="item.images" mode="aspectFill" v-if="showParams.showImg" :style="{ width: imgWidth, height: imgHeight, borderRadius: borderRadius}"></image>
				<view class="item-info flex-item" :style="{height: imgHeight}">
					<view class="info-title text-ellipsis" :style="{fontSize: nameSize, fontWeight: showStyle.nameWeight}">{{item.name}}</view>
					<view class="info-tag flex align-items-center">
						<view class="icon" :style="{width: iconSize, height: iconSize, backgroundSize: iconSize, backgroundImage: 'url('+ iconTime +')'}" v-if="showStyle.showIcon && iconTime"></view>
						<text class="text flex-item text-ellipsis" :style="{fontSize: contentSize}">{{item.start_time}} | {{item.week}}</text>
					</view>
					<view class="info-tag flex align-items-center" v-if="item.organizing_method == 1">
						<view class="icon" :style="{width: iconSize, height: iconSize, backgroundSize: iconSize, backgroundImage: 'url('+ iconNetwork +')'}" v-if="showStyle.showIcon && iconNetwork"></view>
						<text class="text flex-item text-ellipsis" :style="{fontSize: contentSize}">报名成功后查看</text>
					</view>
					<view class="info-tag flex align-items-center" v-else-if="item.organizing_method == 2">
						<view class="icon" :style="{width: iconSize, height: iconSize, backgroundSize: iconSize, backgroundImage: 'url('+ iconLocation +')'}" v-if="showStyle.showIcon && iconLocation"></view>
						<text class="text flex-item text-ellipsis" :style="{fontSize: contentSize}">{{item.address}}</text>
					</view>
				</view>
			</view>
		</view>
		<empty top="0" padding="0" width="200rpx" size="28rpx" title="暂无相关内容~" v-else></empty>
	</view>
</template>

<script>
	import svgData from "@/common/svg.js"
	import {
		mapState
	} from "vuex"
	export default {
		name: "activityDiy",
		props: ['showStyle', 'showParams'],
		data() {
			return {
				// 活动列表
				activityList: [],
			};
		},
		computed: {
			...mapState({
				themeColor: state => state.app.themeColor
			}),
			titleFontSize() {
				return uni.upx2px(this.showStyle.titleFontSize * 2) + 'px';
			},
			titleBtnSize() {
				return uni.upx2px(this.showStyle.titleBtnSize * 2) + 'px';
			},
			titleIconMore() {
				return svgData.svgToUrl("more", this.showStyle.titleBtnColor)
			},
			titleIconSize() {
				return uni.upx2px(this.showStyle.titleIconSize * 2) + 'px';
			},
			titleSpace() {
				return uni.upx2px(this.showStyle.titleSpace * 2) + 'px';
			},
			itemBorderRadius() {
				return uni.upx2px(this.showStyle.itemBorderRadius * 2) + 'px';
			},
			imgWidth() {
				return uni.upx2px(this.showStyle.imgWidth * 2) + 'px';
			},
			imgHeight() {
				return uni.upx2px(this.showStyle.imgHeight * 2) + 'px';
			},
			borderRadius() {
				return uni.upx2px(this.showStyle.borderRadius * 2) + 'px';
			},
			nameSize() {
				return uni.upx2px(this.showStyle.nameSize * 2) + 'px';
			},
			iconSize() {
				return uni.upx2px(this.showStyle.iconSize * 2) + 'px';
			},
			iconTime() {
				return svgData.svgToUrl("time", this.showStyle.iconColor)
			},
			iconLocation() {
				return svgData.svgToUrl("location", this.showStyle.iconColor)
			},
			iconNetwork() {
				return svgData.svgToUrl("network", this.showStyle.iconColor)
			},
			contentSize() {
				return uni.upx2px(this.showStyle.contentSize * 2) + 'px';
			},
			paddingTop() {
				return uni.upx2px(this.showStyle.paddingTop * 2) + 'px';
			},
			paddingLeft() {
				return uni.upx2px(this.showStyle.paddingLeft * 2) + 'px';
			},
			itemSpace() {
				return uni.upx2px(this.showStyle.itemSpace * 2) + 'px';
			},
		},
		watch: {
			showParams: {
				handler(value) {
					if (value) this.getActivityList()
				},
				immediate: true,
				deep: true
			}
		},
		methods: {
			// 获取活动列表
			getActivityList() {
				this.$util.request("activity.list", {
					page: 1,
					limit: this.showParams.count
				}).then(res => {
					if (res.code == 1) {
						this.activityList = res.data.data
					} else {
						uni.showToast({
							title: res.msg,
							icon: 'none'
						})
					}
				}).catch(error => {
					console.error('获取活动列表 ', error)
				})
			},
			// 跳转详情
			toDetails(id, state) {
				if (state == 2) {
					this.getMemberState(() => {
						this.$util.toPage({
							mode: 1,
							path: "/pagesActivity/index/details?id=" + id
						})
					})
				} else {
					this.$util.toPage({
						mode: 1,
						path: "/pagesActivity/index/details?id=" + id
					})
				}
			},
			// 获取会员状态
			getMemberState(fn) {
				uni.showLoading({
					title: "加载中",
					mask: true,
				})
				this.$util.request("member.state").then(res => {
					uni.hideLoading()
					if (res.code == 1) {
						if (res.data.state.state == 6) {
							fn()
						} else if (res.data.state.state == -1) {
							uni.showModal({
								title: "系统提示",
								content: "此页面需成为会员后可查看！",
								confirmColor: this.themeColor,
								confirmText: "去加入",
								success: (res) => {
									if (res.confirm) {
										uni.navigateTo({
											url: "/pages/member/apply/index"
										})
									}
								}
							})
						} else {
							uni.showModal({
								title: "系统提示",
								content: "此页面需成为会员后可查看！",
								confirmColor: this.themeColor,
								confirmText: "前往查看",
								success: (res) => {
									if (res.confirm) {
										uni.switchTab({
											url: "/pages/mine/index"
										})
									}
								}
							})
						}
					} else {
						uni.showToast({
							title: res.msg,
							icon: 'none'
						})
					}
				}).catch(error => {
					console.error('获取会员状态 ', error)
				})
			},
			// 跳转活动列表
			toMore() {
				this.$util.toPage({
					mode: 1,
					path: "/pagesActivity/index/index"
				})
			},
		},
	}
</script>

<style lang="scss">
	.diy-activity {
		.activity-title {
			display: flex;
			align-items: center;
			justify-content: space-between;
		}

		.activity-list {
			.list-item {
				&:first-child {
					margin-top: 0 !important;
				}

				.item-image {
					margin-right: 32rpx;
				}

				.item-info {
					display: flex;
					flex-direction: column;
					justify-content: space-between;

					.info-title {
						color: #5A5B6E;
						line-height: 1.3;
					}

					.info-tag {
						.icon {
							margin-right: 10rpx;
						}

						.text {
							color: #8D929C;
							line-height: 1.3;
						}
					}
				}
			}
		}
	}
</style>