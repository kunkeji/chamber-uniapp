
const user = {
	namespaced: true,
	state: {
		// 登录鉴权
		token: "",
		// 用户信息
		userInfo: {},
	},
	mutations: {
		// 设置token
		setToken(state, token) {
			state.token = token
		},
		// 设置用户信息
		setUserInfo(state, userInfo) {
			state.userInfo = userInfo
		},
		// 清除登录信息
		clearAuth(state) {
			state.token = ""
			state.userInfo = {}
			uni.removeStorageSync("token")
			uni.removeStorageSync("userInfo")
		},
	},
}

export default user