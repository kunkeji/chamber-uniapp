<template>
	<view class="component-modal-region" @click.stop>
		<uni-popup ref="popupModal" type="bottom" :safe-area="false" @change="onChange">
			<view class="popup-box" :style="{'--theme-color': themeColor}">
				<view class="popup-header">
					<view class="title">地区选择</view>
					<image class="close" src="/static/close.png" mode="aspectFit" @click="onClose"></image>
				</view>
				<view class="popup-content flex-direction-column">
					<view class="contetnt-select flex">
						<view class="select-item flex" @click="onReset">
							<view class="item-title">省：</view>
							<view class="item-value">{{selectProvince || "请选择"}}</view>
						</view>
						<view class="select-item flex" style="margin-left: 48rpx;">
							<view class="item-title">市：</view>
							<view class="item-value">{{selectCity || "请选择"}}</view>
						</view>
					</view>
					<scroll-view scroll-y class="contetnt-city flex-item">
						<view class="city-list">
							<block v-if="provinceList.length && !selectProvince">
								<view class="list-item" v-for="(item, index) in provinceList" :key="index" @click="changeProvince(item.id, item.name)">{{item.name}}</view>
							</block>
							<block v-if="cityList.length">
								<view class="list-item" v-for="(item, index) in cityList" :key="index" @click="changeCity(item.name)">{{item.name}}</view>
							</block>
						</view>
						<view class="city-empty" v-if="!provinceList.length && !cityList.length">暂无相关数据</view>
					</scroll-view>
				</view>
				<view class="popup-btn">
					<view class="btn" @click="onReset">重置</view>
					<view class="btn confirm" @click="onConfirm">确认</view>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import {
		mapState
	} from "vuex"
	export default {
		name: "modalRegion",
		data() {
			return {
				// 省份列表
				provinceList: [],
				// 市区列表
				cityList: [],
				// 已选省份
				selectProvince: "",
				// 已选市区
				selectCity: "",
			};
		},
		computed: {
			...mapState({
				themeColor: state => state.app.themeColor,
			})
		},
		methods: {
			// 打开模态框
			open(value) {
				this.provinceList = []
				this.cityList = []
				this.selectProvince = value.province
				this.getProvinceList()
				if (value.city) this.selectCity = value.city
				this.$refs.popupModal.open()
			},
			// 获取省份数据
			getProvinceList() {
				this.$util.request("main.address.province").then(res => {
					if (res.code == 1) {
						this.provinceList = res.data.data
						for (let i in this.provinceList) {
							if (this.provinceList[i].name == this.selectProvince) {
								this.getCityList(this.provinceList[i].id)
								break;
							}
						}
					} else {
						uni.showToast({
							title: res.msg,
							icon: 'none'
						})
					}
				}).catch(error => {
					console.error('获取省份数据 ', error)
				})
			},
			// 获取市区数据
			getCityList(id) {
				this.$util.request("main.address.city", {
					crea_id: id
				}).then(res => {
					if (res.code == 1) {
						this.cityList = res.data.data
					} else {
						uni.showToast({
							title: res.msg,
							icon: 'none'
						})
					}
				}).catch(error => {
					console.error('获取城市数据 ', error)
				})
			},
			// 关闭弹窗
			onClose() {
				this.$refs.popupModal.close()
			},
			// 重置
			onReset() {
				this.cityList = []
				this.selectProvince = ""
				this.selectCity = ""
				this.$emit("callback", {
					province: "",
					city: "",
				})
				this.onClose()
			},
			// 选择省份
			changeProvince(id, name) {
				this.selectProvince = name
				this.getCityList(id)
			},
			// 选择市区
			changeCity(name) {
				this.selectCity = name
			},
			// 确认
			onConfirm() {
				const data = {
					province: this.selectProvince,
					city: this.selectCity,
				}
				this.$emit("callback", data)
				this.onClose()
			},
			// 改变事件
			onChange(e) {
				this.$emit("onChange", e.show)
			},
		},
	}
</script>

<style lang="scss">
	.component-modal-region {
		position: relative;
		z-index: 999;

		.popup-box {
			background: #FFFFFF;
			border-radius: 40rpx 40rpx 0 0;
			padding: 32rpx 32rpx 0;
			padding-bottom: constant(safe-area-inset-bottom);
			padding-bottom: env(safe-area-inset-bottom);

			.popup-header {
				display: flex;
				align-items: center;
				padding-left: 32rpx;

				.title {
					color: #333;
					text-align: center;
					font-size: 32rpx;
					font-weight: 600;
					line-height: 44rpx;
					flex: 1;
				}

				.close {
					width: 32rpx;
					height: 32rpx;
				}
			}

			.popup-content {
				padding: 32rpx 0;
				height: 65vh;

				.contetnt-select {
					margin-top: 16rpx;

					.select-item {
						.item-title {
							color: #333;
							font-size: 28rpx;
							line-height: 50rpx;
						}

						.item-value {
							color: var(--theme-color);
							font-size: 28rpx;
							line-height: 50rpx;
						}
					}
				}

				.contetnt-city {
					padding-top: 32rpx;
					overflow: hidden;

					.city-list {
						.list-item {
							margin-top: 32rpx;
							color: #333;
							font-size: 28rpx;
							line-height: 50rpx;

							&:first-child {
								margin-top: 0;
							}
						}
					}

					.city-empty {
						padding: 48rpx 0 24rpx;
						color: #A0A2B3;
						text-align: center;
						font-size: 28rpx;
						line-height: 40rpx;
					}
				}
			}

			.popup-btn {
				display: flex;
				justify-content: space-between;
				border-top: 1rpx solid #F6F7FB;
				padding: 16rpx 32rpx;

				.btn {
					width: 48%;
					color: #666666;
					font-size: 28rpx;
					line-height: 40rpx;
					padding: 20rpx;
					border-radius: 10rpx;
					background: #F0F0F0;
					text-align: center;

					&.confirm {
						color: #FFFFFF;
						background: var(--theme-color);
					}
				}
			}
		}
	}
</style>