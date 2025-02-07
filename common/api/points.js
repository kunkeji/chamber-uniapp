export default {
	// 获取积分商品列表
	goodsList: {
		url: '/api/wdsxh.points_mall/goods',
		method: 'GET',
		loading: false,
		toast: false
	},
	
	// 获取积分商品详情
	goodsDetail: {
		url: '/api/wdsxh.points_mall/detail',
		method: 'GET',
		loading: true,
		toast: false
	},
	
	// 创建积分订单
	createOrder: {
		url: '/api/wdsxh.points_mall/createOrder',
		method: 'POST',
		loading: true,
		toast: true
	},
	
	// 获取积分订单列表
	orderList: {
		url: '/api/wdsxh.points_mall/orders',
		method: 'GET',
		loading: false,
		toast: false
	},
	
	// 获取积分订单详情
	orderDetail: {
		url: '/api/wdsxh.points_mall/orderDetail',
		method: 'GET',
		loading: true,
		toast: false
	},
	
	// 取消积分订单
	cancelOrder: {
		url: '/api/wdsxh.points_mall/cancelOrder',
		method: 'POST',
		loading: true,
		toast: true
	},
	
	// 确认收货
	confirmOrder: {
		url: '/api/wdsxh.points_mall/confirmOrder',
		method: 'POST',
		loading: true,
		toast: true
	},
	
	// 获取积分概况
	summary: {
		url: '/api/wdsxh.points/summary',
		method: 'GET',
		loading: false,
		toast: false
	}
} 