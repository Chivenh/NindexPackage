/**雨落天穹*/
var RainFlow=function () {
    return function (container) {
        var {Int,Float,Random} = Tutil;
        var {ctx,height,width} =Tutil.getCanvas(container);
        if(!ctx){
            return {start(){},stop(){}};
           }
        /**启动绘图*/
        var Doing = {
            run() {
                this.Day.bgc();
                if(this.count<200){
                    setTimeout(() => {
                        new Rain();
                        this.count++;
                    }, 200); 
                  }
                this.rains.forEach(ri=>ri.flow());
                this.rainArcs.forEach(ri=>ri.diffuse());
            },
            rains: new Set(),
            rainArcs:new Set(),
            count:0
        };
        class RainArc {
            constructor(x, y) {
                this.x = x;
                this.y = y;
                this.radius = Random(1, 3);
                this.color =0x58595a;
                this.draw();
                Doing.rainArcs.add(this);
            }
            diffuse() {
                this.radius *= 1.1;
                this.color+=2;
                if (this.radius > 13) {
                    this.die();
                } else {
                    this.draw();
                }
            }
            die() {
                Doing.rainArcs.delete(this);
            }
            draw() {
                /*this.color=(this.color+)|0;//此运算相当于对结果取整.*/
                /**
                 * this.color.toString(16) 是将值转为16进制.
                 * padStart(6,'0') 是对结果值取6位,如果不足6位则在前面补'0';
                 * */
                ctx.strokeStyle= '#' + this.color.toString(16).padStart(6, 'a');
                this.drawArc(.5);
                this.drawArc(.9);
                this.drawArc(1.3);
            }
            drawArc(radio) {
                /**用三次贝塞尔曲线模拟椭圆,实现类滴水效果*/
                var radius=this.radius*radio;
                var x = this.x,y = this.y,radX = radius+2,radY = radius - 2;
                var startX = x - radX,endX = x + radX;//确定三次贝塞尔曲线起点和终点X坐标.
                var px11 = startX,py11 = y + radY-1,px12 = endX,py12 = y + radY-1;//确定下贝塞尔曲线控制点
                var px21 = startX,py21 = y - radY+1,px22 = endX,py22 = y - radY+1;//确定上贝塞尔曲线控制点
                ctx.beginPath();
                ctx.moveTo(startX, y);
                ctx.bezierCurveTo(px11, py11, px12, py12, endX, y);//下贝塞尔曲线
                ctx.stroke();
                ctx.closePath();
                ctx.beginPath();
                ctx.moveTo(startX, y);
                ctx.bezierCurveTo(px21, py21, px22, py22, endX, y);//上贝塞尔曲线
                ctx.stroke();
                ctx.closePath();
            }
            
        }
        
        class Rain{
            constructor(){
                this.x=Random(5,width*1.3);
                this.y=-1;
                this.radius=Float(Math.random()*1.1);
                this.speed=Random(5,10);
                this.draw();
                Doing.rains.add(this);
            }
            flow(){
                this.x-=.5;
                this.y+=this.speed;
                if(this.y>(height-30)){
                   this.die();
                }else{
                    this.draw();
                }
            }
            die(){
                Doing.rains.delete(this);
                new RainArc(this.x,this.y);
                new Rain();
            }
            draw(){
                ctx.beginPath();
                ctx.arc(this.x,this.y,this.radius,0,2*Math.PI);
                var rainColor=ctx.createRadialGradient(this.x/2,this.y/2,this.radius/2,this.x/2,this.y/2,this.radius);
                Tutil.addColor(rainColor,[0,"#fff"],[.3,"#9dedb9"],[.8,"#a2f2e6"],[1,"#fff"]);
                ctx.fillStyle=rainColor;
                ctx.fill();
                ctx.closePath();
            }
        }
        class RainDay {
            constructor(){
                this.ctx=ctx;
                this.w=width;
                this.h=height;
                var bgColor= this.ctx.createLinearGradient(this.w/2,0,this.w/2,this.h);
                Tutil.addColor(bgColor,[0,"#b0b4b9"],[0.2,"#b9d9f8"],[0.9,"#caddf0"],[1,"#7dd8f4"]);
                this.bgColor=bgColor;
            }
            bgc(){
                this.ctx.clearRect(0,0,this.w,this.h);
                this.ctx.fillStyle=this.bgColor;
                this.ctx.fillRect(0,0,this.w,this.h);
            }
        };
        return {
            start() {
                Doing.Day=new RainDay();
//                Doing.run();return ;
                var _this=this;
                ! function animate() {
                    Doing.run();
                    _this._r = requestAnimationFrame(animate);
                }();
                this.started=true;
                return this;
            },
            stop(){
                cancelAnimationFrame(this._r);
                 this.started=false;
            }
        };
    };
}();