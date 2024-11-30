<template>
	<scroll-view scroll-x :scroll-left="scrollLeft" class="component-member-scroll" @scrolltolower="scrolltolower">
		<view class="scroll-item" v-for="item in showData" :key="item.id" @click="toDetails(item.id)">
			<image class="item-avatar" :src="item.avatar" mode="aspectFill"></image>
		</view>
	</scroll-view>
</template>

<script>
	export default {
		name: "memberScroll",
		props: ["showData"],
		data() {
			return {
				scrollLeft: 0,
			};
		},
		methods: {
			resetScrollLeft() {
				this.scrollLeft = 0.1
				this.$nextTick(() => {
					this.scrollLeft = 0
				})
			},
			scrolltolower() {
				this.$emit("scrolltolower")
			},
			toDetails(id) {
				this.$util.toPage({
					mode: 1,
					path: "/pages/member/details?id=" + id
				})
			},
		},
	}
</script>

<style lang="scss">
	.component-member-scroll {
		white-space: nowrap;

		.scroll-item {
			display: inline-block;
			width: 60rpx;
			margin-left: -10rpx;

			&:first-child {
				margin-left: 0;
			}

			.item-avatar {
				width: 60rpx;
				height: 60rpx;
				border-radius: 50%;
				border: 2rpx solid #fff;
			}
		}
	}
</style>