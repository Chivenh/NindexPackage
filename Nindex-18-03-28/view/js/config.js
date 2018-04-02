require.config({
    paths: {
        'jquery': '/lib/jquery-3.2.1.min',
        Tutil:"/view/js/Tutil"
    },shim:{
        Tutil:{deps:["jquery"],exports:"Tutil"}
    }
});

define([],function(){
    /**将所有模块组成的变量以模块形式返回*/
    return {
        fireBall() {
            /**火球表演*/
            FireBall("#canvas-1").start();
        },
        fireSpark() {
            /**奔放烟花*/
            FireSpark("#canvas-2").start();
        },
        snowFlow() {
            /**满天雪飘*/
            SnowFlow("#canvas-3").start();
        },
        rainFlow() {
            /**雨落天穹*/
            RainFlow("#canvas-4").start();
        },
        imgDeal() {
            /**图像处理*/
            ImgDeal("#canvas-5").start();
        }
    };
});