<template>
	<view>
		<title-bar :title="navigationBarTitle"></title-bar>
		<view class="container">
			
		
	    <!-- 顶部筛选栏 -->
	    <view class="filter-bar">
	      <view
	        v-for="(filter, index) in filters"
	        :key="index"
	        :class="['filter-item', { active: activeFilter === filter.value }]"
	        @click="changeFilter(filter.value)"
	      >
	        {{ filter.text }}
	      </view>
	    </view>
	
	    <!-- 保修记录列表 -->
	    <view class="repair-list">
	      <view
	        v-for="(item, index) in filteredData"
	        :key="index"
	        class="repair-card"
	      >
	        <view class="repair-header">
	          <image :src="item.image" class="repair-image"></image>
	          <view class="repair-info">
	            <view class="repair-title">{{ item.title }}</view>
	            <view class="repair-content">{{ item.content }}</view>
	          </view>
	        </view>
	        <view class="repair-footer">
	          <text class="repair-status" :class="'status-' + item.state">
	            {{ getStatusText(item.state) }}
	          </text>
	          <text class="repair-anonymity">
	            {{ item.is_anonymity === '1' ? '匿名' : '公开' }}
	          </text>
	          <text class="repair-time">创建时间: {{ formatTime(item.createtime) }}</text>
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
				navigationBarTitle:"报修记录",
				activeFilter: 'all', // 当前筛选项
				filters: [
					{ text: '全部', value: 'all' },
					{ text: '未处理', value: '1' },
					{ text: '正在处理', value: '2' },
					{ text: '已处理', value: '3' },
				],
				data:[]
			}
		},
		onLoad() {
			this.getRecord()
		},
		computed: {
		    // 根据筛选条件过滤数据
		    filteredData() {
		      if (this.activeFilter === 'all') {
		        return this.data;
		      }
		      return this.data.filter(item => item.state === this.activeFilter);
		    },
		  },
		methods: {
			// 切换筛选项
			    changeFilter(filter) {
			      this.activeFilter = filter;
			    },
				// 状态文字显示
				    getStatusText(state) {
				      switch (state) {
				        case '1':
				          return '未处理';
				        case '2':
				          return '正在处理';
				        case '3':
				          return '已处理';
				        default:
				          return '';
				      }
				    },
					// 时间格式化
					    formatTime(timestamp) {
					      const date = new Date(timestamp * 1000);
					      return date.toLocaleDateString();
					    },
			// getRecord
			getRecord(){
				this.$util.request("main.getRecord").then(res => {
						console.log(res)
						this.data = res.data
					}).catch(error => {
						console.error('提交反馈', error)
					})
			}
			
		}
	}
</script>

<style>
/* 容器 */
.container {
  padding: 20rpx;
}

/* 筛选栏 */
.filter-bar {
  display: flex;
  justify-content: space-around;
  margin-bottom: 40rpx;
  margin-top: 20rpx;
}

.filter-item {
  padding: 20rpx 40rpx;
  border-radius: 40rpx;
  background-color: #f5f5f5;
  color: #333;
  font-size: 32rpx;
}

.filter-item.active {
  background-color: #007aff;
  color: white;
}

/* 列表 */
.repair-list {
  display: flex;
  flex-direction: column;
  gap: 40rpx;
}

/* 卡片 */
.repair-card {
  display: flex;
  flex-direction: column;
  background-color: white;
  padding: 30rpx;
  border-radius: 20rpx;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.1);
}

/* 卡片头部 */
.repair-header {
  display: flex;
  align-items: center;
}

.repair-image {
  width: 160rpx;
  height: 160rpx;
  border-radius: 20rpx;
  margin-right: 30rpx;
}

.repair-info {
  flex: 1;
}

.repair-title {
  font-size: 36rpx;
  font-weight: bold;
  margin-bottom: 10rpx;
}

.repair-content {
  font-size: 28rpx;
  color: #666;
}

/* 卡片底部 */
.repair-footer {
  display: flex;
  justify-content: space-between;
  margin-top: 30rpx;
}

.repair-status {
  font-size: 28rpx;
  padding: 10rpx 20rpx;
  border-radius: 30rpx;
  color: white;
}

.status-1 {
  background-color: #ff9500;
}

.status-2 {
  background-color: #007aff;
}

.status-3 {
  background-color: #28cd41;
}

.repair-anonymity,
.repair-time {
  font-size: 24rpx;
  color: #999;
}
</style>
