<template>
	<view>
		<title-bar :title="navigationBarTitle"></title-bar>
		<view class="site-detail-page">
			<!-- 场地图片区域优化 -->
			<view class="site-image-container">
				<image :src="siteinfo.image" mode="aspectFill" class="site-image"></image>
				<view class="site-info-overlay">
					<view class="site-name">{{ siteinfo.name }}</view>
					<view class="site-price">¥{{ siteinfo.price }}<text class="price-unit">/小时</text></view>
					<view class="site-attributes">
						<view class="attribute"><text class="icon">📏</text> {{ siteinfo.size }}㎡</view>
						<view class="attribute"><text class="icon">📍</text> {{ siteinfo.location }}</view>
					</view>
				</view>
			</view>

			<!-- 日期选择区域优化 -->
			<view class="date-time-slots">
				<block v-for="(dateSlot, index) in dateTimeSlots" :key="index">
					<view class="date-section">
						<view class="date">{{ formatDate(dateSlot.date) }}</view>
						<scroll-view scroll-x="true" show-scrollbar="false" class="time-slots">
							<view class="time-slots-inner">
								<block v-for="(timeSlot, timeIndex) in dateSlot.time_slots" :key="timeIndex">
									<view class="time-slot"
										:class="{ 'can-book': timeSlot.can_book, 'cannot-book': !timeSlot.can_book }"
										@click="timeSlot.can_book ? confirmBooking(dateSlot.date, timeSlot.name,timeSlot.time_slot_id) : showUnavailableToast()">
										<view class="time-content">
											<view class="time-name">{{ timeSlot.name }}</view>
											<view class="time-range">{{ formatTime(timeSlot.start_time) }} - {{ formatTime(timeSlot.end_time) }}</view>
										</view>
										<view class="status-indicator"></view>
									</view>
								</block>
							</view>
						</scroll-view>
					</view>
				</block>
			</view>

			<!-- 预约确认弹窗优化 -->
			<view v-if="isConfirmModalVisible" class="confirm-modal" @click.self="closeConfirmModal">
				<view class="confirm-modal-content">
					<view class="confirm-title">预约确认</view>
					<view class="confirm-info">
						<view class="info-item">预约日期：{{ selectedDate }}</view>
						<view class="info-item">预约时段：{{ selectedTimeSlot }}</view>
					</view>
					<view class="button-group">
						<button class="btn cancel" @click="closeConfirmModal">取消</button>
						<button class="btn confirm" @click="submitBooking">确认预约</button>
					</view>
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
			},
			showUnavailableToast() {
				uni.showToast({
					title: '该时段已被预约',
					icon: 'none'
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
	min-height: 100vh;
	background-color: #f5f6fa;
}

.site-image-container {
	position: relative;
	height: 500rpx;
	overflow: hidden;
}

.site-image {
	width: 100%;
	height: 100%;
	transition: transform 0.3s ease;
}

.site-info-overlay {
	position: absolute;
	bottom: 0;
	left: 0;
	right: 0;
	padding: 40rpx;
	background: linear-gradient(to top, rgba(0,0,0,0.8), transparent);
	color: white;
}

.site-name {
	font-size: 40rpx;
	font-weight: 600;
	margin-bottom: 16rpx;
}

.site-price {
	font-size: 48rpx;
	font-weight: bold;
	color: #FFD700;
}

.price-unit {
	font-size: 24rpx;
	font-weight: normal;
	margin-left: 8rpx;
}

.site-attributes {
	display: flex;
	gap: 20rpx;
	margin-top: 16rpx;
}

.attribute {
	display: flex;
	align-items: center;
	font-size: 26rpx;
}

.icon {
	margin-right: 8rpx;
}

.date-section {
	background: white;
	margin: 20rpx;
	padding: 20rpx;
	border-radius: 16rpx;
	box-shadow: 0 2rpx 12rpx rgba(0,0,0,0.05);
}

.date {
	color: #333;
	font-size: 32rpx;
	margin-bottom: 24rpx;
}

.time-slots {
	width: 100%;
	overflow-x: auto;
}

.time-slots-inner {
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(200rpx, 1fr));
	gap: 20rpx;
	padding: 10rpx;
}

.time-slot {
	position: relative;
	padding: 20rpx;
	border-radius: 12rpx;
	transition: all 0.3s ease;
}

.can-book {
	background: #f0f9ff;
	border: 2rpx solid #91d5ff;
}

.can-book:active {
	transform: scale(0.98);
}

.cannot-book {
	background: #fff1f0;
	border: 2rpx solid #ffa39e;
	opacity: 0.8;
}

.time-content {
	text-align: center;
}

.time-name {
	font-size: 30rpx;
	font-weight: 500;
	margin-bottom: 8rpx;
}

.time-range {
	font-size: 24rpx;
	color: #666;
}

.status-indicator {
	position: absolute;
	right: 10rpx;
	top: 10rpx;
	width: 12rpx;
	height: 12rpx;
	border-radius: 50%;
}

.can-book .status-indicator {
	background: #52c41a;
}

.cannot-book .status-indicator {
	background: #ff4d4f;
}

.confirm-modal {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background-color: rgba(0, 0, 0, 0.5);
	display: flex;
	justify-content: center;
	align-items: center;
	z-index: 999;
}

.confirm-modal-content {
	background: white;
	width: 80%;
	max-width: 600rpx;
	border-radius: 20rpx;
	padding: 40rpx;
	position: relative;
	animation: modalPop 0.3s ease;
}

@keyframes modalPop {
	from {
		transform: scale(0.8);
		opacity: 0;
	}
	to {
		transform: scale(1);
		opacity: 1;
	}
}

.confirm-title {
	font-size: 36rpx;
	font-weight: 600;
	margin-bottom: 30rpx;
	color: #333;
}

.confirm-info {
	margin: 30rpx 0;
}

.info-item {
	font-size: 28rpx;
	color: #666;
	margin: 10rpx 0;
}

.button-group {
	display: flex;
	gap: 20rpx;
	margin-top: 40rpx;
}

.btn {
	flex: 1;
	padding: 20rpx;
	border-radius: 10rpx;
	font-size: 28rpx;
	border: none;
}

.btn.cancel {
	background: #f5f5f5;
	color: #666;
}

.btn.confirm {
	background: #1890ff;
	color: white;
}

.btn:active {
	opacity: 0.8;
}

@media screen and (max-width: 375px) {
	.time-slots-inner {
		grid-template-columns: repeat(auto-fill, minmax(150rpx, 1fr));
	}
}

@media screen and (min-width: 768px) {
	.time-slots-inner {
		grid-template-columns: repeat(auto-fill, minmax(250rpx, 1fr));
	}
}
</style>