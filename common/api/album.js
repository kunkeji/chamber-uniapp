export default {
	// 相册列表
	albumList: {
		url: '/api/wdsxh/album/index',
		auth: false,
		method: 'GET',
	},
	// 相册详情
	albumDetails: {
		url: '/api/wdsxh/album/details',
		auth: false,
		method: 'GET',
	},
	// 相册权限
	albumLimit: {
		url: '/api/wdsxh/album/album_config',
		auth: false,
		method: 'GET',
	},
};