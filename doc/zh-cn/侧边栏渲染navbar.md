## navbar 侧边栏渲染

通常，你无需导入navbar，因为它是Wmm默认初始化的模块。

navbar仅仅只需提供一个render方法：

以下是一个调用示例：

```javascript
navbar.render({
	data: menus,//菜单数组，树结构
	dynamic: true,
	callback: function () {
		//刷新路由链接
		router.flushRouter();
		//保存默认菜单，用于刷新后默认加载该菜单
		index.putMenus("lastestMenus", menus);
		//设置菜单的选中效果
		index.setItemSelect();
		//重新渲染模块
		fb.element.render();
	}
});
```