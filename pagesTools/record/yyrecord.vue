<template>
  <view>
	<title-bar :title="navigationBarTitle"></title-bar>
    <view v-for="(record, index) in records" :key="index" class="record-item">
      <!-- 左侧图片 -->
      <image :src="record.siteinfo.image" mode="aspectFill" class="site-image"></image>

      <!-- 右侧信息 -->
      <view class="record-info">
        <!-- 标题和确认信息放在同一排 -->
        <view class="name-status">
			<view :class="['status', record.status ? 'confirmed' : 'unconfirmed']">
			  {{ record.status ? '已确认' : '未确认' }}
			</view>
          <view class="site-name">{{ record.siteinfo.name }}</view>
          
        </view>
		<!-- 场地位置 -->
		<view class="site-location">{{ record.siteinfo.location }}</view>
        <!-- 预约日期 -->
        <view class="site-date">{{ formatDate(record.date) }} {{ record.siteinfo.time }}</view>
        
        <!-- 面积和租金左右布局 -->
        <view class="site-size-price">
          <view>{{ record.siteinfo.size }}㎡</view>
          <view>{{ record.siteinfo.price=="0.00"?"免费":"￥"+record.siteinfo.price }}</view>
        </view>
        <!-- 预约时间段 -->
        <!-- <view class="site-time">{{ record.siteinfo.time }}</view> -->
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      records: [],
	  navigationBarTitle:"我的预约"
    };
  },
  methods: {
    fetchRecords() {
      this.$util.request("main.Site.getMyRecord")
        .then(res => {
          if (res.code === 1) {
            this.records = res.data.record;
          } else {
            uni.showToast({
              icon: "error",
              title: "数据加载失败"
            });
          }
        })
        .catch(() => {
          uni.showToast({
            icon: "error",
            title: "数据加载失败"
          });
        });
    },
    formatDate(date) {
      const dateObj = new Date(date);
      const year = dateObj.getFullYear();
      const currentYear = new Date().getFullYear();
      const formattedDate = year === currentYear
        ? `${dateObj.getMonth() + 1}月${dateObj.getDate()}日`
        : `${year}年${dateObj.getMonth() + 1}月${dateObj.getDate()}日`;
      return formattedDate;
    }
  },
  mounted() {
    this.fetchRecords();
  }
};
</script>

<style scoped>
.record-item {
  display: flex;
  padding: 20rpx;
  margin-bottom: 20rpx;
  background-color: #fff;
  border-radius: 12rpx;
}

.site-image {
  min-width: 312rpx;
	max-width: 312rpx;
	height: 200rpx;
	border-radius: 12rpx;
	margin-right: 20rpx;
}

.record-info {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
      width: 396rpx;
}


.confirmed {
  background-color: #4caf50;
}

.unconfirmed {
  background-color: #f44336;
}

.name-status {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.site-name {
  font-size: 36rpx;
  font-weight: bold;
}

.status {
  font-size: 20rpx;
  padding: 6rpx;
  border-radius: 10rpx;
  font-size: 26rpx;
  color: #fff;
  text-align: center;
  font-size: 20rpx;
  min-width: 80rpx;
}

.site-date {
  font-size: 28rpx;
  color: #888;
}

.site-location {
  font-size: 28rpx;
  margin-bottom: 10rpx;
}

.site-size-price {
  display: flex;
  justify-content: space-between;
  font-size: 28rpx;
  margin-top: 10rpx;
}

.site-time {
  font-size: 28rpx;
  color: #555;
}
</style>
