<template>
	<view class="container">
		<!-- 标题栏 -->
		<title-bar :showBack="true" title="供需详情"></title-bar>
		<!-- 内容区 -->
		<view class="container-main">
			<block v-if="loadEnd">
				<!-- 顶部提示语 -->
				<view class="main-prompt alignments" style="background: #FFF1F2" v-if="demandDetails.business.reject">
					<view class="main-prompt-txt" style="color: #FF626E">驳回原因:{{ demandDetails.business.reject }}</view>
				</view>
				<view class="main-prompt alignments" :style="{ background: themeColorWithOpacity }" v-else>
					<view class="main-prompt-icon" :style="{'background-image': 'url('+ iconSecurity +')'}" v-if="iconSecurity"></view>
					<view class="main-prompt-txt" :style="{ color: themeColor }">信息真实,该信息由本{{organize}}成员发布,接受大家监督</view>
				</view>
				<!-- 供需详情 -->
				<view class="demand-main">
					<!-- 顶部发布人信息 -->
					<view class="demand-person alignments" @click="toMemberDetails()">
						<image :src="demandDetails.member.avatar" mode="aspectFill" class="demand-person-img"></image>
						<view class="demand-person-info">
							<view class="info-name">{{ demandDetails.member.name }}</view>
							<view class="info-level">
								<text class="info-level-rank">{{ demandDetails.member.level_name }}</text>
								|
								<text class="info-level-time">{{ getDateBefore(demandDetails.business.createtime) }}</text>
								|
								<text class="info-level-scan">浏览{{ demandDetails.business.page_view }}</text>
							</view>
						</view>
						<view class="demand-person-icon" :style="{'background-image': 'url('+ iconRightArrow +')'}" v-if="iconRightArrow"></view>
					</view>
					<!-- 供需内容 -->
					<view class="demand-info">
						<view class="demand-info-title">
							<text>{{ demandDetails.business.title }}</text>
						</view>
						<view class="demand-info-introduce">
							<text>{{ demandDetails.business.content }}</text>
						</view>
						<view class="demand-info-img" v-if="demandDetails.business && demandDetails.business.images != ''">
							<view v-for="(items, index) in demandDetails.business.images.slice(0, 12)" :key="index" :style="{ marginBottom: ((index + 1) % 3 !== 0) ? '16rpx' : '0' }" @click="previewImages(index)">
								<image :src="items" mode="aspectFill" class="info-img-size"></image>
							</view>
						</view>
					</view>

					<!-- 添加评论区 -->
					<view class="demand-comments">
						<view class="comments-title">评论区</view>
						<!-- 评论列表 -->
						<view class="comments-list" v-if="commentList.length > 0">
							<view class="comment-item" v-for="(item, index) in commentList" :key="index">
								<view class="comment-header">
									<view class="comment-user alignments">
										<image :src="item.member.avatar" mode="aspectFill" class="user-avatar"></image>
										<view class="user-info">
											<view class="user-name">
												{{item.member.name}}
												<text v-if="item.is_author" class="author-tag">作者</text>
											</view>
											<view class="comment-time">{{getDateBefore(item.createtime)}}</view>
										</view>
									</view>
									<text 
										v-if="item.is_self" 
										class="delete-btn" 
										@click="deleteComment(item.id)"
									>删除</text>
								</view>
								<view class="comment-content">{{decodeHtml(item.content)}}</view>
								<view class="comment-actions">
									<text class="action-btn" @click="toggleReplyInput(item)">
										{{replyTo && replyTo.id === item.id ? '取消回复' : '回复'}}
									</text>
								</view>
								
								<!-- 子评论列表 -->
								<view class="reply-list" v-if="item.children && item.children.length > 0">
									<view class="reply-item" v-for="(reply, replyIndex) in item.children" :key="replyIndex">
										<view class="reply-header">
											<view class="comment-user alignments">
												<image :src="reply.member.avatar" mode="aspectFill" class="user-avatar"></image>
												<view class="user-info">
													<view class="user-name">
														{{reply.member.name}}
														<text v-if="reply.is_author" class="author-tag">作者</text>
														<text class="reply-to">回复</text>
														{{item.member.name}}
													</view>
													<view class="comment-time">{{getDateBefore(reply.createtime)}}</view>
												</view>
											</view>
											<text 
												v-if="reply.is_self" 
												class="delete-btn" 
												@click="deleteComment(reply.id)"
											>删除</text>
										</view>
										<view class="comment-content">{{decodeHtml(reply.content)}}</view>
									</view>
								</view>
							</view>
						</view>
						<view class="no-comment" v-else>
							暂无评论，快来抢沙发吧~
						</view>
						
						<!-- 评论输入框 -->
						<view class="comment-input-box">
							<view class="input-wrapper" :class="{'with-reply': replyTo}">
								<input 
									type="text" 
									v-model="commentContent"
									:placeholder="replyTo ? `回复 ${replyTo.member.name}` : '说点什么吧...'"
									class="comment-input"
									@confirm="submitComment"
									@focus="onInputFocus"
									@blur="onInputBlur"
								/>
								<text v-if="replyTo" class="cancel-reply" @click="cancelReply">×</text>
							</view>
							<view 
								class="submit-btn" 
								:style="{ background: themeColor }"
								@click="submitComment"
							>发送</view>
						</view>
					</view>

				</view>
				<view style="height: 100rpx;"></view>
			</block>
			<view class="main-login" v-else-if="showLogin">
				<image class="login-image" :src="loginImg" mode="aspectFit"></image>
				<view class="login-tips">小程序需要登录注册才能使用相关功能，请登录后查看该页面</view>
				<view class="login-btn" :style="{ background: themeColor }" @click="toLogin()">前往登录</view>
				<view class="login-btn cancel" @click="toBack()">返回上一页</view>
			</view>
			<!-- 底部按钮 -->
			
		</view>
	</view>
</template>

<script>
	// #ifdef H5
	import wx from 'weixin-js-sdk';
	// #endif
	import {
		mapState
	} from "vuex"
	import svgData from "@/common/svg.js"
	export default {
		data() {
			return {
				// 加载完成
				loadEnd: false,
				// 供需id
				id: 0,
				// 详情类型
				type: 1,
				demandDetails: {},
				// 是否显示登录提示
				showLogin: false,
				commentList: [], // 评论列表
				commentContent: '', // 评论内容
				replyTo: null, // 当前回复的评论对象
				isInputFocused: false, // 新增：输入框焦点状态
			};
		},
		computed: {
			...mapState({
				themeColor: state => state.app.themeColor,
				organize: state => state.app.organize,
				iconSecurity: state => {
					return svgData.svgToUrl("security", state.app.themeColor);
				},
				iconRightArrow: state => {
					return svgData.svgToUrl("rightArrow", state.app.themeColor);
				},
				iconShare: state => {
					return svgData.svgToUrl("share", state.app.themeColor);
				},
				loginImg: state => state.app.loginImg,
			}),
			themeColorWithOpacity() {
				return this.$util.hexToRgb(this.themeColor, 0.06);
			}
		},
		onLoad(option) {
			this.type = option.type
			this.id = option.id
			uni.showLoading({
				title: "加载中"
			})
			this.getDemandDetails(() => {
				uni.hideLoading()
				this.loadEnd = true
				this.getCommentList() // 获取评论列表
				// #ifdef H5
				this.initConfig()
				// #endif
			})
		},
		onShareAppMessage() {
			return {
				title: this.demandDetails.business.title,
				imageUrl: this.demandDetails.business.images[0],
			}
		},
		onShareTimeline() {
			return {
				title: this.demandDetails.business.title,
				imageUrl: this.demandDetails.business.images[0],
			}
		},
		methods: {
			// #ifdef H5
			// 微信公众号初始化方法
			initConfig() {
				this.$util.request("main.WeChatConfig", {
					url: location.href.split("?")[0]
				}).then(res => {
					if (res.code == 1) {
						wx.config({
							debug: false,
							appId: res.data.appId,
							timestamp: Number(res.data.timestamp),
							nonceStr: res.data.nonceStr,
							signature: res.data.signature,
							jsApiList: ["updateAppMessageShareData", "updateTimelineShareData"],
							openTagList: ["updateAppMessageShareData", "updateTimelineShareData"],
						})
						wx.ready(() => {
							wx.updateAppMessageShareData({
								title: this.demandDetails.business.title,
								desc: "",
								link: window.location.href,
								imgUrl: this.demandDetails.business.images[0],
							});
							wx.updateTimelineShareData({
								title: this.demandDetails.business.title,
								link: window.location.href,
								imgUrl: this.demandDetails.business.images[0],
							});
						});
					} else {
						uni.hideLoading()
						uni.showToast({
							title: res.msg,
							icon: 'none'
						})
					}
				}).catch(error => {
					uni.hideLoading()
					console.error('通过config接口注入权限验证配置 ', error)
				})
			},
			// #endif
			// 获取详情
			getDemandDetails(fn) {
				if (this.type == 1) {
					this.$util.request("demand.businessDetails", {
						id: this.id
					}).then(res => {
						if (fn) fn()
						if (res.code == 1) {
							this.demandDetails = res.data
							this.demandDetails.business.images = (res.data.business.images).split(',')
						} else {
							uni.showToast({
								title: res.msg,
								icon: 'none'
							})
						}
					}).catch(error => {
						if (error == 401) {
							this.showLogin = true
						} else {
							if (fn) fn()
							console.error('获取详情 ', error)
						}
					})
				} else if (this.type = 2) {
					this.$util.request("demand.businessUserDetails", {
						id: this.id
					}).then(res => {
						if (fn) fn()
						if (res.code == 1) {
							this.demandDetails = res.data
							this.demandDetails.business.images = (res.data.business.images).split(',')
						} else {
							uni.showToast({
								title: res.msg,
								icon: 'none'
							})
						}
					}).catch(error => {
						if (error == 401) {
							this.showLogin = true
						} else {
							if (fn) fn()
							console.error('获取详情 ', error)
						}
					})
				}
			},
			// 修改供需
			editDemand(id) {
				this.$util.toPage({
					mode: 2,
					path: "/pagesDemand/demand/edit?id=" + id
				})
			},
			// 删除供需
			delDemand(id) {
				uni.showModal({
					title: '提示',
					content: '确认删除此条吗?',
					confirmText: '确认删除',
					confirmColor: '#E50002',
					cancelText: '我再想想',
					cancelColor: '#999999',
					success: (res) => {
						if (res.confirm) {
							this.$util.request("demand.businessDel", {
								id: id,
							}).then(res => {
								if (res.code == 1) {
									uni.showToast({
										title: "删除成功"
									})
									setTimeout(() =>
										uni.navigateBack(), 1000)
								} else {
									uni.showToast({
										title: res.msg,
										icon: 'none'
									})
								}
							}).catch(error => {
								console.error('获取供需列表', error)
							})

						}
					}
				})
			},
			// 去会员详情
			toMemberDetails() {
				this.$util.toPage({
					mode: 1,
					path: "/pages/member/details?id=" + this.demandDetails.member.id
				})
			},
			// 联系
			onContact() {
				this.$util.toPage({
					mode: 6,
					phone: this.demandDetails.member.mobile,
				})
			},
			// 预览图片 
			previewImages(index) {
				const urls = this.demandDetails.business.images.map(item => item);
				uni.previewImage({
					urls: urls,
					current: index,
				});

			},
			// 时间戳转换
			getDateBefore(time) {
				if (time) return this.$util.getDateBeforeNow(time)
				else return ""
			},
			// 前往登录
			toLogin() {
				uni.navigateTo({
					url: "/pages/login/index",
				})
			},
			// 返回上一页
			toBack() {
				if (getCurrentPages().length == 1) {
					this.$util.toPage({
						mode: 1,
						path: "/pages/index/index"
					})
				} else {
					uni.navigateBack()
				}
			},
			// 获取评论列表
			getCommentList() {
				this.$util.request("demand.commentList", {
					article_id: this.id
				}).then(res => {
					if (res.code == 1) {
						this.commentList = res.data
					}
				}).catch(error => {
					console.error('获取评论列表失败', error)
				})
			},
			// 解码HTML实体
			decodeHtml(html) {
				if(!html) return '';
				return html.replace(/&quot;/g, '"')
					.replace(/&amp;/g, '&')
					.replace(/&lt;/g, '<')
					.replace(/&gt;/g, '>')
					.replace(/&#39;/g, "'");
			},
			// 显示回复输入框
			showReplyInput(comment) {
				this.replyTo = comment
				this.commentContent = ''
			},
			// 提交评论
			submitComment() {
				if (!this.commentContent.trim()) {
					uni.showToast({
						title: '请输入评论内容',
						icon: 'none'
					})
					return
				}
				
				const params = {
					article_id: this.id,
					content: this.commentContent
				}
				
				// 如果是回复评论,添加父评论id
				if (this.replyTo) {
					params.parent_comment_id = this.replyTo.id
				}
				
				this.$util.request("demand.addComment", params).then(res => {
					if (res.code == 1) {
						uni.showToast({
							title: '评论成功'
						})
						this.commentContent = ''
						this.replyTo = null
						this.getCommentList() // 重新获取评论列表
					} else {
						uni.showToast({
							title: res.msg,
							icon: 'none'
						})
					}
				}).catch(error => {
					console.error('提交评论失败', error)
				})
			},
			// 切换回复输入框
			toggleReplyInput(comment) {
				if (this.replyTo && this.replyTo.id === comment.id) {
					this.cancelReply()
				} else {
					this.showReplyInput(comment)
				}
			},
			// 取消回复
			cancelReply() {
				this.replyTo = null
				this.commentContent = ''
			},
			// 输入框获得焦点
			onInputFocus() {
				this.isInputFocused = true
			},
			// 输入框失去焦点
			onInputBlur() {
				this.isInputFocused = false
			},
			// 删除评论
			deleteComment(commentId) {
				uni.showModal({
					title: '提示',
					content: '确定要删除这条评论吗？',
					success: (res) => {
						if (res.confirm) {
							this.$util.request("demand.deleteComment", {
								id: commentId
							}).then(res => {
								if (res.code == 1) {
									uni.showToast({
										title: '删除成功'
									})
									this.getCommentList() // 重新获取评论列表
								} else {
									uni.showToast({
										title: res.msg,
										icon: 'none'
									})
								}
							}).catch(error => {
								console.error('删除评论失败', error)
								uni.showToast({
									title: '删除失败',
									icon: 'none'
								})
							})
						}
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	.container {
		.container-main {
			.main-prompt {
				padding: 24rpx 36rpx;
				font-size: 24rpx;
				line-height: 34rpx;
				background: #EEF2FF;
				color: #325DFF;

				.main-prompt-icon {
					width: 32rpx;
					height: 32rpx;
					background-size: 32rpx;
				}

				.main-prompt-txt {
					padding-left: 8rpx;
					font-size: 24rpx;
					line-height: 34rpx;
				}
			}

			.demand-main {
				margin: 32rpx 32rpx 150rpx 32rpx;
				padding: 32rpx;
				border-radius: 16rpx;
				background: #FFFFFF;

				.demand-person {

					.demand-person-img {
						width: 96rpx;
						height: 96rpx;
						border-radius: 50%;
					}

					.demand-person-info {
						flex: 1;
						padding-left: 24rpx;
						color: #666666;

						.info-name {
							font-size: 32rpx;
							font-weight: 600;
							line-height: 44rpx;
							color: #5A5B6E;
						}

						.info-level {
							display: flex;
							padding-top: 12rpx;
							font-size: 28rpx;
							line-height: 40rpx;
							color: #666666;

							.info-level-rank {
								padding-right: 8rpx;
							}

							.info-level-time {
								padding-left: 8rpx;
								padding-right: 8rpx;
							}

							.info-level-scan {
								padding-left: 8rpx;
							}
						}
					}

					.demand-person-icon {
						width: 50rpx;
						height: 50rpx;
						background-size: 50rpx;
					}

					.demand-person-contact {
						padding: 8rpx 16rpx;
						border-radius: 8rpx;
						font-size: 24rpx;
						background: #325DFF;
						color: #FFFFFF;
					}
				}

				.demand-info {
					padding-top: 32rpx;
					border-bottom: 1rpx solid #efefef;

					.demand-info-title {
						font-size: 32rpx;
						font-weight: 600;
						line-height: 44rpx;
						color: #5A5B6E;
					}

					.demand-info-introduce {
						padding-top: 24rpx;
						font-size: 28rpx;
						line-height: 40rpx;
						color: #5A5B6E;
					}

					.demand-info-img {
						display: flex;
						flex-wrap: wrap;
						justify-content: space-between;
						padding-top: 16rpx;

						.info-img-size {
							border-radius: 16rpx;
							width: 200rpx;
							height: 200rpx;
						}
					}

					.demand-info-img::after {
						width: 200rpx;
						content: '';
					}
				}

				.demand-browse {
					padding-top: 24rpx;
					display: flex;

					.demand-browse-num {
						flex: 1;
						font-size: 24rpx;
						line-height: 34rpx;
						color: #999999;
					}

					.demand-browse-share {
						display: flex;
						font-size: 28rpx;
						line-height: 40rpx;
						color: #5A5B6E;

						.share-img {
							width: 32rpx;
							height: 32rpx;
						}

					}
				}
			}

			.demand-bottom,
			.main-bottom {
				position: fixed;
				bottom: 0;
				left: 0;
				right: 0;
				background: #FFF;
				padding: 16rpx 24rpx;
				z-index: 10; // 增加z-index确保在评论输入框之上
			}
			
			.demand-comments {
				.comment-input-box {
					z-index: 9; // 确保评论输入框在底部按钮之下
				}
			}

			.main-bottom {
				position: fixed;
				bottom: 0;
				left: 0;
				right: 0;
				width: 100%;
				text-align: center;
				background: #FFF;
				padding: 16rpx 24rpx;
				z-index: 1;

				.main-bottom-money {
					font-size: 40rpx;
					line-height: 56rpx;
				}

				.main-bottom-button {
					padding: 22rpx 0rpx 22rpx;
					background: #999999;
					color: rgba(255, 255, 255, 1);
					text-align: center;
					line-height: 44rpx;
					border-radius: 16rpx;
					font-size: 32rpx;
				}

			}

			.main-login {
				padding: 96rpx 60rpx 0;

				.login-image {
					width: 100%;
					height: 500rpx;
				}

				.login-tips {
					color: #585858;
					font-size: 36rpx;
					line-height: 50rpx;
					margin-top: 48rpx;
					text-align: center;
				}

				.login-btn {
					margin-top: 56rpx;
					height: 88rpx;
					line-height: 88rpx;
					font-size: 28rpx;
					border-radius: 16rpx;
					text-align: center;
					color: #ffffff;

					&.cancel {
						background: #dedede;
						color: #999;
						margin-top: 48rpx;
					}
				}
			}

			.demand-comments {
				margin-top: 32rpx;
				
				.comments-title {
					font-size: 32rpx;
					font-weight: 600;
					color: #5A5B6E;
					margin-bottom: 24rpx;
				}
				
				.comments-list {
					// 通用的评论样式（父评论和子评论共用）
					%comment-base {
						.comment-header,
						.reply-header {
							display: flex;
							justify-content: space-between;
							align-items: flex-start;
							
							.comment-user {
								flex: 1;
								
								.user-avatar {
									border-radius: 50%;
								}
								
								.user-info {
									margin-left: 16rpx;
									
									.user-name {
										font-size: 28rpx;
										color: #5A5B6E;
										font-weight: 500;
									}
									
									.comment-time {
										font-size: 24rpx;
										color: #999;
										margin-top: 4rpx;
									}
								}
							}
						}
						
						.delete-btn {
							font-size: 24rpx;
							color: #FF5151;
							padding: 4rpx 0 4rpx 24rpx;
						}
						
						.comment-content {
							margin-top: 16rpx;
							font-size: 28rpx;
							color: #5A5B6E;
							line-height: 40rpx;
						}
					}
					
					// 父评论样式
					.comment-item {
						padding: 24rpx 0;
						border-bottom: 1px solid #EEEEEE;
						@extend %comment-base;
						
						.comment-user {
							.user-avatar {
								width: 64rpx;
								height: 64rpx;
							}
						}
						
						.comment-actions {
							margin-top: 16rpx;
							
							.action-btn {
								font-size: 24rpx;
								color: #999;
								padding: 4rpx 16rpx;
							}
						}
						
						// 子评论列表样式
						.reply-list {
							margin-left: 64rpx;
							margin-top: 16rpx;
							padding: 16rpx;
							background: #F5F5F5;
							border-radius: 8rpx;
							
							// 子评论样式
							.reply-item {
								@extend %comment-base;
								padding: 16rpx 0;
								border-bottom: 1px solid #EEEEEE;
								
								&:last-child {
									border-bottom: none;
								}
								
								.comment-user {
									.user-avatar {
										width: 48rpx;
										height: 48rpx;
									}
									
									.user-name {
										.reply-to {
											font-size: 24rpx;
											color: #999;
											margin: 0 8rpx;
										}
									}
								}
							}
						}
					}
				}
				
				.no-comment {
					text-align: center;
					color: #999;
					font-size: 28rpx;
					padding: 32rpx 0;
				}
				
				.comment-input-box {
					position: fixed;
					bottom: 0;
					left: 0;
					right: 0;
					padding: 24rpx;
					background: #fff;
					display: flex;
					align-items: center;
					border-top: 1px solid #EEEEEE;
					
					.input-wrapper {
						flex: 1;
						position: relative;
						display: flex;
						align-items: center;
						background: #F5F5F5;
						border-radius: 36rpx;
						padding-right: 16rpx;

						&.with-reply {
							background: #E8F3FF;
						}

						.comment-input {
							flex: 1;
							height: 72rpx;
							padding: 0 24rpx;
							font-size: 28rpx;
							background: transparent;
						}

						.cancel-reply {
							font-size: 32rpx;
							color: #999;
							padding: 0 16rpx;
						}
					}
					
					.submit-btn {
						min-width: 120rpx;
						height: 72rpx;
						border-radius: 36rpx;
						margin-left: 16rpx;
						color: #fff;
						font-size: 28rpx;
						display: flex;
						align-items: center;
						justify-content: center;
					}
				}
			}
		}
	}

	.container {
		.container-main {
			.demand-comments {
				.comments-list {
					%comment-base {
						.comment-header,
						.reply-header {
							.comment-user {
								.user-info {
									.user-name {
										display: flex;
										align-items: center;
										
										.author-tag {
											font-size: 20rpx;
											color: #fff;
											background: #FF9C37;
											padding: 2rpx 8rpx;
											border-radius: 4rpx;
											margin-left: 12rpx;
										}
									}
								}
							}
						}
					}
				}
			}
		}
	}
</style>