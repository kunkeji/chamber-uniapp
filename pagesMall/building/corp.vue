<template>
    <view>
        <!-- 标题栏 -->
		<title-bar :title="screenName"></title-bar>
        <view class="corp-container">
            <scroll-view 
      scroll-y 
      class="scroll-view"
      @scrolltolower="loadMore"
      :style="{ height: scrollHeight + 'px' }"
    >
      <!-- <view class="empty-state" v-if="!loading && corpList.length === 0">
        <image class="empty-icon" src="/static/images/empty.png" mode="aspectFit"></image>
        <text class="empty-text">暂无企业信息</text>
      </view> -->
      
      <view class="corp-item" v-for="item in corpList" :key="item.id" @tap="goToDetail(item.id)">
        <image class="corp-logo" :src="item.image" mode="aspectFill"></image>
        <view class="corp-info">
          <view class="corp-name">{{item.name}}</view>
          <view class="corp-detail">
            <text>负责人：{{item.bossname}}</text>
            <text>门牌号：{{item.localhost}}</text>
          </view>
          <view class="corp-detail">
            <text>成立时间：{{item.setupDate}}年</text>
            <text>楼层：{{item.count}}</text>
          </view>
        </view>
      </view>
      <view class="loading" v-if="loading">加载中...</view>
      <view class="no-more" v-if="noMore">没有更多数据了</view>
            </scroll-view>
        </view>
    </view>
</template>

<script>
export default {
  data() {
    return {
      buildingId: '',
      floor: '',
      corpList: [],
      pageSize: 10,
      offset: 0,
      loading: false,
      noMore: false,
      scrollHeight: 0,
      screenName: '企业列表'
    }
  },
  
  onLoad(options) {
    this.buildingId = options.buildingId
    this.floor = options.floor
    // 获取系统信息设置滚动区域高度
    uni.getSystemInfo({
      success: (res) => {
        this.scrollHeight = res.windowHeight
      }
    })
    this.loadData()
  },
  
  methods: {
    async loadData() {
      if (this.loading || this.noMore) return
      
      this.loading = true
      try {
        const params = {
          building_id: this.buildingId,
          floor: this.floor,
          offset: this.offset,
          pagesize: this.pageSize
        }
        
        const res = await this.$util.request('main.Building.get_room_list', params)
        
        if (res.code === 1) {
          if (res.data.length < this.pageSize) {
            this.noMore = true
          }
          this.corpList = [...this.corpList, ...res.data]
          this.offset += this.pageSize
        } else {
          uni.showToast({
            title: res.msg || '加载失败',
            icon: 'none'
          })
        }
      } catch (e) {
        uni.showToast({
          title: '请求失败',
          icon: 'none'
        })
      } finally {
        this.loading = false
      }
    },
    
    loadMore() {
      this.loadData()
    },
    
    goToDetail(id) {
      uni.navigateTo({
        url: `/pagesMall/building/details?id=${id}`
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.corp-container {
  background: #f5f5f5;
  min-height: 100vh;
  
  .corp-item {
    margin: 20rpx;
    padding: 20rpx;
    background: #fff;
    border-radius: 12rpx;
    display: flex;
    
    .corp-logo {
      width: 120rpx;
      height: 120rpx;
      border-radius: 8rpx;
    }
    
    .corp-info {
      flex: 1;
      margin-left: 20rpx;
      
      .corp-name {
        font-size: 32rpx;
        font-weight: bold;
        margin-bottom: 16rpx;
      }
      
      .corp-detail {
        font-size: 26rpx;
        color: #666;
        margin-top: 8rpx;
        
        text {
          margin-right: 20rpx;
        }
      }
    }
  }
  
  .loading, .no-more {
    text-align: center;
    padding: 20rpx;
    color: #999;
    font-size: 26rpx;
  }
  
  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 100rpx 0;
    
    .empty-icon {
      width: 200rpx;
      height: 200rpx;
      margin-bottom: 20rpx;
    }
    
    .empty-text {
      font-size: 28rpx;
      color: #999;
    }
  }
}
</style>
