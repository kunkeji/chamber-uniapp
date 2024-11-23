
const app = {
	namespaced: true,
	state: {
		// 主题色
		themeColor: "#325DFF",
		// 组织类型
		organize: "园区",
		// 订阅消息ids
		subscribeNotifyIds: {},
		// 备案号声明
		statement: "",
		// 技术支持
		support: {},
		// 登录背景图
		loginImg: "",
		// 接龙分享图
		jielongImg: "",
		// 问卷分享图
		questionnaireImg: "",
		// 小程序名称
		appletName: "智慧园区",
		// 小程序log
		appletLogo: "",
		// 底部导航列表
		tabBarList: [],
		// 分享图片
		shareImage:"",
		// 分享标题
		shareTitle:"",
		// 微信公众号APPID
		WeChatAppid: "",
		// 版本号
		version: "",
	},
	mutations: {
		// 设置小程序信息
		setAppletInfo(state, data) {
			state.appletName = data.name || "智慧园区"
			state.appletLogo = data.logo || ""
		},
		// 设置基础配置
		setConfig(state, data) {
			state.themeColor = data.themeColor || "#325DFF"
			state.organize = data.organize || "商协"
			state.subscribeNotifyIds = data.subscribeNotifyIds
			state.statement = data.statement || ""
			state.support = data.support || {}
			state.loginImg = data.loginImg || ""
			state.jielongImg = data.jielongImg || ""
			state.questionnaireImg = data.questionnaireImg || ""
			state.shareImage = data.shareImage || ""
			state.shareTitle = data.shareTitle || ""
			state.WeChatAppid = data.WeChatAppid || ""
			state.version = data.version || "1.0.0"
		},
		// 设置底部导航
		setTabBar(state, data) {
			state.tabBarList = data || []
		},
	},
}

export default app