<template>
    <view class="page-container">
        <title-bar :title="screenName"></title-bar> 
        <view class="container">
            <view class="building-list">
                <view 
                    class="building-item"
                    v-for="(item, index) in buildingList"
                    :key="item.id"
                    @click="handleBuildingClick(item)"
                    :style="{'animation-delay': `${index * 0.1}s`}"
                >
                    <view class="building-icon">
                        <u-icon name="home" size="40" color="#4A90E2"></u-icon>
                    </view>
                    <view class="building-info">
                        <text class="building-name">{{item.region}}</text>
                        <text class="floor-count">{{item.floorCount}}层</text>
                    </view>
                    <view class="arrow-icon">
                        <u-icon name="arrow-right" color="#4A90E2"></u-icon>
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
            keyword: '',
            buildingList: [],
            screenName: '楼宇列表'
        }
    },
    onLoad() {
        this.getBuildingList()
    },
    methods: {
        // 获取建筑列表
        getBuildingList() {
            this.$util.request('main.Building.get_building_list').then(res => {
                if (res.code === 1) {
                    this.buildingList = res.data
                }
            })
        },
        // 搜索
        handleSearch() {
            // TODO: 实现搜索功能
        },
        // 点击建筑
        handleBuildingClick(item) {
            console.log(item)
            // 跳转到楼层页面，携带建筑id和楼层数
            uni.navigateTo({
                url: `/pagesMall/building/floor?buildingId=${item.id}&floorCount=${item.floorCount}`
            })
        }
    
    }
}
</script>

<style lang="scss" scoped>
.page-container {
    min-height: 100vh;
    background: linear-gradient(135deg, #f8f9fa, #e9ecef);
}

.container {
    padding: 30rpx;
}

.building-list {
    .building-item {
        display: flex;
        align-items: center;
        padding: 40rpx;
        background: rgba(255, 255, 255, 0.9);
        margin-bottom: 30rpx;
        border-radius: 20rpx;
        box-shadow: 0 8rpx 30rpx rgba(0, 0, 0, 0.05);
        backdrop-filter: blur(10rpx);
        border: 1rpx solid rgba(255, 255, 255, 0.6);
        animation: slideIn 0.6s ease-out forwards;
        opacity: 0;
        transform: translateY(30rpx);
        transition: all 0.3s ease;
        
        &:active {
            transform: scale(0.98);
            background: rgba(255, 255, 255, 0.7);
        }

        .building-icon {
            background: linear-gradient(135deg, #e3f2fd, #bbdefb);
            padding: 20rpx;
            border-radius: 16rpx;
            margin-right: 30rpx;
        }

        .building-info {
            flex: 1;
            position: relative;
            
            &::after {
                content: '';
                position: absolute;
                left: -20rpx;
                top: 50%;
                width: 4rpx;
                height: 60%;
                transform: translateY(-50%);
                background: linear-gradient(to bottom, #4A90E2, transparent);
            }

            .building-name {
                font-size: 34rpx;
                font-weight: 600;
                background: linear-gradient(135deg, #1a2a6c, #4A90E2);
                -webkit-background-clip: text;
                color: transparent;
                display: block;
                margin-bottom: 8rpx;
            }

            .floor-count {
                font-size: 28rpx;
                color: #666;
                opacity: 0.8;
            }
        }

        .arrow-icon {
            position: relative;
            padding: 20rpx;
            
            &::before {
                content: '';
                position: absolute;
                right: 0;
                top: 50%;
                width: 40rpx;
                height: 2rpx;
                background: linear-gradient(to right, transparent, #4A90E2);
                transform: translateY(-50%);
                opacity: 0;
                transition: all 0.3s ease;
            }
            
            &:active::before {
                opacity: 1;
                width: 60rpx;
            }
        }
    }
}

@keyframes slideIn {
    from {
        opacity: 0;
        transform: translateY(30rpx);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes pulse {
    0% {
        box-shadow: 0 0 0 0 rgba(74, 144, 226, 0.4);
    }
    70% {
        box-shadow: 0 0 0 20rpx rgba(74, 144, 226, 0);
    }
    100% {
        box-shadow: 0 0 0 0 rgba(74, 144, 226, 0);
    }
}
</style>
