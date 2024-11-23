export default {
	// 系统配置
	config: {
		url: '/api/wdsxh/config/config',
		auth: false,
		method: 'GET',
	},
	// 底部导航
	tabbar: {
		url: '/api/wdsxh/index/tabbar_index',
		auth: false,
		method: 'GET',
	},
	// 首页显示模式
	homeMode: {
		url: '/api/wdsxh/diy/mode',
		auth: false,
		method: 'GET',
	},
	// 首页自定义数据
	diyData: {
		url: '/api/wdsxh/diy/getPage',
		auth: false,
		method: 'GET',
	},
	// 首页轮播图
	carousel: {
		url: '/api/wdsxh/banner/index',
		auth: false,
		method: 'GET',
	},
	// 轮播图详情
	carouselDetails: {
		url: '/api/wdsxh/banner/details',
		auth: false,
		method: 'GET',
	},
	// 快速导航
	menu: {
		url: '/api/wdsxh/index/quickmenu_index',
		auth: false,
		method: 'GET',
	},
	// 快速导航详情
	menuDetails: {
		url: '/api/wdsxh/index/quickmenu_details',
		auth: false,
		method: 'GET',
	},
	// 省市区管理
	address: {
		// 获取省份
		province: {
			url: '/api/wdsxh/goods/address/address_province',
			auth: false,
			method: 'GET',
		},
		// 获取城市
		city: {
			url: '/api/wdsxh/goods/address/address_city',
			auth: false,
			method: 'GET',
		},
		// 获取区域
		area: {
			url: '/api/wdsxh/goods/address/address_area',
			auth: false,
			method: 'GET',
		},
	},
	// 需求建议提交
	addDemand: {
		url: '/api/wdsxh/demand/add',
		auth: false,
		method: 'POST',
	},
	getRecord:{
		url: '/api/wdsxh/demand/list',
		auth: false,
		method: 'GET',
	},
	// 商协信息
	association: {
		url: '/api/wdsxh/association/index',
		auth: false,
		method: 'GET',
	},
	// 文章管理
	article: {
		// 分类
		category: {
			url: '/api/wdsxh/article/article_cat',
			auth: false,
			method: 'GET',
		},
		// 列表
		list: {
			url: '/api/wdsxh/article/index',
			auth: false,
			method: 'GET',
		},
		// 详情
		details: {
			url: '/api/wdsxh/article/details',
			auth: false,
			method: 'GET',
		},
	},
	// 协议内容
	agreement: {
		url: '/api/wdsxh/config/agreement',
		auth: false,
		method: 'GET',
	},
	// 消息订阅
	message: {
		// 订阅数量
		count: {
			url: '/api/wdsxh/member/member/subscribe_count',
			auth: true,
			method: 'GET',
		},
		// 消息订阅
		subscribe: {
			url: '/api/wdsxh/member/member/submit_subscribe',
			auth: true,
			method: 'POST',
		},
	},
	// 系统配置
	WeChatConfig: {
		url: '/api/wdsxh/wananchi_user_wechat/get_wechat_config',
		auth: false,
		method: 'GET',
	},
	//场地预约
	Site:{
		getList:{
			url:'/api/wdsxh/site/index/getList',
			auth:false,
			method:'GET'
		},
		getProtocol:{
			url:'/api/wdsxh/site/index/getProtocol',
			auth:false,
			method:'GET'
		},
		getTimeList:{
			url:'/api/wdsxh/site/index/getTimeList',
			auth:false,
			method:'GET'
		},
		addRecord:{
			url:'/api/wdsxh/site/index/addRecord',
			auth:true,
			method:'POST'
		},
		getMyRecord:{
			url:'/api/wdsxh/site/index/getMyRecord',
			auth:true,
			method:'GET'
		}
		
	},
	// 食堂管理
	Shop:{
		getIndex:{
			url:"/api/wdsxh/shop/shop/index",
			auth:true,
			method:'GET'
		},
		getGoodsList:{
			url:"/api/wdsxh/shop/shop/goodsList",
			auth:true,
			method:"GET"
		},
		goodsListByShangjia:{
			url:"/api/wdsxh/shop/shop/goodsListByShangjia",
			auth:true,
			method:"GET"
		},
		createOrder:{
			url:"/api/wdsxh/shop/shop/createOrder",
			auth:true,
			method:"POST"
		},
		getOrderList:{
			url:"/api/wdsxh/shop/shop/getOrderList",
			auth:true,
			method:"GET"
		},
		getShopByUserId:{
			url:"/api/wdsxh.shop.shop/getShopByUserId",
			auth:true,
			method:"GET"
		},
		getShopByShopId:{
			url:"/api/wdsxh.shop.shop/getShopByShopId",
			auth:true,
			method:"GET"
		},
		updateShopById:{
			url:"/api/wdsxh.shop.shop/updateShopById",
			auth:true,
			method:"POST"
		},
		getOrderListByShopIdPage:{
			url:"/api/wdsxh.shop.shop/getOrderListByShopIdPage",
			auth:true,
			method:"GET",
		},
		updateStatusByShopId:{
			url:"/api/wdsxh.shop.shop/updateStatusByShopId",
			auth:true,
			method:"POST",
		},
		addDish:{
			url:"/api/wdsxh.shop.shop/addDish",
			auth:true,
			method:"POST",
		},
		deleteDish:{
			url:"/api/wdsxh.shop.shop/deleteDish",
			auth:true,
			method:"POST",
		},
		getDishById:{
			url:"/api/wdsxh.shop.shop/getDishById",
			auth:true,
			method:"GET",
		},
		updateDish:{
			url:"/api/wdsxh.shop.shop/updateDish",
			auth:true,
			method:"GET",
		},
		changeStatus:{
			url:"/api/wdsxh.shop.order/changeStatus",
			auth:true,
			method:"POST",
		},
		writeOff:{
			url:"/api/wdsxh.shop.order/writeOff",
			auth:true,
			method:"POST",
		},
		getOrderDetail:{
			url:"/api/wdsxh.shop.order/getOrderDetail",
			auth:true,
			method:"GET",
		},
		writeOff:{
			url:"/api/wdsxh.shop.order/writeOff",
			auth:true,
			method:"GET",
		}
	}
};