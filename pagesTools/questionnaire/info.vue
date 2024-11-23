<template>
	<view class="container" :style="{'--theme-color': themeColor}">
		<!-- 标题栏 -->
		<title-bar title="问卷反馈详情"></title-bar>
		<!-- 内容区 -->
		<view class="container-main" v-if="loadEnd">
			<question-problem ref="questionProblem" :show-data="questionDetails" @onChange="pageChange"></question-problem>
			<empty top="26%" title="暂无问题~" v-if="questionDetails.length == 0"></empty>
		</view>
		<!-- 底部导航 -->
		<tab-bar></tab-bar>
	</view>
</template>

<script>
	import {
		mapState
	} from "vuex"
	import questionProblem from "@/pagesTools/component/questionnaire/problem.vue"
	export default {
		components: {
			questionProblem
		},
		data() {
			return {
				// 加载完成
				loadEnd: false,
				// 问卷id 
				id: 0,
				// 问卷详情
				questionDetails: {},
				// 页面是否阻止滚动
				pageShow: false,
			};
		},
		computed: {
			...mapState({
				themeColor: state => state.app.themeColor,
				questionnaireImg: state => state.app.questionnaireImg,
			})
		},
		onLoad(option) {
			uni.showLoading({
				title: "加载中"
			})
			this.id = option.id
			this.getQuestionDetails()
		},
		methods: {
			// 获取问卷详情
			getQuestionDetails() {
				this.$util.request("questionnaire.renderDetails", {
					questionnaire_id: this.id
				}).then(res => {
					if (res.code == 1) {
						this.questionDetails = res.data
						uni.hideLoading()
						this.loadEnd = true
					} else {
						uni.showToast({
							title: res.msg,
							icon: 'none'
						})
					}
				}).catch(error => {
					console.error('获取问卷列表', error)
				})
			},
			// 改变页面滚动状态
			pageChange(state) {
				this.pageShow = state
			},

		}
	}
</script>

<style lang="scss">
	.container {
		.container-main {
			padding: 32rpx;
		}
	}
</style>