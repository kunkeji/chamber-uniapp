
export default {
	// 问卷列表
	questionList: {
		url: '/api/wdsxh/questionnaire/index/index',
		auth: false,
		method: 'GET',
	},
	// 问卷详情
	questionDetails: {
		url: '/api/wdsxh/questionnaire/index/details',
		auth: false,
		method: 'GET',
	},
	// 问卷提交
	questionAdd: {
		url: '/api/wdsxh/questionnaire/index/add_topic',
		auth: false,
		method: 'POST',
	},
	// 问卷反馈详情
	renderDetails: {
		url: '/api/wdsxh/questionnaire/index/render_details',
		auth: false,
		method: 'GET',
	},
};