<template>
	<view class="container">
		<!-- 标题栏 -->
		<title-bar title="活动接龙反馈"></title-bar>
		<!-- 内容区 -->
		<view class="container-main" v-if="loadEnd">
			<view class="main-item">
				<view class="main-item-title">1.署名<text class="main-item-symbol">*</text></view>
				<view class="main-item-input">{{name}}</view>
			</view>
			<view class="main-item">
				<view class="main-item-title">2.图片</view>
				<view class="main-form-info" :style="{'--theme-color': themeColor}">
					<view class="flex flex-wrap">
						<view class="item-image" v-for="(item, index) in selectImages" :key="index">
							<image class="image" :src="item" mode="aspectFill" @click="previewImage(index)"></image>
							<image class="close" src="/static/cancel.png" mode="aspectFit" @click="deleteImage(index)"></image>
						</view>
						<view class="item-upload" @click="chooseImage()" v-if="selectImages.length < 1">
							<view class="image-background"></view>
							<view class="image-choose">
								<view class="icon">
									<image src="/static/camera.png" mode="aspectFit"></image>
								</view>
								<view class="text">上传图片</view>
							</view>
						</view>
					</view>
				</view>
			</view>
			<view class="main-item">
				<view class="main-item-title">3.内容</view>
				<view class="main-item-textarea"><textarea class="textarea" placeholder="请输入反馈内容" placeholder-class="placeholder" v-model="content"></textarea></view>
			</view>
			<view class="main-item">
				<view class="main-item-button" :style="{ background: themeColor }" @click="submitFeedback(1)">参加</view>
				<view class="main-item-button" :style="{ background: themeColorTypeOne }" @click="submitFeedback(2)">不参加</view>
				<view class="main-item-button" :style="{ background: themeColorTypeTwo }" @click="submitFeedback(3)">参加其它</view>
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
				// 加载完成
				loadEnd: false,
				// 接龙id
				chainsId: 0,
				// 会员id
				memberId: 0,
				// 会员姓名
				name: "",
				// 反馈内容
				content: "",
				// 参加状态
				status: 0,
				// 提交的图片
				image: "",
				// 已选择图片
				selectImages: [],
			};
		},
		computed: {
			...mapState({
				themeColor: state => state.app.themeColor
			}),
			themeColorTypeOne() {
				return this.$util.hexToRgb(this.themeColor, 0.6);
			},
			themeColorTypeTwo() {
				return this.$util.hexToRgb(this.themeColor, 0.3);
			}
		},
		onLoad(option) {
			this.memberId = option.memberId
			this.chainsId = option.chainsId
			this.name = option.name
			this.$nextTick(() => {
				this.loadEnd = true
			})
		},
		methods: {
			// 提交反馈
			submitFeedback(status) {
				this.status = status
				if (this.selectImages[0]) {
					uni.showLoading({
						title: "上传图片中",
						mask: true
					})
					this.$util.uploadFile(this.selectImages[0]).then(result => {
						this.image = result.data.url
						uni.hideLoading()
						this.submit()
					}).catch(error => {
						uni.hideLoading()
						console.error('上传图片 ', error)
					})
				} else {
					this.submit()
				}
			},
			submit() {
				uni.showLoading({
					title: "提交中",
					mask: true
				})
				this.$util.request("sequence.addFeedback", {
					jielong_id: this.chainsId,
					member_id: this.memberId,
					name: this.name,
					images: this.image,
					content: this.content,
					status: this.status
				}).then(res => {
					if (res.code == 1) {
						uni.hideLoading()
						uni.showToast({
							title: "反馈成功",
							mask: true,
							duration: 1000
						})
						setTimeout(() =>
							uni.navigateBack(), 1000)
					} else {
						uni.showToast({
							title: res.msg,
							icon: 'none'
						})
					}
				}).catch(error => {
					console.error('获取详情', error)
				})
			},
			// 选择图片
			chooseImage() {
				// #ifdef MP-WEIXIN
				uni.chooseMedia({
					count: 9 - this.selectImages.length,
					mediaType: ['image'],
					sourceType: ['album', 'camera'],
					sizeType: ['compressed'],
					success: (res) => {
						this.selectImages = [...this.selectImages, ...res.tempFiles.map(item => item.tempFilePath)]
					}
				})
				// #endif
				// #ifndef MP-WEIXIN
				uni.chooseImage({
					count: 9 - this.selectImages.length,
					sizeType: ['original', 'compressed'],
					sourceType: ['album', 'camera '],
					sizeType: ['compressed'],
					success: (res) => {
						this.selectImages = [...this.selectImages, ...res.tempFilePaths]
					}
				});
				// #endif
			},
			// 删除图片
			deleteImage(index) {
				this.$delete(this.selectImages, index)
			},
			// 预览图片
			previewImage(index) {
				uni.previewImage({
					urls: this.selectImages,
					current: index,
				})
			},
		}
	}
</script>

<style lang="scss">
	.container {
		.container-main {
			padding: 48rpx;

			.main-item {
				margin-top: 32rpx;

				.main-item-title {
					font-size: 32rpx;
					font-weight: 600;
					color: #5A5B6E;

					.main-item-symbol {
						color: #E60012;
					}

				}

				.main-item-input {
					margin-top: 32rpx;
					padding: 36rpx 32rpx;
					border-radius: 16rpx;
					background: #FFFFFF;
					color: #5A5B6E;
					font-size: 28rpx;
					line-height: 40rpx;
				}

				.main-item-textarea {
					margin-top: 32rpx;
					padding: 36rpx 32rpx;
					border-radius: 16rpx;
					background: #FFFFFF;

					.textarea {
						height: 118rpx;
						width: 100%;
					}

					.placeholder {
						font-size: 28rpx;
						line-height: 40rpx;
						color: #ACADB7;
					}
				}

				.main-item-button {
					margin-top: 16rpx;
					padding: 28rpx 0rpx;
					border-radius: 16rpx;
					font-size: 28rpx;
					line-height: 40rpx;
					text-align: center;
					color: #FFFFFF;

					&:first-child {
						margin-top: 0;
					}
				}

				.main-form-info {
					border-radius: 16rpx;
					background: transparent;

					.item-image {
						width: 240rpx;
						height: 240rpx;
						padding-top: 32%;
						position: relative;
						margin-top: 32rpx;
						margin-right: 2%;

						&:nth-child(3n) {
							margin-right: 0;
						}

						.image {
							position: absolute;
							top: 0;
							left: 0;
							border-radius: 10rpx;
						}

						.close {
							position: absolute;
							z-index: 1;
							top: 0;
							right: 0;
							width: 48rpx;
							height: 48rpx;
						}
					}

					.item-upload {
						width: 240rpx;
						height: 240rpx;
						padding-top: 32%;
						position: relative;
						margin-top: 32rpx;
						border-radius: 10rpx;
						background: #FFF;

						.image {
							position: absolute;
							top: 0;
							left: 0;
							border-radius: 10rpx;
							width: 240rpx;
							height: 240rpx;
						}

						.image-background {
							position: absolute;
							top: 0;
							left: 0;
							right: 0;
							bottom: 0;
							z-index: 1;
							background: var(--theme-color);
							opacity: 0.08;
						}

						.image-choose {
							position: absolute;
							top: 20rpx;
							left: 20rpx;
							right: 20rpx;
							bottom: 20rpx;
							z-index: 6;
							display: flex;
							flex-direction: column;
							justify-content: center;
							align-items: center;
							background: #ffffff;
							border-radius: 6rpx;

							.icon {
								width: 80rpx;
								height: 80rpx;
								padding: 18rpx;
								background: var(--theme-color);
								border-radius: 50%;
							}

							.text {
								margin-top: 16rpx;
								color: var(--theme-color);
								font-size: 28rpx;
								line-height: 40rpx;
							}
						}
					}
				}

				&:first-child {
					margin-top: 0;
				}
			}
		}
	}
</style>