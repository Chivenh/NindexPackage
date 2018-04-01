/**日月轮转*/
var SunMoon=function () {
    return function (container) {
        var {Int,Float,Random} = Tutil;
        var {ctx,height,width} =Tutil.getCanvas(container);
        if(!ctx){
            return {start(){},stop(){}};
           }
        /**启动绘图*/
        var Doing = {
            run() {
                this.day.bgc();
                if(this.count<10){
                    new Soup();
                }
                this.soups.forEach(si=>si.move());
            },
            soups: new Set(),
            count: 0
        };
        class Soup {
            constructor(){
                this.x=-10;
                this.y=height-30;
                this.radius=Random(5,10)|0;
                Doing.soups.add(this);
            }
            move(){
                this.x+=2;
                if(this.x>width+this.radius){
                        this.die();
                   }else{
                       this.draw();
                   }
            }
            draw(){
//                ctx.beginPath();
            }
            die(){
                Doing.soups.delete(this);
                new Soup();
            }
        }
        
       class NiceDay {
            constructor(){
                this.ctx=ctx;
                this.w=width;
                this.h=height;
                var img1=document.querySelector("#img1");
                var img2=document.querySelector("#img2");
//                var bgColor= this.ctx.createLinearGradient(this.w/2,0,this.w/2,this.h);
//                Tutil.addColor(bgColor,[0,"#1f334d"],[0.2,"#45302b"],[0.7,"#caddf0"],[0.9,"#1a1ac9"],[1,"#0e1564"]);
                this.img1=img1;
                this.img2=img2;
                this.bgColor="#566b80";
//                ctx.drawImage(this.img1,0,0,300,300);
//                ctx.drawImage(this.img2,310,0,this.img2.width,this.img2.height);
                ctx.drawImage(this.img2,0,0,this.img2.width,this.img2.height);
            }
            bgc(){
//                this.ctx.clearRect(0,0,this.w,this.h);
//                this.ctx.rotate(2*Math.PI/20);
//                ctx.drawImage(this.img2,0,0,this.img2.width,this.img2.height);
//                this.ctx.fillStyle=this.bgColor;
//                this.ctx.fillRect(0,0,this.w,this.h);
            }
           getContent(){
                return   Tutil.getPoints(ctx,0,0,this.img2.width,this.img2.height);
//               return ctx.getImageData(0,0,this.w,this.h);
           }
        };
        return {
            start() {
                Doing.day=new NiceDay();
                console.info(Doing.day.getContent());
                var _this=this;
                ! function animate() {
                    Doing.run();
                    _this._r = requestAnimationFrame(animate);
                }();
                this.started=true;
                $.post("/canvas.do",{content:"日月轮转",name:"SunMoon"}).done(data=>{
                    console.info(data);
                });
                return this;
            },
            stop(){
                cancelAnimationFrame(this._r);
                 this.started=false;
            }
        };
    };
}();