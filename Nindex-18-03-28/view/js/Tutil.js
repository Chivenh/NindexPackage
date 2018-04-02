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
    var Arc = function(){
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
        
    var ImgPoints=function(){
        /**扩展数组类,以对应此操作对象方便数据匹配*/
        class Points extends Array{
            constructor(points){
                super(...points);
            }
        }
        /**获取像素点,存入对象中*/
        let _getPoints=function(){
            let points=[],opt=this.options;
                for (let j = 0; j < opt.height; j += opt.grad) {
                    points.push(Array(opt.wlength));
                    for (let i = 0; i < opt.width; i += opt.grad) {
                        let index = (j * opt.width + i) * 4;
                        let _j = j / opt.grad,
                            _i = i / opt.grad;
                        if (opt.data[index + 3]) {
                            let _ai = new Uint8ClampedArray(4);
                            _ai[3] = opt.data[index + 3];
                            _ai[2] = opt.data[index + 2];
                            _ai[1] = opt.data[index + 1];
                            _ai[0] = opt.data[index];
                            let xy = {
                                x: i * opt.rt + opt.x + opt.fx,
                                y: j * opt.rt + opt.y + opt.fy,
                                rad: opt.rt,
                                color: `rgba(${_ai[0]},${_ai[1]},${_ai[2]},${(_ai[3]/255)})`
                            };
                            points[_j][_i] = [..._ai, xy];
                        }
                    }
                }
                this.points=new Points(points);
                this.options.hlength=this.points.length;
                
        };
        /**获取指定区域的所有像素点
         * @param ctx //canvas操作对象
         * @param {x,y,w,h} //矩形区域的范围.
         * @param rt //获得坐标时的放大倍数.
         * @param grad //粒度
         * @param fx,fy 分别为x轴和y轴的偏移量.
         * @return {imageData,points} //返回图像对象和像素点.
         */
        class ImgPxies {
            constructor(ctx, {x,y,w,h}, {grad = 1,rt = 1,fx = 0,fy = 0}) {
                let imageData = ctx.getImageData(x, y, w, h),
                    data = imageData.data,
                    height = imageData.height,
                    width = imageData.width,
                    wlength = Math.ceil(width / grad);
                grad = grad | 0;
                rt = Math.abs(rt);
                this.options={ctx,imageData,data,x,y,grad,rt,height,width,wlength,fx,fy};
                _getPoints.call(this);
            }
            /**获取像素数据*/
            getPoints() {
                return {
                    imageData: this.options.imageData,
                    points: this.points
                };
            }/**以矩形来绘制像素*/
            drawByRect(points = this.points) {
                let ctx = this.options.ctx;
                if (points instanceof Points) {
                    points.forEach(j => {
                        j.forEach(i => {
                            let _px = i[4];
                            ctx.beginPath();
                            ctx.fillStyle = _px.color;
                            ctx.fillRect(_px.x - _px.rad / 2, _px.y - _px.rad / 2, _px.rad, _px.rad);
                            ctx.closePath();
                        });
                    });
                }
            }
            /**以圆形来绘制像素*/
            drawByArc(points = this.points) {
                let ctx = this.options.ctx;
                if (points instanceof Points) {
                    points.forEach(j => {
                        j.forEach(i => {
                            let _px = i[4];
                            ctx.beginPath();
                            ctx.fillStyle = _px.color;
                            ctx.arc(_px.x, _px.y, _px.rad / 2, 0, 2 * Math.PI);
                            ctx.fill();
                            ctx.closePath();
                        });
                    });
                }
            }
        }
        return (ctx,img,opts)=>new ImgPxies(ctx,img,opts);
    }();
    
    return {Random,Float,Int,getCanvas,Arc,addColor,ImgPoints};
}(jQuery);