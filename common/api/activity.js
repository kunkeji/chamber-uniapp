// +----------------------------------------------------------------------
export default {
	// 活动列表
	list: {
		url: '/api/wdsxh/activity/activity/index',
		auth: false,
		method: 'GET',
	},
	// 活动详情
	details: {
		url: '/api/wdsxh/activity/activity/details',
		auth: true,
		method: 'GET',
	},
	// 提交报名
	submit: {
		url: '/api/wdsxh/activity/activity_apply/submit',
		auth: true,
		method: 'POST',
	},
	// 订单列表
	orderList: {
		url: '/api/wdsxh/activity/activity/user_index',
		auth: true,
		method: 'GET',
	},
	// 订单详情
	orderDetails: {
		url: '/api/wdsxh/activity/activity_apply/details',
		auth: true,
		method: 'GET',
	},
	// 活动核销列表
	verifyList: {
		url: '/api/wdsxh/activity/verifying/activity_list',
		auth: true,
		method: 'GET',
	},
	// 核销会员列表
	verifyMemberList: {
		url: '/api/wdsxh/activity/verifying/verifying_member_list',
		auth: true,
		method: 'GET',
	},
	// 核销活动
	verifying: {
		url: '/api/wdsxh/activity/verifying/verifying',
		auth: true,
		method: 'POST',
	},
	// 申请退款
	applyRefund: {
		url: '/api/wdsxh/activity/activity/apply_refund',
		auth: true,
		method: 'POST',
	},
	// 取消参加
	applyCancel: {
		url: '/api/wdsxh/activity/activity_apply/cancel',
		auth: true,
		method: 'POST',
	},
	// 参会凭证
	attendance: {
		url: '/api/wdsxh/activity/activity/attendance_voucher',
		auth: true,
		method: 'GET',
	},
	// 删除未支付订单
	applyDel: {
		url: '/api/wdsxh/activity/activity_apply/del',
		auth: true,
		method: 'POST',
	}
};