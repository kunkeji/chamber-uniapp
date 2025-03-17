<template>
  <view>
    <title-bar :title="navigationBarTitle"></title-bar>

    <view class="container">
      <!-- 筛选栏 -->
      <scroll-view scroll-x class="tab-scroll">
        <view class="tab-bar">
          <view
            v-for="(type, index) in venueTypes"
            :key="index"
            class="tab-item"
            :class="{ active: selectedType === index }"
            @click="filterVenues(index)"
          >
            {{ type.name }}
          </view>
        </view>
      </scroll-view>

      <!-- 场地列表 -->
      <view class="venue-list">
        <view
          v-for="venue in filteredVenues"
          :key="venue.id"
          class="venue-card"
          @click="goToDetails(venue)"
        >
          <view class="venue-image-wrapper">
            <image :src="venue.image" class="venue-image" mode="aspectFill"></image>
          </view>
          <view class="venue-info">
            <view class="venue-title">{{ venue.name }}</view>
			
            <view class="venue-price">{{ venue.price != 0.00? venue.price+"元/小时" : "免费" }}</view>
            <view class="venue-details">
              <text class="venue-size">{{ venue.size }}㎡</text>
              <text class="venue-location">{{ venue.location }}</text>
            </view>
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
      navigationBarTitle: '场地预约',
      venueTypes: [], // 场地类型
      selectedType: 0, // 当前选中的tab
      filteredVenues: [], // 当前展示的场地
    };
  },
  mounted() {
    this.getSiteList(); // 页面加载时获取场地列表
  },
  methods: {
    filterVenues(index) {
      this.selectedType = index;
      // 获取当前选中类型下的场地列表
      this.filteredVenues = this.venueTypes[index].list.map(item => ({
        ...item,
        image: `http://62.234.215.13${item.image}` // 修正图片路径
      }));
    },
    goToDetails(venue) {
      wx.navigateTo({
        url: `/pagesTools/protocol/protocol?type="1"&id=${venue.id}`,
      });
    },
    // 获取所有场地列表
    getSiteList() {
      this.$util.request("main.Site.getList").then(res => {
        this.venueTypes = res.data; // 获取场地类型和对应的场地列表
        this.filterVenues(0); // 默认显示第一个类型的场地
      });
    }
  }
};
</script>

<style>
	.container {
		padding: 20rpx;
	}

	/* 标题栏 */
	.title-bar {
		background-color: #007aff;
		color: white;
		padding: 20rpx;
		text-align: center;
		font-size: 32rpx;
	}

	/* 筛选栏 */
	.tab-bar {
		display: flex;
		white-space: nowrap;
		/* 防止换行 */
	}

	.tab-scroll {
		height: 89rpx;
		overflow-x: auto;
		/* 允许横向滚动 */
	}

	/* Tab 栏项目 */
	.tab-item {
		padding: 10rpx 20rpx;
		border-radius: 20rpx;
		background-color: #f5f5f5;
		color: #333;
		font-size: 28rpx;
		margin-right: 10rpx;
		/* 添加间距 */
		cursor: pointer;
		/* 添加手势样式 */
	}

	.tab-item.active {
		background-color: #007aff;
		color: white;
	}

	/* 场地列表 */
	.venue-list {
		display: flex;
		flex-wrap: wrap;
		/* 两列布局 */
		justify-content: space-between;
		/* 调整间距 */
		gap: 20rpx;
		/* 间隔 */
	}

	.venue-card {
		display: flex;
		flex-direction: column;
		/* 垂直布局 */
		justify-content: flex-start;
		/* 垂直顶部对齐 */
		border-radius: 10rpx;
		background-color: #f5f5f5;
		padding: 20rpx;
		width: calc(48%);
		/* 控制卡片宽度，适应两列 */
		box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
	}

	.venue-image-wrapper {
		position: relative;
		width: 100%;
		padding-bottom: 66.67%;
		/* 固定3:2的比例 */
	}

	.venue-image {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		border-radius: 10rpx;
	}

	.venue-info {
		flex: 1;
	}

	.venue-title {
		font-size: 32rpx;
		margin-bottom: 10rpx;
	}

	.venue-price {
		font-size: 28rpx;
		font-weight: bold;
		color: red;
		/* 设置为红色 */
		margin-bottom: 10rpx;
	}

	.venue-details {
		display: flex;
		justify-content: space-between;
		/* 左右分布 */
	}

	.venue-size,
	.venue-location {
		font-size: 28rpx;
		color: #666;
	}
</style>