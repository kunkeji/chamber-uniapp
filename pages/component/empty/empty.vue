<template>
	<view class="component-empty" :style="{marginTop: top, padding: padding}">
		<image class="image" :style="{width: width, height: width}" src="/static/empty.png" mode="widthFix"></image>
		<view class="text" :style="{fontSize: size}">
			<text>{{title}}</text>
			<view class="btn" @click="callback" v-if="btnText" :style="{ color: themeColor }">{{btnText}}</view>
		</view>
	</view>
</template>

<script>
	import {
		mapState
	} from "vuex"
	export default {
		name: "emptyIndex",
		props: {
			// 距顶部位置 注：center为居中显示
			top: {
				type: String,
				default: "32rpx"
			},
			// 盒子内边距
			padding: {
				type: String,
				default: "32rpx"
			},
			// 图标尺寸
			width: {
				type: String,
				default: "260rpx"
			},
			// 文字大小
			size: {
				type: String,
				default: "32rpx"
			},
			// 标题
			title: {
				type: String,
				default: "暂无相关内容~"
			},
			// 快捷按钮文字 注：为空则不显示
			btnText: {
				type: String,
				default: ""
			},
		},
		computed: {
			...mapState({
				themeColor: state => state.app.themeColor,
			})
		},
		methods: {
			// 快捷按钮回调函数
			callback() {
				this.$emit("callback")
			},
		},
	}
</script>

<style lang="scss">
	.component-empty {
		text-align: center;

		.image {
			width: 100%;
			height: 100%;
			display: block;
			margin: 0 auto 32rpx;
		}

		.text {
			color: #888;
			line-height: 1.4;
			display: flex;
			justify-content: center;
			
		}
	}
</style>