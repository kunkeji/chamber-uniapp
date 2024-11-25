<template>
    <view class="page-container">
        <title-bar :title="screenName"></title-bar>
        <view class="container">
            <!-- 添加楼宇信息展示 -->
            <view class="building-info">
                <text class="building-title">该栋共有{{ floorCount }}层</text>
            </view>
            
            <view class="floor-grid">
                <view 
                    class="floor-item"
                    v-for="floor in floorList"
                    :key="floor"
                    @click="handleFloorClick(floor)"
                >
                    <view class="floor-content">
                        <text class="floor-number">F{{ floor }}</text>
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
            buildingId: '',
            floorCount: 0,
            floorList: [],
            screenName: '选择楼层'
        }
    },
    onLoad(options) {
        // 获取路由参数
        this.buildingId = options.buildingId
        this.floorCount = Number(options.floorCount)
        this.generateFloorList()
    },
    methods: {
        // 生成楼层列表（倒序）
        generateFloorList() {
            this.floorList = Array.from(
                {length: this.floorCount}, 
                (_, index) => this.floorCount - index
            )
        },
        // 更新跳转方法
        handleFloorClick(floor) {
            uni.navigateTo({
                url: `/pagesMall/building/corp?buildingId=${this.buildingId}&floor=${floor}&floorCount=${this.floorCount}`
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.page-container {
    min-height: 100vh;
    background-color: #f8f8f8;
}

.container {
    padding: 30rpx;
}

.building-info {
    margin-bottom: 40rpx;
    padding: 30rpx;
    background: linear-gradient(135deg, #1a2a6c, #2a4858);
    border-radius: 16rpx;
    position: relative;
    overflow: hidden;
    
    &::before {
        content: '';
        position: absolute;
        top: -50%;
        left: -50%;
        width: 200%;
        height: 200%;
        background: linear-gradient(
            rgba(255, 255, 255, 0.1),
            rgba(255, 255, 255, 0.05)
        );
        transform: rotate(45deg);
        animation: shine 3s infinite linear;
    }
    
    .building-title {
        color: #ffffff;
        font-size: 32rpx;
        font-weight: 500;
        text-shadow: 0 2rpx 4rpx rgba(0,0,0,0.2);
    }
}

.floor-grid {
    display: flex;
    flex-direction: column;
    gap: 20rpx;
    padding: 10rpx;
    
    .floor-item {
        background: rgba(255, 255, 255, 0.9);
        backdrop-filter: blur(10rpx);
        border: 1rpx solid rgba(255, 255, 255, 0.3);
        height: 120rpx;
        border-radius: 16rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4rpx 16rpx rgba(0,0,0,0.08);
        transition: all 0.3s ease;
        
        &:active {
            transform: scale(0.98);
            background: rgba(255, 255, 255, 0.7);
        }
        
        .floor-content {
            position: relative;
            
            &::before {
                content: '';
                position: absolute;
                left: -40rpx;
                width: 4rpx;
                height: 40rpx;
                background: linear-gradient(to bottom, #4A90E2, transparent);
            }
            
            .floor-number {
                font-size: 40rpx;
                font-family: 'DIN Alternate', sans-serif;
                background: linear-gradient(135deg, #1a2a6c, #4A90E2);
                -webkit-background-clip: text;
                color: transparent;
            }
        }
    }
}

@keyframes shine {
    from {
        transform: rotate(45deg) translateY(-100%);
    }
    to {
        transform: rotate(45deg) translateY(100%);
    }
}

// 更新动画效果
@keyframes slideIn {
    from {
        opacity: 0;
        transform: translateY(20rpx);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.floor-item {
    animation: slideIn 0.3s ease-out forwards;
    
    @for $i from 1 through 50 {
        &:nth-child(#{$i}) {
            animation-delay: #{$i * 0.03}s;
        }
    }
}
</style>
