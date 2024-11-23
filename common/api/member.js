
export default {
	// 会员列表
	list: {
		url: '/api/wdsxh/member/member/index',
		auth: false,
		method: 'GET',
	},
	// 会员单位
	units: {
		url: '/api/wdsxh/member/member/unit',
		auth: false,
		method: 'GET',
	},
	// 会员详情
	details: {
		url: '/api/wdsxh/member/member/details',
		auth: true,
		method: 'GET',
	},
	// 企业详情
	enterprise: {
		url: '/api/wdsxh/member/member/company_details',
		auth: true,
		method: 'GET',
	},
	// 团体详情
	organization: {
		url: '/api/wdsxh/member/member/organize_details',
		auth: true,
		method: 'GET',
	},
	// 对外限制
	limit: {
		url: '/api/wdsxh/member/member/auth',
		auth: true,
		method: 'GET',
	},
	// 会员级别
	level: {
		url: '/api/wdsxh/member/member_apply/level_list',
		auth: false,
		method: 'GET',
	},
	// 入会类型
	type: {
		url: '/api/wdsxh/config/join_config',
		auth: false,
		method: 'GET',
	},
	// 会员状态
	state: {
		url: '/api/wdsxh/user_wechat/apply_member_state',
		auth: true,
		method: 'GET',
	},
	// 入会字段
	field: {
		url: '/api/wdsxh/member/join_config/custom_field',
		auth: true,
		method: 'GET',
	},
	// 入会申请
	apply: {
		url: '/api/wdsxh/member/member_apply/submit',
		auth: true,
		method: 'POST',
	},
	// 申请详情
	applyDetails: {
		url: '/api/wdsxh/member/member_apply/details',
		auth: true,
		method: 'GET',
	},
	// 入会申请验证
	applyCheck: {
		url: '/api/wdsxh/member/member_apply/check_mobile_use',
		auth: true,
		method: 'GET',
	},
	// 会员资料
	information: {
		url: '/api/wdsxh/member/member/information_details',
		auth: true,
		method: 'GET',
	},
	// 编辑资料
	editInformation: {
		url: '/api/wdsxh/member/member/submit_information',
		auth: true,
		method: 'POST',
	},
	// 会费缴纳详情
	payDetails: {
		url: '/api/wdsxh/member/member/membershipPayDetail',
		auth: true,
		method: 'GET',
	},
	// 线上缴费
	accountInfo: {
		url: '/api/wdsxh/association/public_account_information',
		auth: true,
		method: 'GET',
	},
	// 线上缴费
	payOnline: {
		url: '/api/wdsxh/member/member/membershipPay',
		auth: true,
		method: 'POST',
	},
	// 线下缴费
	payOffline: {
		url: '/api/wdsxh/member/member/submit_pay_voucher',
		auth: true,
		method: 'POST',
	},
	// 证书查询
	certificate: {
		url: '/api/wdsxh/member/cert/index',
		auth: true,
		method: 'GET',
	},
	// 行业分类
	industry: {
		url: '/api/wdsxh/member/member_apply/industry_category_list',
		auth: false,
		method: 'GET',
	},
	// 通讯录
	addressBook: {
		url: '/api/wdsxh/member/member/address_book',
		auth: true,
		method: 'GET',
	},
	// 通讯录限制
	addressBookLimit: {
		url: '/api/wdsxh/member/member/address_book_auth',
		auth: true,
		method: 'GET',
	},
	// 推广会员列表
	promotionList: {
		url: '/api/wdsxh/member/promotion/index',
		auth: true,
		method: 'GET',
	},
};