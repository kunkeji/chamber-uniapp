<template>
	<view class="container">
		<!-- 标题栏 -->
		<title-bar :showBack="true" title="退款申请"></title-bar>
		<!-- 内容区 -->
		<view class="container-main" v-if="loadEnd">
			<view class="main-header">
				<view class="main-header-title">
					退款原因
				</view>
				<view class="main-header-list">
					<checkbox-group @change="checkboxChange">
						<label class="main-header-list-lab" v-for="item in items" :key="item.value">
							<checkbox :value="item.name" :checked="item.checked" :color="themeColor" />
							<view class="main-header-list-nam">{{item.name}}</view>
						</label>
					</checkbox-group>
				</view>
			</view>
			<view class="main-content">
				<view class="main-content-title">
					退款描述
				</view>
				<view class="main-content-list">
					<textarea placeholder="请填写您的退款描述，200字以内" v-model="textValue" class="main-content-list-txt" placeholder-style="font-size: 28rpx;" />
				</view>
			</view>
			<view class="main-bottom">
				<view class="harmless-content-button" :style="{ background: themeColor }" @click="submit">提交退款申请</view>
				<view class="safe-padding"></view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		mapState
	} from "vuex"
	export default {
		data() {
			return {
				loadEnd: false, // 加载完成
				order_id: 0, //订单ID
				textValue: '', //退款详情
				refund_reason: [], //退款原因
				items: [{
						value: '1',
						name: '产品存在质量问题'
					},
					{
						value: '2',
						name: '产品实物与描述不符'
					},
					{
						value: '3',
						name: '卖家的发货环节出现问题'
					},
					{
						value: '4',
						name: '卖家存在延迟发货问题'
					}
				]
			};
		},
		onLoad(option) {
			this.order_id = option.id
			this.$nextTick(() => {
				this.loadEnd = true
			})
		},
		computed: {
			...mapState({
				themeColor: state => state.app.themeColor
			})
		},
		methods: {
			//提交退款申请
			submit() {
				if (this.refund_reason == '' && this.textValue == '') {
					uni.showToast({
						title: "请选择退款原因或填写退款描述",
						icon: 'none'
					})
					return
				}
				this.$util.request("mall.orderRefund", {
					refund_reason: this.refund_reason,
					refund_content: this.textValue,
					order_id: this.order_id
				}).then(res => {
					if (res.code == 1) {
						uni.redirectTo({
							url: "/pagesMall/order/success?type=1"
						})
					} else {
						uni.showToast({
							title: res.msg,
							icon: 'none'
						})
					}
				}).catch(error => {
					console.error('提交退款申请', error)
				})

			},
			//选择退款原因
			checkboxChange(e) {
				this.refund_reason = e.detail.value
			}
		}
	}
</script>

<style lang="scss">
	page {
		background: #f2f2f2;
	}

	.container {
		.container-main {
			padding: 32rpx 32rpx 144rpx;

			.main-header {
				padding: 24rpx 32rpx;
				border-radius: 20rpx;
				background: rgba(255, 255, 255, 1);

				.main-header-title {
					font-weight: 600;
					font-size: 32rpx;
				}

				.main-header-list {

					.main-header-list-lab {
						display: flex;
						align-items: center;
						padding-top: 48rpx;
					}

					.main-header-list-nam {
						padding-left: 24rpx;
						font-size: 28rpx;
					}
				}
			}

			.main-content {
				margin-top: 32rpx;
				padding: 24rpx 32rpx;
				border-radius: 20rpx;
				background: rgba(255, 255, 255, 1);

				.main-content-title {
					font-weight: 600;
					font-size: 32rpx;
				}

				.main-content-list {
					padding-top: 32rpx;

					.main-content-list-txt {
						padding: 24rpx;
						width: 100%;
						box-sizing: border-box;
						font-size: 28rpx;
						background: rgba(246, 247, 251, 1);
					}
				}
			}

			.main-bottom {
				flex: 1;
				padding-top: 16rpx;
				padding-bottom: 16rpx;
				position: fixed;
				bottom: 0;
				left: 0;
				right: 0;
				text-align: center;
				background: #FFF;
				z-index: 99;

				.harmless-content-button {
					margin-left: 26rpx;
					margin-right: 26rpx;
					width: 700rpx;
					height: 80rpx;
					background: rgba(50, 93, 255, 1);
					color: rgba(255, 255, 255, 1);
					text-align: center;
					line-height: 80rpx;
					border-radius: 16rpx;
				}

				.safe-padding {
					width: 100%;
					padding-bottom: constant(safe-area-inset-bottom);
					/* 兼容 iOS < 11.2 */
					padding-bottom: env(safe-area-inset-bottom);
					/* 兼容 iOS >= 11.2 */
				}

			}
		}
	}
</style>