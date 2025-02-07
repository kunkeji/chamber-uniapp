<template>
	<view class="component-user-info">
		<!-- 用户信息 -->
		<view class="user-info-content flex align-items-center" v-if="token" @click="toModifyUser()">
			<image class="content-avatar" :src="userInfo.avatar" mode="aspectFill"></image>
			<view class="content-box flex-item">
				<view class="name-row flex align-items-center">
					<text class="name text-ellipsis">{{userInfo.nickname}}</text>
					<view class="points-box" @click.stop="toPoints">
						<text class="points-label">积分明细</text>
						<!-- <text class="points-value">{{userInfo.points || 0}}</text> -->
					</view>
					<view class="points-mall-box" @click.stop="toPointsMall">
						<text class="mall-label">积分商城</text>
					</view>
				</view>
				<view class="phone text-ellipsis">{{userInfo.mobile}}</view>
			</view>
		</view>
		<!-- 登录 -->
		<view class="user-info-login" v-else @click="toLogin()">
			<view class="login-text">立即登录</view>
		</view>
		<!-- 会员状态 -->
		<view class="user-info-member" :class="'' + getMemberClass(memberState)">
			<!-- 背景图片 -->
			<view class="member-image">
				<image class="image-circular" src="/static/member_bg.png" mode="aspectFit"></image>
				<image class="image-auth" src="/static/member/member_blue.png" mode="heightFix" v-if="memberState == 6 || memberState == 3 || memberState == 4 || memberState == 5"></image>
				<image class="image-auth" src="/static/member/member_orange.png" mode="heightFix" v-else-if="memberState == 7 || memberState == 1"></image>
				<image class="image-auth" src="/static/member/member_red.png" mode="heightFix" v-else-if="memberState == 2"></image>
				<image class="image-note" src="/static/note.png" mode="aspectFit" v-else></image>
			</view>
			<!-- 会员 -->
			<view class="member-box" v-if="memberState == 6">
				<view class="box-title">
					<text class="title">{{userInfo.member_level_name}}</text>
					<text class="subtitle"> | 到期时间{{userInfo.expire_time ? userInfo.expire_time.replaceAll("-", "/") : userInfo.expire_time}}</text>
				</view>
				<view class="box-btn flex align-items-center" @click="getPoster">
					<text>电子会牌</text>
					<view class="icon" :style="{'background-image': 'url('+ iconMore2 +')'}" v-if="iconMore2"></view>
				</view>
			</view>
			<!-- 已到期 -->
			<view class="member-box" v-else-if="memberState == 7">
				<view class="box-title">
					<text class="title">会员</text>
					<text class="subtitle"> | 已到期</text>
				</view>
				<view class="box-btn flex align-items-center" @click="toPayment()">
					<text>待缴纳会费</text>
					<view class="icon" :style="{'background-image': 'url('+ iconMore3 +')'}" v-if="iconMore3"></view>
				</view>
			</view>
			<!-- 待缴费 -->
			<view class="member-box" v-else-if="memberState == 3 || memberState == 4 || memberState == 5">
				<view class="box-title">
					<text class="title">会员</text>
					<text class="subtitle"> | 已通过审核</text>
				</view>
				<view class="box-btn flex align-items-center" @click="toPayment()">
					<text>待缴纳会费</text>
					<view class="icon" :style="{'background-image': 'url('+ iconMore4 +')'}" v-if="iconMore4"></view>
				</view>
			</view>
			<!-- 待审核 -->
			<view class="member-box" v-else-if="memberState == 1">
				<view class="box-title">
					<text class="title">个人会员</text>
					<text class="subtitle"> | 待审核</text>
				</view>
				<view class="box-tag">已提交审核，请等待审核</view>
			</view>
			<!-- 已驳回 -->
			<view class="member-box" v-else-if="memberState == 2">
				<view class="box-title">
					<text class="title">会员</text>
					<text class="subtitle">| 已驳回</text>
				</view>
				<view class="box-btn flex align-items-center" @click="toApplyMember()">
					<text>重新申请</text>
					<view class="icon" :style="{'background-image': 'url('+ iconMore5 +')'}" v-if="iconMore5"></view>
				</view>
			</view>
			<!-- 非会员 -->
			<view class="member-box" v-else>
				<view class="box-title">
					<text class="title">您还不是{{organize}}成员</text>
				</view>
				<view class="box-btn flex align-items-center" @click="toApplyMember()">
					<text>立即申请</text>
					<view class="icon" :style="{'background-image': 'url('+ iconMore1 +')'}" v-if="iconMore1"></view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import svgData from "@/common/svg.js"
	import {
		mapState
	} from "vuex"
	export default {
		name: "userInfo",
		data() {
			return {
				// 更多图标
				iconMore1: "",
				iconMore2: "",
				iconMore3: "",
				iconMore4: "",
				iconMore5: "",
			};
		},
		computed: {
			...mapState({
				themeColor: state => state.app.themeColor,
				organize: state => state.app.organize,
				token: state => state.user.token,
				userInfo: state => state.user.userInfo,
				memberState: state => {
					if (state.user.userInfo && state.user.userInfo.apply_member_state) {
						return state.user.userInfo.apply_member_state.state
					} else {
						return -1
					}
				},
			})
		},
		mounted() {
			this.getSvgIcon()
		},
		methods: {
			// 获取图标
			getSvgIcon() {
				this.iconMore1 = svgData.svgToUrl("more", "#5A5B6E")
				this.iconMore2 = svgData.svgToUrl("more", "#325DFF")
				this.iconMore3 = svgData.svgToUrl("more", "#F39700")
				this.iconMore4 = svgData.svgToUrl("more", "#379CFA")
				this.iconMore5 = svgData.svgToUrl("more", "#FA3737")
			},
			// 获取会员状态类名
			getMemberClass(state) {
				if (state == 6) return "state-1"
				else if (state == 7) return "state-2"
				else if (state == 3 || state == 4 || state == 5) return "state-3"
				else if (state == 1) return "state-2"
				else if (state == 2) return "state-4"
				else return ""
			},
			// 跳转登录
			toLogin() {
				this.$util.toPage({
					mode: 1,
					path: "/pages/login/index"
				})
			},
			// 显示电子会牌
			getPoster() {
				this.$emit("getPoster")
			},
			// 跳转修改用户信息
			toModifyUser() {
				this.$util.toPage({
					mode: 1,
					path: "/pages/mine/settings/user"
				})
			},
			// 跳转申请入会
			toApplyMember() {
				this.$util.toPage({
					mode: 1,
					path: "/pages/member/apply/index"
				})
			},
			// 跳转会费缴纳
			toPayment() {
				this.$util.toPage({
					mode: 1,
					path: "/pages/member/fees/index"
				})
			},
			toPoints() {
				uni.navigateTo({
					url: '/pages/mine/points/index'
				})
			},
			// 跳转积分商城
			toPointsMall() {
				uni.navigateTo({
					url: '/pages/mine/points/mall/index'
				})
			}
		},
	}
</script>

<style lang="scss">
	.component-user-info {
		padding-bottom: 16rpx;

		.user-info-content {
			padding: 0 32rpx;

			.content-avatar {
				width: 128rpx;
				height: 128rpx;
				border-radius: 50%;
				margin-right: 48rpx;
			}

			.content-box {
				.name-row {
					.name {
						color: #5A5B6E;
						font-size: 36rpx;
						font-weight: 600;
						line-height: 50rpx;
						margin-right: 16rpx;
						flex: 1;
					}
					
					.points-box {
						background: rgba(50, 93, 255, 0.1);
						padding: 4rpx 12rpx;
						border-radius: 20rpx;
						display: inline-flex;
						align-items: center;
						flex-shrink: 0;
						margin-right: 16rpx;
						
						.points-label {
							font-size: 22rpx;
							color: #325DFF;
							margin-right: 6rpx;
						}
						
						.points-value {
							font-size: 24rpx;
							color: #325DFF;
							font-weight: bold;
						}
						
						&:active {
							opacity: 0.7;
						}
					}
					
					.points-mall-box {
						background: rgba(50, 93, 255, 0.1);
						padding: 4rpx 12rpx;
						border-radius: 20rpx;
						display: inline-flex;
						align-items: center;
						flex-shrink: 0;
						
						.mall-label {
							font-size: 22rpx;
							color: #325DFF;
						}
						
						&:active {
							opacity: 0.7;
						}
					}
				}

				.phone {
					color: #5A5B6E;
					font-size: 32rpx;
					line-height: 44rpx;
					margin-top: 16rpx;
				}
			}
		}

		.user-info-login {
			padding: 0 32rpx;

			.login-text {
				color: #5A5B6E;
				font-size: 36rpx;
				font-weight: 600;
				height: 128rpx;
				line-height: 128rpx;
			}
		}

		.user-info-member {
			position: relative;
			background: linear-gradient(90.00deg, #BABABA, #FEFEFE 50.802%, #CECECE 100%);
			min-height: 190rpx;
			padding: 32rpx 48rpx;
			border-radius: 10rpx;
			margin-top: 48rpx;

			&::after {
				content: "";
				display: block;
				position: absolute;
				left: 16rpx;
				right: 16rpx;
				bottom: -8rpx;
				height: 128rpx;
				z-index: -1;
				border-radius: 10rpx;
				background: #C1C1C1;
			}

			&::before {
				content: "";
				display: block;
				position: absolute;
				left: 32rpx;
				right: 32rpx;
				bottom: -16rpx;
				height: 128rpx;
				z-index: -1;
				border-radius: 10rpx;
				background: #929292;
			}

			.member-image {
				.image-circular {
					width: 296rpx;
					height: auto;
					position: absolute;
					top: 0;
					left: 34rpx;
					bottom: 6rpx;
					z-index: 5;
				}

				.image-note {
					width: 156rpx;
					height: 140rpx;
					position: absolute;
					top: 26rpx;
					right: 36rpx;
					z-index: 5;
				}

				.image-auth {
					position: absolute;
					top: 16rpx;
					right: 80rpx;
					bottom: 0;
					z-index: 5;
					width: auto;
				}
			}

			.member-box {
				position: relative;
				z-index: 8;
				display: flex;
				flex-direction: column;
				align-items: flex-start;

				.box-title {
					color: #5A5B6E;

					.title {
						font-size: 32rpx;
						font-weight: 600;
						line-height: 44rpx;
					}

					.subtitle {
						font-size: 24rpx;
						line-height: 44rpx;
						margin-left: 8rpx;
					}
				}

				.box-btn {
					margin-top: 24rpx;
					padding: 12rpx 20rpx;
					border-radius: 8rpx;
					background: #ffffff;

					text {
						color: #5A5B6E;
						font-size: 24rpx;
						line-height: 34rpx;
					}

					.icon {
						margin-left: 16rpx;
						width: 24rpx;
						height: 24rpx;
						background-size: 24rpx;
					}
				}

				.box-tag {
					margin-top: 24rpx;
					color: #ffffff;
					font-size: 24rpx;
					line-height: 34rpx;
				}
			}

			&.state-1 {
				background: linear-gradient(90.00deg, #325DFF, #88C1FF 50.802%, #489FFF 100%);

				&::after {
					background: #82ACFF;
				}

				&::before {
					background: #C6E1FF;
				}

				.member-box {
					.box-title {
						color: #FFFFFF;
					}

					.box-btn text {
						color: #325DFF;
					}
				}
			}

			&.state-2 {
				background: linear-gradient(90.00deg, #FF9D00, #FF8D4E 50.802%, #FFD9AD 100%);

				&::after {
					background: #FFC66B;
				}

				&::before {
					background: #FFE2B4;
				}

				.member-box {
					.box-title {
						color: #FFFFFF;
					}

					.box-btn text {
						color: #F39700;
					}
				}
			}

			&.state-3 {
				background: linear-gradient(90.00deg, #379CFA, #57C3FF 50.802%, #8DC8FF 100%);

				&::after {
					background: #83C3FF;
				}

				&::before {
					background: #B4DBFF;
				}

				.member-box {
					.box-title {
						color: #FFFFFF;
					}

					.box-btn text {
						color: #379CFA;
					}
				}
			}

			&.state-4 {
				background: linear-gradient(90.00deg, #FA3737, #FF5757 50.802%, #FF8D8D 100%);

				&::after {
					background: #FF6B6B;
				}

				&::before {
					background: #FFB4B4;
				}

				.member-box {
					.box-title {
						color: #FFFFFF;
					}

					.box-btn text {
						color: #FA3737;
					}
				}
			}
		}
	}
</style>