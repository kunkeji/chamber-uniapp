<template>
	<view scroll-x class="component-chains">
		<view class="chains-item" :class="{'chains-list-item': showType == 1}" v-for="item in showData" :key="item.id" @click="toDetails(item)">
			<view class="item-title text-ellipsis">{{item.name}}</view>
			<view class="item-tag flex justify-content-between">
				<view class="tag-box flex">
					<text style="margin-left: 0;">{{item.expire_time}}</text>
					<text v-if="item.type == 1">自由接龙</text>
					<text v-else>限定接龙</text>
				</view>
				<view class="tag-box flex">
					<text>浏览{{item.page_view}}</text>
					<text>参与{{item.part_total}}</text>
				</view>
			</view>
			<view class="item-btn flex align-items-center">
				<!-- #ifdef MP-WEIXIN -->
				<button open-type="share" class="btn-box clear flex align-items-center" @click.stop="setShareData(item)">
					<view class="icon" :style="{'background-image': 'url('+ iconInvite +')'}" v-if="iconInvite"></view>
					<text class="text">邀请填写</text>
				</button>
				<!-- #endif -->
				<!-- #ifndef MP-WEIXIN -->
				<view class="btn-box flex align-items-center">
					<view class="icon" :style="{'background-image': 'url('+ iconInvite +')'}" v-if="iconInvite"></view>
					<text class="text">填写接龙</text>
				</view>
				<!-- #endif -->
				<view class="btn-line"></view>
				<view class="btn-box justify-content-end flex align-items-center" @click.stop="onContact(item.mobile)">
					<view class="icon" :style="{'background-image': 'url('+ iconPhone +')'}" v-if="iconPhone"></view>
					<text class="text">联系电话</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import svgData from "@/common/svg.js"
	import {
		mapState
	} from "vuex"
	export default {
		name: "chainsIndex",
		props: ["showData", "showType"],
		data() {
			return {

			};
		},
		computed: {
			...mapState({
				jielongImg: state => state.app.jielongImg,
				themeColor: state => state.app.themeColor,
				iconInvite: state => {
					return svgData.svgToUrl("invite", state.app.themeColor)
				},
				iconPhone: state => {
					return svgData.svgToUrl("phone", state.app.themeColor)
				},
			})
		},
		methods: {
			// 设置分享数据
			setShareData(item) {
				this.$emit('setShareData', {
					title: item.name,
					path: '/pagesTools/sequence/details?id=' + item.id,
					imageUrl: this.jielongImg,
				})
			},
			// 去详情 
			toDetails(item) {
				// type = 1为自由接龙,直接进入 
				if (item.type == 1) {
					if (item.jielong_auth == 2) {
						this.getMemberState(() => {
							this.$util.toPage({
								mode: 1,
								path: "/pagesTools/sequence/details?id=" + item.id
							})
						})
					} else {
						this.$util.toPage({
							mode: 1,
							path: "/pagesTools/sequence/details?id=" + item.id
						})
					}
				} else if (item.type == 2) {
					// type = 2为限定接龙,需调接口判断
					this.$util.request("sequence.chainsSeniority", {
						id: item.id
					}).then(res => {
						if (res.code == 1) {
							if (res.data.state == 1) {
								this.$util.toPage({
									mode: 1,
									path: "/pagesTools/sequence/details?id=" + item.id
								})
							} else {
								uni.showToast({
									title: "您无法参加此限定接龙,请联系管理员添加",
									icon: 'none'
								})
							}
						} else {
							uni.showToast({
								title: res.msg,
								icon: 'none'
							})
						}
					}).catch(error => {
						console.error('是否有资格进入', error)
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
			// 联系电话
			onContact(phone) {
				this.$util.toPage({
					mode: 6,
					phone: phone,
				})
			}
		},
	}
</script>

<style lang="scss">
	.component-chains {
		.chains-item {
			margin-top: 32rpx;

			&.chains-list-item {
				padding: 32rpx;
				border-radius: 10rpx;
				background: #FFFFFF;
			}

			&:first-child {
				margin-top: 0;
			}

			.item-title {
				color: #5A5B6E;
				font-size: 28rpx;
				line-height: 40rpx;
			}

			.item-tag {
				margin-top: 16rpx;

				.tag-box {
					text {
						color: #999999;
						font-size: 24rpx;
						line-height: 34rpx;
						margin-left: 16rpx;
					}
				}
			}

			.item-btn {
				margin-top: 32rpx;
				border-top: 1rpx solid #E8E8E8;
				padding-top: 32rpx;

				.btn-box {
					flex: 1;
					padding: 0 48rpx;

					.icon {
						width: 32rpx;
						height: 32rpx;
						background-size: 32rpx;
					}

					.text {
						margin-left: 8rpx;
						color: #5A5B6E;
						font-size: 28rpx;
						line-height: 34rpx;
					}
				}

				.btn-line {
					width: 0;
					height: 32rpx;
					border-left: 1rpx solid #E8E8E8;
				}
			}
		}
	}
</style>