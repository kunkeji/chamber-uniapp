<template>
  <view class="page">
    <title-bar :title="navigationBarTitle"></title-bar>
    <view class="content">
      <view v-html="richText" class="richText"></view>
      <view v-if="showCheckbox" class="footer">
        <checkbox-group @change="checkboxChange">
          <label class="checkbox-label">
            <checkbox value="agree" :checked="isChecked" />
            <text class="agree-text">我已阅读并同意以上协议</text>
          </label>
        </checkbox-group>
        <button @click="nextStep" class="next-button">{{ buttonLabel }}</button>
      </view>
      <view v-else class="countdown-message">{{ buttonLabel }}</view>
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
				id: 0
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
				let timer = setInterval(() => {
					if (this.countdown > 0) {
						this.countdown--;
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
  display: flex;
  flex-direction: column;
  height: 100%;
}

.content {
  flex: 1;
  padding: 20rpx;
  padding-bottom: 120rpx; /* Adjust padding to make space for the fixed footer */
  overflow-y: auto;
}

.richText {
  color: #333;
  font-size: 32rpx;
  line-height: 1.6;
  margin-bottom: 40rpx;
}

.footer {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx;
  background-color: #fff;
  border-top: 1rpx solid #eee;
}

.checkbox-label {
  display: flex;
  align-items: center;
}

.agree-text {
  margin-left: 16rpx;
  font-size: 28rpx;
  color: #666;
}

.next-button {
  background-color: #007aff;
  color: #fff;
  border: none;
  margin: 0;
  border-radius: 8rpx;
  font-size: 32rpx;
}

.countdown-message {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  text-align: center;
  padding: 20rpx 0;
  font-size: 28rpx;
  color: #666;
  background-color: #fff;
  border-top: 1rpx solid #eee;
}
</style>