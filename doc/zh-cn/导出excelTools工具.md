excelTools工具是针对导出excel.exportExcel方法再次封装

通过调用` excelTools.defaultExcelTools(sheetName, props, data);`可直接导出数据。

| 属性名  | 说明  | 类型  |
| ------------ | ------------ | ------------ |
| sheetName  | 表名  | string  |
| props  | 配置属性json数组  |  object |
| data  | 后台返回导出数据list  | object  |

### props对象示例

```javascript
 [
	{
		 head: "赛区",
		 prop: "zoneName",
	 },
	 {
		 head: "性别",
		 prop: "sex",
		replace: function (v, o) {
			 if (v == true) {
			 return '男';
			 } else {
			 return '女';
		 }
	  }
	 },
	 {
		 head: "入学日期",
		 prop: "enrollmentAt",
		 type: "datetime"
	 },
	 {
		 head: "加题1",
		 prop: "question_info",
		 replace: function (v, o) {
		 return v.question1Count || 0;
		 }
	 },


]
```

### 快速构建props对象
```javascript
//根据页面form表单定义：defines 通过table表定义的方法：vars.table.getAtomicDefines();
var props=vars.table.getAtomicDefines();
```

### 使用示例

调用方法：`excelTools.defaultExcelTools();vars.table.getAtomicDefines()；`

```javascript
//自定义导出数据属性定义
 var extendsExcelTools = {
 head: "项目",
 prop: "projectInfo",
 replace :function (value) {
    var c = "";
        for (var i = 0; i < value.length; i++) {
            c += value[i].projectName + "-" + value[i].groupName + " \n"
    }
     return c;
  }
 };
 var props=vars.table.getAtomicDefines();
 props.push(extendsExcelTools);
 excelTools.defaultExcelTools('信息表', props, data);
```


