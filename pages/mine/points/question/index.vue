    <template>
    <view>
        <title-bar title="每日问答"></title-bar>
        <view class="question-page">
            <!-- 加载中 -->
            <view class="loading-box" v-if="isLoading">
                <uni-load-more status="loading" :iconSize="24"></uni-load-more>
            </view>
            <!-- 已答题 -->
            <view class="answered-box" v-else-if="isAnswered">
                <image src="/static/answered.png" mode="aspectFit" class="answered-image"></image>
                <text class="answered-text">今日已完成答题</text>
                <text class="answered-tip">明天再来吧~</text>
                <view class="record-btn" @click="toRecord">查看答题记录</view>
            </view>
            <!-- 问题内容 -->
            <block v-else>
                <view class="question-card">
                    <view class="card-header">
                        <text class="title">今日问题</text>
                        <view class="record-btn" @click="toRecord">答题记录</view>
                    </view>
                    <view class="question-title">{{questionInfo.title}}</view>
                    <view class="options-list">
                        <view 
                            class="option-item" 
                            v-for="(value, key) in questionInfo.options" 
                            :key="key"
                            :class="{'selected': selectedAnswer === key}"
                            @click="selectAnswer(key)"
                        >
                            <text class="option-key">{{key}}</text>
                            <text class="option-value">{{value}}</text>
                        </view>
                    </view>
                </view>
                <view class="submit-btn" :class="{'disabled': !selectedAnswer}" @click="submitAnswer">
                    提交答案
                </view>
            </block>
        </view>
    </view>
</template>

<script>
export default {
    data() {
        return {
            isLoading: true,
            isAnswered: false,
            questionInfo: {},
            selectedAnswer: '',
            questionId: ''
        }
    },
    onLoad() {
        this.getTodayQuestion()
    },
    methods: {
        // 获取今日问题
        async getTodayQuestion() {
            this.isLoading = true
            try {
                const res = await this.$util.request('points.questionToday')
                if (res.code === 1) {
                    this.isAnswered = res.data.is_answered
                    if (!this.isAnswered && res.data.question) {
                        this.questionInfo = res.data.question
                        this.questionId = res.data.question.id
                    }
                    this.isAnswered = res.data.is_answered
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
        },
        // 选择答案
        selectAnswer(answer) {
            this.selectedAnswer = answer
        },
        // 提交答案
        async submitAnswer() {
            if (!this.selectedAnswer) return
            
            try {
                const res = await this.$util.request('points.questionSubmit', {
                    question_id: this.questionId,
                    answer: this.selectedAnswer
                })
                
                if (res.code === 1) {
                    // 显示结果
                    if (res.data.is_correct) {
                        uni.showModal({
                            title: '答对啦',
                            content: `恭喜获得${res.data.points}积分`,
                            showCancel: false,
                            success: () => {
                                this.isAnswered = true
                            }
                        })
                    } else {
                        uni.showModal({
                            title: '答错了',
                            content: '很遗憾，再接再厉',
                            showCancel: false,
                            success: () => {
                                this.getTodayQuestion()
                            }

                        })
                    }
                } else {
                    uni.showToast({
                        title: res.msg || '提交失败',
                        icon: 'none'
                    })
                }
            } catch (e) {
                uni.showToast({
                    title: '提交失败',
                    icon: 'none'
                })
            }
        },
        // 跳转答题记录
        toRecord() {
            uni.navigateTo({
                url: '/pages/mine/points/question/logs'
            })
        }
    }
}
</script>

<style lang="scss">
.question-page {
    min-height: 100vh;
    background: #f5f5f5;
    padding: 20rpx;
    
    .loading-box {
        margin-top: 200rpx;
    }
    
    .answered-box {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding-top: 200rpx;
        
        .answered-image {
            width: 200rpx;
            height: 200rpx;
            margin-bottom: 20rpx;
        }
        
        .answered-text {
            font-size: 32rpx;
            color: #333;
            font-weight: bold;
            margin-bottom: 12rpx;
        }
        
        .answered-tip {
            font-size: 26rpx;
            color: #999;
            margin-bottom: 30rpx;
        }
        
        .record-btn {
            font-size: 26rpx;
            color: #325DFF;
            padding: 12rpx 30rpx;
            background: rgba(50, 93, 255, 0.1);
            border-radius: 24rpx;
            
            &:active {
                opacity: 0.8;
            }
        }
    }
    
    .question-card {
        background: #ffffff;
        border-radius: 12rpx;
        padding: 30rpx;
        margin-bottom: 40rpx;
        
        .card-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 30rpx;
            
            .title {
                font-size: 32rpx;
                color: #333;
                font-weight: bold;
            }
            
            .record-btn {
                font-size: 26rpx;
                color: #325DFF;
                padding: 8rpx 20rpx;
                background: rgba(50, 93, 255, 0.1);
                border-radius: 24rpx;
                
                &:active {
                    opacity: 0.8;
                }
            }
        }
        
        .question-title {
            font-size: 30rpx;
            color: #333;
            line-height: 42rpx;
            margin-bottom: 40rpx;
        }
        
        .options-list {
            .option-item {
                display: flex;
                align-items: center;
                padding: 24rpx;
                background: #f8f8f8;
                border-radius: 12rpx;
                margin-bottom: 20rpx;
                
                .option-key {
                    width: 48rpx;
                    height: 48rpx;
                    background: #ffffff;
                    border-radius: 24rpx;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 26rpx;
                    color: #666;
                    margin-right: 20rpx;
                }
                
                .option-value {
                    font-size: 28rpx;
                    color: #333;
                    flex: 1;
                }
                
                &.selected {
                    background: rgba(50, 93, 255, 0.1);
                    
                    .option-key {
                        background: #325DFF;
                        color: #ffffff;
                    }
                    
                    .option-value {
                        color: #325DFF;
                    }
                }
                
                &:active {
                    opacity: 0.8;
                }
                
                &:last-child {
                    margin-bottom: 0;
                }
            }
        }
    }
    
    .submit-btn {
        height: 88rpx;
        background: #325DFF;
        color: #ffffff;
        font-size: 30rpx;
        border-radius: 44rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        
        &.disabled {
            background: #cccccc;
        }
        
        &:active {
            opacity: 0.8;
        }
    }
}
</style> 