/**
 * http://usejsdoc.org/
 */
require.config(
        {
            baseUrl:"/lib",
        	paths: {
                'jquery': 'jquery-3.2.1.min'
            }
        }
    );
require(['jquery'],function ($) {
	var main=$("#_main_");
	var second=$("#_second_");
	var _data_html_=[];
	console.time("加载json");
	$.getJSON("/view/json/test.json").done(function(data){
		console.timeEnd("加载json");
		console.time("填充元素");
		if(data&&data.length){
			_data_html_=data.map(function(i,index){
				return function(io){
					var _=["<div class='_item'><i class='_item_index'> "+(index+1)+". </i> "];
					for(var _i in io){
						_.push(_i+" | "+io[_i]);
					}
					_.push("</div>");
					return _.join("");
				}(i);
			});
			main.html(_data_html_.join(""));
			second.html(_data_html_.join(""));
			console.timeEnd("填充元素");
		}
	});
});