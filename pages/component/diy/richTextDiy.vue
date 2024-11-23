<template>
	<!-- 富文本 -->
	<view class="diy-richText" :style="{padding: paddingTop + ' ' + paddingLeft, background: showStyle.background, borderRadius: itemBorderRadius}">
		<mp-html :content="showParams.content" />
	</view>
</template>

<script>
	export default {
		name: 'richTextDiy',
		props: ['showStyle', 'showParams'],
		computed: {
			itemBorderRadius() {
				return uni.upx2px(this.showStyle.itemBorderRadius * 2) + 'px';
			},
			paddingTop() {
				return uni.upx2px(this.showStyle.paddingTop * 2) + 'px';
			},
			paddingLeft() {
				return uni.upx2px(this.showStyle.paddingLeft * 2) + 'px';
			},
		},
	}
</script>