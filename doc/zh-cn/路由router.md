##  wmm-router 
---
wmm router 是采用原生js实现的一个轻量级路由，用于页面的跳转。

## 如何开始使用？
---
通常，你并不需要在页面上引入或导入router相关的模块，因为在wmm框架内，已默认导入了此模块，并且绑定到了全局对象（window）上。**在全局对象域上，使用router对象始终保存了当前的路由状态。**

*小贴士: 开发者可在框架的任意页面（除login）,在浏览器控制台键入router查看*

## 核心方法
---
`router.route(props)`

- props的配置项如下所示

| 属性名  |类型 |说明  | 是否必须  | 默认值  |
| ------------ | ------------ | ------------ | ------------ |------------ |
| url  | string |路由页面地址，不包括后缀  | √  |   |
| params  | string & object  | 追加到路由后面的参数，会在浏览器地址栏显示  | ×  | "" |
| pushState  | object | 与目标路由相关联的对象，用于参数传递  | ×  | {} |
| condition  | object | 与目标路由相关联的条件对象，配合customAfter函数使用，可根据指定条件在路由跳转后处理后续动作  | ×  | undefined |


## 可选配置
---
路由的默认配置项已经通过入口函数配置，但开发者仍可以通过主配置来个性化路由的其他参数


|  属性名 | 说明 |类型 | 默认  | 版本支持|
| ------------ | ------------ | ------------ | ------------|----|
| hashMode  | 是否开启哈希路由  |  bool  | false ||
| contextPath  |  路由上下文  | string  |  ||
| page404  | 404页面  |  string | /fastboot/pages/404 ||
| cache | 是否开启路由缓存 | bool | true||
|templateType| 单页模板类型 | string | html ||
|animate| 页面切换的动画 | string | layui-anim-upbit ||
|enableFadeOutAnimate| 是否开启页面离开切换时的动画效果 | bool | true ||
|customAfter| 路由跳转后自定义逻辑 | function(condition) |  |2019-10-21 |

- hashMode：如果你开启了该选项，浏览器地址栏路径将出现“#”号
- contextPath：路由上下文，通常指向根目录
- page404：你可以自定义404页面的路由地址
- cache：路由的缓存，默认缓存选项是开启的，如果你关闭了它，意味着每次的路由将会耗费一次HTTP的请求
- templateType：路由到指定页面的模板类型，如果你替换了它，请务必保证所有的页面模板类型都是相同的
- customAfter: 路由跳转后自定义逻辑,在使用router.route()的时候可以传递condition对象，跳转时可以获取condition对象，根据自身判断来决定是否需要进行后续动作，常用于页面查询条件保存的逻辑。







