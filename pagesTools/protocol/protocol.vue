<template>
  <view class="page">
    <title-bar :title="navigationBarTitle"></title-bar>
    <view class="content">
      <view class="content-card">
        <view class="protocol-header">
          <text class="protocol-title">预约协议</text>
          <text class="protocol-subtitle">请仔细阅读以下内容</text>
        </view>
        <rich-text :nodes="richText" class="richText"></rich-text>
      </view>
    </view>
    
    <view v-if="showCheckbox" class="footer">
      <checkbox-group @change="checkboxChange">
        <label class="checkbox-label">
          <checkbox value="agree" :checked="isChecked" color="#4CAF50" />
          <text class="agree-text">我已阅读并同意以上协议</text>
        </label>
      </checkbox-group>
      <button @click="nextStep" 
              class="next-button" 
              :class="{ 'button-active': isChecked }"
              :disabled="!isChecked">
        {{ buttonLabel }}
      </button>
    </view>
    
    <view v-else class="countdown-message">
      <view class="countdown-container">
        <text class="countdown-text">{{ buttonLabel }}</text>
        <view class="progress-bar">
          <view class="progress" :style="{ width: progressWidth + '%' }"></view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
	export default {
		data() {
			return {
				navigationBarTitle: '场地预约协议',
				richText: '', // 富文本内容
				showCheckbox: false, // 是否显示选择框
				isChecked: false, // 是否勾选了选择框
				buttonLabel: '请认真阅读以上协议', // 按钮文字
				countdown: 5, // 倒计时秒数
				type: '', // 接收的类型
				id: 0,
				progressWidth: 0,
			}
		},
		onLoad(options) {
			// 接收页面参数
			this.type = options.type;
			this.id = options.id;
			console.log(options)
			// 根据类型请求内容
			this.fetchAgreementContent();
		},
		methods: {
			// 请求协议内容
			fetchAgreementContent() {
				// 这里替换成实际的请求逻辑
				// 例如使用uni.request来请求数据
				this.$util.request("main.Site.getProtocol", {
					id: this.id
				}).then(res => {
					this.richText = res.data; // 获取场地类型和对应的场地列表
					// this.filterVenues(0); // 默认显示第一个类型的场地
				});

				// 模拟请求到的数据
				// this.richText = '这里是协议的富文本内容...';
				this.startCountdown();
			},
			// 开始倒计时
			startCountdown() {
				const totalTime = this.countdown;
				let timer = setInterval(() => {
					if (this.countdown > 0) {
						this.countdown--;
						this.progressWidth = ((totalTime - this.countdown) / totalTime) * 100;
						this.buttonLabel = `请认真阅读以上协议（${this.countdown}秒）`;
					} else {
						clearInterval(timer);
						this.showCheckbox = true;
						this.buttonLabel = '下一步';
					}
				}, 1000);
			},
			// 选择框变化
			checkboxChange(e) {
				if (e.detail.value.length) {
					this.isChecked = true;
				} else {
					this.isChecked = false;
				}
			},
			// 下一步操作
			nextStep() {
				if (!this.isChecked) {
					uni.showToast({
						title: '请先阅读并同意协议',
						icon: 'none'
					});
					return;
				}
				// 跳转到指定页面
				uni.redirectTo({
					url: '/pagesTools/record/reservation?id='+this.id
				});
			}
		},
	};
</script>


<style>
.page {
  min-height: 100vh;
  background-color: #f5f6fa;
}

.content {
  padding: 30rpx;
  padding-bottom: 180rpx;
}

.content-card {
  background: #fff;
  border-radius: 24rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.protocol-header {
  padding: 40rpx;
  background: linear-gradient(135deg, #4CAF50, #45a049);
  color: #fff;
}

.protocol-title {
  font-size: 36rpx;
  font-weight: 600;
  display: block;
  margin-bottom: 10rpx;
}

.protocol-subtitle {
  font-size: 24rpx;
  opacity: 0.9;
}

.richText {
  padding: 40rpx;
  color: #333;
  font-size: 28rpx;
  line-height: 1.8;
  letter-spacing: 0.5rpx;
}

.footer {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  padding: 30rpx;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-top: 1rpx solid rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.checkbox-label {
  display: flex;
  align-items: center;
  padding: 10rpx 0;
}

.agree-text {
  margin-left: 16rpx;
  font-size: 26rpx;
  color: #666;
}

.next-button {
  width: 100%;
  height: 88rpx;
  border-radius: 44rpx;
  background: #e0e0e0;
  color: #fff;
  font-size: 30rpx;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.button-active {
  background: #4CAF50;
  box-shadow: 0 6rpx 20rpx rgba(76, 175, 80, 0.3);
}

.countdown-message {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  padding: 30rpx;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
}

.countdown-container {
  text-align: center;
}

.countdown-text {
  font-size: 28rpx;
  color: #666;
  margin-bottom: 20rpx;
  display: block;
}

.progress-bar {
  height: 6rpx;
  background: #eee;
  border-radius: 3rpx;
  overflow: hidden;
  margin: 20rpx auto;
  width: 80%;
}

.progress {
  height: 100%;
  background: linear-gradient(90deg, #4CAF50, #45a049);
  transition: width 0.3s linear;
}
</style>