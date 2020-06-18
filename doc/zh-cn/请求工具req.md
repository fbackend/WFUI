## 介绍
---
req是请求工具，通常能不需要去刻意配置它，因为在框架的主函数里已经有默认配置项，包含已经配置了全局请求头部，全局请求前缀。

## 主要方法
---

### GET请求
`req.get(接口地址,请求成功回调,请求失败回调)`;
`req.get(接口地址,请求成功回调)`;

请求示例：
```javascript
req.get("/users",function(result){
//获取数据请求后逻辑
},function(ret){
//打印系统的错误信息
console.error(ret.msg);
})
```


### POST请求
`req.post(接口地址,请求参数,请求成功回调,请求失败回调)`;
`req.post(接口地址,请求参数,请求成功回调)`;

json请求示例：
```javascript
req.post("/users",{name:"MF",age:2},function(result){
//处理添加成功后的逻辑
},function(ret){
//打印系统的错误信息
console.error(ret.msg);
})
```

FormData请求示例：
```javascript
req.post("/users","name=MF&age=2",function(result){
//处理添加成功后的逻辑
},function(ret){
//打印系统的错误信息
console.error(ret.msg);
})
```

### PUT请求
`req.put(接口地址,请求参数,请求成功回调,请求失败回调)`;
`req.put(接口地址,请求参数,请求成功回调)`;



### DELETE请求
`req.delete(接口地址,请求成功回调,请求失败回调)`;
`req.delete(接口地址,请求成功回调)`;

请求示例：
```javascript
req.delete("/users/1",function(result){
//处理删除请求后逻辑
},function(ret){
//打印系统的错误信息
console.error(ret.msg);
})
```


