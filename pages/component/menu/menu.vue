<template>
	<view class="component-menu flex flex-wrap">
		<block v-for="(item, index) in showData" :key="index">
			<button 
				v-if="item.info == 'contact'" 
				class="menu-item menu-btn clear" 
				open-type="contact" 
				:style="{
					width: (parseFloat(100 / rowNumber).toFixed(2) + '%'), 
					marginTop: (index < rowNumber ? 0 : marginTop)
				}"
				@click="toPage(index)"
			>
				<view class="icon-box">
					<image :src="item.icon" :style="{width: iconSize, height: iconSize}" mode="aspectFit"></image>
				</view>
				<text 
					class="text-ellipsis" 
					:style="{
						fontSize: fontSize, 
						color: fontColor, 
						lineHeight: lineHeight, 
						marginTop: space
					}"
				>{{item.name}}</text>
			</button>

			<view 
				v-else
				class="menu-item" 
				:style="{
					width: (parseFloat(100 / rowNumber).toFixed(2) + '%'), 
					marginTop: (index < rowNumber ? 0 : marginTop)
				}"
				@click="toPage(index)"
			>
				<view class="icon-box">
					<image :src="item.icon" :style="{width: iconSize, height: iconSize}" mode="aspectFit"></image>
				</view>
				<text 
					class="text-ellipsis" 
					:style="{
						fontSize: fontSize, 
						color: fontColor, 
						lineHeight: lineHeight, 
						marginTop: space
					}"
				>{{item.name}}</text>
				<!-- #ifdef H5 -->
				<wx-open-launch-weapp class="item-absolute" :appid="item.content.appid" :path="item.content.path" v-if="item.skip_type == 3">
					<script type="text/wxtag-template">
						<style>.btn { position: absolute; top: 0; left: 0; right: 0; bottom: 0; }</style>
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
		name: "menuIndex",
		props: {
			// 组件内容
			showData: {
				type: Array,
				default () {
					return []
				}
			},
			// 每排数量
			rowNumber: {
				type: Number,
				default: 4,
			},
			// 图标尺寸
			iconSize: {
				type: String,
				default: "80rpx",
			},
			// 文字尺寸
			fontSize: {
				type: String,
				default: "28rpx",
			},
			// 文字行高
			lineHeight: {
				type: String,
				default: "40rpx",
			},
			// 文字颜色
			fontColor: {
				type: String,
				default: "#5A5B6E",
			},
			// 图文间隔
			space: {
				type: String,
				default: "12rpx",
			},
			// 上下间隔
			marginTop: {
				type: String,
				default: "24rpx",
			},
		},
		methods: {
			toPage(index) {
				// #ifdef H5
				if (this.showData[index].skip_type == 3) return
				// #endif
				if (this.showData[index].info) {
					this.$util.toPage(this.showData[index].info)
				} else {
					this.$emit("toPage", this.showData[index])
				}
			}
		},
	}
</script>

<style lang="scss">
	.component-menu {
		padding: 4rpx;
		
		.menu-item {
			position: relative;
			display: flex;
			flex-direction: column;
			align-items: center;
			background: transparent;
			padding: 6rpx;
			transition: all 0.2s;
			
			&.menu-btn {
				&::after {
					border: none;
				}
			}
			
			.icon-box {
				width: 90rpx;
				height: 90rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				border-radius: 18rpx;
				background: rgba(245, 245, 245, 0.5);
				
				image {
					will-change: transform;
				}
			}
			
			text {
				width: 100%;
				padding: 0 8rpx;
				box-sizing: border-box;
				text-align: center;
			}
			
			&:active {
				opacity: 0.7;
				transform: scale(0.98);
			}
			
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