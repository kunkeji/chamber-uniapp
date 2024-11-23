<template>
	<block v-if="isshow">
		<view :style="{padding: paddingTop + ' ' + paddingLeft, background: showStyle.background, borderRadius: itemBorderRadius}">
			<u-alert-tips :type="showStyle.type" :title="showParams.title" :description="showParams.description" :close-able="showParams.closable" :show="show" @close="onClick" :show-icon="showParams.showIcon"></u-alert-tips>
		</view>
	</block>
</template>

<script>
	export default {
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
		data() {
			return {
				show: true,
				isshow: true,
			}
		},
		methods: {
			onClick() {
				this.show = false;
				this.isshow = false;
			}
		}
	}
</script>