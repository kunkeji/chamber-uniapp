<template>
	<view class="container">
		<!-- 标题栏 -->
		<title-bar :showBack="true" title="查询结果"></title-bar>
		<!-- 内容区 -->
		<view class="container-main" v-if="loadEnd">
			<image :src="item.image" mode="widthFix" class="img" @click="previewImage(item.image)" v-for="(item, index) in image" :key="index"></image>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				// 加载完成
				loadEnd: false,
				// 图片
				image: ''
			};
		},
		onLoad(option) {
			this.image = JSON.parse(option.image);
			this.$nextTick(() => {
				this.loadEnd = true
			})
		},
		methods: {
			// 预览图片
			previewImage(image) {
				uni.previewImage({
					loop: true,
					urls: [image]
				})
			}
		}
	}
</script>

<style lang="scss">
	page {
		background: #FFF;
	}

	.container {
		.container-main {
			padding: 72rpx;

			.img {
				margin-bottom: 32rpx;
			}
		}
	}
</style>