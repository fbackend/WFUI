## datatable
---
datatable用于渲染表格相关的数据，**与layui的数据表格组件不兼容**，使用语法与之前大体相同。

###### 最新更新 2020年6月18日

## 所有配置项
---

- #### 使用方法
渲染一个数据表格，我们通常使用`new DataTable(props);`

- #### 注意事项

- 新版datatable修改了查询条件事件监听逻辑，方便更准确的拿到查询条件，以及条件的保存回显。自定义表单元素的变更事件无法识别，可参考各个组件内类似change回调，使用表格的setQueryObject方法设置查询条件

- #### 所有配置项参考


| 属性名称  | 说明  | 类型  | 是否必须 |默认值  | 示例 |更新日期/说明|
| --- | --- | --- | --- |--- |--- |--- |
| el  | 渲染的容器ID（不要写“#”号）| string  | 是  | tb-sys-users | ||
| formEl  | 表单的ID（不要写“#”号）  |  string | 否  | |search-form ||
|url | 接口地址| string | 与data属性不同为空 |  | /users ||
| data | 数据列表 | array | 与url属性不同为空 | | ||
| autoQuery | 是否开启表单数据改变时自动查询 | bool | 否 | false | ||
| ~~firstQueryData~~ | ~~初始查询的条件，用于页面跳转后返回保留上次查询记录,应返回一个数据对象~~ | function():object | 否 |  | |已废弃|
|handlesCondition|操作栏显示隐藏|function():bool |否|true|||
|handleFixed|是否固定操作栏列|bool |否|false|||
|rowClick|行点击事件|function(data,tr,tbdy) |否|||191014新增|
|sortByParamName|排序参数字段|string|否|sortBy||2019-06-11|
|queryCache|是否开启查询条件缓存|bool|否|true||2019-06-11|
|multiple|是否开启行复选框|bool |否||||
|multipleFixed|是否固定复选框列|bool |否|true|||
|pageSize|默认分页条数| int |否|20|||
| defines | 列定义项 | array | 是 | |||
|defines[0].head|列名|string|是|| 姓名||
|defines[0].prop|属性名称（支持驼峰、下划线的兼容）|string|是||full_name||
|defines[0].wordBreak| 是否截断超出文本为省略号 |bool|否|false|||
|defines[0].fixed| 已当前列为基准固定左（右）列，可选值为"left"和"right" |string|否||||
|defines[0].sort| 是否开启排序，点击表头将传递排序参数 |bool或function(define[0])|否|false||2019-06-11|
|defines[0].crossOrigin| 开启图片跨域访问 |boolean|否|false||2019-06-11|
|defines[0].total|合计列功能|string或bool或function(当前列值，当前列数组，当前数据)|否|||2019-06-11|
|defines[0].totalStyle|合计列的样式|object|否|||2019-06-11|
|defines[0].type|数据转义类型详见下文|string|否||full_name||
|defines[0].change|type为checkbox的时需配置|function(layui的form监听函数参数,行数据对象):void|否||||
|defines[0].replace|数据转义|function(value,object):string 或 string |否||||
|defines[0].visible|列函数显示隐藏|function(value,object):bool 或 bool |否|true|||
|defines[0].imgWidth|图片框的宽度| int |否|100|||
|defines[0].imgHeight|图片框的高度|int |否|100|||
|defines[0].width|列宽| int |否|100|||
|defines[0].onclick|单元格点击事件| function(当前属性对应值，当前对象，当前数据列表) |否|||2019-06-04|
|defines[0].clazz| 自定义class(type为checkbox生效)|string|array|否|["layui-disable"]||
|defines[0].domProps| 自定义属性(type为checkbox生效)|string|array|否|["data-props=custom-prop"]||
|~~fixHeightNumber~~|表格容器高度修正值| int |否|290|||
| handles | 操作栏定义项 | array | 否 | |||
| handles[0].visible | 显示隐藏当前操作的函数 | function(rowData):bool | 否 | true | ||
| handles[0].icon | 按钮的图标 | string | 否 | [自动] |  ||
| handles[0].color | 按钮的背景颜色 | string | 否 | [自动] | ||
| handles[0].name | 按钮的文字 | string | 否 | [自动] | ||
| handles[0].className | 按钮的class名称 | string | 否 | [自动] | ||
| handles[0].func | 按钮点击逻辑 | function(rowData) | 否(与edit/del互斥) | | ||
| handles[0].edit | 按钮的编辑功能（推荐function） | function(data)/object | 否 |  | ||
| handles[0].edit.content | (当edit为对象时适用)弹框的内容 | function(data):string/string/DOM/jQuery| 是 |  | ||
| handles[0].edit.dataRule | (当edit为对象时适用) 数据转换规则，适用于内容内有双大括号命名 | object| 否 |  | ||
| handles[0].edit.data | (当edit为对象时适用) 自定义模态框内form的数据对象获取方法 | function(formData):object| 否 |  | ||
| handles[0].edit.btns | (当edit为对象时适用) 模态框底部按钮列表 |array| 否 |  | ||
| handles[0].edit.btns[0].name | 模态框底部按钮名称 |string| 否 |  | ||
| handles[0].edit.btns[0].func | 模态框底部按钮点击触发逻辑 |function(index,layDom):void| 否 |  | ||
| handles[0].edit.url | (当edit为对象时适用) 模态框确定按钮请求地址 |string| 否 |  | ||
| handles[0].edit.type | (当edit为对象时适用) 打开的层类型 |int| 否 | 1 | ||
| handles[0].edit.title | (当edit为对象时适用) 打开的层标题 |string| 否 | 编辑 | ||
| handles[0].edit.x | (当edit为对象时适用) 打开的层宽度 |int| 否 | 50% | ||
| handles[0].edit.y | (当edit为对象时适用) 打开的层高度 |int| 否 | 50% | ||
| handles[0].edit.customBtns | (当edit为对象时适用) 自定义按钮数组 |array| 否 |  | ||
| handles[0].del |  删除功能 | function(data)/object| 否 | | ||
| handles[0].del.tip | (当del为对象时适用) 删除提示 | string | 否 | | ||
| handles[0].del.url | (当del为对象时适用) 删除请求接口地址，自动替换{id}为data.id | string | 否 | | ||
| handles[0].del.warning | (当del为对象时适用) 删除请求返回code后的警告提示 | string | 否 | [根据接口返回结果] | ||
| handles[0].del.error | (当del为对象时适用) 删除请求失败后的错误提示 | string | 否 | [根据接口返回结果] | ||
| handles[0].del.success | (当del为对象时适用) 删除请求成功后的提示 | string | 否 | 删除成功| ||
|handles[0].del.do | (当del为对象时适用) 未配置url的删除请求逻辑 | function(data) | 否 | | ||
| then | 每次渲染完成后处理函数 | function():void | 否 | |||
| singletonThen | 第一次渲染完成后处理函数 | function():void | 否 | |||
| subline | 子行项 | function():string | 否 | |||
| endline | 末行项 | function():string | 否 | |||
| localPage | 是否开启本地分页（需要传data数据列表） | bool | 否 | |||

## 提供的操作方法
---
- 刷新数据
`表格对象.flush()`

- 获取选中的数据行
`表格对象.getCheckedData()`

- 获取当前渲染的数据列表
`表格对象.getList()`

- 获取当前渲染的分页对象
`表格对象.getPage()`

- 获取当前渲染的响应数据
`表格对象.getResponse()`

- 刷新表格的宽度
`表格对象.flushStyle()`

- 获取表单查询的数据对象
`表格对象.getQueryData()`

- 设置表单查询的数据对象
`表格对象.setQueryData()`

示例：

```javascript

vars.table.setQueryObject(key,value)
vars.table.setQueryObject({key1:value1,key2:value2})


```



附：已支持的数据转义类型


| 类型名称  | 说明  | 元数据示例 | 转换的语义  |
| ------------ | ------------ | ------------ | ------------ |
|	date	|	日期	|	1545896461695	|	yyyy-MM-dd	|
|	datetime	|	日期时间	|	1545896461695	|	yyyy-MM-dd HH:mm	|
|	datetime	|	时间	|	1545896461695	|	HH:mm	|
|	img	|	图片相框预览,可通过相关属性配置宽高	|	http://xxx.png	|	[打开图片预览效果]	|
|	checkbox	|	开关选项	|	false	|	[渲染为checkbox开关]	|
|	dom	|	自定义返回dom	|	"<span>自定义dom</span>" 或dom对象	|	[渲染为自定义dom元素]	|





