/**
 * dataTable
 */
var DataTable = (function () {

    /**
     * 将参数对象的每个值绑定到目标对象上
     * @param target 目标对象 Object
     * @param arg 参数对象 Object
     * @param ignores 忽略列表 Array
     */
    var objBind = function (target, arg, ignores) {
        for (var ai in arg) {
            if ( (!ignores || 0 > ignores.indexOf(ai))) {
                target[ai] = arg[ai];
            }
        }
    };

    /**
     * 状态管理对象
     * @param statusLength 状态码长度
     * @param defaultStatus 状态码默认值
     * @constructor Status
     */
    var Status = function (statusLength, defaultStatus) {
        Status.privateFns._init_status.call(this,statusLength, defaultStatus);
    };

    /**
     * 状态码
     * @type {{"0": number, "1": number, off: string, on: string}}
     */
    Status.enum = {
        on: '1',
        off: '0',
        '1': 1,
        '0': 0,
        st: "",
        onAll: /1/g,
        offAll: /0/g
    };

    /*内部函数*/
    Status.privateFns = {
        /**
         * 初始化
         * @param statusLength {number}
         * @param defaultStatus {string|number}
         * @private
         */
        _init_status: function (statusLength, defaultStatus) {

            var theStatusLength = statusLength && statusLength > 0 ? statusLength : 0;
            var theDefaultStatus = defaultStatus === undefined ? Status.enum.off : Status.enum.on == defaultStatus ? Status.enum.on : Status.enum.off;
            var _status_array = [], _status = "", i = theStatusLength;
            while (i-- > 0) {
                _status_array.push(theDefaultStatus);
                _status += theDefaultStatus;
            }
            this._status_length = theStatusLength;
            this._status = _status;
            this._status_array = _status_array;
        },
        /**
         * 更新 status值
         * @private
         */
        _change_status: function () {
            this._status = this._status_array.join(Status.enum.st);
        },
        /**
         * 更新 status_array的值
         * @private
         */
        _change_status_array: function () {
            this._status_array = this._status.split(Status.enum.st);
        }
    };

    objBind(Status.prototype, {
        /*外部函数*/

        /**
         * 获取某一项的状态码
         * @param index
         * @returns {string | *}
         */
        get: function (index) {
            return this._status[index];
        },
        /**
         * 打开某一项开关
         * @param index
         */
        on: function (index) {
            this._status_array[index] = Status.enum.on;
            Status.privateFns._change_status.call(this);
        },
        /**
         * 关闭某一项开关
         * @param index
         */
        off: function (index) {
            this._status_array[index] = Status.enum.off;
            Status.privateFns._change_status.call(this);
        },
        /**
         * 选择或反选指定位
         * @param index
         */
        check:function(index){
            return this.isOn(index)?this.off(index):this.on(index);
        },
        /**
         * 打开所有
         */
        onAll: function () {
            this._status = this._status.replace(Status.enum.offAll, Status.enum.on);
            Status.privateFns._change_status_array.call(this);
        },
        /**
         * 关闭所有
         */
        offAll: function () {
            this._status = this._status.replace(Status.enum.onAll, Status.enum.off);
            Status.privateFns._change_status_array.call(this);
        },
        /**
         * 判断某一项是否打开
         * @param index
         * @returns {boolean}
         */
        isOn: function (index) {
            return this._status[index] === Status.enum.on;
        },
        /**
         * 判断某一项是否关闭
         * @param index
         * @returns {boolean}
         */
        isOff: function (index) {
            return this._status[index] === Status.enum.off;
        },
        /**
         * 判断是否全部打开
         * @returns {number}
         */
        isAllOn: function () {
            return this._status.indexOf(Status.enum.off) < 0;
        },
        /**
         * 判断是否全部关闭
         * @returns {number}
         */
        isAllOff: function () {
            return this._status.indexOf(Status.enum.on )< 0;
        },
        /**
         * 全选或反选全部
         */
       checkAll:function () {
           return this.isAllOn()?this.offAll():this.onAll();
       },
        /**
         * 获取所有选中项的序号集
         * @returns {Array}
         */
        getOnSelections:function () {
            var selections=[];
            var length=this._status_length;
            for (var i = 0; i <length ; i++) {
                this.isOn(i)&&(selections.push(i));
            }
            return selections;
        },
        /**
         * 获取所有未选中项的序号集
         * @returns {Array}
         */
        getOffSelections:function () {
        var selections=[];
        var length=this._status_length;
        for (var i = 0; i <length ; i++) {
            this.isOff(i)&&(selections.push(i));
        }
        return selections;
    }
    });

    /**
     * 表格数据结构
     * @param data {{rows:Array,total:Number}}
     * @constructor
     */
    var Table=function (data) {
        Table.privateFns._init_data.call(this,data);
    };

    /**
     * 内部方法
     * */
    Table.privateFns={
        /**
         * 初始化结构
         * @param data
         * @private
         */
        _init_data:function (data) {
            this._data_rows=data.rows;
            var dataSize = data.rows.length;
            this.status=function (theStatus) {
                var _= {};
                var bindFn=function (key,fn) {
                    _[key]=function () {
                        return fn.apply(theStatus,arguments);
                    }
                };

                for(var fn in theStatus){
                    if(fn[0]!=='_'){
                        var theFn=theStatus[fn];
                        if( typeof theFn==="function"){
                            bindFn(fn,theFn);
                        }
                    }
                }
                return _;
            }(new Status(dataSize));
        }
    };

    objBind(Table.prototype,{

        /**
         * 获取指定行记录
         * @param index
         * @returns {*}
         */
        getRow:function (index) {
            return this._data_rows[index];
        },
        /**
         * 获取所有选中行记录
         * @returns {Array}
         */
        getSelections:function () {
            var selections=this.status.getOnSelections();
            if(selections&&selections.length){
                var rows=[],length=selections.length;
                for (var i=0;i<length;i++) {
                    rows.push(this.getRow( selections[i]));
                }
                return rows;
            }
            return [];
        },
        /**
         * 获取所有未选中记录
         * @returns {Array}
         */
        getUnSelections:function () {
            var selections=this.status.getOffSelections();
            if(selections&&selections.length){
                var rows=[],length=selections.length;
                for (var i=0;i<length;i++) {
                    rows.push(this.getRow( selections[i]));
                }
                return rows;
            }
            return [];
        },reload:function (data) {
            Table.privateFns._init_data.call(this,data);
        }
    });

    return {
        /**
         * 创建DataTable数据结构
         * @param data
         * @returns {Table}
         */
        create:function (data) {
            if(data&&data.rows){
                return new Table(data);
            }
            console.table("数据结构应为:",{
                rows:'Array',
                total:'Number'
            });
            throw new Error("数据结构初始化失败!");

        },
        /**
         * 创建一个数据状态管理结构
         * @param size
         * @returns {Status}
         */
        createStatus:function (size) {
            return new Status(size);
        }
    }
}());

/*测试部分*/
(function () {

    var containers = document.querySelectorAll(".container-info");

    /**
     * 构造行数据
     * @param row
     * @returns {string}
     */
    var htmlRow= (row)=> {
        var str=[];
        for (var key in row){
            row.hasOwnProperty(key)&& str.push(`${row[key]}`);
        }
        return str.join(" : ");
    };

    /**
     * 明细元素填充
     * @param row
     * @param index
     * @returns {string}
     */
    var htmlFn =  (row, index) =>{
        return `<p><span><input type="checkbox" class="checkbox-row" data-index="${index}"/></span><b class="checkbox-index">${index} | </b><span>${htmlRow(row)}</span></p>`;
    };

    /**
     * 全选元素填充
     * @returns {string}
     */
    var htmlCheckAll= (addon)=> {
        return `<p><input type="checkbox" class="checkbox-all"> ${addon}</p>`;
    };

    /**
     * 容器渲染
     * @param container
     * @returns {Promise<any>}
     * @param data
     */
    var htmlContainer= function (container,data){
        return new Promise((resolve,rej)=>{
            //填充内容
            container.innerHTML=(`${htmlCheckAll(`总:${data.rows.length}`)}${data.rows.map((ri, i) => htmlFn(ri, i)).join("")}`);
            resolve();
        });
    };

    /**
     * 事件绑定
     * @param container
     * @param data
     * @param theDataTable
     */
    var eventDealFn=(container,data,theDataTable)=>{
        //移除事件
        if(theDataTable.clickFn){
            container.removeEventListener("click",theDataTable.eFn);
        }
        //选择控制
        var checkboxs = container.querySelectorAll(".checkbox-row");
        var checkAllBox=container.querySelector('.checkbox-all');
        var theStatus=theDataTable.status;
        //事件委托(比事件绑定快10倍,内存占用也优化良多)
        theDataTable.clickFn=e=>{
            var node=e.target;
            if(node.classList&&node.classList.contains("checkbox-row")){
                var index =node.dataset.index;
                theStatus.check(index);
                //触发全选按钮状态改变
                checkAllBox.checked=theStatus.isAllOn();
                // console.info(theDataTable.getSelections());
                // console.info(theDataTable.getUnSelections());
            }
        };
        //事件委托
        container.addEventListener("click",theDataTable.clickFn);
        if(theDataTable.changeFn){
            checkAllBox.removeEventListener("change",theDataTable.changeFn);
        }
        theDataTable.changeFn=e => {
            theStatus.checkAll();
            var checked=e.target.checked;

            checkboxs.forEach(ci =>{
                ci.checked=checked;
            });
        };
        checkAllBox.addEventListener("change", theDataTable.changeFn);
    };

    var Tables=[];
    var dataReload=(index,data)=>{
        //容器循环
        var theTable=Tables[index];
        if(theTable){
            theTable.reload(data);
        }else{
            Tables[index]=theTable=DataTable.create(data);
        }
        htmlContainer(containers[index],data).then( ()=> {
            eventDealFn(containers[index],data,theTable);
        });
    };

    var makeSize=()=>{
        var size= ((Math.random()+1)*5000)|0;
        console.info("当次数据:",size);
        return size;
    };

    var testRows=[
        {name: "哈哈", value: 111,size:200,text:"新程序调试数据"},
        {name: "嘿嘿", value: '1--1',size:120,text:"测试数据1010101"},
        {name: "呵呵", value: '1xx1',size:110,text:"1010101-测试"}
    ];

    var makeTestRows= (z)=> {
        var rows=[...testRows],_=[...rows];
        while(rows.length<z){
            _=[..._,...testRows];
            rows=[...rows,..._];
        }
        return { rows};
    };
    //构造测试数据并渲染
    dataReload(0,makeTestRows(makeSize()));
    dataReload(1,makeTestRows(makeSize()));
    //刷新操作
    document.querySelectorAll(".dataReload").forEach((_, index) => {
        _.addEventListener("click", () => {
            dataReload(index, makeTestRows(makeSize()));
        });
    });

    //加载时间
    console.time("load");
    window.onload=function () {
        console.timeEnd("load");
    }

}());