
export default {
	// 轮播图
	carousel: {
		url: '/api/wdsxh/goods/goods/banner_index',
		auth: false,
		method: 'GET',
	},
	// 商城轮播图
	carouselDetails: {
		url: '/api/wdsxh/goods/goods/banner_details',
		auth: false,
		method: 'GET',
	},
	// 商品分类
	categoay: {
		url: '/api/wdsxh/goods/goods/category_index',
		auth: false,
		method: 'GET',
	},
	// 商品列表
	goodsList: {
		url: '/api/wdsxh/goods/goods/index',
		auth: false,
		method: 'GET',
	},
	// 商品详情
	goodsDetails: {
		url: '/api/wdsxh/goods/goods/details',
		auth: false,
		method: 'GET',
	},
	// 地址列表
	addressList: {
		url: '/api/wdsxh/goods/address/index',
		auth: true,
		method: 'GET',
	},
	// 添加地址
	addAddress: {
		url: '/api/wdsxh/goods/address/add',
		auth: true,
		method: 'POST',
	},
	// 修改地址
	editAddress: {
		url: '/api/wdsxh/goods/address/edit',
		auth: true,
		method: 'POST',
	},
	// 删除地址
	delAddress: {
		url: '/api/wdsxh/goods/address/del',
		auth: true,
		method: 'POST',
	},
	// 修改默认地址
	setDefault: {
		url: '/api/wdsxh/goods/address/set_default',
		auth: true,
		method: 'POST',
	},
	// 计算邮费
	getPostage: {
		url: '/api/wdsxh/goods/order/postage',
		auth: true,
		method: 'GET',
	},
	// 订单预支付
	preparePay: {
		url: '/api/wdsxh/goods/order/prepare_pay',
		auth: true,
		method: 'GET',
	},
	// 订单创建
	createOrder: {
		url: '/api/wdsxh/goods/order/create',
		auth: true,
		method: 'POST',
	},
	// 订单详情
	orderDetails: {
		url: '/api/wdsxh/goods/order/details',
		auth: true,
		method: 'POST',
	},
	// 订单列表
	orderList: {
		url: '/api/wdsxh/goods/order/index',
		auth: true,
		method: 'GET',
	},
	// 确认收货
	orderCollect: {
		url: '/api/wdsxh/goods/order/sing',
		auth: true,
		method: 'POST',
	},
	// 申请退款
	orderRefund: {
		url: '/api/wdsxh/goods/order/refund',
		auth: true,
		method: 'POST',
	},
	// 退款列表
	refundList: {
		url: '/api/wdsxh/goods/order/refund_index',
		auth: true,
		method: 'GET',
	},
	// 提交快递
	receipt: {
		url: '/api/wdsxh/goods/order/receipt',
		auth: true,
		method: 'POST',
	},
	// 取消退款
	cancelRefund: {
		url: '/api/wdsxh/goods/order/cancel_refund',
		auth: true,
		method: 'POST',
	},
	// 取消订单
	delOrder: {
		url: '/api/wdsxh/goods/order/del_order',
		auth: true,
		method: 'POST',
	},
	//电费充值
	electricity:{
		url: '/api/wdsxh.electricity/create_message',
		auth: true,
		method: 'POST',
	},
	//管理员电费充值
	direct_charge:{
		url: '/api/wdsxh.electricity/direct_charge',
		auth: true,
		method: 'POST',
	},
	//管理员扣款
	deduct:{
		url: '/api/wdsxh.electricity/deduct',
		auth: true,
		method: 'POST',
	},
	//管理员拉闸
	close:{
		url: '/api/wdsxh.electricity/close',
		auth: true,
		method: 'POST',
	},
	//管理员合闸
	open:{
		url: '/api/wdsxh.electricity/open',
		auth: true,
		method: 'POST',
	},
	//管理员清零
	clear:{
		url: '/api/wdsxh.electricity/clear',
		auth: true,
		method: 'POST',
	},
	//绑定电表
	binding:{
		url: '/api/wdsxh.electricity/binding',
		auth: true,
		method: 'POST',
	},
	// 获取绑定的电表列表
	get_binding:{
		url: '/api/wdsxh.electricity/get_binding',
		auth: true,
		method: 'GET',
	},
	//获取记录
	get_order:{
		url: '/api/wdsxh.electricity/get_order',
		auth: true,
		method: 'GET',
	},
	// 余额查询
	balance:{
		url: '/api/wdsxh.electricity/balance',
		auth: true,
		method: 'GET',
	},
	//解除绑定
	unbinding:{
		url: '/api/wdsxh.electricity/unbinding',
		auth: true,
		method: 'POST',
	}
};