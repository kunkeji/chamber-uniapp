
export default {
	// 查询用户是否已注册-微信小程序
	isAuth: {
		url: '/api/wdsxh/applet_user_wechat/is_register',
		auth: false,
		method: 'GET',
	},
	// 获取手机号-微信小程序
	getPhone: {
		url: '/api/wdsxh/applet_user_wechat/get_phone',
		auth: false,
		method: 'GET',
	},
	// 登录-微信小程序
	login: {
		url: '/api/wdsxh/applet_user_wechat/login',
		auth: false,
		method: 'POST',
	},
	// 注册-微信小程序
	register: {
		url: '/api/wdsxh/applet_user_wechat/register',
		auth: false,
		method: 'POST',
	},
	// 登录-微信公众号
	officialLogin: {
		url: '/api/wdsxh/wananchi_user_wechat/mobile_login',
		auth: false,
		method: 'POST',
	},
	// 发送验证码-微信公众号
	captcha: {
		url: '/api/sms/send',
		auth: false,
		method: 'POST',
	},
};