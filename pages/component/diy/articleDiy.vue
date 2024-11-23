<template>
	<view class="diy-article" :style="{padding: paddingTop + ' ' + paddingLeft, background: showStyle.background, borderRadius: itemBorderRadius}">
		<view class="article-title" :style="{marginBottom: titleSpace}" v-if="showParams.showTitle">
			<view :style="{fontSize: titleFontSize,fontWeight: showStyle.titleFontStyle, color: showStyle.titleColor}">{{showParams.titleText}}</view>
			<view :style="{fontSize: titleBtnSize, color: showStyle.titleBtnColor}" @click="toMore()">
				<text v-if="showParams.titleBtnType == 'text'">{{showParams.titleBtnText}}</text>
				<view :style="{'background-image': 'url('+ titleIconMore +')', width: titleIconSize, height: titleIconSize, backgroundSize: titleIconSize}" v-else-if="titleIconMore"></view>
			</view>
		</view>
		<view class="article-list" v-if="articleList.length">
			<view class="list-item" :style="{marginTop: itemSpace }" v-for="(item,index) in articleList" :key="index" @click="toDetails(item)">
				<view class="item-left" v-if="showParams.showImg">
					<image mode="aspectFill" :src="item.image" :style="{ width: imgWidth, height: imgHeight, float: showStyle.imgFloat || 'left', borderRadius: borderRadius}"></image>
				</view>
				<view class="item-right" :style="`height: ${imgHeight};` + (showStyle.imgFloat == 'right' ? 'padding-right: 20rpx;' : 'padding-left: 20rpx;')">
					<view class="title" :style="{fontSize: nameSize, fontWeight: showStyle.nameWeight}">{{item.title}}</view>
					<view class="date" :style="{fontSize: dateSize, textAlign: showStyle.imgFloat == 'right' ? 'left' : 'right'}">{{item.createtime}}</view>
				</view>
			</view>
		</view>
		<empty top="0" padding="0" width="200rpx" size="28rpx" title="暂无相关内容~" v-else></empty>
	</view>
</template>

<script>
	import svgData from "@/common/svg.js"
	export default {
		name: 'articleDiy',
		props: ['showStyle', 'showParams'],
		data() {
			return {
				articleList: [],
			}
		},
		computed: {
			titleFontSize() {
				return uni.upx2px(this.showStyle.titleFontSize * 2) + 'px';
			},
			titleBtnSize() {
				return uni.upx2px(this.showStyle.titleBtnSize * 2) + 'px';
			},
			titleIconMore() {
				return svgData.svgToUrl("more", this.showStyle.titleBtnColor)
			},
			titleIconSize() {
				return uni.upx2px(this.showStyle.titleIconSize * 2) + 'px';
			},
			titleSpace() {
				return uni.upx2px(this.showStyle.titleSpace * 2) + 'px';
			},
			itemBorderRadius() {
				return uni.upx2px(this.showStyle.itemBorderRadius * 2) + 'px';
			},
			imgWidth() {
				return uni.upx2px(this.showStyle.imgWidth * 2) + 'px';
			},
			imgHeight() {
				return uni.upx2px(this.showStyle.imgHeight * 2) + 'px';
			},
			borderRadius() {
				return uni.upx2px(this.showStyle.borderRadius * 2) + 'px';
			},
			nameSize() {
				return uni.upx2px(this.showStyle.nameSize * 2) + 'px';
			},
			dateSize() {
				return uni.upx2px(this.showStyle.dateSize * 2) + 'px';
			},
			paddingTop() {
				return uni.upx2px(this.showStyle.paddingTop * 2) + 'px';
			},
			paddingLeft() {
				return uni.upx2px(this.showStyle.paddingLeft * 2) + 'px';
			},
			itemSpace() {
				return uni.upx2px(this.showStyle.itemSpace * 2) + 'px';
			},
		},
		watch: {
			showParams: {
				handler(value) {
					if (value) this.getArticleList()
				},
				immediate: true,
				deep: true
			}
		},
		methods: {
			// 获取新闻列表
			getArticleList() {
				let catId = ""
				if (this.showParams.category) {
					catId = this.showParams.category
				} else if (this.showParams.link && this.showParams.link.type == "Article") {
					catId = this.showParams.link.path.split("?id=")[1]
				}
				this.$util.request("main.article.list", {
					page: 1,
					limit: this.showParams.count,
					cat_id: catId
				}).then(res => {
					if (res.code == 1) {
						this.articleList = res.data.data
					} else {
						uni.showToast({
							title: res.msg,
							icon: 'none'
						})
					}
				}).catch(error => {
					console.error('获取新闻列表 ', error)
				})
			},
			// 跳转查看更多
			toMore() {
				this.$util.toPage({
					mode: 1,
					path: "/pages/article/index?id=" + this.showParams.category
				})
			},
			// 跳转新闻详情
			toDetails(item) {
				if (item.type == 2) {
					this.$util.toPage({
						mode: 4,
						path: item.link,
					})
				} else {
					this.$util.toPage({
						mode: 1,
						path: "/pages/article/details?id=" + item.id
					})
				}
			},
		}
	}
</script>

<style lang="scss">
	.diy-article {
		.article-title {
			display: flex;
			align-items: center;
			justify-content: space-between;
		}

		.article-list {
			.list-item {
				overflow: hidden;

				&:first-child {
					margin-top: 0;
				}

				.item-right {
					display: flex;
					flex-direction: column;
					justify-content: space-between;
					flex: 1;

					.title {
						line-height: 1.3;
						color: #333;
						display: -webkit-box;
						word-break: break-all;
						text-overflow: ellipsis;
						overflow: hidden;
						-webkit-box-orient: vertical;
						-webkit-line-clamp: 3;
					}

					.date {
						margin-top: 16rpx;
						line-height: 1.3;
						color: #333;
						text-align: right;
					}
				}
			}
		}
	}
</style>