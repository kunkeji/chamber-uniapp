<template>
	<view class="container">
		<!-- 标题栏 -->
		<title-bar :showBack="true" title="系统错误"></title-bar>
		<!-- 内容区 -->
		<view class="container-main">
			<image class="main-icon" src="/static/error.png" mode="widthFix"></image>
			<view class="main-tips flex-direction-column align-items-center">
				<text>该网页仅支持微信浏览器</text>
				<text>请使用微信浏览器打开</text>
			</view>
		</view>
	</view>
</template>

<style lang="scss">
	page {
		background: #ffffff;
	}

	.container {
		.container-main {
			padding: 144rpx 32rpx 32rpx;
			display: flex;
			flex-direction: column;
			align-items: center;

			.main-icon {
				width: 45vw;
				height: auto;
			}

			.main-tips {
				margin-top: 32rpx;
				color: #5A5B6E;
				font-size: 32rpx;
				font-weight: 600;
				line-height: 44rpx;
			}
		}
	}
</style>