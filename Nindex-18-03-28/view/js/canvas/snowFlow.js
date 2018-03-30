/**雪花展览*/
var SnowFlow=function () {
    return function (container) {
        var {Int,Float} = Tutil;
        var {ctx,height,width} =Tutil.getCanvas(container);
        var randomNUM = Tutil.Random;
        if(!ctx){
            return {start(){},stop(){}};
           }
        /**启动绘图*/
        var Doing = {
            run() {
                this.Day.bgc();
                if(this.count<150){
                    setTimeout(() => {
                        new Snow();
                        this.count++;
                    }, 200); // new Snow();
                  }
                  this.snows.forEach(si=>{
                      si.flow();
                  });
            },
            snows: new Set(),
            count:0,
            color:"rgba(33, 222, 247, 0.86)",
            drawSnow(_arc){
                ctx.strokeStyle="#fff";
                ctx.lineCap="round";
                ctx.lineJoin="bevel";
                var degs=[30,90,150,210,270,330];
                var points=_arc.getPoints(...degs);
                this.snowLine(points);//画中心的花
                points.forEach(i=>{//循环画每个角上的花.
                    let _arci=Tutil.Arc(i.x,i.y,_arc.r/2.2);
                    let ipoints=_arci.getPoints(...degs);
                    this.snowLine(ipoints);
                });
            },
            /**画雪花上的线条*/
            snowLine(points){
                var _start=points.slice(0,points.length/2);
                var _stop=points.slice(points.length/2,points.length);
                for(let i=0;i<_start.length;i++){
                    var _=_start[i],__=_stop[i];
                    ctx.save();
                    ctx.moveTo(_.x,_.y);//连接对角线.
                    ctx.lineTo(__.x,__.y);
                    ctx.stroke();
                    ctx.restore();
                }
            }
        };
        class Snow{
            constructor(){
                this.x=randomNUM(5,width*1.3);
                this.y=-1;
                this.radius=randomNUM(2,5);
                this.speed=randomNUM(3,7);
                this.draw();
                Doing.snows.add(this);
            }
            flow(){
                this.x-=1;
                this.y+=this.speed;
                if(this.y>(height-20)){
                   this.melt();
                }else{
                    this.draw();
                }
            }
            melt(){
                ctx.beginPath();
                ctx.fillStyle=Doing.color;
                ctx.arc(this.x,this.y-this.radius*1.5,this.radius,0,2*Math.PI);
                ctx.fill();
                Doing.snows.delete(this);
                for(let i=0;i<randomNUM(1,2);i++){
                    new Snow();
                }
            }
            draw(){
                ctx.beginPath();
                var _arc=Tutil.Arc(this.x,this.y,this.radius*2.5);
                Doing.drawSnow(_arc);
                ctx.closePath();
            }
        }
        class SnowDay {
            constructor(){
                this.ctx=ctx;
                this.w=width;
                this.h=height;
                var bgColor= this.ctx.createLinearGradient(this.w/2,0,this.w/2,this.h);
                Tutil.addColor(bgColor,[0,"#cbd1d8"],[0.2,"#caddf0"],[0.8,"#caddf0"],[1,"#7dd8f4"]);
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
                Doing.Day=new SnowDay();
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