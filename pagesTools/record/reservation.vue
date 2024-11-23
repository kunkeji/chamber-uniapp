<template>
	<view>
		<title-bar :title="navigationBarTitle"></title-bar>
		<view class="site-detail-page">
			<!-- 场地图片 -->
			<image :src="siteinfo.image" mode="aspectFill" class="site-image"></image>
			<!-- 场地详情信息 -->
			<view class="site-info">
				<view class="site-name">{{ siteinfo.name }}</view>
				<view class="site-price">价格: ¥{{ siteinfo.price }} / 小时</view>
				<view class="site-size-location">面积: {{ siteinfo.size }}㎡ | 位置: {{ siteinfo.location }}</view>
			</view>

			<!-- 未来7天的预约时间段 -->
			<view class="date-time-slots">
				<block v-for="(dateSlot, index) in dateTimeSlots" :key="index">
					<view class="date">{{ formatDate(dateSlot.date) }}</view>
					<scroll-view scroll-x="true" show-scrollbar="false" class="time-slots">
						 <view class="time-slots-inner"> <!-- 新增一个容器 -->
						  <block v-for="(timeSlot, timeIndex) in dateSlot.time_slots" :key="timeIndex">
							<view class="time-slot"
							  :class="{ 'can-book': timeSlot.can_book, 'cannot-book': !timeSlot.can_book }"
							  @click="timeSlot.can_book ? confirmBooking(dateSlot.date, timeSlot.name,timeSlot.time_slot_id) : null">
							  <view class="time-name">{{ timeSlot.name }}</view>
							<view class="time-range">{{ formatTime(timeSlot.start_time) }}</view>
							<view class="time-range">{{ formatTime(timeSlot.end_time) }}</view>
							</view>
							</block>
						</view>
					</scroll-view>
				</block>
			</view>

			<!-- 预约确认弹窗 -->
			<view v-if="isConfirmModalVisible" class="confirm-modal">
				<view class="confirm-modal-content">
					<view class="confirm-title">确认预约</view>
					<view>您确认要预约 {{ selectedDate }} {{ selectedTimeSlot }} 吗？</view>
					<button @click="submitBooking">确认</button>
					<button @click="closeConfirmModal">取消</button>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				navigationBarTitle: "场地预约",
				siteinfo: {},
				dateTimeSlots: [],
				isConfirmModalVisible: false, // 控制确认预约弹窗显示
				selectedDate: null, // 选择的日期
				selectedTimeSlot: null, // 选择的时间段ID
				formData: {
					name: "",
					phone: ""
				}
			};
		},
		onLoad(options) {
			this.id = options.id||1;
		},
		methods: {
			getTimeList() {
				this.$util.request("main.Site.getTimeList", {
					id: this.id
				}).then(res => {
					if (res.code === 1) {
						this.dateTimeSlots = res.data.date_time_slots;
						this.siteinfo = res.data.siteinfo;
					} else {
						uni.showToast({
							icon:"error",
							title:"数据加载失败"
						})
					}
				}).catch(() => {
					uni.showToast({
						icon:"error",
						title:"请求失败"
					})
				});
			},
			formatDate(date) {
				const options = {
					month: "2-digit",
					day: "2-digit"
				};
				const dateObj = new Date(date);
				return dateObj.toLocaleDateString("zh-CN", options);
			},
			formatTime(time) {
				const date = new Date(`1970-01-01T${time}Z`);
				const hours = String(date.getUTCHours()).padStart(2, '0');
				const minutes = String(date.getUTCMinutes()).padStart(2, '0');
				return `${hours}:${minutes}`;
			},

			// 确认预约弹窗
			confirmBooking(date, timename,timeSlotId) {
				this.selectedDate = date;
				this.selectedTimeSlot = timename;
				this.timeSlotId = timeSlotId
				this.isConfirmModalVisible = true;
			},

			// 关闭确认弹窗
			closeConfirmModal() {
				this.isConfirmModalVisible = false;
			},
			// 提交预约
			submitBooking() {
				var that = this
				const bookingData = {
					date: that.selectedDate,
					time_slot_id: that.timeSlotId,
					site_id:that.id
				};
				that.$util.request("main.Site.addRecord", bookingData).then(response => {
					
					if (response.code === 1) {
						uni.showToast({
							icon:"success",
							title:"预约成功",
							complete() {
								that.getTimeList()
							}
						})
						that.closeConfirmModal();
					} else {
						uni.showToast({
							icon:"error",
							title:"预约失败",
							complete() {
								that.getTimeList()
							}
						})
					}
					
				}).catch(() => {
					uni.showToast({
						icon:"error",
						title:"预约失败",
						complete() {
							that.getTimeList()
						}
					})
				});
			}
		},
		mounted() {
			this.getTimeList();
		}
	};
</script>

<style scoped>
.site-detail-page {
  padding: 40rpx;
}

.site-image {
  width: 100%;
  height: 400rpx;
  border-radius: 16rpx;
}

.site-info {
  margin-top: 20rpx;
  text-align: center;
}

.site-name {
  font-size: 36rpx;
  font-weight: bold;
}

.site-price,
.site-size-location {
  margin-top: 10rpx;
  font-size: 28rpx;
}

.date-time-slots {
  margin-top: 40rpx;
}

.date {
  font-size: 30rpx;
  margin-bottom: 20rpx;
  font-weight: bold;
  margin-top: 40rpx;
}

.time-slots {
  display: flex;
  flex-direction: row;
  overflow-x: auto; /* 确保可以横向滚动 */
  white-space: nowrap; /* 确保不换行 */
}

.time-slots-inner {
  display: flex; /* 新增这个样式 */
}

.time-slot {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-right: 20rpx;
  padding: 12rpx;
  border-radius: 8rpx;
  border: 1rpx solid #ccc;
  width: 170rpx; /* 每个时间段的宽度 */
  font-size: 26rpx;
  text-align: center;
}

.time-name {
  font-size: 28rpx;
  margin-bottom: 10rpx;
}

.time-range {
  font-size: 24rpx;
  color: #555;
}

.can-book {
  background-color: #e0f7e8;
  cursor: pointer;
}

.cannot-book {
  background-color: #f7e0e0;
  cursor: not-allowed;
}

.booking-form-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.booking-form {
  background-color: #fff;
  padding: 40rpx;
  border-radius: 16rpx;
  width: 600rpx;
}

.form-item {
  margin-bottom: 30rpx;
}
.confirm-modal {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.7);
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.confirm-modal-content {
		background-color: #fff;
		padding: 40rpx;
		border-radius: 16rpx;
		width: 600rpx;
		text-align: center;
	}

	.confirm-title {
		font-size: 36rpx;
		font-weight: bold;
		margin-bottom: 20rpx;
	}
button {
  margin-top: 20rpx;
}

</style>