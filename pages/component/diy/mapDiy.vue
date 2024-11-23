<template>
	<view class="diy-map" :style="{padding: paddingTop + ' ' + paddingLeft, background: showStyle.background, borderRadius: itemBorderRadius}">
		<map class="map" :latitude="showParams.latitude" :longitude="showParams.longitude" :style="{height: height}" @click="onClick"></map>
	</view>
</template>

<script>
	export default {
		name: 'mapDiy',
		props: ['showStyle', 'showParams'],
		computed: {
			itemBorderRadius() {
				return uni.upx2px(this.showStyle.itemBorderRadius * 2) + 'px';
			},
			height() {
				return uni.upx2px(this.showStyle.height * 2) + 'px';
			},
			paddingTop() {
				return uni.upx2px(this.showStyle.paddingTop * 2) + 'px';
			},
			paddingLeft() {
				return uni.upx2px(this.showStyle.paddingLeft * 2) + 'px';
			},
		},
		methods: {
			// 点击事件
			onClick() {
				uni.openLocation({
					latitude: parseFloat(this.showParams.latitude),
					longitude: parseFloat(this.showParams.longitude),
				});
			}
		}
	}
</script>

<style lang="scss">
	.diy-map .map {
		width: 100%;
	}
</style>