<template>
	<view class="diy-blank" :style="{height: height, background: showStyle.background, borderRadius: itemBorderRadius}"></view>
</template>

<script>
	export default {
		name: 'blankDiy',
		props: ['showStyle'],
		computed: {
			itemBorderRadius() {
				return uni.upx2px(this.showStyle.itemBorderRadius * 2) + 'px';
			},
			height() {
				return uni.upx2px(this.showStyle.height * 2) + 'px';
			},
		},
	}
</script>