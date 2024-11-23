<template>
	<view class="component-picker-address" @click.stop>
		<uni-popup ref="popupModal" type="bottom" :safe-area="false" @change="onChange">
			<view class="modal-box" :style="{'--theme-color': themeColor}">
				<view class="modal-head">
					<view class="head-title">地址选择</view>
					<view class="head-btn" @click="handleConfirm">确认</view>
				</view>
				<view class="modal-content flex align-items-center">
					<picker-view class="content-picker" indicator-style="height: 70rpx;" :immediate-change="true" :value="selectValue" @change="handleChange">
						<picker-view-column>
							<view class="picker-column" v-for="(item, index) in provinceList" :key="index">{{item.name}}</view>
						</picker-view-column>
						<picker-view-column>
							<view class="picker-column" v-for="(item, index) in cityList" :key="index">{{item.name}}</view>
						</picker-view-column>
					</picker-view>
				</view>
				<view class="modal-btn" @click="onClose">取消</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import {
		mapState
	} from "vuex"
	export default {
		name: "addressPicker",
		data() {
			return {
				// 省份列表
				provinceList: [],
				// 城市列表
				cityList: [],
				// 已选地址
				selectAddress: {},
				// 已选数据
				selectValue: [0, 0],
				// 参数
				parameter: "",
			};
		},
		computed: {
			...mapState({
				themeColor: state => state.app.themeColor,
			})
		},
		mounted() {
			this.getProvinceList()
		},
		methods: {
			// 打开模态框
			open(value, parameter) {
				let address = {}
				if (value) {
					address = {
						province: value.split("/")[0],
						city: value.split("/")[1]
					}
				}
				this.selectAddress = address
				this.parameter = parameter
				if (address && address.province) {
					for (var i in this.provinceList) {
						if (this.provinceList[i].name == address.province) {
							this.$set(this.selectValue, 0, i)
							break
						}
					}
				} else {
					this.selectValue = [0, 0, 0]
				}
				this.getCityList(this.provinceList[this.selectValue[0]].id)
				this.$refs.popupModal.open()
			},
			// 关闭弹窗
			onClose() {
				this.$refs.popupModal.close()
			},
			// 改变事件
			onChange(e) {
				this.$emit("onChange", e.show)
			},
			// 数值改变
			handleChange(e) {
				if (this.selectValue[0] != e.target.value[0]) {
					this.selectValue = [e.target.value[0], 0, 0]
					this.getCityList(this.provinceList[this.selectValue[0]].id)
				} else {
					this.selectValue = e.target.value
				}
			},
			// 确认
			handleConfirm() {
				var data = {
					province: this.provinceList[this.selectValue[0]].name,
					city: this.cityList[this.selectValue[1]].name,
				}
				this.$emit("confirm", data, this.parameter)
				this.onClose()
			},
			// 获取省份数据
			getProvinceList() {
				this.$util.request("main.address.province").then(res => {
					if (res.code == 1) {
						this.provinceList = res.data.data
						if (this.selectAddress.province) {
							for (var i in this.provinceList) {
								if (this.provinceList[i].name == this.selectAddress.province) {
									this.$set(this.selectValue, 0, i)
									break
								}
							}
						}
						this.getCityList(this.provinceList[this.selectValue[0]].id)
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
			// 获取城市数据
			getCityList(id) {
				this.$util.request("main.address.city", {
					crea_id: id
				}).then(res => {
					if (res.code == 1) {
						this.cityList = res.data.data
						if (this.selectAddress.city) {
							for (var i in this.cityList) {
								if (this.cityList[i].name == this.selectAddress.city) {
									this.$nextTick(() => {
										this.$set(this.selectValue, 1, i)
									})
									break
								}
							}
						}
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
		},
	}
</script>

<style lang="scss" scoped>
	.component-picker-address {
		position: relative;
		z-index: 999;

		.modal-box {
			background: #FFFFFF;
			border-radius: 20rpx 20rpx 0 0;
			width: 100vw;
			padding-bottom: constant(safe-area-inset-bottom);
			padding-bottom: env(safe-area-inset-bottom);

			.modal-head {
				display: flex;
				align-items: center;
				padding: 32rpx;

				.head-title {
					flex: 1;
					color: #333;
					text-align: center;
					font-size: 32rpx;
					font-weight: 600;
					line-height: 44rpx;
					padding-left: 128rpx;
				}

				.head-btn {
					color: #FFF;
					font-size: 28rpx;
					line-height: 40rpx;
					padding: 12rpx 36rpx;
					border-radius: 10rpx;
					background: var(--theme-color);
				}
			}

			.modal-content {
				padding-bottom: 32rpx;

				.content-picker {
					height: 400rpx;
					flex: 1;

					.picker-column {
						line-height: 70rpx;
						text-align: center;
						font-size: 28rpx;
					}
				}
			}

			.modal-btn {
				color: #E10602;
				text-align: center;
				font-size: 32rpx;
				line-height: 44rpx;
				padding: 32rpx;
			}
		}
	}
</style>