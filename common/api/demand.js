export default {
	// 商圈列表
	businessIndexList: {
		url: '/api/wdsxh/business/index',
		auth: false,
		method: 'GET',
	},
	// 商圈分类
	businessCat: {
		url: '/api/wdsxh/business/business_cat',
		auth: false,
		method: 'GET',
	},
	// 商圈详情
	businessDetails: {
		url: '/api/wdsxh/business/details',
		auth: true,
		method: 'GET',
	},
	// 评论列表
	commentList: {
		url: '/api/wdsxh/business/comments',
		auth: true,
		method: 'GET',
	},
	// 添加评论
	addComment: {
		url: '/api/wdsxh/business/add_comments',
		auth: true,
		method: 'POST',
	},

	// 删除评论
	deleteComment: {
		url: '/api/wdsxh/business/del_comments',
		auth: true,
		method: 'GET',
	},
	// 发布
	businessAdd: {
		url: '/api/wdsxh/business/add',
		auth: true,
		method: 'POST',
	},
	// 发布列表
	businessList: {
		url: '/api/wdsxh/business/user_index',
		auth: true,
		method: 'GET',
	},
	// 发布删除
	businessDel: {
		url: '/api/wdsxh/business/del',
		auth: true,
		method: 'GET',
	},
	// 发布详情
	businessUserDetails: {
		url: '/api/wdsxh/business/user_details',
		auth: true,
		method: 'GET',
	},
	// 修改
	businessEdit: {
		url: '/api/wdsxh/business/edit',
		auth: true,
		method: 'POST',
	},
	// 商圈限制
	businessLimit: {
		url: '/api/wdsxh/business/business_config',
		auth: true,
		method: 'GET',
	},
};