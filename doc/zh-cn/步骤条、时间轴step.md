### 开始
---

step是一个步骤条或者称之为时间轴
```html
<div id="step" style="text-align:center">< /div>
```
```javascript
需要在Wmm中导入step模块

data0 = {
	steps: [{ "title": "基础信息", "time": "2018-10-09 17:59" },
	{ "title": "商品规格", "time": "2018-10-09 17:59" },
	{ "title": "赠品信息", "time": "2018-10-09 17:59" },
	{ "title": "商品详情", "time": "2018-10-09 17:59" }],
	current: 3,//这里current为当前步骤到第几个,1为起始位
}
step.ready({
	elem: '#step',//载体div的Id 必填
	data: data0, //数据源 必填
	width: '150px', //指定宽度 非必填
	color: { //指定颜色 非必填
	success:'#56ece3',//success：为已经步骤通过的颜色
	error:'red'//error：为还没有通过步骤颜色
	}
})
```






