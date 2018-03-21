/**
 * http://usejsdoc.org/
 */
require.config({
    baseUrl: "/lib",
    paths: {
        'jquery': 'jquery-3.2.1.min'
    }
});
var window = window;
require(['jquery'], function ($) {
    /**求数组中的最大值最小值*/
    Array.prototype.max = function () {
        return Math.max.apply({}, this);
    };
    Array.prototype.min = function () {
        return Math.min.apply({}, this);
    };
    /**计算最大值,最小值*/
    ! function () {
        var _values = [];
        $("#_max_min>input[name='num']").each(function () {
            _values.push(this);
        });
        var _calc = function () {
            var _nums = _values.map(function (em) {
                return em.value;
            });
            $("#max").val(_nums.max());
            $("#min").val(_nums.min());
        };
        $("#_max_min").on("blur", "input[name='num']", _calc);
        $("#_num_clear").click(function () {
            _values.forEach(function (em) {
                em.value = 0;
            });
            _calc();
        });
    }();
    /**返回顶部*/
    $(".back2top").click(function () {
        $("html,body").animate({
            scrollTop: 0
        }, 300);
    });
    $(window).scroll(function () {
        var t = window.document.documentElement.scrollTop || window.document.body.scrollTop;
        if (t > 75) {
            setTimeout(function () {
                $("._lock_top").addClass("_fixed");
            }, 50);
        } else {
            setTimeout(function () {
                $("._lock_top").removeClass("_fixed");
            }, 50);
        }
    });
    $("._navgation").on("click", "li[data-href]", function () {
        var href = $(this).data("href");
        href && window.open(href);
    });
    /**图片模块*/
    ! function () {
        $("._do_upload_imgs").click(function () {
            window.open("/view/html/tab2.html");
        });
        var _con = $(".imgs_container");
        var _img_deal_res = $("._img_deal_res");
        var _loadImgs = function () {
            $.get("/getFileList").done(function (data) {
                var _imgs = [];
                data.forEach(function (i, index) {
                    _imgs.push("<span class='_img_show_con' ><img alt='" + (index + 1) + "' srcset='/view/imgs/步行.png' data-src='" + i + "' class='_img_show _blur' draggable='true'/><span data-src='" + i + "'  class='_img_del'></span></span>");
                });
                _con.html(_imgs.join(""));
                setTimeout(function () {
                    $("._img_show", _con).each(function () {
                        this.srcset = this.src = this.dataset.src;
                        delete this.dataset.src;
                    });
                }, 20);
                setTimeout(function () {
                    _img_deal_res.empty();
                }, 2000);
            });
        };
        _loadImgs();
        $("._load_imgs").click(_loadImgs);
        _con.on("click", "._img_del", function () {
            var _path = $(this).data("src");
            $.post("/delFile", {
                delPath: _path
            }).done(function (data) {
                _img_deal_res.html(JSON.stringify(data.body) + "&nbsp;" + (data.msg || data.err));
                if (data.success === true) {
                    _loadImgs();
                }
            });
        });
        _con.on({
            mouseover: function () {
                $(this).addClass("_after_").find("._img_show").removeClass("_blur");
            },
            mouseleave: function () {
                $(this).removeClass("_after_").find("._img_show").addClass("_blur");
            }
        }, "._img_show_con");
        _con.on("click", "._img_show", function (e) {
            e.stopPropagation(); //停止事件传播,以免触发父级元素事件.
            window.open(this.src);
        });
    }();
    /**拖动更换背景模块*/
    ! function () {
        var _con = $(".imgs_container");
        var _vcon = $(".entry_s");
        _vcon.on({
            drop: function (e) {
                var src = e.originalEvent.dataTransfer.getData("src"); //获取移入元素携带的数据.
                if (src) {
                    var _imgs = $(this).find("._img_title");
                    $(this).find("._img_title").attr("src", src);
                }
            },
            dragover: function (e) {
                e.preventDefault(); //阻止默认事件,以允许拖动进行.
            }
        });
        _con.on("dragstart", "._img_show", function (e) {
            e.originalEvent.dataTransfer.setData("src", this.src.replace("..", ""));
        });
    }();
    /*数据展示模块*/
    ! function () {
        var _userCon = $("#users_grid>tbody");
        var _row = function (arr) {
            return "<tr>" + arr.map(function (i) {
                return "<td>{{" + i + "}}</td>";
            }) + "</tr>";
        }(["index", "id", "name", "code", "creation_time", "modification_time", "del"]);
        var _loadUsers = function () {
            $.get("/getUsers.do").done(function (data) {
                var _rows = [];
                (data.rows && data.rows.length) && data.rows.forEach(function (i, index) {
                    var _ri = _row;
                    i.index = index + 1;
                    for (vi in i) {
                        if (i.hasOwnProperty(vi)) {
                            _ri = _ri.replace(new RegExp("\{\{" + vi + "\}\}", "ig"), i[vi]);
                        }
                    }
                    if (i.id != 10) {
                        _ri = _ri.replace(new RegExp("((td)>\{\{del\}\})+?", "ig"), "$2 class='_user_del' data-id=" + i.id + ">删除");
                    } else {
                        _ri = _ri.replace(new RegExp("((td)>\{\{del\}\})+?", "ig"), "$2 >--");

                    }
                    _rows.push(_ri);
                });
                _userCon.html(_rows.join(""));
            });
        };
        _loadUsers();
        $("._users_load").click(function () {
            var _date = new Date();
            _loadUsers();
        });
        $("._users_add").click(function () {
            var _user = {};
            $("input", "#_users_add_con").each(function () {
                _user[this.name] = this.value;
            });
            $.post("/addUser.do", _user).done(function (data) {
                _loadUsers();
            });
        });
        _userCon.on("click", "._user_del", function () {
            $.post("/delUser.do", {
                id: this.dataset.id
            }).done(function () {
                _loadUsers();
            });
        });
    }();
    /*轮播图模块*/
    ! function () {
        var _con=$("#loopContainer");
        var _title=$("#loopTitle");
        var _baseLoop="/view/imgs/loop/";
        var _index=0;
        var _loops=[
            {url:"中货车.png",title:"中货车"},
            {url:"小货车.png",title:"小货车"},
            {url:"小面包车.png",title:"小面包车"},
            {url:"小三轮.png",title:"小三轮"},
            {url:"大三轮.png",title:"大三轮"},
            {url:"摩托车.png",title:"摩托车"},
            {url:"摩托车1.png",title:"摩托车1"}
        ];
        var _data = function () {
            _loops.forEach(function (i, index) {
                i.index = index;
            });
        }();
        var _titleInit=function(){
            var tw=_title.width();
            var _tiw=80;
            var _l_=Math.floor((+tw)/_tiw);
            console.info("lll",_l_);
            var _ts=[];
            for(var _i=_index;_i<_l_&&_i<_loops.length;_i++){
                _ts.push("<i class='_loop_title_item' data-index='"+_i+"' id='_loop_title_item_"+_i+"'>"+_loops[_i].title+"</i>");
            }
            _title.html(_ts.join(""));
             $("#_loop_title_item_"+_index).addClass("_loop_title_active");
        };
        var _linkTitle=function(){
            $("._loop_title_active").removeClass("_loop_title_active");
             $("#_loop_title_item_"+_index).addClass("_loop_title_active");
            
        };
        var _1=function(){
            var _m=$("<div class='_loop_container'></div>"),
                _prev=$("<i class='_loop_prev'></i>"),
                _next=$("<i class='_loop_next'></i>");
            _m.append(_prev).append(_next);
            _con.append(_m);
        };
        var _xi=function(){
            var max=_loops.length-1;
            var min=0;
            _index++;
            if(_index>max){
                _index=min;
            }
            return _index;
        };
        var _yi=function(){
            var max=_loops.length-1;
            var min=0;
            _index--
            if(_index<min){
                _index=max;
            }
            return _index;
        };
        var _2 = function () {
            var _m = $("._loop_container", _con),
                _prev = $("._loop_prev", _con),
                _next = $("._loop_next", _con);
            _m.css({
                backgroundImage: "url( " + (_baseLoop + _loops[_index].url) + ")"
            });
            _prev.click(function () {
                _m.css({
                    backgroundImage: "url( " + (_baseLoop + _loops[_yi()].url) + ")"
                });
                _linkTitle();
            });
            _next.click(function () {
                _m.css({
                    backgroundImage: "url( " + (_baseLoop + _loops[_xi()].url) + ")"
                });
                _linkTitle();
            });
            var _titleTurn = function () {
                $("#loopTitle").on("click", "._loop_title_item", function () {
                    _index = this.dataset.index;
                    _m.css({
                        backgroundImage: "url( " + (_baseLoop + _loops[_index].url) + ")"
                    });
                    _linkTitle();
                });
            }();
        };
        _1();
        _2();
        _titleInit();
    }();
});
