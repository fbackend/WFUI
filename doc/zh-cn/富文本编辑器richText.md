富文本编辑器插件基于wangEditor3
### 导入模块
```javascript
imports:"richText"
```

### 初始化富文本编辑器

- 获取文件上传的TokenInfo(参考代码)
```javascript
var apiName = api.upgrade[AppConfig.upgrade.preference + "Token"];
//tokenInfo
var resp = (apiName && apiName(null, false)) || {};
//upload host
var uploadUrl = resp.host || (AppConfig.request.api + api.upgrade.localApi);
```


- 初始化编辑器
```javascript
vars.editor = richText.render(props);
```
- 属性列表

|  属性名称 | 说明  | 类型  | 是否必须  | 默认值
| ------------ | ------------ | ------------ | ------------ |------------ |
| el  | 编辑器容器el表达式  | string | √  | |
| url  | 直传的URL  | string  | √  | |
| scene  | 本地上传的场景值  | string  | 本地上传必填  |"" |
|  maxSize | 单次最大上传的文件大小（byte）  |  long | 否  |1024*1024 |
| maxCount  | 一次性最大选择的文件个数  |   |   | 5|
| zIndex  | 富文本编辑器层级  |   |   | 10000|
| tokenInfo  | 上传凭证信息  | object  | 非本地上传必填  | {} |
|  height | 容器高度  | string  | 否  | 300px|
|  keyGenerator | 上传key的生成策略  | functon(fileName):string  | 否  | [自动] |
|outerNamespace|外部静态资源域名，可配置外链被禁用的域名|array|否| ["statics.xiumi.us"]|

- outerNamespace
此属性在用于外部富文本编辑器粘贴进来时生效，**基于wangEditor封装的richText组件，会将外部富文本内的图片上传至本地** ,默认会过滤秀米的链接，可通过此参数额外添加需要过滤的静态资源域名。

- 自动过滤列表

|  主体 | 域名  | 自动过滤  |
| ------------ | ------------ | ------------ |
| 秀米  | *.xiumi.us  | √ |
| 135  | ？  | X |
| 待添加...  | ...  | X |
| 待添加...  | ...  | X |

除此之外，可以传入wangEditor原生的属性（customProp）配置（部分属性互斥）

- 编辑器的其他操作
参考[编辑器的内容操作](https://www.kancloud.cn/wangfupeng/wangeditor3/335773 "编辑器的内容操作")

