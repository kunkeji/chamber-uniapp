<template>
	<view class="container">
		<!-- 标题栏 -->
		<title-bar title="详情"></title-bar>
		<!-- 内容区 -->
		<view class="container-main" v-if="loadEnd">
			<mp-html :content="imageTextContent" />
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				// 加载完成
				loadEnd: false,
				// 图文类型 1.轮播图图文，2.快速导航图文，3.商城轮播图图文
				imageTextType: 1,
				// 图文Id
				imageTextId: null,
				// 图文内容
				imageTextContent: ''
			};
		},
		onLoad(option) {
			this.imageTextType = option.type
			this.imageTextId = option.id
			uni.showLoading({
				title: "加载中"
			})
			this.getImageText(() => {
				this.loadEnd = true
				uni.hideLoading()
			})
		},
		methods: {
			// 获取图文内容
			getImageText(fn) {
				let url = ""
				if (this.imageTextType == 1) url = "main.carouselDetails"
				else if (this.imageTextType == 2) url = "main.menuDetails"
				else if (this.imageTextType == 3) url = "mall.carouselDetails"
				else return
				this.$util.request(url, {
					id: this.imageTextId
				}).then(res => {
					if (fn) fn()
					if (res.code == 1) {
						this.imageTextContent = res.data.content
					} else {
						uni.showToast({
							title: res.msg,
							icon: 'none'
						})
					}
				}).catch(error => {
					if (fn) fn()
					console.error('获取图文详情 ', error)
				})
			},
		},
	}
</script>

<style lang="scss">
	page {
		background: #fff;
	}

	.container {
		.container-main {
			padding: 32rpx;
			font-size: 32rpx;
			line-height: 60rpx;
			color: #666;
		}
	}
</style>