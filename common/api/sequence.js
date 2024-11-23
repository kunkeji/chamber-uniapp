
export default {
	// 接龙列表
	chainsList: {
		url: '/api/wdsxh/jielong/index',
		auth: false,
		method: 'GET',
	},
	// 接龙详情
	chainsDetails: {
		url: '/api/wdsxh/jielong/details',
		auth: false,
		method: 'GET',
	},
	// 是否有资格参加
	chainsSeniority: {
		url: '/api/wdsxh/jielong/jielong_state',
		auth: false,
		method: 'GET',
	},
	// 是否已经反馈过
	chainsFeedback: {
		url: '/api/wdsxh/jielong/feedback_state',
		auth: false,
		method: 'GET',
	},
	// 是否已经反馈过
	addFeedback: {
		url: '/api/wdsxh/jielong/add',
		auth: false,
		method: 'POST',
	},
	// 反馈详情
	feedbackDetails: {
		url: '/api/wdsxh/jielong/feedback_details',
		auth: false,
		method: 'POST',
	},
};