layui.define(['utils', 'laypage', 'layer', 'req', 'utils', 'spop', 'form'], function (exports) {
    class DataTable {
        constructor(props) {
            layui.link(layui.cache.modules.datatable.replace(".js", ".css"));
            //渲染ID
            this.el = props.el || 'datatable';
            //表单查询form ID
            this.formEl = props.formEl || 'search-form';
            //url路径
            this.url = props.url || '/user';
            //api地址
            this.api = props.api || ((typeof AppConfig === "undefined") ? '' : AppConfig.api);
            //自定义数据
            this.data = props.data;
            //是否开启表单自动查询
            this.autoQuery = props.autoQuery || false;

            //是否开启查询条件缓存（默认开启）
            this.queryCache = props.queryCache === undefined ? true : props.queryCache;

            this.parentSelector = props.parentSelector || ".page-container"
            this.height = props.height || document.querySelector(this.parentSelector).clientHeight - 250;

            //enable multiple on first column
            this.multiple = props.multiple || false;
            this.multipleFixed = props.multipleFixed === undefined ? true : props.multipleFixed;
            //define column name and show function
            this.defines = props.defines || [];
            //handle button rule
            this.handles = props.handles || [];
            this.handlesCondition = props.handlesCondition;
            //操作栏固定
            this.handleFixed = props.handleFixed === undefined ? false : props.handleFixed;

            //排序参数字段
            this.sortByParamName = props.sortByParamName || "sortBy";

            //the function will be executed after data loaded
            this.then = ((res, dataList, table) => {
                layui.form.render();
                layui.form.on("switch(datatable-checkbox)", function (filterData) {
                    let dataIndex = filterData.elem.getAttribute("data-index");
                    let columnIndex = filterData.elem.getAttribute("column-index");
                    let data = dataList[dataIndex];
                    table.defines[columnIndex].change(filterData, data);
                })
                props.then && props.then(res, dataList, table);
            });
            //the function will be executed only onece after data loaded
            this.singletonThen = props.singletonThen || (() => {
            });
            //sub row show function
            this.subline = props.subline;
            this.endline = props.endline;

            return this.init();
        }

        init() {
            let privateDefaultProps = {
                list: this.list,
                response: {},
                page: {},
                checkedData: [],
                hasRequest: false,
                singletonFlag: false,
                formEl: this.formEl,
                queryParam: {pageIndex: this.pageIndex || 1, pageSize: this.pageSize || 20},

            };
            const layuiFormElements = ["select", "checkbox", "radio", "switch"];
            const LAYER_TYPE = {
                MSG: 0,
                PAGE: 1,
                IFRAME: 2,
                LOADING: 3,
                TIPS: 4
            };

            let _that = this;
            let builder = {

                tableBox: function () {
                    //清理
                    document.querySelector("#" + _that.el) && (document.querySelector("#" + _that.el).innerHTML = "");
                    let tableBox = document.createElement("div");
                    tableBox.classList.add("datatable-box");
                    tableBox.style.position = "relative";
                    tableBox.style.border = "1px #eee solid";
                    document.querySelector("#" + _that.el).appendChild(tableBox);
                },
                headTable: function () {
                    //创建表头div容器
                    let headOuterDiv = document.createElement("div");
                    headOuterDiv.setAttribute("id", _that.el + "-datatable-head");
                    headOuterDiv.style.overflow = "hidden";
                    let headTable = document.createElement("table");
                    headOuterDiv.appendChild(headTable);
                    document.querySelector("#" + _that.el + " .datatable-box").appendChild(headOuterDiv);

                    let thead = document.createElement("thead");
                    headTable.appendChild(thead);
                    let tr = document.createElement("tr");
                    thead.appendChild(tr);

                    //add multiple checkbox head
                    let checkboxTotal = this.checkBox(true);
                    if (checkboxTotal) {
                        tr.appendChild(checkboxTotal);
                    }
                    for (let i = 0; i < _that.defines.length; ++i) {
                        let headDefine = _that.defines[i];
                        if (typeof headDefine.visible === "function" && !headDefine.visible()) {
                            continue;
                        }
                        if (typeof headDefine.visible === "boolean" && !headDefine.visible) {
                            continue;
                        }
                        let th = document.createElement("th");
                        let thSpan = document.createElement("span");
                        thSpan.appendChild(document.createTextNode(headDefine.head));
                        th.appendChild(thSpan);

                        if (headDefine.sort) {
                            let sortSpan = document.createElement("span");
                            let sortParams = privateDefaultProps.queryParam[_that.sortByParamName];
                            if (sortParams && sortParams.length > 0) {
                                for (let j = 0; j < sortParams.length; j++) {
                                    if (!sortParams[j]) {
                                        continue;
                                    }
                                    let sortparamArr = sortParams[j].split("-");
                                    if (sortparamArr[0] === headDefine.prop) {
                                        sortSpan.setAttribute("lay-sort", sortparamArr[1].toLocaleLowerCase());
                                    }
                                }
                            }
                            let setParamAndFlush = function (sort) {
                                if (_that.data) {
                                    layer.msg("暂不支持本地数据排序");
                                    return;
                                }
                                let currSort = privateDefaultProps.queryParam[_that.sortByParamName];
                                currSort = currSort || [];
                                let propName = layui.utils.underline2Camel(headDefine.prop);
                                let hasExists = false;
                                for (let j = 0; j < currSort.length; j++) {
                                    if (!currSort[j]) {
                                        continue;
                                    }
                                    let sortQuery = currSort[j].split("-");
                                    if (sortQuery[0] === propName) {
                                        hasExists = true;
                                        if (!sort) {
                                            currSort.splice(j, 1);
                                            break;
                                        }
                                        currSort[j] = propName + "-" + sort;
                                        break
                                    }
                                }
                                if (!hasExists && sort) {
                                    currSort.push(propName + "-" + sort);
                                }
                                privateDefaultProps.queryParam[_that.sortByParamName] = currSort;
                                builder.flush();
                            }
                            let doSort = function (span) {
                                let state;
                                let currentSortState = span.getAttribute("lay-sort");
                                if (!currentSortState) {
                                    state = "ASC";
                                    span.setAttribute("lay-sort", "asc");
                                }
                                if (currentSortState === "asc") {
                                    state = "DESC";
                                    span.setAttribute("lay-sort", "desc");
                                }

                                if (currentSortState === "desc") {
                                    span.removeAttribute("lay-sort");
                                }
                                if (typeof headDefine.sort === "function") {
                                    headDefine.sort(headDefine);
                                } else {
                                    setParamAndFlush(state);
                                }
                            };
                            let ascIcon = document.createElement("i");
                            ascIcon.className = "layui-edge layui-table-sort-asc";
                            ascIcon.title = "升序";
                            ascIcon.onclick = function () {
                                if (typeof headDefine.sort === "function") {
                                    headDefine.sort(headDefine)
                                } else if (typeof headDefine.sort === "boolean") {
                                    setParamAndFlush("ASC");
                                }
                                sortSpan.setAttribute("lay-sort", "asc");
                            }

                            let descIcon = document.createElement("i");
                            descIcon.className = "layui-edge layui-table-sort-desc";
                            descIcon.title = "降序";
                            descIcon.onclick = function () {
                                if (typeof headDefine.sort === "function") {
                                    headDefine.sort(headDefine)
                                } else if (typeof headDefine.sort === "boolean") {
                                    setParamAndFlush("DESC");
                                }
                                sortSpan.setAttribute("lay-sort", "desc");
                            }

                            sortSpan.appendChild(ascIcon);
                            sortSpan.appendChild(descIcon);

                            sortSpan.className = "layui-table-sort layui-inline";
                            th.appendChild(sortSpan);

                            thSpan.onclick = function (e) {
                                let span = e.target.parentNode.querySelector(".layui-table-sort");
                                doSort(span);
                            }
                        }

                        th.setAttribute("data-prop", headDefine.prop);
                        th.className = 'datatable-cell datatable-' + i + '-cell';
                        th.style.fontWeight = "blod";
                        if (headDefine.fixed) {
                            th.setAttribute("data-fixed", headDefine.fixed);
                        }
                        tr.appendChild(th);
                    }
                    let handleTh = this.handler(true);
                    if (handleTh && !(_that.handlesCondition && _that.handlesCondition())) {
                        tr.appendChild(this.handler(true));
                    }
                    return headTable;
                },

                rowTable: function () {
                    /**
                     * 构建一个只包含一个单元格的行
                     * @param {string} innerHTML
                     */
                    let buildSingleRow = function (innerHTML) {
                        let tr = document.createElement("tr");
                        let td = document.createElement("td");
                        td.setAttribute("colspan", _that.defines.length + (_that.handles.length > 0 ? 1 : 0));
                        innerHTML = innerHTML.replace(/script>/g, "")
                        td.innerHTML = innerHTML;
                        tr.appendChild(td);
                        return tr;
                    }

                    let dataOuterDiv = document.createElement("div");
                    dataOuterDiv.setAttribute("id", _that.el + "-datatable");
                    dataOuterDiv.style.overflow = "auto";
                    document.querySelector("#" + _that.el + " .datatable-box").appendChild(dataOuterDiv);
                    let dataTable = document.createElement("table");
                    dataOuterDiv.appendChild(dataTable);

                    let tbody = document.createElement("tbody");
                    dataTable.appendChild(tbody);
                    this.flushHeight();

                    //build and fill data
                    if (privateDefaultProps.list.length === 0) {
                        let tr = document.createElement("tr");
                        let td = document.createElement("td");

                        tr.appendChild(td);
                        td.setAttribute("colspan", _that.defines.length + (_that.handles.length > 0 ? 1 : 0));
                        td.style.textAlign = "center";
                        td.style.color = "#666"
                        td.innerText = "没有符合条件的记录";
                        tbody.appendChild(tr);
                    }

                    let startIndex = 0;
                    if (_that.data) {
                        startIndex = (privateDefaultProps.queryParam.pageIndex - 1) * privateDefaultProps.queryParam.pageSize;
                    }

                    // 兼容如果是本地分页就控制在一页展示指定数量
                    let hasTotalRow = false;
                    let sourceColumnValue = [];
                    for (let index = startIndex, i = 0; index < privateDefaultProps.list.length && ((v) => {
                        if (_that.data) {
                            return v < privateDefaultProps.queryParam.pageSize;
                        }
                        return true;
                    })(i); index++ , i++) {

                        let obj = privateDefaultProps.list[index];
                        let tr = document.createElement("tr");
                        tbody.appendChild(tr);

                        let elementCkBox = this.checkBox(false);
                        if (elementCkBox) {
                            tr.appendChild(elementCkBox);
                        }

                        tr.setAttribute("data-index", index);

                        for (let columnIndex = 0; columnIndex < _that.defines.length; columnIndex++) {
                            const define = _that.defines[columnIndex];
                            if (typeof define.visible === "function" && !define.visible()) {
                                continue;
                            }
                            if (typeof define.visible === "boolean" && !define.visible) {
                                continue;
                            }

                            let td = document.createElement("td");
                            tr.appendChild(td);
                            td.className = 'datatable-cell datatable-' + columnIndex + '-cell';
                            td.setAttribute("data-prop", define.prop || define.head);
                            td.id = "td-data-" + index + "-" + columnIndex;
                            if (define.fixed) {
                                td.setAttribute("data-fixed", define.fixed);
                            }
                            obj._dataIndex = index;
                            obj._columnIndex = columnIndex;

                            let tdBuildAfter;
                            let currentDataPropValue = obj[define.prop] || obj[layui.utils.underline2Camel(define.prop)];
                            if (define.total) {
                                hasTotalRow = true;
                                sourceColumnValue[columnIndex] = sourceColumnValue[columnIndex] || [];
                                sourceColumnValue[columnIndex].push(currentDataPropValue);
                            }
                            if (define.onclick) {
                                td.onclick = () => {
                                    define.onclick(currentDataPropValue, obj, privateDefaultProps.list);
                                }
                            }
                            td.appendChild(this.valueBuild(define, currentDataPropValue, obj, (buildAfter) => {
                                tdBuildAfter = buildAfter;
                            }));
                            tdBuildAfter && tdBuildAfter(define, obj, td, tr);
                        }

                        let trHander = this.handler(false, privateDefaultProps.list[index]);
                        if (trHander && !(_that.handlesCondition && _that.handlesCondition())) {
                            tr.appendChild(trHander);
                        }

                        if (_that.subline) {
                            let tr = buildSingleRow(_that.subline(obj));
                            tbody.appendChild(tr);
                        }
                    }
                    //构建合计行
                    if (hasTotalRow) {
                        let totalRow = document.createElement("tr");
                        totalRow.classList.add("datatable-total-tr");
                        let firstIdx;
                        for (let columnIndex = 0; columnIndex < _that.defines.length; columnIndex++) {
                            const define = _that.defines[columnIndex];
                            if (typeof define.visible === "function" && !define.visible()) {
                                continue;
                            }
                            if (typeof define.visible === "boolean" && !define.visible) {
                                continue;
                            }

                            firstIdx = firstIdx === undefined ? columnIndex : firstIdx;
                            let td = document.createElement("td");
                            td.classList.add("data-table-total-td");
                            if (define.fixed) {
                                td.setAttribute("data-fixed", define.fixed);
                            }
                            totalRow.appendChild(td);
                            totalRow.style.fontWeight = 700;
                            let span = document.createElement("span");
                            if (typeof define.total === "string") {
                                span.innerHTML = define.total;
                            }
                            if (!define.total) {
                                span.innerHTML = columnIndex === firstIdx ? "合计：" : "";
                            } else {
                                if (define.totalStyle) {
                                    for (let totalStyleKey in define.totalStyle) {
                                        if (define.totalStyle.hasOwnProperty(totalStyleKey)) {
                                            span.style[totalStyleKey] = define.totalStyle[totalStyleKey];
                                        }
                                    }
                                }
                                span.innerHTML = typeof define.total === "function" ? define.total(sourceColumnValue[columnIndex], sourceColumnValue, privateDefaultProps.list) : ((arr) => {
                                    let total = 0;
                                    arr.forEach(a => {
                                        a = parseFloat(a);
                                        if (isNaN(a)) {
                                            a = 0;
                                        }
                                        total += a;
                                    });
                                    return total.toFixed(2);
                                })(sourceColumnValue[columnIndex]);

                            }
                            td.appendChild(span);
                        }
                        tbody.appendChild(totalRow);
                    }


                    //构建尾行
                    if (_that.endline) {
                        let tr = buildSingleRow(_that.endline(privateDefaultProps.response));
                        tbody.appendChild(tr);
                    }

                    return dataOuterDiv;

                },

                /**
                 * 渲染分页区
                 */
                page: function () {
                    //if response data contails page
                    if (!(Object.getOwnPropertyNames(privateDefaultProps.page).length > 0 || _that.data)) {
                        return;
                    }
                    let pageDiv = document.querySelector("#" + _that.el + "-page");

                    if (pageDiv === null) {
                        pageDiv = document.createElement("div");
                        pageDiv.setAttribute("id", _that.el + "-page");
                        pageDiv.style.textAlign = "right";
                        document.querySelector("#" + _that.el).appendChild(pageDiv);
                    }
                    var laypage = layui.laypage;
                    laypage.render({
                        elem: _that.el + "-page",
                        count: privateDefaultProps.page.total || privateDefaultProps.list.length,
                        theme: "#1E9FFF",
                        limit: privateDefaultProps.queryParam.pageSize,
                        layout: ['count', 'prev', 'page', 'next', 'limit', 'refresh', 'skip'],
                        curr: privateDefaultProps.queryParam.pageIndex || 1,
                        jump: function (obj, first) {
                            if (first) {
                                if (_that.data) {
                                    privateDefaultProps.queryParam.pageIndex = 1;
                                }
                                return;
                            }
                            privateDefaultProps.queryParam.pageIndex = obj.curr;
                            privateDefaultProps.queryParam.pageSize = obj.limit;
                            builder.flush();
                        }

                    });
                },
                /**
                 * 响应每个单选按钮
                 * @param {object} element
                 */
                flushCheckedChildren: function (element) {
                    var state = element.checked;
                    let checkboxes = document.querySelectorAll("." + _that.el + "-checkchild");
                    privateDefaultProps.checkedData = [];
                    for (let index = 0; index < checkboxes.length; index++) {
                        const element = checkboxes[index].querySelector("input");
                        element.checked = state;
                        if (state === true && index < privateDefaultProps.list.length) {
                            privateDefaultProps.checkedData.push(privateDefaultProps.list[index]);
                        }
                    }
                },

                /**
                 * 响应全选按钮
                 * @param {object} element
                 */
                flushCheckedParent: function (element) {
                    //初始化单选按钮状态
                    if (!element) {
                        document.querySelector("." + _that.el + "-checkall").querySelector("input").checked = false;
                        privateDefaultProps.checkedData = [];
                        return;
                    }
                    var state = element.checked;
                    var index = element.parentNode.parentNode.getAttribute("data-index");
                    if (!state) {
                        document.querySelectorAll("." + _that.el + "-checkall").forEach(elem => elem.querySelector("input").checked = state);
                        //remove element
                        privateDefaultProps.checkedData.forEach(function (v, k) {
                            if (v.id == privateDefaultProps.list[index].id) {
                                privateDefaultProps.checkedData.splice(k, 1);
                            }
                        });
                    } else {
                        //add element
                        privateDefaultProps.checkedData.push(privateDefaultProps.list[index]);
                        let checkAll = true;
                        if (privateDefaultProps.checkedData.length !== privateDefaultProps.list.length) {
                            checkAll = false;
                        }
                        document.querySelectorAll("." + _that.el + "-checkall").forEach(elem => elem.querySelector("input").checked = checkAll);
                    }
                },
                /**
                 * 渲染多选
                 * @param {bool} isHead
                 */
                checkBox: function (isHead) {

                    if (_that.multiple) {
                        let element = isHead ? document.createElement("th") : document.createElement("td");
                        element.onchange = (e) => {
                            isHead ? this.flushCheckedChildren(e.target) : this.flushCheckedParent(e.target);
                        }
                        element.className = _that.el + (isHead ? "-checkall" : "-checkchild checkchild");
                        element.classList.add("layui-form");
                        element.style.width = "60px"
                        let ckbox = document.createElement("input");
                        ckbox.type = "checkbox";
                        ckbox.setAttribute("lay-skin", "primary");
                        ckbox.setAttribute("lay-filter", "datatable-multiple-checkbox");
                        ckbox.classList.add("datatable-multiple-checkbox" + (isHead ? "-parent" : ""));
                        element.appendChild(ckbox);
                        if (window.layui && layui.form) {
                            layui.form.on("checkbox(datatable-multiple-checkbox)", function (layData, event) {
                                if (layData.elem.classList.contains("datatable-multiple-checkbox-parent")) {
                                    builder.flushCheckedChildren(layData.elem);
                                }
                                if (layData.elem.classList.contains("datatable-multiple-checkbox")) {
                                    builder.flushCheckedParent(layData.elem);
                                }
                                layui.form.render("checkbox");
                            });
                        }
                        return element;
                    }

                },


                //渲染操作栏
                handler: function (isHead, data) {

                    if (_that.handles.length > 0) {
                        if (isHead) {
                            let th = document.createElement("th");
                            th.innerHTML = "操作";
                            th.className = "datatable-operation";
                            th.classList.add("datatable-cell")
                            return th;
                        }

                        //build custom hander
                        let handerCtx = document.createElement("td");
                        handerCtx.className = "operation-child datatable-cell";
                        for (let index = 0; index < _that.handles.length; index++) {
                            const hander = _that.handles[index];
                            let visible = true;
                            if (typeof hander.visible === "function") {
                                visible = hander.visible(data);
                            }
                            if (typeof hander.visible === "boolean") {
                                visible = hander.visible;
                            }
                            if (!visible) {
                                continue;
                            }
                            let handerSpan = document.createElement("span");
                            handerSpan.style.margin = "5px";

                            let handerBtn = document.createElement("button");
                            if (hander.icon) {
                                //set btn icon
                                let icon = document.createElement("i");
                                icon.className = "layui-icon " + hander.icon;
                                handerBtn.appendChild(icon);
                                handerBtn.style.border = "none";
                                handerBtn.style.cursor = "pointer";
                                handerBtn.title = hander.name || "";
                            }
                            let color;
                            let btnName;
                            if (hander.edit) {
                                color = "layui-btn-normal";
                                btnName = "编辑"
                            } else if (hander.del) {
                                color = "layui-btn-danger";
                                btnName = "删除";
                            } else {
                                color = "";
                            }
                            handerBtn.style.backgroundColor = hander.color || color;
                            handerBtn.appendChild(document.createTextNode(" "));
                            if (!hander.iconOnly) {
                                handerBtn.appendChild(document.createTextNode(hander.name || btnName || "function " + index));
                            }
                            //set button class
                            handerBtn.className = hander.className || "layui-btn " + color + " layui-btn-xs";

                            if (hander.dropdown) {
                                handerSpan.className = "layui-dropdown";
                                handerSpan.appendChild(document.createElement("ul"));
                                for (let i = 0; hander.dropdownList && i < hander.dropdownList.length; i++) {
                                    let drop = hander.dropdownList[i];
                                    if (drop.visible !== undefined && !drop.visible) {
                                        continue;
                                    }
                                    let li = document.createElement("li");
                                    li.setAttribute("href", drop.href || "javascript:");
                                    if (drop.onclick) {
                                        li.onclick = function () {
                                            drop.onclick(data);
                                        };
                                    }
                                    li.innerText = drop.text || "";
                                    handerSpan.querySelector("ul").appendChild(li);
                                }
                            } else {
                                handerBtn.onclick = function () {
                                    //assert this is edit data row
                                    if (hander.onclick) {
                                        hander.onclick(data, handerBtn);
                                    }
                                    if (hander.edit) {
                                        if (typeof hander.edit === "function") {
                                            hander.edit(data);
                                            return;
                                        }
                                        //use layer
                                        if (typeof hander.edit === "object") {

                                            let content = hander.edit.content || "empty content";
                                            let utils = layui.utils;

                                            if (typeof content === "object") {
                                                if (typeof content[0] === "undefined") {
                                                    //dom
                                                    content = document.createElement("div").appendChild(content).innerHTML;
                                                } else {
                                                    //jquery object
                                                    content = content.html();
                                                }
                                            }
                                            if (typeof content === "function") {
                                                content = content(data);
                                            }

                                            //build layer content dom
                                            let contentParentDom = document.createElement("div");
                                            contentParentDom.innerHTML = content;
                                            let contentDom = contentParentDom.childNodes[1];

                                            let dataRule = {};

                                            // compatible date type
                                            let containPatternElements = contentDom.querySelectorAll("[pattern]");

                                            let re = /{{(.*?)}}/g;
                                            for (let index = 0; index < containPatternElements.length; index++) {
                                                const element = containPatternElements[index];
                                                let tmpDiv = document.createElement("div");
                                                tmpDiv.appendChild(element);
                                                const elementHtml = tmpDiv.innerHTML;
                                                dataRule[re.exec(elementHtml)[0].replace("{{", "").replace("}}", "")] = function (v, o) {
                                                    return layui.utils.formatDate(new Date(v), element.pattern);
                                                }
                                            }

                                            let customDataRule = hander.edit.dataRule || {};

                                            for (const key in dataRule) {
                                                if (dataRule.hasOwnProperty(key)) {
                                                    customDataRule[key] = dataRule[key];
                                                }
                                            }
                                            content = content.render(data, customDataRule);

                                            //自定义模态框内form的data数据获取方法
                                            let customDataFunction = hander.edit.data || function () {
                                                return undefined;
                                            };
                                            let editBtns = hander.edit.btns || [{}, {}]

                                            let btns = [
                                                {
                                                    name: editBtns[0].name || "确定",
                                                    func: editBtns[0].func || function (index, layerDom) {
                                                        let newData = layui.utils.toJSONData(layerDom[0].querySelector("form"));
                                                        let updateData = customDataFunction(newData) || newData;
                                                        layui.req.put((hander.edit.url || "/test").replace("{id}", data.id), updateData, function (response) {
                                                            if (!response.code) {
                                                                utils.msg.warning(editBtns[0].warning || ("[" + response.code + "]" + response.msg));
                                                            } else {
                                                                utils.msg.success(editBtns[0].success || "保存成功");
                                                                layui.layer.close(index);
                                                                builder.flush();
                                                            }

                                                        }, function (response) {
                                                            utils.msg.error(editBtns[0].error || ("[" + response.status + "]" + response.responseJSON.msg));
                                                        });
                                                    }
                                                },
                                                {
                                                    name: editBtns[1].name || "取消",
                                                    func: editBtns[1].func || function (index, layerDom) {
                                                        //dont to do anythings
                                                    }
                                                }
                                            ];

                                            //this btns will append to btns

                                            let layerOpenObject = {
                                                type: hander.edit.type || LAYER_TYPE.PAGE,
                                                title: hander.edit.title || "编辑",
                                                area: [hander.edit.x || "50%", hander.edit.y || "50%"],
                                                content: content,
                                                shadeClose: false,
                                                shade: 0,
                                            };

                                            //build layer params
                                            let btnTextArr = [];
                                            for (let index = 0; index < btns.length; index++) {
                                                const btn = btns[index];
                                                btnTextArr[index] = btn.name;
                                                layerOpenObject["btn" + (index + 1)] = btn.func;
                                            }

                                            //custom button setting
                                            let customBtns = hander.edit.customBtns || [];
                                            for (let index = 0; index < customBtns.length; index++) {
                                                btns.push(customBtns[index]);
                                            }
                                            layerOpenObject.btn = btnTextArr;
                                            layer.open(layerOpenObject);

                                        }
                                    } else if (hander.del) {
                                        if (typeof hander.del === "function") {
                                            hander.del(data);
                                        }
                                        if (typeof hander.del === "object") {
                                            layui.layer.msg(hander.del.tip || "真要删除该数据吗？", {
                                                time: 1000000,
                                                btn: hander.del.btn || ['嗯', '我再想想'],
                                                yes: function (index) {
                                                    if (hander.del.url) {
                                                        layui.req.delete((hander.del.url || "/test").replace("{id}", data.id), function (response) {
                                                            if (response.code) {
                                                                utils.msg.warning(hander.del.warning || ("[" + response.code + "]" + response.msg));
                                                            } else {
                                                                utils.msg.success(hander.del.success || "删除成功");
                                                                builder.flush();
                                                                layui.layer.close(index);
                                                            }

                                                        }, function (response) {
                                                            utils.msg.error(hander.del.error || ("[" + response.status + "]" + response.responseJSON.msg));
                                                        });
                                                    } else {
                                                        hander.del.do(data);
                                                    }
                                                }
                                            });
                                        }

                                    } else {
                                        hander.func(data, handerBtn);
                                    }

                                }
                            }
                            handerSpan.appendChild(handerBtn);
                            handerCtx.appendChild(handerSpan);
                        }
                        return handerCtx;
                    }
                },

                /**
                 * 值生成器
                 * @param {object} define
                 * @param {string} v
                 * @param {objec} o
                 * @param {function} after
                 */
                valueBuild(define, v, o, after) {
                    let replaceResult = define.replace && define.replace(v, o);
                    let textNode;
                    if (replaceResult === 0 || replaceResult === "0") {
                        textNode = document.createTextNode(replaceResult);
                    } else {
                        textNode = document.createTextNode(replaceResult || (v === undefined ? "" : v))
                    }
                    let buildResult = this.typeHandler(define, v, o, after) || textNode;
                    let div = document.createElement("div");
                    div.appendChild(buildResult);
                    //检测是否开启了行内容超出省略
                    if (define.wordBreak) {
                        let className = "cell-" + (define.prop || define.head) + o._dataIndex + "" + o._columnIndex;
                        div.classList.add(className);
                        div.setAttribute("word-break", true);
                        let avgWidth = document.querySelector("#" + _that.el).offsetWidth / (_that.defines.length + 1);
                        // if (buildResult.length > parseInt(avgWidth / 14)) {
                        //求字符数，汉字2个字符，其他1个字符
                        var strLength = 0;
                        for (let i = 0; v && i < v.length; i++) {
                            if (v.charCodeAt(i) > 0 && v.charCodeAt(i) < 128) {
                                strLength++;
                            } else {
                                strLength += 2;
                            }
                        }
                        //字符数*宽度>平均单元格宽度
                        if (strLength * 6 > avgWidth) {
                            div.classList.add("layui-table-cell");
                            div.classList.add("layer-tips-active");
                            div.onmouseover = function () {
                                layer.tips(v, "." + className)
                            }
                            div.onmouseleave = function () {
                                layer.closeAll("tips");
                            }
                        }
                        div.classList.add("wmm-word-break");
                    }
                    div.style.display = "inline-block";
                    let avg = this.getAvgWidth();
                    div.style.width = (define.width || (avg < 80 ? 80 : avg)) + "px";
                    return div;
                },
                /**
                 * 计算平均宽度
                 * @returns {number}
                 */
                getAvgWidth: function () {
                    return document.querySelector("#" + _that.el).offsetWidth / (_that.defines.length + (_that.handles.length > 0 ? 1 : 0) + (_that.multiple ? 1 : 0));
                },
                /**
                 * 类型转换器
                 * @param {object} define
                 * @param {string} v
                 * @param {object} o
                 * @param {function} after
                 */
                typeHandler: function (define, v, o, after) {

                    let val;
                    let initValue = typeof v === "string" ? v.replace(new RegExp(/-/gm), "/") : v;
                    switch (define.type) {
                        case undefined:
                            return undefined;
                        case "date":
                            val = v === undefined ? "-" : layui.utils.formatDate(new Date(initValue), "yyyy-MM-dd");
                            break;
                        case "datetime":
                            val = v === undefined ? "-" : layui.utils.formatDate(new Date(initValue), "yyyy-MM-dd HH:mm");
                            break;
                        case "time":
                            val = v === undefined ? "-" : layui.utils.formatDate(new Date(initValue), "HH:mm");
                            break;
                        case "img":
                            if (v === undefined || v === '') {
                                return ""
                            }
                            let imgArr = [];
                            if (typeof v === "object") {
                                //处理数组
                                imgArr = v;
                            } else {
                                imgArr = v.split(",");
                            }
                            let isMultiple = imgArr.length > 1;
                            let imgContainer = document.createElement("div");
                            if (isMultiple) {
                                for (let index = 0; index < imgArr.length; index++) {
                                    const src = imgArr[index];
                                    let img = document.createElement('img');
                                    img.setAttribute("src", src);
                                    if ((typeof define.crossOrigin === "boolean" && define.crossOrigin)
                                        || (typeof define.crossOrigin === "function" && define.crossOrigin(v, o))) {
                                        img.setAttribute("crossorigin", "anonymous");
                                    }
                                    img.id = (define.prop || define.head) + "-view-" + index + "-" + o.id;
                                    img.style.height = (define.imgHeight || 100) + "px";
                                    if (define.imgWidth) {
                                        img.style.width = (define.imgWidth || 100) + "px";
                                    }
                                    if (index >= define.imgMax) {
                                        img.style.display = "none"
                                    }
                                    imgContainer.appendChild(img);
                                }
                            } else {
                                var img = document.createElement('img');
                                if ((typeof define.crossOrigin === "boolean" && define.crossOrigin)
                                    || (typeof define.crossOrigin === "function" && define.crossOrigin(v, o))) {
                                    img.setAttribute("crossorigin", "anonymous");
                                }
                                img.id = (define.prop || define.head) + "-view-" + o.id;
                                img.setAttribute("src", v);
                                if ((typeof define.crossOrigin === "boolean" && define.crossOrigin)
                                    || (typeof define.crossOrigin === "function" && define.crossOrigin(v, o))) {
                                    img.setAttribute("crossorigin", "anonymous");
                                }
                                img.style.height = (define.imgHeight || 100) + "px";
                                if (define.imgWidth) {
                                    img.style.width = (define.imgWidth || 100) + "px";
                                }
                                imgContainer.appendChild(img);
                            }

                            after((define, obj, td, tr) => {
                                if (layer) {
                                    layer.photos({photos: "#" + td.id});
                                }
                            });
                            return imgContainer;
                        case "checkbox":
                            let tmpDiv = document.createElement("div");
                            let checked = v ? "checked" : "";
                            tmpDiv.classList.add("layui-form");
                            let clazzStr = "", domPropsStr = "";
                            if (define.clazz && define.clazz[0]) {
                                define.clazz.forEach(cls => clazzStr += (cls + " "));
                            } else if (define.clazz) {
                                define.clazz.forEach(cls => clazzStr = cls)
                            }
                            if (define.domProps && define.domProps[0]) {
                                define.domProps.forEach(pro => domPropsStr += (pro + " "));
                            } else if (define.domProps) {
                                domPropsStr += define.domProps
                            }
                            tmpDiv.innerHTML = '<input type="checkbox" ' + checked + ' name="open" ' + clazzStr + domPropsStr + ' column-index="' + o._columnIndex + '" data-index="' + o._dataIndex + '" lay-skin="switch" lay-filter="datatable-checkbox" lay-text="ON|OFF">';
                            return tmpDiv;
                        case "dom":
                            let replaceResult = define.replace(v, o);
                            if (typeof replaceResult === "undefined") {
                                val = "";
                            } else if (typeof replaceResult === "string") {
                                let tmpDiv = document.createElement("div");
                                tmpDiv.innerHTML = replaceResult;
                                return tmpDiv.childNodes[0];
                            } else if (typeof replaceResult[0] === "undefined") {
                                //dom
                                return replaceResult;
                            } else {
                                //jq element
                                return replaceResult[0];
                            }
                        default:
                            val = v;
                    }
                    return document.createTextNode(val);
                },

                /**
                 * 刷新高度
                 */
                flushHeight() {
                    _that.height = document.querySelector(_that.parentSelector).clientHeight - 250;
                    _that.height = _that.height < 300 ? 300 : _that.height;
                    let datatableBody = document.querySelector("#" + _that.el + "-datatable");
                    let datatableFixedBodies = document.querySelectorAll("." + _that.el + "-datatable-body-fixed");
                    datatableBody.style.maxHeight = _that.height + "px";
                    if (datatableFixedBodies.length > 0) {
                        datatableFixedBodies.forEach(datatableFixedBody => datatableFixedBody.style.maxHeight = _that.height - (datatableBody.offsetHeight - datatableBody.clientHeight) + 'px')
                    }
                    document.querySelectorAll(".fixed-table-left th").forEach(e => e.style.height = document.querySelector("#" + _that.el + " th").offsetHeight + 'px');
                },

                /**
                 * 刷新宽度
                 */
                flushWidth() {

                    let body = document.querySelector("#" + _that.el + "-datatable");
                    for (let index = 0; index < _that.defines.length; index++) {
                        if (_that.defines[index].wordBreak) {
                            let tds = document.querySelectorAll('#' + _that.el + ' td.datatable-' + index + '-cell');
                            tds.forEach(td => {
                                let div = td.querySelector('.wmm-word-break')
                                if (div) {
                                    td.style.width = div.style.width;
                                }
                            });

                        }
                        let elem = document.querySelector("#" + _that.el + " td.datatable-" + index + "-cell");
                        if (!elem) {
                            continue;
                        }
                        //计算滚动条宽度
                        let scrollWidth = 0;
                        //在没有操作栏的时候矫正滚动条宽度
                        if (index === _that.defines.length - 1 && (_that.handles.length === 0 || (_that.handlesCondition && _that.handlesCondition()))) {
                            scrollWidth = body.offsetWidth - body.clientWidth;
                        }
                        //矫正th宽度
                        document.querySelectorAll("#" + _that.el + " th.datatable-" + index + "-cell").forEach(th => {
                            th.style.minWidth = (elem.clientWidth > (_that.defines[index].width || 0) ? elem.clientWidth : _that.defines[index].width) + scrollWidth + "px";
                        });
                    }

                    let hasAddedScroll = false;

                    //矫正操作栏宽度
                    if (_that.handles && _that.handles.length > 0) {
                        let operation = document.querySelectorAll("#" + _that.el + " .datatable-operation");
                        if (operation) {
                            let operationChild = document.querySelector("#" + _that.el + " .operation-child");
                            if (operationChild) {
                                operation.forEach(op => op.style.minWidth = operationChild.clientWidth + (!hasAddedScroll ? (body.offsetWidth - body.clientWidth) : 0) + "px")
                            }
                        }
                    }

                    //矫正选择框宽度
                    if (_that.multiple) {
                        let checkeParent = document.querySelectorAll("." + _that.el + "-checkall");
                        let checkboxChild = document.querySelector("." + _that.el + "-checkchild");
                        if (checkboxChild) {
                            checkeParent.forEach(cp => cp.style.minWidth = checkboxChild.clientWidth + "px");
                        }
                    }
                },

                /**
                 * 刷新数据
                 * @param {bool} cache
                 */
                flush(cache) {

                    /**
                     * 获取查询缓存对象
                     * @returns {any}
                     */
                    let getQueryCacheObject = function () {
                        let queryCacheCrypto = localStorage.getItem("DATATABLE_QUERY_CACHE");
                        let decodeStr;
                        try {
                            decodeStr = layui.utils.string.b64_to_utf8((queryCacheCrypto || "").replace(/eyzmaple/g, "ey"));
                        } catch (e) {
                            decodeStr = "null";
                        }
                        decodeStr = decodeStr === "null" ? null : (decodeStr || null);
                        let dbCache = JSON.parse(decodeStr);
                        return dbCache;
                    };
                    /**
                     * 设置查询缓存对象
                     * @param queryCacheObject
                     */
                    let setQueryCacheObject = function (queryCacheObject) {
                        localStorage.setItem("DATATABLE_QUERY_CACHE", layui.utils.string.utf8_to_b64(JSON.stringify(queryCacheObject)).replace(/ey/g, "eyzmaple"));
                    };
                    /**
                     * 获取当前查询缓存键
                     * @returns {string}
                     */
                    let getQueryCacheKey = function () {
                        return location.pathname + "::query_" + _that.el;
                    }
                    //如果不采用查询条件缓存则清理缓存(手动点击查询才会触发)
                    if (!cache) {
                        let dbCache = getQueryCacheObject();
                        if (dbCache) {
                            if (typeof dbCache === "object") {
                                delete dbCache[getQueryCacheKey()];
                                setQueryCacheObject(dbCache);
                            }
                        }
                    }
                    let doRender = function (res) {
                        if (typeof res === "function") {
                            res(data => {
                                _doRender(data);
                            });
                        } else {
                            _doRender(res);
                        }

                        function _doRender(res) {
                            privateDefaultProps.response = res;
                            //res is contain page
                            if (res.page) {
                                privateDefaultProps.page = res.page;
                                privateDefaultProps.list = res.page.list;
                            } else if (res.list) {
                                //res is a page
                                privateDefaultProps.page = res;
                                privateDefaultProps.list = res.list;
                            } else {
                                //res is a list
                                privateDefaultProps.list = res;
                            }
                            builder.tableBox();
                            builder.headTable();
                            let contentTable = builder.rowTable();
                            contentTable.addEventListener('scroll', function () {
                                document.querySelector("#" + _that.el + "-datatable-head").scrollLeft = contentTable.scrollLeft
                            });
                            builder.page();

                            if (_that.multiple) {
                                builder.flushCheckedParent();
                            }

                            builder.flushWidth();
                            //二次校正
                            builder.flushWidth();

                            //固定列
                            builder.renderFixed();
                            // layui && layui.dropdown && layui.dropdown.render();
                            _that.then(res, privateDefaultProps.list, _that);

                            if (!privateDefaultProps.singletonFlag) {
                                _that.singletonThen(res);
                                privateDefaultProps.singletonFlag = true;
                            }

                        }

                    };

                    let utils = layui.utils;
                    //查询条件(按钮触发会直接采用表单的数据)
                    let dbCache = getQueryCacheObject();
                    let thisQueryData = (dbCache && JSON.parse(dbCache[getQueryCacheKey()] || null)) || privateDefaultProps.queryParam;
                    privateDefaultProps.queryParam = thisQueryData;
                    layui.form.val(_that.formEl, thisQueryData || {});
                    layui.form.render();

                    //本地分页 本地列表数据
                    if (_that.data && typeof _that.data === "object") {
                        setTimeout(function () {
                            dbCache = dbCache || {};
                            dbCache[getQueryCacheKey()] = JSON.stringify(thisQueryData);
                            setQueryCacheObject(dbCache);
                            doRender(_that.data);
                        }, 100);
                        return;
                    }

                    //本地分页 异步数据 数据已获取到
                    if (privateDefaultProps.hasRequest && (_that.url || typeof _that.data === "function")) {
                        setTimeout(function () {
                            dbCache = dbCache || {};
                            dbCache[getQueryCacheKey()] = JSON.stringify(thisQueryData);
                            setQueryCacheObject(dbCache);
                            doRender(_that.data || privateDefaultProps.list);
                        }, 100);
                        return;
                    }


                    let queryString = utils.objectToQueryString(thisQueryData);
                    let requestUrl = _that.url.indexOf("?") === -1 ? (_that.url + "?" + queryString) : (_that.url + "&" + queryString);
                    layui.req.get(requestUrl, function (res) {
                        if (res.code && res.code !== 0) {
                            utils.msg.error(res.description);
                            return;
                        }
                        dbCache = dbCache || {};
                        dbCache[getQueryCacheKey()] = JSON.stringify(thisQueryData);
                        setQueryCacheObject(dbCache);
                        doRender(res);
                    }, function (res) {
                        console.log(res);
                    });
                },

                renderFixed() {

                    if (privateDefaultProps.list.length === 0) {
                        return;
                    }
                    let tdPadding = 7 * 2;

                    //左固定结束索引
                    let hasLeft = false;
                    //右固定开始索引
                    let hasRight = false;
                    let leftIndex = 0;
                    let rightIndex = 0;
                    for (let index = 0; index < _that.defines.length; index++) {
                        const define = _that.defines[index];
                        if (define.fixed) {
                            if (define.fixed === "left") {
                                hasLeft = true;
                                leftIndex = index;
                                continue;
                            }
                            if (define.fixed === "right") {
                                hasRight = true;
                                rightIndex = _that.defines.length - index + (_that.handles.length > 0 ? 1 : 0);
                                continue;
                            }
                        }
                    }

                    //左构建
                    if (hasLeft || (_that.multiple && _that.multipleFixed)) {
                        //创建容器
                        let leftFixed = document.createElement("div");
                        leftFixed.classList.add("fixed-table-left");
                        //插入容器
                        document.querySelector("#" + _that.el + " .datatable-box").appendChild(leftFixed);

                        let headDiv = document.createElement("div");
                        leftFixed.appendChild(headDiv);

                        //创建表头的副本
                        let headTable = document.createElement("table");
                        headDiv.appendChild(headTable);
                        let thead = document.createElement("thead");
                        headTable.appendChild(thead);
                        let headTr = document.createElement("tr");
                        thead.appendChild(headTr);
                        let ths = document.querySelectorAll("#" + _that.el + "-datatable-head th");
                        for (let index = 0; index < ths.length; index++) {
                            const th = ths[index].cloneNode(true);
                            if (ths[index + 1]) {
                                th.style.height = ths[index + 1].clientHeight + "px";
                            }
                            headTr.appendChild(th);
                            if (th.getAttribute("data-fixed") === "left" || (_that.multipleFixed && !hasLeft)) {
                                break;
                            }
                        }

                        //创建内容区副本
                        let bodyDiv = document.createElement("div");
                        bodyDiv.classList.add(_that.el + "-datatable-body-fixed");
                        bodyDiv.style.overflow = "hidden";
                        // let datatableBody = document.querySelector("#" + _that.el + "-datatable");
                        // let bodyHeight = document.querySelector('.layui-body').clientHeight;
                        // datatableBody.style.height = bodyHeight - _that.fixHeightNumber + 'px';
                        // bodyDiv.style.height = document.querySelector("#" + _that.el + "-datatable").clientHeight + "px";
                        //跟随滚动
                        let normalBodyDiv = document.querySelector("#" + _that.el + "-datatable");
                        normalBodyDiv.addEventListener('scroll', function () {
                            bodyDiv.scrollTop = normalBodyDiv.scrollTop
                        });
                        //插入内容区副本
                        leftFixed.appendChild(bodyDiv);
                        //创建内容区table
                        let bodyHeadTable = document.createElement("table");
                        bodyDiv.appendChild(bodyHeadTable);
                        let tbody = document.createElement("tbody");
                        bodyHeadTable.appendChild(tbody);

                        //查找原表的tr行
                        let trs = document.querySelectorAll("#" + _that.el + "-datatable tr");
                        for (let i = 0; i < trs.length; i++) {
                            //复制一个tr节点
                            const tr = trs[i].cloneNode();

                            //获取原tr下的td
                            const tds = trs[i].querySelectorAll("td");
                            for (let j = 0; j < tds.length; j++) {
                                const td = tds[j].cloneNode(true);
                                td.removeAttribute("id");
                                if (tds[j + 1]) {
                                    td.style.height = tds[j + 1].clientHeight - tdPadding + "px";
                                }
                                let wmmBreak = td.querySelector(".layer-tips-active");
                                if (wmmBreak) {
                                    wmmBreak.id = "fixed-div" + i + j;
                                    wmmBreak.onmouseover = function () {
                                        layer.tips(wmmBreak.innerHTML, "#" + wmmBreak.id);
                                    }
                                    wmmBreak.onmouseleave = function () {
                                        layer.closeAll("tips");
                                    }

                                }
                                //将copy的td添加到coop的tr里
                                tr.appendChild(td);
                                if (td.getAttribute("data-fixed") === "left" || (_that.multipleFixed && !hasLeft)) {
                                    break;
                                }
                            }
                            if (tds.length === 1) {
                                //子行
                                let sourceTd = trs[i].querySelector("td");
                                let emptyTd = document.createElement("td");
                                emptyTd.style.height = sourceTd.clientHeight - tdPadding + "px";
                                emptyTd.setAttribute("colspan", leftIndex);
                                tr.appendChild(emptyTd);
                            }
                            tbody.appendChild(tr);
                        }
                    }


                    // 右浮动构建
                    if (hasRight || (_that.handles.length > 0 && _that.handleFixed)) {
                        //创建容器
                        let rightFixed = document.createElement("div");
                        rightFixed.classList.add("fixed-table-right");
                        document.querySelector("#" + _that.el + " .datatable-box").appendChild(rightFixed);

                        let headDiv = document.createElement("div");
                        rightFixed.appendChild(headDiv);

                        //创建表头的副本
                        let headTable = document.createElement("table");
                        headDiv.appendChild(headTable);
                        let thead = document.createElement("thead");
                        headTable.appendChild(thead);
                        let headTr = document.createElement("tr");
                        thead.appendChild(headTr);
                        let ths = document.querySelectorAll("#" + _that.el + "-datatable-head th");
                        let lastTh;
                        for (let index = ths.length - 1; index > 0; index--) {

                            const th = ths[index].cloneNode(true);
                            if (ths[index - 1]) {
                                th.style.height = ths[index - 1].clientHeight + "px";
                            }
                            if (lastTh) {
                                headTr.insertBefore(th, lastTh);
                            } else {
                                headTr.appendChild(th);
                            }
                            lastTh = th;

                            if (th.getAttribute("data-fixed") === "right" || (_that.handleFixed && !hasRight)) {
                                break;
                            }
                        }


                        //创建内容区副本
                        let bodyDiv = document.createElement("div");
                        bodyDiv.classList.add(_that.el + "-datatable-body-fixed");
                        bodyDiv.style.overflow = "auto";
                        // let datatableBody = document.querySelector("#" + _that.el + "-datatable");
                        // let bodyHeight = document.querySelector('.layui-body').clientHeight;
                        // datatableBody.style.height = bodyHeight - _that.fixHeightNumber + 'px';
                        // bodyDiv.style.height = document.querySelector("#" + _that.el + "-datatable").clientHeight + "px";

                        //跟随滚动
                        let normalBodyDiv = document.querySelector("#" + _that.el + "-datatable")

                        let currentTab = 0;
                        bodyDiv.addEventListener('scroll', function () {
                            if (currentTab !== 1) return
                            normalBodyDiv.scrollTop = bodyDiv.scrollTop;
                        });
                        normalBodyDiv.addEventListener('scroll', function () {
                            if (currentTab !== 2) return
                            bodyDiv.scrollTop = normalBodyDiv.scrollTop;
                        });
                        bodyDiv.addEventListener('mouseover', () => {
                            currentTab = 1
                        })
                        normalBodyDiv.addEventListener('mouseover', () => {
                            currentTab = 2
                        })


                        rightFixed.appendChild(bodyDiv);
                        let bodyHeadTable = document.createElement("table");
                        bodyDiv.appendChild(bodyHeadTable);
                        let tbody = document.createElement("tbody");
                        bodyHeadTable.appendChild(tbody);

                        let trs = document.querySelectorAll("#" + _that.el + "-datatable tr");
                        for (let i = 0; i < trs.length; i++) {
                            //复制一个tr节点
                            const tr = trs[i].cloneNode();
                            //获取原tr下的td
                            const tds = trs[i].querySelectorAll("td");
                            let lastTd;
                            for (let j = tds.length - 1; j > 0; j--) {
                                const td = tds[j].cloneNode(true);
                                if (td.classList.contains("operation-child")) {
                                    let thisBtns = td.querySelectorAll("button");
                                    let btns = tds[j].querySelectorAll("button");
                                    for (let idx = 0; idx < thisBtns.length; idx++) {
                                        const btn = thisBtns[idx];
                                        btn.onclick = btns[idx].onclick;
                                    }

                                }
                                td.onclick = tds[j].onclick;
                                td.removeAttribute("id");
                                if (tds[j - 1]) {
                                    td.style.height = tds[j - 1].clientHeight - tdPadding + "px";
                                }
                                let wmmBreak = td.querySelector(".layer-tips-active");
                                if (wmmBreak) {
                                    wmmBreak.id = "fixed-div" + i + j;
                                    wmmBreak.onmouseover = function () {
                                        layer.tips(wmmBreak.innerHTML, "#" + wmmBreak.id);
                                    }
                                    wmmBreak.onmouseleave = function () {
                                        layer.closeAll("tips");
                                    }

                                }
                                if (lastTd) {
                                    tr.insertBefore(td, lastTd);
                                } else {
                                    tr.appendChild(td);
                                }
                                lastTd = td;
                                if (td.getAttribute("data-fixed") === "right" || (_that.handleFixed && !hasRight)) {
                                    break;
                                }
                            }
                            if (tds.length === 1) {
                                //子行
                                let sourceTd = trs[i].querySelector("td");
                                let emptyTd = document.createElement("td");
                                emptyTd.style.height = sourceTd.clientHeight - tdPadding + "px";
                                emptyTd.setAttribute("colspan", rightIndex);
                                tr.appendChild(emptyTd);
                            }
                            tbody.appendChild(tr);
                        }

                    }

                    builder.flushHeight()

                }

            }
            /** end builder */

            //添加data-table专属class
            document.querySelector("#" + this.el).classList.add("datatable");
            let searchFormDOM = document.querySelector("#" + this.formEl);
            if (this.formEl && searchFormDOM) {
                document.querySelector("#" + this.formEl).setAttribute("lay-filter", this.formEl);

                let attrPrefix = "zmapledt";
                document.querySelectorAll("#" + this.formEl + " select").forEach(e => e.setAttribute(attrPrefix + "-select", ""));
                document.querySelectorAll("#" + this.formEl + " input[type=checkbox]").forEach(e => {
                    e.setAttribute(attrPrefix + "-checkbox", "");
                    e.setAttribute(attrPrefix + "-switch", "")
                });
                document.querySelectorAll("#" + this.formEl + " input[type=radio]").forEach(e => e.setAttribute(attrPrefix + "-radio", ""));


                let onchangeEventArr = [];
                /**
                 * 自动刷新查询条件
                 * @returns {privateDefaultProps.queryParam|{pageIndex, pageSize}}
                 */
                let refreshSearchFormToQuery = function () {
                    if (event.target.type === "file") {
                        return;
                    }
                    let queryFormJSONData = layui.utils.toJSONData(searchFormDOM);
                    for (let queryFormJSONDataKey in queryFormJSONData) {
                        if (queryFormJSONData.hasOwnProperty(queryFormJSONDataKey)) {
                            privateDefaultProps.queryParam[queryFormJSONDataKey] = queryFormJSONData[queryFormJSONDataKey];
                        }
                    }
                    return privateDefaultProps.queryParam;
                };
                onchangeEventArr.push(refreshSearchFormToQuery);

                if (this.autoQuery) {
                    onchangeEventArr.push(builder.flush);
                }

                //原始表单改变事件
                document.querySelector("#" + this.formEl).onchange = function () {
                    onchangeEventArr.forEach(e => e());
                };

                layuiFormElements.forEach(type => {
                    form.on(type, function (obj) {
                        if (obj.elem.getAttribute(attrPrefix + "-" + type) == null) {
                            return;
                        }
                        onchangeEventArr.forEach(e => e());
                    });
                });

                let searchBTN = document.querySelector("#" + this.formEl + " .datatable-search");
                if (searchBTN) {
                    searchBTN.onclick = function () {
                        builder.flush();
                    }
                }

                let domSearchObject = utils.toJSONData(searchFormDOM);
                for (let key in domSearchObject) {
                    if (domSearchObject.hasOwnProperty(key)) {
                        privateDefaultProps.queryParam[key] = domSearchObject[key];
                    }
                }
            }


            builder.flush(this.queryCache);


            /**
             * 注册窗体resize事件
             */
            window.onresize = function () {
                builder.flushWidth();
                builder.flushHeight();
            }
            return {

                flush(cache) {
                    return builder.flush(cache);
                },

                getCheckedData() {
                    return privateDefaultProps.checkedData;
                },
                setCheckedData(dataArray, conditional) {
                    privateDefaultProps.checkedData = [];
                    if (!dataArray || !dataArray[0]) {
                        return;
                    }
                    conditional = conditional || ((checkData, data) => {
                        return checkData.id === data.id;
                    });

                    let list = this.getList() || [];
                    for (let i = 0; i < list.length; i++) {
                        let dataTr = document.querySelector("#" + _that.el)
                            .querySelector('[data-index="' + i + '"]');
                        let ckboxElem = dataTr.querySelector(".datatable-multiple-checkbox");
                        ckboxElem.checked = false;

                        let datatableFixedBodies,shadowDataTr,shadowCkboxElem;
                        if (_that.multipleFixed) {
                            datatableFixedBodies = document.querySelector("." + _that.el + "-datatable-body-fixed");
                            shadowDataTr = datatableFixedBodies.querySelector('[data-index="' + i + '"]');
                            shadowCkboxElem = shadowDataTr.querySelector(".datatable-multiple-checkbox");
                            shadowCkboxElem.checked = false;
                        }
                        layui.form.render()
                        dataArray.forEach(checkData => {
                            if (conditional(checkData, list[i])) {
                                ckboxElem.checked = true;
                                builder.flushCheckedParent(ckboxElem);
                                if (_that.multipleFixed) {
                                    shadowCkboxElem.checked = true;
                                }
                                layui.form.render()
                            }
                        });
                    }
                },
                getList() {
                    return privateDefaultProps.list;
                },

                getPage() {
                    return privateDefaultProps.page;
                },

                getResponse() {
                    return privateDefaultProps.response;
                },
                flushStyle() {
                    builder.flushWidth();
                    builder.flushHeight();
                },
                getQueryObject(key) {
                    return key ? privateDefaultProps.queryParam[key] : privateDefaultProps.queryParam;
                },
                getAtomicDefines() {
                    return (defines => {
                        let _defines = [];
                        defines.forEach(df => _defines.push({
                            head: df.head
                            , prop: df.prop
                            , type: df.type || "text"
                            , replace: df.replace
                        }));
                        return _defines;
                    })(_that.defines);
                },
                setQueryObject(paramObject, value) {
                    if (value) {
                        privateDefaultProps.queryParam[paramObject] = value;
                        return;
                    }
                    if (!paramObject) {
                        return;
                    }
                    for (let paramObjectKey in paramObject) {
                        if (paramObject.hasOwnProperty(paramObjectKey)) {
                            privateDefaultProps.queryParam[paramObjectKey] = paramObject[paramObjectKey];
                        }
                    }
                    return privateDefaultProps.queryParam;
                }

            }
        }

    };
    window.DataTable = DataTable;
    exports('datatable', {version: "v2.4", "message": "usage: new DataTable({...})"});
});


