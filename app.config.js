var AppConfig = {

    //主题配置
    theme: {
        backgroundColor: "",
        activeColor: "",
        loginBg: "/login-bg.jpg",
    },

    //路由配置
    route: {
        //是否开启哈希路由
        hashMode: false,
        //上下文
        contextPath: "",
        //路由404页面
        page404: "/fastboot/pages/404",
        cache: true,
        selector:".page-container",
        templateType: "html",
    },

    //页面相关配置
    page: {
        //管理系统名称
        name: function(){
            return new Date().getTime();
        },
        // logo: "http://t.cn/RCzsdCq",
        title: ":: WFUI-后台管理系统:: ",
        //设置默认首页
        index: {
            name: "当前位置",
            // route: "/shangfan/mall/goods",
            // route: "/fastboot/pages/sys/policy",
            // params: "id=2&name=12",
        },
        menus: {
            dynamic: true
        },
        //顶部菜单配置
        topLinks: [
            {
                name: "数据库配置",
                icon: "layui-icon-login-wechat",
                tip: "暂不支持"
            }, {
                name: "文档管理",
                icon: "layui-icon-login-wechat",
                href: "https://doc.f.wmeimob.com"
            }, {
                name: "SQL监控",
                icon: "layui-icon-404",
                href: "/api/druid"
            },{
                name:"主菜单",
                icon:"layui-icon-wechat",
                onclick:"index.initMenu(true)"
            }
        ],

        //底部版权声明文本
        footer: function () {
            return "";
        },
    },

    //请求配置
    request: {
        //设置接口请求前缀
        api: "http://localhost:6632",
        //全局请求头部
        globalHeaders: {
            // merchantId: function () {
            //     return localStorage.getItem("merchantId");
            // },
            Authorization: function () {
                return localStorage.getItem(AppConfig.authentication.tokenAlias);
            },
            appId: function () {
                return localStorage.getItem("APPID") || -1;
            },
            instanceId: function () {
                return localStorage.getItem("INSTANCE_ID") || -1;
            }
        },
        autoCustomErrTip: true
    },

    //认证相关配置
    authentication: {

        //是否开启认证
        enabled: true,
        verifyCode:true,
        quickInner:true,

        //登录发起页面(默认login.html)
        loginPage: "/login.html",

        //未授权的处理函数(该配置优于loginPage)401
        handler: function () {
            location.href = AppConfig.authentication.loginPage;
        },

        //配置token别名
        tokenAlias: "Nougat",

        //登录信息设置
        loginSetting: function (result) {
            // localStorage.setItem("merchantId", result.merchantId);
        },
    },
    //授权相关
    authorization: {
        //开启授权资源分配菜单
        resourcesHandlerEnabled: true
    },

    //配置自定义模块
    modules: {

    },

    //上载配置
    upgrade: {
        preference: "oss",

    },
    AD: {
        enabled: true
    }
}