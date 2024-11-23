<template>
	<view class="container">
		<!-- 标题栏 -->
		<title-bar :showBack="true" title="修改供需"></title-bar>
		<!-- 内容区 -->
		<view class="container-main" v-if="loadEnd">
			<!-- 发布供需表单 -->
			<view class="main-form">
				<!-- 发布类型 -->
				<view class="main-form-item">
					<view class="main-form-title"><text style="color: #E60012;">*</text>发布类型</view>
					<view class="main-form-info" @click="selectMemberType">
						<view class="uni-input" v-if="memberType">
							<text v-for="item in typeList" :key="item.id" v-if="memberType == item.id">{{item.name}}</text>
						</view>
						<view class="alignments" v-else>
							<view class="info-txt">请选择发布类型</view>
							<image src="/static/right.png" mode="aspectFill" class="info-icon"></image>
						</view>
					</view>
				</view>
				<!-- 标题 -->
				<view class="main-form-item">
					<view class="main-form-title"><text style="color: #E60012;">*</text>标题</view>
					<view class="main-form-info">
						<input type="text" v-model="title" placeholder="请输入标题" placeholder-class="placeholder" />
					</view>
				</view>
				<!-- 介绍 -->
				<view class="main-form-item">
					<view class="main-form-title"><text style="color: #E60012;">*</text>介绍</view>
					<view class="main-form-info">
						<textarea v-model="content" style="height: 200rpx;width: 100%;" placeholder="请输入" placeholder-class="placeholder" />
					</view>
				</view>
				<!-- 详情图片 -->
				<view class="main-form-item" :style="{'--theme-color': themeColor}">
					<view class="main-form-title" style="padding-bottom: 0;">详情图片<text style="font-size: 24rpx;">(图片建议尺寸1:1,最多9张)</text></view>
					<view class="main-form-info" style="background: transparent;padding: 0;">
						<view class="flex flex-wrap">
							<view class="item-image" v-for="(item, index) in selectImages" :key="index">
								<image class="image" :src="item" mode="aspectFill" @click="previewImage(index)"></image>
								<image class="close" src="/static/cancel.png" mode="aspectFit" @click="deleteImage(index)"></image>
							</view>
							<view class="item-upload" @click="chooseImage()" v-if="selectImages.length < 9">
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
			</view>
			<!-- 提交按钮 -->
			<view class="main-bottom">
				<view class="harmless-content-button" :style="{ background: themeColor }" @click="submitCheck()">提交修改</view>
				<view class="safe-padding"></view>
			</view>
		</view>
		<!-- 单项选择框 -->
		<select-picker ref="selectPicker" title="发布类型" @onChange="pageChange" @confirm="changeSelectPicker"></select-picker>
	</view>
</template>

<script>
	import {
		mapState
	} from "vuex"
	import selectPicker from "@/pages/component/picker/select.vue"
	export default {
		components: {
			selectPicker
		},
		data() {
			return {
				// 加载完成
				loadEnd: false,
				// 供需id
				id: 0,
				// 已选发布类型
				memberType: '',
				// 发布类型列表
				typeList: [],
				// 标题
				title: "",
				// 内容
				content: '',
				// 上传图片
				image: '',
				// 已选择图片
				selectImages: [],
				// 编辑前已选择图片
				oldImages: [],
				// 分类列表
				classifyList: [],
			};
		},
		computed: {
			...mapState({
				themeColor: state => state.app.themeColor,
			})
		},
		onLoad(option) {
			uni.showLoading({
				title: "加载中"
			})
			// 获取商圈分类
			this.getDemandNav()
			this.id = option.id
			if (this.id) {
				this.getDemandDetails()
			}
		},
		methods: {
			// 获取详情
			getDemandDetails() {
				this.$util.request("demand.businessUserDetails", {
					id: this.id
				}).then(res => {
					if (res.code == 1) {
						this.memberType = res.data.business.category_id,
							this.title = res.data.business.title,
							this.content = res.data.business.content,
							this.oldImages = res.data.business.images.split(','),
							uni.hideLoading()
						this.loadEnd = true
						if (res.data.business.images) {
							this.selectImages = res.data.business.images.split(',')
						}
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
			// 提交校验 
			submitCheck() {
				if (this.memberType == '') {
					uni.showToast({
						title: "请选择发布类型",
						icon: 'none'
					})
					return
				}
				if (this.title == '') {
					uni.showToast({
						title: "请输入标题",
						icon: 'none'
					})
					return
				}
				if (this.content == '') {
					uni.showToast({
						title: "请输入内容",
						icon: 'none'
					})
					return
				}
				if (this.selectImages.length > 0) {
					uni.showLoading({
						title: "上传图片中",
						mask: true
					})
					this.$util.uploadFileMultiple(this.selectImages, this.oldImages).then(result => {
						uni.hideLoading()
						this.image = result
						this.submit()
						uni.showLoading({
							title: "提交中",
							mask: true
						})
					}).catch(error => {
						uni.hideLoading()
						console.error('上传图片 ', error)
					})
				} else {
					this.submit()
					uni.showLoading({
						title: "提交中",
						mask: true
					})
				}
			},
			// 提交审核
			submit() {
				this.$util.request("demand.businessEdit", {
					id: this.id,
					category_id: this.memberType,
					title: this.title,
					content: this.content,
					images: this.image
				}).then(res => {
					if (res.code == 1) {
						uni.showToast({
							title: "提交成功",
							mask: true
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
					console.error('提交审核', error)
				})

			},
			// 改变页面滚动状态
			pageChange(state) {
				this.pageShow = state
			},
			// 选择入会类型
			selectMemberType() {
				this.$refs.selectPicker.open(this.typeList, this.memberType)
			},
			// 改变下拉选项
			changeSelectPicker(value) {
				this.memberType = value.id
			},
			// 获取商圈分类
			getDemandNav() {
				this.$util.request("demand.businessCat", {}).then(res => {
					if (res.code == 1) {
						this.typeList = res.data
					} else {
						uni.showToast({
							title: res.msg,
							icon: 'none'
						})
					}
				}).catch(error => {
					console.error('获取商圈分类', error)
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
					sourceType: ['album', 'camera'],
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
			padding-bottom: 200rpx;

			.main-form {
				padding: 16rpx 48rpx;

				.main-form-item {
					margin-top: 32rpx;

					.main-form-title {
						padding-bottom: 32rpx;
						font-size: 32rpx;
						color: #5A5B6E;
					}

					.main-form-info {
						padding: 36rpx 32rpx;
						border-radius: 16rpx;
						background: #FFFFFF;

						.info-txt {
							flex: 1;
							font-size: 28rpx;
							color: #ACADB7;
						}

						.info-icon {
							width: 32rpx;
							height: 32rpx;
						}

						.placeholder {
							font-size: 28rpx;
							color: #ACADB7;
						}

						.item-image {
							width: 32%;
							height: 0;
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
							width: 32%;
							height: 0;
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
								// width: 240rpx;
								// height: 240rpx;
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
				}
			}

			.main-bottom {
				padding-top: 16rpx;
				padding-bottom: 16rpx;
				position: fixed;
				bottom: 0;
				left: 0;
				right: 0;
				width: 100%;
				text-align: center;
				background: #FFF;
				z-index: 99;

				.harmless-content-button {
					margin-left: 26rpx;
					margin-right: 26rpx;
					width: 700rpx;
					height: 80rpx;
					background: rgba(50, 93, 255, 1);
					color: rgba(255, 255, 255, 1);
					text-align: center;
					line-height: 80rpx;
					border-radius: 16rpx;
				}

				.safe-padding {
					width: 100%;
					padding-bottom: constant(safe-area-inset-bottom);
					/* 兼容 iOS < 11.2 */
					padding-bottom: env(safe-area-inset-bottom);
					/* 兼容 iOS >= 11.2 */
				}

			}
		}
	}
</style>