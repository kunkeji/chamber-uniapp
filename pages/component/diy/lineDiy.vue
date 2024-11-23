<template>
	<view class="diy-line" :style="{padding: paddingTop + ' ' + paddingLeft, background: showStyle.background, borderRadius: itemBorderRadius}">
		<view class="line" :style="{borderTop: line}">
		</view>
	</view>
</template>

<script>
	export default {
		name: 'lineDiy',
		props: ['showStyle'],
		computed: {
			itemBorderRadius() {
				return uni.upx2px(this.showStyle.itemBorderRadius * 2) + 'px';
			},
			line() {
				return uni.upx2px(this.showStyle.lineHeight * 2) + 'px' + ' ' + this.showStyle.lineStyle + ' ' + this.showStyle.lineColor;
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

<style lang="scss">
	.diy-line .line {
		width: 100%;
	}
</style>