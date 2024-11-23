<template>
	<view class="container">
		<!-- 标题栏 -->
		<title-bar title="常见问题"></title-bar>
		<!-- 内容区 -->
		<view class="container-main" v-if="loadEnd">
			<view class="main-box">
				<view class="box-title">{{problemInfo.title}}</view>
				<view class="box-content">
					<mp-html :content="problemInfo.reply"></mp-html>
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
				// 加载完成
				loadEnd: false,
				// 问题id
				problemId: null,
				// 问题详情
				problemInfo: {},
			}
		},
		onLoad(option) {
			uni.showLoading({
				title: "加载中"
			})
			this.problemId = option.id
			this.getProblemInfo(() => {
				this.loadEnd = true
				uni.hideLoading()
			})
		},
		methods: {
			// 获取问题详情
			getProblemInfo(fn) {
				this.$util.request("mine.problemDetails", {
					id: this.problemId
				}).then(res => {
					if (fn) fn()
					if (res.code == 1) {
						this.problemInfo = res.data
					} else {
						uni.showToast({
							title: res.msg,
							icon: 'none'
						})
					}
				}).catch(error => {
					console.error('获取问题详情 ', error)
				})
			},
		},
	}
</script>

<style lang="scss">
	.container {
		.container-main {
			padding: 32rpx;

			.main-box {
				padding: 32rpx;
				border-radius: 10rpx;
				background: #ffffff;

				.box-title {
					color: #5A5B6E;
					font-size: 32rpx;
					font-weight: 600;
					line-height: 40rpx;
					padding-bottom: 32rpx;
					border-bottom: 1rpx solid rgba(0, 0, 0, 0.1);
				}

				.box-content {
					margin-top: 32rpx;
					color: #5A5B6E;
					font-size: 28rpx;
					line-height: 48rpx;
				}
			}
		}
	}
</style>