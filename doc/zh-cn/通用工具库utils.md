utils
---

utils是wmm通用工具库。

### 使用方法
---
`imports:["utils"]`

`utils.open(...)`

### 公共操作函数
---


##### 简化弹窗操作layer.open
```javascript
utils.open(content, title, x, y, func);
//默认为弹出页面层
//content：可传入的值是灵活多变的，不仅可以传入普通的html内容，还可以指定DOM
//title：标题
//x:宽度 为String 需要写px或者%
//y:高度 为String 需要写px或者%
//func:层弹出后的成功回调方法
例子：
 fb.utils.open($("#addGoods").html(), "添加商品", "700px", "600px", function () {
	 console.log("111")
 });
```


##### 获取浏览器地址栏参数
```javascript
utils.getQueryString(参数名称):string;
```
返回类型：string字符串 或 null

##### 时间格式转换
```javascript
utils.formatDate(now, mask):string;
//now:date时间
//mask：需要转换的时间格式
例子：
utils.formatDate(new Date(), "yyyy-MM-dd HH:mm")
```

##### 对象转为GET请求参数
```javascript
utils.objectToQueryString(对象):string;

```

#####判断是否是没有属性的对象
```
utils.isEmptyObject(对象):bool;
```

##### 生成随机数
```javascript
utils.randomString(len):string
//len: 需要生成的字符长度
```
##### 生成UUID
`utils.getUUID():string`
##### form表单转换为GET请求参数
`utils.toFormData(表单DOM对象):string`

##### form表单转换为对象
```javascript
utils.toJSONData(表单DOM对象,扩展对象):object
```
扩展对象:将会整合到表单参数构成的对象里一并返回

##### 下划线转驼峰
```javascript
utils.underline2Camel(字符串):string
```


### 消息通知类
---
```javascript
utils.msg.success(tips, timeout);//成功提示
utils.msg.warning(tips, timeout);//警告提示
utils.msg.error(tips, timeout);//错误提示
//tips：要显示的消息
//timeout：消失时间，单位毫秒（可不填success默认1500，warning默认10000，error默认30000）
```


### 渲染类
---
##### 渲染select
```javascript
utils.render.select(EL表达式,数组,要展现的属性名,值属性名);
```
### 浏览器操作类
---
##### 是否是IE
`utils.browser.isIE():bool`

##### 是否是IE11
`utils.browser.isIE11():bool`

##### 是否是微信
`utils.browser.isWeixin():bool`


### 验证类
---
##### 是否包含有中文
`utils.valid.hasChinese(字符串):bool`

### IO类
---
##### 获取后缀名
`utils.valid.getSuffix(文件名):string`







