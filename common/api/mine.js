
export default {
	// 用户信息
	user: {
		url: '/api/wdsxh/user_wechat/center',
		auth: true,
		method: 'GET',
	},
	// 电子会牌
	poster: {
		url: '/api/wdsxh/willbrand/index',
		auth: true,
		method: 'GET',
	},
	// 更新用户信息
	updateUser: {
		url: '/api/wdsxh/user_wechat/update_nickname_avatar',
		auth: true,
		method: 'POST',
	},
	// 常见问题列表
	problemList: {
		url: '/api/wdsxh/faq/index',
		auth: false,
		method: 'GET',
	},
	// 常见问题详情
	problemDetails: {
		url: '/api/wdsxh/faq/details',
		auth: false,
		method: 'GET',
	},
	// 积分明细
	pointsList: {
		url: '/api/wdsxh.points/detail',
		auth: true,
		method: 'GET',
	},
};