<template>
	<view class="container">
		<!-- 标题栏 -->
		<title-bar :showBack="true" title="修改信息"></title-bar>
		<!-- 内容区 -->
		<form class="container-form" @submit="onConfirm" v-if="loadEnd">
			<view class="form-item flex align-items-center">
				<view class="item-title">头像</view>
				<button class="item-avatar flex-item flex justify-content-end" open-type="chooseAvatar" @chooseavatar="chooseAvatar">
					<image class="avatar" :src="avatar" mode="aspectFill" v-if="avatar"></image>
					<image class="avatar" :src="userInfo.avatar" mode="aspectFill" v-else></image>
				</button>
			</view>
			<view class="form-item flex align-items-center">
				<view class="item-title">昵称</view>
				<view class="item-nickname flex-item">
					<input class="nickname" type="nickname" name="nickname" :value="nickname" placeholder="请输入新的昵称" />
				</view>
			</view>
			<button class="form-button" form-type="submit">
				<view class="btn" :style="{background: themeColor}" @click="onConfirm">设置</view>
				<view class="safe-padding"></view>
			</button>
		</form>
	</view>
</template>

<script>
	import {
		mapState
	} from "vuex"
	export default {
		data() {
			return {
				// 加载完成
				loadEnd: false,
				// 用户信息
				userInfo: {},
				// 头像
				avatar: "",
				// 昵称
				nickname: "",
				// 延时器
				timeout: null,
			}
		},
		computed: {
			...mapState({
				themeColor: state => state.app.themeColor,
			})
		},
		onLoad() {
			this.userInfo = uni.getStorageSync("userInfo")
			this.nickname = this.userInfo.nickname
			this.$nextTick(() => {
				this.loadEnd = true
			})
		},
		onUnload() {
			clearTimeout(this.timeout)
		},
		methods: {
			// 选择头像
			chooseAvatar(e) {
				this.avatar = e.detail.avatarUrl
			},
			// 设置
			onConfirm(e) {
				this.nickname = e.detail.value.nickname
				if (!this.nickname) {
					uni.showToast({
						icon: "none",
						title: "昵称不能为空"
					})
					return
				}
				if (!this.avatar && this.nickname === this.userInfo.nickname) {
					uni.showToast({
						icon: "success",
						title: "设置成功",
						mask: true,
						duration: 1000
					})
					this.timeout = setTimeout(() => {
						uni.navigateBack()
					}, 1000);
				} else {
					uni.showLoading({
						title: "加载中",
						mask: true
					})
					this.uploadAvatar(url => {
						var data = {
							avatar: url,
							nickname: this.nickname || this.userInfo.nickname
						}
						this.$util.request("mine.updateUser", data).then(res => {
							uni.hideLoading()
							if (res.code == 1) {
								var userInfo = uni.getStorageSync("userInfo")
								userInfo.avatar = res.data.avatar
								userInfo.nickname = res.data.nickname
								uni.setStorageSync("userInfo", userInfo)
								this.$store.commit('user/setUserInfo', userInfo)
								uni.showToast({
									icon: "success",
									title: "设置成功",
									mask: true,
									duration: 1000
								})
								this.timeout = setTimeout(() => {
									uni.navigateBack()
								}, 1000);
							} else {
								uni.showToast({
									title: res.msg,
									icon: 'none'
								})
							}
						}).catch(error => {
							uni.hideLoading()
							console.error('更新用户信息 ' + error)
						})
					})
				}
			},
			// 上传图片
			uploadAvatar(fn) {
				if (!this.avatar) {
					fn(this.userInfo.avatar)
				} else {
					this.$util.uploadFile(this.avatar).then(res => {
						if (res.code == 1) {
							fn(res.data.url)
						} else {
							uni.showToast({
								title: res.msg,
								icon: 'none'
							})
						}
					}).catch(error => {
						console.error('上传图片 ', error)
					})
				}
			},
		}
	}
</script>

<style lang="scss">
	.container {
		.container-form {
			display: block;
			padding: 32rpx 32rpx 168rpx;

			.form-item {
				margin-top: 32rpx;
				border-radius: 16rpx;
				background: #fff;

				&:first-child {
					margin-top: 0;
				}

				.item-title {
					color: #333;
					font-size: 32rpx;
					line-height: 44rpx;
					padding-left: 32rpx;
					margin-right: 24rpx;
				}

				.item-avatar {
					background: transparent;
					padding: 24rpx 32rpx 24rpx 0;

					.avatar {
						width: 80rpx;
						height: 80rpx;
						border-radius: 50%;
					}
				}

				.item-nickname {
					.nickname {
						text-align: right;
						color: #333;
						font-size: 32rpx;
						height: 80rpx;
						line-height: 80rpx;
						padding: 24rpx 0;
						box-sizing: content-box;
						padding-right: 32rpx;
					}

					.placeholder {
						color: #999;
					}
				}
			}

			.form-button {
				position: fixed;
				left: 0;
				right: 0;
				bottom: 0;
				z-index: 99;
				background: #fff;
				padding: 24rpx;

				.btn {
					color: #FFF;
					text-align: center;
					font-size: 32rpx;
					line-height: 44rpx;
					padding: 22rpx 32rpx;
					border-radius: 16rpx;
				}
			}
		}
	}
</style>