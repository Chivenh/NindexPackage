/**火球雨展览*/
var FireBall=function () {
    return function (container) {
        var {Int,Float} = Tutil;
        var {ctx,height,width} =Tutil.getCanvas(container);
        var randomNUM = Tutil.Random;
        if(!ctx){
            return {start(){},stop(){}};
           }
        /**启动绘图*/
        var Doing = {
            fires: new Set(),
            count: 0,
            run() {
                ctx.clearRect(0, 0, width, height);
                if (this.count < 10) {

                    this.fires.add(new Fire());
                    this.count += 1;
                }

                this.fires.forEach(fe => {

                    fe.makeFire();

                    fe.fire.forEach((f) => {

                        f.render(fe.x, fe.y);
                    });

                    if (fe.isOver) {

                        this.fires.delete(fe);
                        this.fires.add(new Fire());
                    }
                });
            }
        };
        class F {
            constructor(x, y) {
                this.initState(x, y);
            }
            initState(x, y) {
                this.x = x;
                this.y = y;
                this.vx = (Math.random() - 0.5) * 2;
                this.vy = (Math.random() - 1.5) * 4;
                this.vx = Float(this.vx);
                this.vy = Float(this.vy);
                this.opacity = 1;
                this.radius = 20;
                this.g = 0;
            }
            render(x, y) {
                this.x += this.vx;
                this.y += this.vy;
                this.x = Float(this.x);
                this.y = Float(this.y);
                this.radius -= 1;
                this.opacity -= 0.05;
                this.g += 10;

                this.draw();

                if (this.opacity <= 0 || this.radius <= 0 || this.g >= 255) {

                    this.initState(x, y);
                }
            }
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                /**创建散射状渐变颜色,和对应圆形一致*/
                var radgrad = ctx.createRadialGradient(this.x, this.y, Int(this.radius / 2), this.x, this.y, this.radius);
                radgrad.addColorStop(0, `rgba(255,${this.g },0,${this.opacity })`);
                radgrad.addColorStop(0.3, "rgb(224, 146, 97)");
                radgrad.addColorStop(0.6, "rgb(221, 111, 78)");
                radgrad.addColorStop(0.8, "rgb(227, 95, 55)");
                radgrad.addColorStop(1, "rgb(255,0,0)");
                ctx.fillStyle = radgrad;
                ctx.fill();
            }
        }
        class Fire {
            constructor() {
                this.x = randomNUM(Int(width / 3), Int(width / 5) * 6);
                this.y = 0;
                this.speedX = randomNUM(4, 12);
                this.speedY = this.speedX;
                this.fire = new Set();
                this.isOver = false;
            }
            makeFire() {
                if (!this.isOver) {

                    var f = new F(this.x, this.y);

                    this.fire.add(f);

                    this.x -= this.speedX;
                    this.y += this.speedY;
                    this.speedX += 0.07;
                    this.speedY += 0.07;
                    if (this.y >= height + 200) {
                        this.isOver = true;
                    }
                }
            }
        }

        return {
            start() {
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