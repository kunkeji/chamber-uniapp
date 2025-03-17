<template>
    <view>
        <title-bar title="答题记录"></title-bar>
        <view class="logs-page">
            <!-- 加载中 -->
            <view class="loading-box" v-if="isLoading && page === 1">
                <uni-load-more status="loading" :iconSize="24"></uni-load-more>
            </view>
            <!-- 空数据 -->
            <view class="empty-box" v-else-if="logsList.length === 0">
                <image src="/static/empty.png" mode="aspectFit" class="empty-image"></image>
                <text class="empty-text">暂无答题记录</text>
            </view>
            <!-- 记录列表 -->
            <view class="logs-list" v-else>
                <view class="log-item" v-for="(item, index) in logsList" :key="index">
                    <view class="log-header">
                        <text class="date">{{item.answer_date}}</text>
                        <text class="result" :class="{'correct': item.is_correct}">
                            {{item.is_correct ? '答对了' : '答错了'}}
                        </text>
                    </view>
                    <view class="question-info">
                        <view class="question-title">{{item.question.title}}</view>
                        <view class="answer-info">
                            <text class="label">我的答案：</text>
                            <text class="value">{{item.answer}}</text>
                        </view>
                        <view class="answer-info">
                            <text class="label">正确答案：</text>
                            <text class="value">{{item.question.answer}}</text>
                        </view>
                        <view class="answer-info" v-if="item.is_correct">
                            <text class="label">获得积分：</text>
                            <text class="value points">+{{item.points}}</text>
                        </view>
                    </view>
                </view>
                <!-- 加载更多 -->
                <view class="load-more">
                    <view class="loading-icon" v-if="isLoading && page > 1">
                        <view class="loading-dot"></view>
                        <view class="loading-dot"></view>
                        <view class="loading-dot"></view>
                    </view>
                    <text class="loading-text" v-if="isLoading && page > 1">加载中...</text>
                    <text class="no-more" v-else-if="!hasMore && logsList.length > 0">没有更多了</text>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
export default {
    data() {
        return {
            // 记录列表
            logsList: [],
            // 分页参数
            page: 1,
            pageSize: 10,
            // 是否还有更多
            hasMore: true,
            // 是否加载中
            isLoading: false
        }
    },
    onLoad() {
        this.getLogsList()
    },
    // 下拉刷新
    onPullDownRefresh() {
        this.page = 1
        this.logsList = []
        this.hasMore = true
        this.getLogsList().then(() => {
            uni.stopPullDownRefresh()
        })
    },
    // 上拉加载
    onReachBottom() {
        if (this.hasMore && !this.isLoading) {
            this.page++
            this.getLogsList()
        }
    },
    methods: {
        // 获取记录列表
        async getLogsList() {
            if (!this.hasMore) return
            
            this.isLoading = true
            try {
                const res = await this.$util.request('points.questionLogs', {
                    page: this.page,
                    pageSize: this.pageSize
                })
                
                if (res.code === 1) {
                    if (this.page === 1) {
                        this.logsList = res.data.items
                    } else {
                        this.logsList = [...this.logsList, ...res.data.items]
                    }
                    
                    // 判断是否还有更多数据
                    this.hasMore = this.logsList.length < res.data.total
                } else {
                    uni.showToast({
                        title: res.msg || '获取失败',
                        icon: 'none'
                    })
                }
            } catch (e) {
                uni.showToast({
                    title: '获取失败',
                    icon: 'none'
                })
            } finally {
                this.isLoading = false
            }
        }
    }
}
</script>

<style lang="scss">
.logs-page {
    min-height: 100vh;
    background: #f5f5f5;
    padding: 20rpx;
    
    .loading-box {
        margin-top: 200rpx;
    }
    
    .empty-box {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding-top: 200rpx;
        
        .empty-image {
            width: 200rpx;
            height: 200rpx;
            margin-bottom: 20rpx;
        }
        
        .empty-text {
            font-size: 28rpx;
            color: #999;
        }
    }
    
    .logs-list {
        .log-item {
            background: #ffffff;
            border-radius: 12rpx;
            padding: 30rpx;
            margin-bottom: 20rpx;
            
            .log-header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin-bottom: 20rpx;
                
                .date {
                    font-size: 26rpx;
                    color: #666;
                }
                
                .result {
                    font-size: 26rpx;
                    color: #ff4d4f;
                    
                    &.correct {
                        color: #52c41a;
                    }
                }
            }
            
            .question-info {
                .question-title {
                    font-size: 28rpx;
                    color: #333;
                    line-height: 40rpx;
                    margin-bottom: 16rpx;
                }
                
                .answer-info {
                    font-size: 26rpx;
                    margin-bottom: 12rpx;
                    
                    .label {
                        color: #666;
                    }
                    
                    .value {
                        color: #333;
                        
                        &.points {
                            color: #52c41a;
                            font-weight: bold;
                        }
                    }
                    
                    &:last-child {
                        margin-bottom: 0;
                    }
                }
            }
        }
        
        .load-more {
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 30rpx 0;
            
            .loading-icon {
                display: flex;
                align-items: center;
                margin-right: 12rpx;
                
                .loading-dot {
                    width: 8rpx;
                    height: 8rpx;
                    border-radius: 50%;
                    background-color: #325DFF;
                    margin: 0 4rpx;
                    animation: loading 1.4s infinite ease-in-out;
                    
                    &:nth-child(1) {
                        animation-delay: 0s;
                    }
                    
                    &:nth-child(2) {
                        animation-delay: 0.2s;
                    }
                    
                    &:nth-child(3) {
                        animation-delay: 0.4s;
                    }
                }
            }
            
            .loading-text {
                font-size: 24rpx;
                color: #666;
            }
            
            .no-more {
                font-size: 24rpx;
                color: #999;
            }
        }
    }
}

@keyframes loading {
    0%, 100% {
        transform: scale(0.6);
        opacity: 0.6;
    }
    50% {
        transform: scale(1);
        opacity: 1;
    }
}
</style> 