<template>
	<view class="diy-video" :style="{padding: paddingTop + ' ' + paddingLeft, background: showStyle.background, borderRadius: itemBorderRadius}">
		<video :src="showParams.videoUrl" :poster="getImagePath(showParams.poster)" :autoplay="showParams.autoplay == 1" controls="false"></video>
	</view>
</template>

<script>
	export default {
		name: 'videoDiy',
		props: ['showStyle', 'showParams', 'domain'],
		computed: {
			paddingTop() {
				return uni.upx2px(this.showStyle.paddingTop * 2) + 'px';
			},
			paddingLeft() {
				return uni.upx2px(this.showStyle.paddingLeft * 2) + 'px';
			},
			itemBorderRadius() {
				return uni.upx2px(this.showStyle.itemBorderRadius * 2) + 'px';
			},
		},
		methods: {
			// 获取图片地址
			getImagePath(url) {
				if (url.indexOf('http') > -1) {
					return url
				} else {
					return this.domain + url
				}
			},
		},
	}
</script>

<style lang="scss">
	.diy-video video {
		width: 100%;
		display: block;
	}
</style>