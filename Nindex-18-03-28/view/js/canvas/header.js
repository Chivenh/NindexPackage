var Header = function () {
    return function (container) {
        var $h = $(container); //
        var $ca = $h[0];
        var wh = $h.width();
        $ca.width = wh;
        $ca.height = 30;
        var hctx = $ca.getContext("2d");
        var bgcolor = hctx.createRadialGradient(wh / 2, 15, 10, wh / 2, 15, wh);
        bgcolor.addColorStop(0, "rgb(81, 125, 222)");
        bgcolor.addColorStop(.3, "rgb(114, 76, 152)");
        bgcolor.addColorStop(.5, "rgb(100, 31, 170)");
        bgcolor.addColorStop(.7, "rgb(127, 109, 224)");
        bgcolor.addColorStop(1, "rgb(104, 118, 199)");
        hctx.fillStyle = bgcolor;
        hctx.fillRect(0, 0, wh, 30);
        hctx.beginPath();
        hctx.moveTo(0, 15);
        var linecolor = hctx.createLinearGradient(0, 15, wh, 15);
        linecolor.addColorStop(0, "rgba(39, 39, 235, 0.94)");
        linecolor.addColorStop(.3, "rgba(242, 110, 28, 0.94)");
        linecolor.addColorStop(.7, "rgba(240, 11, 46, 0.94)");
        linecolor.addColorStop(1, "rgba(66, 216, 60, 0.94)");
        hctx.strokeStyle = linecolor;
        hctx.lineTo(wh, 15);
        hctx.stroke();
        hctx.closePath();
        hctx.font = "16px Aria";
        hctx.fillStyle = "#16e50e";
        hctx.fillText("canvas 练习 "+$h.text()||"", wh / 2 - 100, 18);
    };
}();
