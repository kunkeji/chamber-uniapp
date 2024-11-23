<template>
	<view :style="{background: showStyle.background, borderRadius: itemBorderRadius, padding: paddingTop +' '+ paddingLeft, textAlign: showStyle.textAlign, color: showStyle.textColor, fontSize: fontSize}">
		<text v-if="showStyle.fontStyle == 'bold'" style="font-weight: bold;">{{showStyle.text}}</text>
		<text v-else-if="showStyle.fontStyle == 'italic'" style="font-style: italic;">{{showStyle.text}}</text>
		<text v-else>{{showStyle.text}}</text>
	</view>
</template>

<script>
	export default {
		name: 'textDiy',
		props: ['showStyle'],
		computed: {
			itemBorderRadius() {
				return uni.upx2px(this.showStyle.itemBorderRadius * 2) + 'px';
			},
			fontSize() {
				return uni.upx2px(this.showStyle.fontsize * 2) + 'px';
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