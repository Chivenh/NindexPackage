/**日月轮转*/
var ImgDeal=function () {
    return function (container) {
        var {Int,Float,Random} = Tutil;
        var {ctx,height,width} =Tutil.getCanvas(container);
        if(!ctx){
            return {start(){},stop(){}};
           }
        let colorLoop;//颜色循环绘画.
       class NiceDay {
            constructor(){
                let ocanvas=document.createElement("canvas");
                this.ow=ocanvas.width=1000;
                this.oh=ocanvas.height=1000;
                this.octx=ocanvas.getContext("2d");
                this.octx.globalCompositeOperation="lighter";
                this.ctx=ctx;
                this.ctx.globalCompositeOperation="lighter";
                this.w=width;
                this.h=height;
                var img1=document.querySelector("#img1");
                var img2=document.querySelector("#img2");
                this.img1={x:0,y:0,w:img1.width,h:img1.height,img:img1};
                this.img2={x:img1.width+1,y:0,w:img2.width,h:img2.height,img:img2};
                this.bgColor="#566b80";
                this.drawImg(img2,this.img2);
                this.drawImg(img1,this.img1);
            }
            *bgc(){
                let color=0x3b3a3a;
                let count=50;
                let x=500,y=0;
                let _cps=function _(s=[],v){
                    if(v>0){
                        return _([...s,v],--v);
                       }
                      return s; 
                }([],360);
                let _getPoints=function(...colorArc){
                    let _=[];
                    colorArc.forEach(i=>{
                        if(!i){
                            _=_.concat(false);
                            return;
                        }
                        _=_.concat(i.getPoints(..._cps));
                    });
                    return _;
                };
                let step=3,colorArcs=function _(r,s,t){
                    if(r<10){
                      return s;
                       }
                    s=s.concat(Tutil.Arc(t.width*.9*1.5+1,t.height*.9/2,r));
                    r-=step;
                    return _(r,s,t);
                }(200,[],this.img1.img);
                let arcPoints=_getPoints(...colorArcs);//获取每一个角度的坐标.
                setTimeout(()=>{
                    this.getContent();
                },100);
                let _time=new Date().getTime();
                console.time("生成耗时");
                for(let xyi in arcPoints){
                    yield setTimeout((xy)=>{
                        this.ctx.beginPath();
                        this.ctx.fillStyle='#' + color.toString(16).padStart(6, '0');
                        this.ctx.arc(xy.x,xy.y,1.3,0,2*Math.PI);
                        this.ctx.fill();
                        this.ctx.closePath();
                        color=color+205;
                        colorLoop.next();
                    },0,arcPoints[xyi]);
                }
                yield function(){console.timeEnd("生成耗时"); alert("生成耗时: "+(new Date().getTime()-_time)+" ms")}();
            }
           getContent(){
               let imgPointsObj1=Tutil.ImgPoints(this.octx,this.img1,{rt:.9,fx:10});
               let imgPointsObj2=Tutil.ImgPoints(this.octx,this.img2,{rt:.7,fx:400-this.img1.img.width*.1+25,fy:100});
               let imgData1=imgPointsObj1.getPoints();
               let imgData2=imgPointsObj2.getPoints();
               this.octx.clearRect(0,0,this.ow,this.oh);
               imgData2.points.forEach((j,index) => {
                    imgData2.points[index]=j.map((i) => {
                       if (i[0]==255&&i[1]==255&&i[2]==255&&i[3]===255){
                                i[4].color="rgba(255,255,255,0)";//将第二个图片像素中白色区域转换成透明区域.
                           }else if(i[0]==0&&i[1]==0&&i[2]==0){
                                i[4].color="rgba(48,64,134,255)";//将像素中黑色区域的颜色改为想要的颜色.
                            }
                       return i;
                   });
               });
               imgPointsObj1.drawByArc({ctx:this.ctx},true);
               imgPointsObj2.drawByArc({ctx:this.ctx,points:imgData2.points},true);
               return {};
           }
           drawImg(img,{x,y,w,h}){
               this.octx.drawImage(img,x,y,w,h);
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
                let day=new NiceDay();
                var _this=this;
                this.started=true;
//                 setTimeout(function () {
//                    var content=day.getContent();
//                    $.post("/canvas.do", {
//                        content: {
//                            width: content.imageData.width,
//                            height: content.imageData.height
//                        },
//                        name: "SunMoon"
//                    }).done(data => {
//                        console.info(data);
//                    });
//                    /**将图片像素信息发往服务器.*/
////                   doSendImg=sendImg(content);//分次发送数据的方法.
////                    doSendImg.next();//依次执行.
//                },100);
                colorLoop=day.bgc();
                colorLoop.next();
                
                return this;
            },
            stop(){
                 this.started=false;
            }
        };
    };
}();