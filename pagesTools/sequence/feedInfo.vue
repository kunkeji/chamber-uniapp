<template>
	<view class="container">
		<!-- 标题栏 -->
		<title-bar title="反馈信息"></title-bar>
		<!-- 内容区 -->
		<view class="container-main" v-if="loadEnd">
			<view class="main-box">
				<view class="alignments">
					<image :src="details.menber_data.avatar" class="main-img" mode="aspectFill"></image>
					<view class="main-content">
						<view class="flex">
							<view class="main-content-name">{{details.menber_data.name}}</view>
							<view class="main-content-leval">{{details.menber_data.member_leve}}</view>
						</view>
						<view class="main-content-time">{{details.feedback_data.createtime}}</view>
					</view>
				</view>
				<view class="main-info">
					<view class="main-info-txt" v-if="details.feedback_data.status">{{details.feedback_data.status}}</view>
					<view class="main-info-txt" v-if="details.feedback_data.content">
						<text>{{details.feedback_data.content}}</text>
					</view>
					<image :src="details.feedback_data.images" mode="aspectFill" class="main-info-img" v-if="details.feedback_data.images"></image>
				</view>
			</view>
		</view>
		<!-- 底部导航 -->
		<tab-bar></tab-bar>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				// 加载状态
				loadEnd: false,
				// 接龙id
				id: 0,
				details: {}
			};
		},
		onLoad(option) {
			uni.showLoading({
				title: "加载中"
			})
			this.id = option.id
			if (this.id) {
				this.getDetails()
			}
		},
		methods: {
			getDetails() {
				this.$util.request("sequence.feedbackDetails", {
					jielong_id: this.id
				}).then(res => {
					if (res.code == 1) {
						this.details = res.data
						uni.hideLoading()
						this.loadEnd = true
					} else {
						uni.showToast({
							title: res.msg,
							icon: 'none'
						})
					}
				}).catch(error => {
					console.error('判断是否反馈过', error)
				})
			}
		}
	}
</script>

<style lang="scss">
	.container {
		.container-main {
			padding: 32rpx;

			.main-box {
				padding: 32rpx;
				border-radius: 10rpx;
				background: #FFFFFF;

				.main-img {
					margin-right: 16rpx;
					width: 80rpx;
					height: 80rpx;
					border-radius: 50%;
				}

				.main-content {
					.main-content-name {
						font-size: 28rpx;
						font-weight: 600;
						line-height: 20px;
						color: #5A5B6E;
					}

					.main-content-leval {
						padding-left: 8rpx;
						font-size: 28rpx;
						line-height: 20px;
						color: #325DFF;
					}

					.main-content-time {
						padding-top: 6rpx;
						font-size: 24rpx;
						line-height: 34rpx;
						color: #8D929C;
					}
				}

				.main-info {
					padding-top: 32rpx;

					.main-info-txt {
						font-size: 28rpx;
						line-height: 40rpx;
						color: #8D929C;
					}

					.main-info-img {
						margin-top: 32rpx;
						width: 100%;
						height: 300rpx;
					}
				}
			}
		}
	}
</style>