<template>
	<view class="component-problem">
		<view class="problem-form">
			<view class="problem-form-item" v-for="(item, index) in problemField" :key="index">
				<!-- 标题 -->
				<view class="item-title">
					{{item.topic}}<text style="color: #E60012;" v-if="item.must == 1">*</text>
				</view>
				<!-- 文本字段 -->
				<block v-if="item.type == 'text'">
					<view class="item-text" v-if="item.status == 1">
						<input v-model="item.value" type="text" disabled="true" :placeholder="item.message" placeholder-class="placeholder" />
					</view>
					<view class="item-text" v-else>
						<input v-model="item.value" type="text" :placeholder="item.message" placeholder-class="placeholder" />
					</view>
				</block>
				<!-- 数字字段 -->
				<block v-else-if="item.type == 'number'">
					<view class="item-text" v-if="item.status == 1">
						<input v-model="item.value" type="number" disabled="true" :placeholder="item.message" placeholder-class="placeholder" />
					</view>
					<view class="item-text" v-else>
						<input v-model="item.value" type="number" :placeholder="item.message" placeholder-class="placeholder" />
					</view>
				</block>
				<!-- 单选按钮 -->
				<block v-else-if="item.type == 'radio'">
					<view class="item-radio" v-if="item.status == 1">
						<view class="item-radio-button">
							<image src="/static/mark.png" class="radio-image"></image>
						</view>
						<view class="item-radio-txt">{{item.content}}</view>
					</view>	
					<view class="item-radio" v-for="(radioItem, radioIndex) in transTitle(item.content)" :key="radioIndex" v-else>
						<view class="item-radio-button" @click="selectRadio(index,radioIndex,radioItem.title)">
							<image :src="selectedIdx == radioIndex ? '/static/mark.png' : ''" class="radio-image"></image>
						</view>
						<view class="item-radio-txt">{{radioItem.title}}</view>
					</view>
				</block>
				<!-- 多选按钮 -->
				<block v-else-if="item.type == 'checkbox'">
					<view v-if="item.status == 1">
						<view class="item-checkbox" v-for="(checkboxItem, checkboxIndex) in transd(item.content)" :key="checkboxIndex">
							<view class="item-checkbox-button" @click="toggleCheckbox(index,checkboxIndex,checkboxItem.title)">
								<image src="/static/mark.png"class="checkbox-image"></image>
							</view>
							<view class="item-checkbox-txt">{{checkboxItem.title}}</view>
						</view>
					</view>
					<view v-else>
						<view class="item-checkbox" v-for="(checkboxItem, checkboxIndex) in transTitle(item.content)" :key="checkboxIndex">
							<view class="item-checkbox-button" @click="toggleCheckbox(index,checkboxIndex,checkboxItem.title)">
								<image :src="selectedIndices.includes(checkboxIndex) ? '/static/mark.png' : ''"
									class="checkbox-image"></image>
							</view>
							<view class="item-checkbox-txt">{{checkboxItem.title}}</view>
						</view>
					</view>
				</block>
				<!-- 日期选择 -->
				<block v-else-if="item.type == 'datetime'">
					<view class="item-date" v-if="item.status == 1">
						<view class="input" v-if="item.value">{{item.value}}</view>
						<view class="input placeholder" v-else>{{item.message}}</view>
						<image class="icon" src="/static/date.png" mode="aspectFit"></image>
					</view>
					<view class="item-date" @click="openDatePicker(index)" v-else>
						<view class="input" v-if="item.value">{{item.value}}</view>
						<view class="input placeholder" v-else>{{item.message}}</view>
						<image class="icon" src="/static/date.png" mode="aspectFit"></image>
					</view>
				</block>
				<!-- 下拉选择 -->
				<block v-else-if="item.type == 'select'">
					<view class="item-select" v-if="item.status == 1">
						<view class="input" v-if="item.value">{{item.value}}</view>
						<view class="input placeholder" v-else>{{item.message}}</view>
						<image class="icon" src="/static/right.png" mode="aspectFit"></image>
					</view>
					<view class="item-select" @click="openSelectPicker(index)" v-else>
						<view class="input" v-if="item.value">{{item.value}}</view>
						<view class="input placeholder" v-else>{{item.message}}</view>
						<image class="icon" src="/static/right.png" mode="aspectFit"></image>
					</view>
				</block>
				<!-- 文本域 -->
				<block v-else-if="item.type == 'textarea'">
					<view class="item-textarea" v-if="item.status == 1">
						<textarea v-model="item.value" class="item-textarea-height" disabled="true" :placeholder="item.message" placeholder-class="placeholder"></textarea>
					</view>
					<view class="item-textarea" v-else>
						<textarea v-model="item.value" class="item-textarea-height" :placeholder="item.message" placeholder-class="placeholder"></textarea>
					</view>
				</block>
				<!-- 上传图片 -->
				<block v-else-if="item.type == 'images'">
					<view v-if="item.status == 1">
						<view class="item-image" v-for="(itemImages, imgIndex) in item.content" :key="imgIndex">
							<image class="image" :src="itemImages" mode="aspectFill" @click="previewImage(imgIndex)"></image>
						</view>
					</view>
					<view class="item-images" v-else>
						<view class="flex flex-wrap">
							<view class="item-image" v-for="(itemImages, imgIndex) in selectImages" :key="imgIndex">
								<image class="image" :src="itemImages" mode="aspectFill" @click="previewImage(imgIndex)"></image>
								<image class="close" src="/static/cancel.png" mode="aspectFit" @click="deleteImage(imgIndex)"></image>
							</view>
							<view class="item-upload" @click="chooseImage(index)" v-if="selectImages.length < 9">
								<view class="image-background"></view>
								<view class="image-choose">
									<view class="icon">
										<image src="/static/camera.png" mode="aspectFit"></image>
									</view>
									<view class="text">上传图片</view>
								</view>
							</view>
						</view>
					</view>
				</block>
				<!-- 说明字段 -->
				<block v-if="item.is_explain == 1">
					<view class="item-text">
						<input v-model="item.explain" type="text" :placeholder="item.explain_message" placeholder-class="placeholder" />
					</view>
				</block>
			</view>
			<!-- 单项选择框弹窗组件 -->
			<select-picker ref="selectPicker" title="下拉选择" @onChange="pageChange" @confirm="changeSelectPicker"></select-picker>	
			<!-- 日期选择框弹窗组件 -->
			<date-picker ref="datePicker" @onChange="pageChange" @confirm="changeDatePicker"></date-picker>
		</view>
	</view>
</template>

<script>
	import selectPicker from "@/pages/component/picker/select.vue"
	import datePicker from "@/pages/component/picker/date.vue"
	export default {
		name: "questionProblem",
		props: ["showData"],
		components: {
			selectPicker,
			datePicker
		},
		data() {
			return {
				// 问卷字段 
				problemField: [],
				// 已选择图片
				selectImages: [],
				// 多选选中的
				selectedIndices: [], 
				selectedIdx: -1,
				checkboxValue:[]
			};
		},
		watch: {
			showData: {
				handler(value) {
					this.problemField = value || [];
				},
				immediate: true,
				deep: true
			}
		},
		methods: {
			//单选按钮
			selectRadio(index,radioIndex,radioItem) {
				this.selectedIdx = radioIndex;
				this.$set(this.problemField[index], 'value', radioItem);
			},
			//多选按钮
			toggleCheckbox(index,checkboxIndex,checkboxItem) {
				if (this.selectedIndices.includes(checkboxIndex)) {
					this.selectedIndices = this.selectedIndices.filter((i) => i !== checkboxIndex);
				} else {
					this.selectedIndices.push(checkboxIndex);
				}
				this.checkboxValue.push(checkboxItem)
				this.$set(this.problemField[index], 'value', this.checkboxValue);
			},
			// 选择下拉选项
			openSelectPicker(index) {
				let list = this.transName(this.problemField[index].content);
				this.$refs.selectPicker.open(list, this.problemField[index].value, index)
			},
			// 改变下拉选项
			changeSelectPicker(value, index) {
				this.$set(this.problemField[index], 'value', value.name);
			},
			// 选择日期
			openDatePicker(index) {
				this.$refs.datePicker.open(this.problemField[index].value, index)
			},
			// 改变日期 
			changeDatePicker(value, index) {
				this.$set(this.problemField[index], 'value', value);
			},
			// 获取表单数据
			getApplyField(fn) {
				fn(JSON.parse(JSON.stringify(this.problemField)))
			},
			transd(content) {
				  try {
				    // 使用 split() 方法将字符串分割成数组
				    const items = content.split(',');
				
				    // 遍历数组，为每个项目创建对象
				    const jsonArray = items.map(item => {
				      return {
				        title: item.trim() // 去除项目两侧的空格并作为 title 属性的值
				      };
				    });
				
				    // 返回转换后的 JSON 数组
				    return jsonArray;
				  } catch (error) {
				    console.error("转换为 JSON 出错", error);
				    return null;
				  }  
			}, 
			// 转换数据格式
			transTitle(content) {
				try {
				  const parsedContent = JSON.parse(content);
				  if (Array.isArray(parsedContent)) {
				    return parsedContent.map(item => {
				      return {
				        id: parseInt(item.id),
				        title: item.title
				      };
				    });
				  } else {
				    console.error("parsedContent不是一个数组");
				    return [];
				  }
				} catch (error) {
				  console.error("解析JSON出错", error);
				  return [];
				}  
			}, 
			transName(content) {
				try {
				  const parsedContent = JSON.parse(content);
				  if (Array.isArray(parsedContent)) {
				    return parsedContent.map(item => {
				      return {
				        id: parseInt(item.id),
				        name: item.title
				      };
				    });
				  } else {
				    console.error("parsedContent不是一个数组");
				    return [];
				  }
				} catch (error) {
				  console.error("解析JSON出错", error);
				  return [];
				}  
			},
			// 选择图片
			chooseImage(index) {
				// #ifdef MP-WEIXIN
				uni.chooseMedia({
					count: 9 - this.selectImages.length,
					mediaType: ['image'],
					sourceType: ['album', 'camera'],
					sizeType: ['compressed'],
					success: (res) => {
						this.selectImages = [...this.selectImages, ...res.tempFiles.map(item => item.tempFilePath)]
						this.$set(this.problemField[index], 'value', this.selectImages);
					}
				})
				// #endif
				// #ifndef MP-WEIXIN
				uni.chooseImage({
					count: 9 - this.selectImages.length,
					sizeType: ['original', 'compressed'],
					sourceType: ['album', 'camera'],
					sizeType: ['compressed'],
					success: (res) => {
						this.selectImages = [...this.selectImages, ...res.tempFilePaths]
						this.$set(this.problemField[index], 'value', this.selectImages);
					}
				});
				// #endif
			},
			// 删除图片
			deleteImage(index) {
				this.$delete(this.selectImages, index)
			},
			// 预览图片
			previewImage(index) {
				uni.previewImage({
					urls: this.selectImages,
					current: index,
				})
			},
			// 改变页面滚动状态
			pageChange(state) {
				this.$emit("onChange", state)
			}
		}
	}
</script>

<style lang="scss">
	.component-problem {
		.problem-form {
			.problem-form-item {
				margin-top: 32rpx;

				.item-title {
					font-size: 32rpx;
					font-weight: 600;
					color: #5A5B6E;
				}

				.item-text {
					margin-top: 32rpx;
					padding: 36rpx 32rpx;
					border-radius: 16rpx;
					background: #FFFFFF;

					.placeholder {
						font-size: 28rpx;
						line-height: 40rpx;
						color: #8D929C;
					}
				}

				.item-radio {
					margin-top: 32rpx;
					display: flex;
					align-items: center;

					.item-radio-button {
						width: 48rpx;
						height: 48rpx;
						border-radius: 8rpx;
						background: #FFFFFF;
						position: relative; // 设置相对定位，用于放置图片    

						.radio-image {
							position: absolute;
							top: 0;
							left: 0;
							width: 100%;
							height: 100%;
							display: block;
						}
					}

					.item-radio-txt {
						padding-left: 16rpx;
						font-size: 28rpx;
						line-height: 40rpx;
						color: #5A5B6E;
					}
				}

				.item-checkbox {
					margin-top: 32rpx;
					display: flex;
					align-items: center;

					.item-checkbox-button {
						width: 48rpx;
						height: 48rpx;
						border-radius: 8rpx;
						background: #FFFFFF;
						position: relative; // 设置相对定位，用于放置图片

						.checkbox-image {
							position: absolute;
							top: 0;
							left: 0;
							width: 100%;
							height: 100%;
							display: block;
						}
					}

					.item-checkbox-txt {
						padding-left: 16rpx;
						font-size: 28rpx;
						line-height: 40rpx;
						color: #5A5B6E;
					}

				}
				
				
				.item-date{
					margin-top: 32rpx;
					padding: 36rpx 32rpx;
					border-radius: 16rpx;
					background: #FFFFFF;
					display: flex;
					align-items: center;
					
					.input {
						color: #5A5B6E;
						font-size: 28rpx;
						line-height: 40rpx;
						flex: 1;
					}
					.placeholder {
						color: #ACADB7;
						font-size: 28rpx;
						line-height: 40rpx;
					}
					
					.icon {
						width: 32rpx;
						height: 32rpx;
					}
				}
				
				.item-select{
					margin-top: 32rpx;
					padding: 36rpx 32rpx;
					border-radius: 16rpx;
					background: #FFFFFF;
					display: flex;
					align-items: center;
					
					.input {
						color: #5A5B6E;
						font-size: 28rpx;
						line-height: 40rpx;
						flex: 1;
					}
					.placeholder {
						color: #ACADB7;
						font-size: 28rpx;
						line-height: 40rpx;
					}
					
					.icon {
						width: 32rpx;
						height: 32rpx;
					}
				}
				
				.item-textarea{
					margin-top: 32rpx;
					padding: 36rpx 32rpx;
					border-radius: 16rpx;
					background: #FFFFFF;
					
					.item-textarea-height{
						height: 136rpx;
						width: 100%;
					}
					
					.placeholder {
						font-size: 28rpx;
						line-height: 40rpx;
						color: #8D929C;
					}
				}
				
				
				.item-image {
					width: 32%;
					height: 0;
					padding-top: 32%;
					position: relative;
					margin-top: 32rpx;
					margin-right: 2%;
				
					&:nth-child(3n) {
						margin-right: 0;
					}
				
					.image {
						position: absolute;
						top: 0;
						left: 0;
						border-radius: 10rpx;
					}
				
					.close {
						position: absolute;
						z-index: 1;
						top: 0;
						right: 0;
						width: 48rpx;
						height: 48rpx;
					}
				}
				
				.item-upload {
					width: 32%;
					height: 0;
					padding-top: 32%;
					position: relative;
					margin-top: 32rpx;
					border-radius: 10rpx;
					background: #FFF;
				
					.image{
						position: absolute;
						top: 0;
						left: 0;
						border-radius: 10rpx;
						// width: 240rpx;
						// height: 240rpx;
					}
					.image-background {
						position: absolute;
						top: 0;
						left: 0;
						right: 0;
						bottom: 0;
						z-index: 1;
						background: var(--theme-color);
						opacity: 0.08;
					}
					.image-choose {
						position: absolute;
						top: 20rpx;
						left: 20rpx;
						right: 20rpx;
						bottom: 20rpx;
						z-index: 6;
						display: flex;
						flex-direction: column;
						justify-content: center;
						align-items: center;
						background: #ffffff;
						border-radius: 6rpx;
					
						.icon {
							width: 80rpx;
							height: 80rpx;
							padding: 18rpx;
							background: var(--theme-color);
							border-radius: 50%;
						}
					
						.text {
							margin-top: 16rpx;
							color: var(--theme-color);
							font-size: 28rpx;
							line-height: 40rpx;
						}
					}
				}
			}
		}
	}
</style>