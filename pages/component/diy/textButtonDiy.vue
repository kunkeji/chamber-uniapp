<template>
	<view class="diy-text-button" :style="{padding: paddingTop + ' ' + paddingLeft, background: showStyle.background, borderRadius: itemBorderRadius}">
		<block v-for="(item, index) in showData" :key="index">
			<button class="item clear" open-type="contact" :style="{color: showStyle.textColor, fontSize: fontSize}" v-if="item.link && item.link.type == 'Service'">
				{{item.text}}
			</button>
			<view class="item" :style="{color: showStyle.textColor, fontSize: fontSize}" @click="onClick(item.link)" v-else>
				<text>{{item.text}}</text>
				<!-- #ifdef H5 -->
				<wx-open-launch-weapp class="item-absolute" :appid="item.link.appid" :path="item.link.path" v-if="item.link && item.link.type == 'WXMp'">
					<script type="text/wxtag-template">
						<style> .btn { position: absolute; top: 0; left: 0; right: 0; bottom: 0; } </style>
						<view class="btn"></view>
					</script>
				</wx-open-launch-weapp>
				<!-- #endif -->
			</view>
		</block>
	</view>
</template>

<script>
	export default {
		name: 'textButtonDiy',
		props: ['showStyle', 'showData'],
		computed: {
			itemBorderRadius() {
				return uni.upx2px(this.showStyle.itemBorderRadius * 2) + 'px';
			},
			fontSize() {
				return uni.upx2px(this.showStyle.fontSize * 2) + 'px';
			},
			paddingTop() {
				return uni.upx2px(this.showStyle.paddingTop * 2) + 'px';
			},
			paddingLeft() {
				return uni.upx2px(this.showStyle.paddingLeft * 2) + 'px';
			},
		},
		methods: {
			onClick(e) {
				if (!e) return;
				this.$emit("onClick", e)
			},
		}
	}
</script>
<style lang="scss">
	.diy-text-button {
		height: auto;

		.item {
			position: relative;
			padding: 0.5rem;
			text-align: center;
			position: relative;
			color: #666;
			font-size: 0.75rem;
			width: 1%;
			display: table-cell;
			-webkit-user-select: none;
			-moz-user-select: none;
			transition: background-color 300ms;
			-webkit-transition: background-color 300ms;

			.item-absolute {
				display: block;
				position: absolute;
				top: 0;
				left: 0;
				right: 0;
				bottom: 0;
			}
		}
	}
</style>