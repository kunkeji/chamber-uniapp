<template>
    <view>
        <title-bar :title="screenName"></title-bar>
        <!-- 添加搜索框 -->
        <view class="search-box" v-if="isSearchMode">
            <view class="search-input-wrap">
                <text class="iconfont icon-search"></text>
                <input
                    class="search-input"
                    v-model="keyword"
                    :placeholder="searchPlaceholder"
                    placeholder-class="placeholder"
                    @input="handleSearch"
                    confirm-type="search"
                />
                <text class="clear-icon" v-if="keyword" @tap="clearKeyword">×</text>
            </view>
        </view>

        <view class="corp-container">
            <scroll-view 
                scroll-y 
                class="scroll-view"
                @scrolltolower="loadMore"
                :style="{ height: scrollHeight + 'px' }"
            >
                <view v-if="corpList.length === 0 && !loading" class="empty-state">
                    <image class="empty-icon" src="/static/images/empty.png" mode="aspectFit"></image>
                    <text class="empty-text">{{ emptyText }}</text>
                </view>
                
                <view class="corp-item" v-for="item in corpList" :key="item.id" @tap="goToDetail(item.id)">
                    <image class="corp-logo" :src="item.image || '/static/images/default-corp.png'" mode="aspectFill"></image>
                    <view class="corp-info">
                        <view class="corp-name">{{item.name}}</view>
                        <view class="corp-detail">
                            <block v-if="isSearchMode">
                                <text>{{item.building || '--'}}{{item.count ? `${item.count}层` : '--'}}</text>
                                <text>门牌号：{{item.localhost || '--'}}</text>
                            </block>
                            <block v-else>
                                <text>{{item.count ? `${item.count}层` : '--'}}</text>
                                <text>门牌号：{{item.localhost || '--'}}</text>
                            </block>
                        </view>
                    </view>
                    <text class="iconfont icon-right">›</text>
                </view>
                
                <view class="loading" v-if="loading">加载中...</view>
                <view class="no-more" v-if="noMore && corpList.length > 0">没有更多数据了</view>
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
            keyword: '',
            corpList: [],
            pageSize: 10,
            offset: 0,
            loading: false,
            noMore: false,
            scrollHeight: 0,
            screenName: '企业列表',
            isSearchMode: false,
            searchTimer: null
        }
    },
    
    computed: {
        searchPlaceholder() {
            return this.isSearchMode ? '搜索公司名称' : ''
        },
        emptyText() {
            return this.isSearchMode ? '未找到相关企业' : '暂无企业数据'
        }
    },
    
    onLoad(options) {
        // 判断是搜索模式还是列表模式
        if (options.name) {
            this.isSearchMode = true
            this.keyword = decodeURIComponent(options.name)
            this.screenName = '搜索结果'
        } else {
            this.buildingId = options.buildingId
            this.floor = options.floor
            this.screenName = options.floor ? `${options.floor}层企业` : '企业列表'
        }
        
        // 获取系统信息设置滚动区域高度
        uni.getSystemInfo({
            success: (res) => {
                this.scrollHeight = res.windowHeight - (this.isSearchMode ? 140 : 100)
            }
        })
        
        this.loadData()
    },
    
    methods: {
        async loadData() {
            if (this.loading || this.noMore) return
            
            this.loading = true
            try {
                let res
                if (this.isSearchMode) {
                    res = await this.$util.request('main.Building.search_room', {
                        name: this.keyword
                    })
                    
                    if (res.code === 1) {
                        this.corpList = res.data.map(item => ({
                            ...item,
                            building: item.building || '--',
                            localhost: item.localhost || '--',
                            count: item.count || '--',
                            image: item.image || '/static/images/default-corp.png'
                        }))
                        this.noMore = true
                    }
                } else {
                    res = await this.$util.request('main.Building.get_room_list', {
                        building_id: this.buildingId,
                        floor: this.floor,
                        offset: this.offset,
                        pagesize: this.pageSize
                    })
                    
                    if (res.code === 1) {
                        if (res.data.length < this.pageSize) {
                            this.noMore = true
                        }
                        this.corpList = [...this.corpList, ...res.data]
                        this.offset += this.pageSize
                    }
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
        
        handleSearch(e) {
            if (this.searchTimer) clearTimeout(this.searchTimer)
            
            this.searchTimer = setTimeout(() => {
                this.keyword = e.detail.value
                this.corpList = []
                this.noMore = false
                this.offset = 0
                this.loadData()
            }, 300)
        },
        
        clearKeyword() {
            this.keyword = ''
            this.corpList = []
            this.noMore = false
        },
        
        loadMore() {
            if (!this.isSearchMode) {
                this.loadData()
            }
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
.search-box {
    padding: 20rpx 30rpx;
    background: #fff;
    border-bottom: 1rpx solid #eee;
    
    .search-input-wrap {
        display: flex;
        align-items: center;
        background-color: #F5F5F5;
        padding: 15rpx 30rpx;
        border-radius: 36rpx;
        
        .icon-search {
            font-size: 32rpx;
            color: #999;
            margin-right: 20rpx;
            &::before {
                content: '🔍';
            }
        }
        
        .search-input {
            flex: 1;
            height: 60rpx;
            font-size: 28rpx;
            color: #333;
        }
        
        .placeholder {
            color: #999;
            font-size: 28rpx;
        }
        
        .clear-icon {
            padding: 0 20rpx;
            color: #999;
            font-size: 40rpx;
        }
    }
}

.corp-container {
  background: #f5f5f5;
  min-height: 100vh;
  
  .corp-item {
    margin: 20rpx;
    padding: 20rpx;
    background: #fff;
    border-radius: 12rpx;
    display: flex;
    align-items: center;
    
    .corp-logo {
      width: 100rpx;
      height: 100rpx;
      border-radius: 8rpx;
      background-color: #f5f5f5;
    }
    
    .corp-info {
      flex: 1;
      margin-left: 20rpx;
      
      .corp-name {
        font-size: 32rpx;
        font-weight: bold;
        margin-bottom: 12rpx;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      
      .corp-detail {
        font-size: 26rpx;
        color: #666;
        
        text {
          max-width: 250rpx;
          margin-right: 30rpx;
          
          &:last-child {
            margin-right: 0;
          }
        }
      }
    }
    
    .icon-right {
      color: #999;
      font-size: 32rpx;
      margin-left: 10rpx;
    }
    
    &:active {
      background-color: #f9f9f9;
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
    padding: 200rpx 0;
    
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
