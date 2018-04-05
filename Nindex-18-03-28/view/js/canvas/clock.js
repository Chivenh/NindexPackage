/** 时钟*/
let Clock=function(){
    return function(container){
       let {ctx,height,width} =Tutil.getCanvas(container);
        /** 时钟对象*/
        class _clock {
            constructor(x,y,r){
                this.ctx=ctx;
                this.x=x;
                this.y=y;
                this.r=r;
                this.second=this.minute=this.hour=0;
                let ptArc=Tutil.Arc(x,y,r-2);
                this.secondArc=Tutil.Arc(x,y,r-5);
                this.minuteArc=Tutil.Arc(x,y,r-16);
                this.hourArc=Tutil.Arc(x,y,r-30);
                this.pt1=ptArc.getPointsBatch({step:6});
                this.pt2=this.secondArc.getPointsBatch({step:6});
                this.ctx.lineJoin="round";//线交叉样式
                this.ctx.lineCap="round";//线端部样式
                /** 展示数字时间区域.*/
                this.timeArea=function(){
                    let ocanvas=document.createElement("canvas");
                    ocanvas.width=150;
                    ocanvas.height=30;
                    let octx=ocanvas.getContext("2d");
                    octx.globalCompositeOperation="lighter";
                    let _now=new Date();
                    let _nowShow=`${_now.getFullYear()}-${(_now.getMonth()+1+"").padStart(2,'0')}-${(_now.getDate()+"").padStart(2,'0')} `
                    return function(){
                        octx.clearRect(0,0,150,30);
                        octx.beginPath();
                        octx.strokeStyle="#92b1ba";
                        octx.strokeRect(0,0,150,30);
                        octx.closePath();
                        let time=new Date();
                        let nowTime=`${_nowShow}${(time.getHours()+"").padStart(2,'0')}:${(time.getMinutes()+"").padStart(2,'0')}:${(time.getSeconds()+"").padStart(2,'0')}:${(time.getMilliseconds()+"").padStart(3,'0')}`
                        octx.beginPath();
                        octx.font="17px serif";
                        octx.letterSpacing="2px";
                        octx.strokeStyle="#cbe2b5";
                        octx.strokeWidth=1;
                        octx.strokeText(nowTime,20,20,120);
                        octx.closePath();
                        let imgData=octx.getImageData(0,0,150,30);
                        this.ctx.putImageData(imgData,125,50);
                    }
                }();
                this.step();
            }
            /**绘制表盘*/
            drawPanel(){
                this.ctx.clearRect(0,0,width,height);
                this.timeArea();
                this.ctx.beginPath();
                this.ctx.fillStyle="#7d94a0";
                this.ctx.strokeStyle="#1f2f31";
                this.ctx.strokeWidth=5;
                this.ctx.arc(this.x,this.y,this.r,0,2*Math.PI);
                this.ctx.stroke();
                this.ctx.fill();
                this.ctx.closePath();
                this.ctx.beginPath();
                this.ctx.arc(this.x,this.y,10,0,2*Math.PI);
                this.ctx.fillStyle="#3d7c8b";
                this.ctx.fill();
                this.ctx.closePath();
                this.ctx.strokeStyle="#5a1018";
                this.ctx.lineWidth=2;
                this.pt1.forEach((p,index)=>{
                    let _e= this.pt2[index];
                    this.ctx.beginPath();
                    this.ctx.moveTo(p.x,p.y);
                    this.ctx.lineTo(_e.x,_e.y);
                    this.ctx.stroke();
                    this.ctx.closePath();
                });
            }
            secondStep(){
                this.ctx.strokeStyle="red";
                this.ctx.lineWidth=1.5;
                let deg=-this.second*6;
                let _s=this.secondArc.getPoint(deg);
                this.ctx.lineTo(_s.x,_s.y);
                this.second++;
                return {..._s,deg};
            }
            minuteStep(){
                this.ctx.strokeStyle="#343f4b";
                this.ctx.lineWidth=3;
                let deg=-this.minute*6;
                let _s=this.minuteArc.getPoint(deg);
                this.ctx.lineTo(_s.x,_s.y);
                this.minute+=(1/60);
                return {..._s,deg};
            }
            hourStep(){
                this.ctx.strokeStyle="#1e3109";
                this.ctx.lineWidth=5;
                let deg=-this.hour*6;
                let _s=this.hourArc.getPoint(deg);
                this.ctx.lineTo(_s.x,_s.y);
                this.hour+=(1/60/60);
                return {..._s,deg};
            }
            /** 时钟启动*/
            step(){
                this.drawPanel();
                [this.secondStep,this.minuteStep,this.hourStep].forEach((fn)=>{
                    this.before();
                    let x= fn.call(this);//得到当前摆针的参数.
                    this.after();
                    this.arrow(x);
                });
                /**重置时分秒参数,以防数字过大,时钟停摆.*/
                if(this.second>60){
                    this.second=0;
                }
                if(this.minute>60){
                    this.minute=0;
                }
                if(this.hour>12){
                    this.hour=0;
                }
            }
            before(){
                this.ctx.beginPath();
                this.ctx.moveTo(this.x,this.y);
            }
            /**摆针绘制完成*/
            after(){
                this.ctx.stroke();
                this.ctx.closePath();
            }
            /**绘制箭头*/
            arrow({x,y,deg}){
                let _deg=deg*Math.PI/180;
                this.ctx.save();
                this.ctx.translate(x,y);
                this.ctx.rotate(_deg);
                this.ctx.beginPath();
                this.ctx.moveTo(0,0);
                this.ctx.lineTo(0,3);
                this.ctx.lineTo(7,0);
                this.ctx.lineTo(0,-3);
                this.ctx.fillStyle=this.ctx.strokeStyle;
                this.ctx.fill();
                this.ctx.translate(-x,-y);
                this.ctx.rotate(-_deg);
                this.ctx.restore();
            }
        }
        
        return {
            start(){
                let miniClock=new _clock(200,200,100);
                !function step(){
                    miniClock.step();
                    setTimeout(step,10);//一秒转动一次.
                }();
            },
            stop(){
                
            }
        }
    }
}();