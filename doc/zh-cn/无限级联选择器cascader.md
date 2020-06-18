### 开始
---
cascader是一个无限级联选择器

```html
<div class="layui-form-item">
    <label class="layui-form-label">选择框</label>
    <div class="layui-input-block">
        <input type="text" id="classify" class="layui-input" readonly="readonly">
    </div>
</div>
```
```javascript
需要在Wmm中导入cascader模块
数据格式：
var data = [{
        label: "生鲜",//下拉框显示名称
        value: 127, //值
        children: [{ //子节点
                label: "虾",
                value: 132,
                children: [{
                        label: "小虾",
                        value: 140
                    }]
            }]
    }, {
        label: "交通工具",
        value: 83,
        children: [{
                label: "地铁",
                value: 85
            }, {
                label: "飞机",
                value: 84
            }]
    }]
    var cas=cascader({
        elem: "#classify",         //绑定对象 必填
        data: data,                //源数据，需要的静态数据，类型为数组 （data与url两个参数二选一）
        url: "/aa",                //异步获取的数据，类型为数组        （data与url两个参数二选一）
        type: "post",              //异步获取的方式，默认get，可省略
        triggerType: "change",     //触发方式，不填或其他都为click，可选参数"change"，即鼠标移入触发
        showLastLevels: true,      //输入框是否只显示最后一级,默认false，即全显示
        where: { a: "aaa"},        //异步传入的参数，可省略
        value: [127, 132，140],    //传入的初始值，类型为数组，值为data的value值
        success: function (data) { //回调函数，选择完成之后的回调函数，返回值为value数组
            console.log(data);
        }
    });
	cas.reload():                  // 可重新渲染数据  
})
```






