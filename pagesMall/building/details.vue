<template>
    <view>  
        <!-- 标题栏 -->
		<title-bar :title="screenName"></title-bar> 
        <view class="page-container">
            <!-- 企业封面图 -->
    <view class="cover-section">
      <image class="company-logo" :src="companyInfo.image" mode="aspectFill"></image>
      <view class="company-name-card">
        <text class="company-name">{{companyInfo.name}}</text>
      </view>
    </view>
    
    <!-- 信息卡片 -->
    <view class="info-card">
      <!-- 基础信息 -->
      <view class="card-section">
        <view class="section-title">
          <text class="icon">📋</text>
          <text>基本信息</text>
        </view>
        
        <view class="info-grid">
          <view class="grid-item">
            <text class="label">负责人</text>
            <text class="content">{{companyInfo.bossname}}</text>
          </view>
          
          <view class="grid-item">
            <text class="label">门牌号</text>
            <text class="content">{{companyInfo.localhost}}</text>
          </view>
          
          <view class="grid-item">
            <text class="label">成立年份</text>
            <text class="content">{{companyInfo.setupDate}}年</text>
          </view>
        </view>
      </view>
      
      <!-- 企业简介 -->
      <view class="card-section">
        <view class="section-title">
          <text class="icon">📝</text>
          <text>企业简介</text>
        </view>
        <view class="intro-content">
          <text>{{companyInfo.intfo}}</text>
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
      roomId: '',
      companyInfo: {},
      screenName: '企业详情'
    }
  },
  
  onLoad(options) {
    this.roomId = options.id
    this.getCompanyDetail()
  },
  
  methods: {
    getCompanyDetail() {
      const params = {
        room_id: this.roomId
      }
      this.$util.request('main.Building.get_room_detail', params).then(res => {
        if (res.code === 1) {
          this.companyInfo = res.data
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.page-container {
  min-height: 100vh;
  background-color: #f5f6fa;
  
  .cover-section {
    position: relative;
    height: 400rpx;
    
    .company-logo {
      width: 100%;
      height: 100%;
    }
    
    .company-name-card {
      position: absolute;
      bottom: -40rpx;
      left: 30rpx;
      right: 30rpx;
      background: rgba(255, 255, 255, 0.95);
      padding: 20rpx 30rpx;
      border-radius: 16rpx;
      box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
      
      .company-name {
        font-size: 36rpx;
        font-weight: 600;
        color: #333;
      }
    }
  }
  
  .info-card {
    margin: 60rpx 30rpx 30rpx;
    
    .card-section {
      background: #fff;
      border-radius: 16rpx;
      padding: 30rpx;
      margin-bottom: 20rpx;
      box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
      
      .section-title {
        display: flex;
        align-items: center;
        margin-bottom: 30rpx;
        font-size: 32rpx;
        font-weight: 600;
        color: #333;
        
        .icon {
          margin-right: 10rpx;
          font-size: 36rpx;
        }
      }
      
      .info-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 20rpx;
        
        .grid-item {
          .label {
            font-size: 26rpx;
            color: #999;
            margin-bottom: 8rpx;
            display: block;
          }
          
          .content {
            font-size: 30rpx;
            color: #333;
            font-weight: 500;
          }
        }
      }
      
      .intro-content {
        font-size: 28rpx;
        color: #666;
        line-height: 1.6;
      }
    }
  }
}
</style>
