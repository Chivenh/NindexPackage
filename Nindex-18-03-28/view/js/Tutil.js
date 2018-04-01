var Tutil=function($){
    /**得到一个在两个数值之间的随机数*/
    var Random= (min, max)=> Math.floor(Math.random() * (max - min) + min);
    /**对浮点数保留2位小数*/
    var Float=(num)=>Number(parseFloat(num).toFixed(2));
    var Int=parseInt;
    /**获取canvas操作对象*/
    var getCanvas=(container)=>{
        var $cv=$(container);
        if(!$cv.length){
                return {};
           }
        var width = $cv.width();
        var height = $cv.height();
        var canvas = $cv[0];
        /**这一步是指定canvas元素的width和height属性,让其等于样式中的width和height*/
        canvas.width = width;
        canvas.height = height;
        var ctx = canvas.getContext("2d");
        /**显示源图像 + 目标图像。*/
         ctx.globalCompositeOperation = "lighter";
        
        return {ctx,width,height};
    };
    var Arc = function(x, y, r){
        /**创建一个圆周对象,以方便获取圆周上点坐标*/
        class _Arc {
            constructor(x, y, r) {
                this.x = x;
                this.y = y;
                this.r = r;
            }
            setStart(v) {
                var deg = (2 * Math.PI / 360) * v;
                this._x = this.x + Math.sin(deg) * this.r;
                this._y = this.y + Math.cos(deg) * this.r;
            }
            getPoint(v) {
                var deg = (2 * Math.PI / 360) * v;
                var x = Float(this.x + Math.sin(deg) * this.r);
                var y = Float(this.y + Math.cos(deg) * this.r);
                return {x,y};
            }
            getPoints(...v) {
                if (v && v.length) {
                    let ps = [];
                    ps = v.map(vi => {
                        let deg = (2 * Math.PI / 360) * vi;
                        let x = Float(this.x + Math.sin(deg) * this.r);
                        let y = Float(this.y + Math.cos(deg) * this.r);
                        return {x,y};
                    });
                    return ps;
                }
                return false;
            }
        }
        return (x, y, r) => new _Arc(x, y, r);
    }();
    /**以便于批量添加渐变颜色的梯度值*/
    var addColor=(gradient,...color)=>{
        if(color&&color.length){
            color.forEach(ci=>gradient.addColorStop(ci[0],ci[1]));
        }
        return gradient;
    };
    /**获取指定区域的所有像素点
     * @param ctx //canvas操作对象
     * @param {x,y,w,h} //矩形区域的范围.
     * @return {imageData,points} //返回图像对象和像素点.
     */
    var getPoints = (ctx, x,y,w,h) => {
        var imageData = ctx.getImageData(x, y, w, h),data=imageData.data,points = [];
        var _w = w / 2,_h = h / 2;
        var height=imageData.height,width=imageData.width;
        console.info(data);
        for (let j = 0; j < height; j += 1) {
            points.push(Array(width));
            for (let i = 0; i < width; i += 1) {
                let index=(j*width+i)*4;
                points[j]=new Uint8ClampedArray(4);
                points[j][3]=data[index+3];
                points[j][2]=data[index+2];
                points[j][1]=data[index+1];
                points[j][0]=data[index];
            }
        }

        return {imageData,points};
    };
    return {Random,Float,Int,getCanvas,Arc,addColor,getPoints};
}(jQuery);