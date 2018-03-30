var Header = function () {
    return function (container) {
        var $h = $(container); //
        var $ca = $h[0];
        var wh = $h.width();
        $ca.width = wh;
        $ca.height = 30;
        var hctx = $ca.getContext("2d");
        var bgcolor = hctx.createRadialGradient(wh / 2, 15, 10, wh / 2, 15, wh);
        Tutil.addColor(bgcolor, [0, "rgb(81, 125, 222)"], [.3, "rgb(114, 76, 152)"], [.5, "rgb(100, 31, 170)"], [.7, "rgb(127, 109, 224)"], [1, "rgb(104, 118, 199)"]);
        hctx.fillStyle = bgcolor;
        hctx.fillRect(0, 0, wh, 30);
        hctx.beginPath();
        hctx.moveTo(0, 15);
        var linecolor = hctx.createLinearGradient(0, 15, wh, 15);
        Tutil.addColor(linecolor, [0, "rgba(39, 39, 235, 0.94)"], [.3, "rgba(242, 110, 28, 0.94)"], [.7, "rgba(240, 11, 46, 0.94)"], [1, "rgba(66, 216, 60, 0.94)"]);
        hctx.strokeStyle = linecolor;
        hctx.lineTo(wh, 15);
        hctx.stroke();
        hctx.closePath();
        hctx.font = "16px Aria";
        var fontColor = hctx.createLinearGradient(wh / 2 - 100, 0, wh / 2, 0);
        Tutil.addColor(fontColor,[0, "#f40707"],[0.3, "#1424e2"],[0.7, "#aa1cbc"],[1, "#d5f810"]);
        hctx.fillStyle = fontColor;
        hctx.fillText("canvas 练习 " + $h.text() || "", wh / 2 - 100, 18);
    };
}();
