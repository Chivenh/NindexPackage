/**
 *@author LFH
 *@date 2018年03月29日 09:10
 */
require(["./config"], function (doings) {
    require.config({
        baseUrl:"/view/js/canvas/"
    });
    var deps=["jquery", "Tutil","header"];
    var content=document.querySelector(".header").dataset.content;
    deps.push(content);//实现按需加载
    require(deps, function ($) {
        $(".container>canvas").text("Sorry! Your browser don't support canvas!");
        /**标题*/
        Header(".header");
       doings[content]();
    });
});