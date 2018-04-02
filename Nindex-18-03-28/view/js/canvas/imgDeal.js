/**日月轮转*/
var ImgDeal=function () {
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
                this.img1={x:0,y:0,w:img1.width,h:img1.height};
                this.img2={x:0,y:0,w:img2.width,h:img2.height};
                this.bgColor="#566b80";
                this.drawImg(img1,this.img1);
            }
            bgc(){
                
            }
           getContent(){
               let imgPointsObj=Tutil.ImgPoints(ctx,this.img1,{rt:.9,fx:50});
               let imgData=imgPointsObj.getPoints();
               ctx.clearRect(0,0,this.w,this.h);
               imgPointsObj.drawByArc();
               return imgData;
           }
           drawImg(img,{x,y,w,h}){
               ctx.drawImage(img,x,y,w,h);
           }
        };
        
        let doSendImg;//Generator 对象存储.
        let sendImg= function* (content) {//Generator 方法.
            let points = content.points;
            let flag = "w",sep=100;
            while (points.length > 0) {
                let end = sep;
                if (points.length < sep) {
                    end = points.length;
                }
                yield function(){
                    let data = points.splice(0, end);
                    $.post("/canvas-img.do", {
                        name: "SunMoon1",
                        data:JSON.stringify( data),
                        flag: flag
                    }).done(function (data) {
                        doSendImg.next();
                    });
                    flag = "a";//第一次为覆写,后面的数据为追加.
                }();
            };
        };
        
        return {
            start() {
                Doing.day=new NiceDay();
                var _this=this;
                ! function animate() {
                    Doing.run();
                    _this._r = requestAnimationFrame(animate);
                }();
                this.started=true;
                setTimeout(function () {
                    var content=Doing.day.getContent();
                    $.post("/canvas.do", {
                        content: {
                            width: content.imageData.width,
                            height: content.imageData.height
                        },
                        name: "SunMoon"
                    }).done(data => {
                        console.info(data);
                    });
                    /**将图片像素信息发往服务器.*/
//                   doSendImg=sendImg(content);//分次发送数据的方法.
//                    doSendImg.next();//依次执行.
                },100);
                return this;
            },
            stop(){
                cancelAnimationFrame(this._r);
                 this.started=false;
            }
        };
    };
}();