var FireSpark = function () {
    return function (container) {
       
        class Spark { //爆炸火花
            constructor({color,ctx,sparks,die}, angle) {
                this.x = 0;
                this.y = 0;
                this.color = color;
                this.angle = angle;
                this.ctx = ctx;
                this.target = Tutil.Float(80 + 120 * Math.random());
                this.speed = Tutil.Float(10 + 5 * Math.random());
                this.radius = Tutil.Float(2 + 2 * Math.random());
                this.finalRadius = Tutil.Float(0.6 * this.radius);
                this.sparks = sparks;
                this.die = die;
            }
            move() {
                if (this.x < this.target) {
                    this.x += this.speed;
                    this.speed *= 0.9;
                    this.speed < 2 && (this.speed = 2);
                    this.radius *= 0.96;
                    this.radius < this.finalRadius && (this.radius = this.finalRadius);
                } else {
                    this.sparks.delete(this);
                    !this.sparks.size && this.die();
                }
            }

            draw() {
                this.ctx.save();
                this.ctx.rotate(this.angle);
                this.ctx.fillStyle = this.color;
                this.ctx.beginPath();
                this.ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
                this.ctx.fill();
                this.ctx.restore();
            }
        }

        class TextPoint { //文字点
            constructor({ctx,color,sparks,die}, {x,y}) {
                this.ctx = ctx;
                this.x = x/2;
                this.y = y/2;
                this.color = color;
                this.sparks = sparks;
                this.die = die;
                this.count = 0;
            }

            move() {
                if (this.count < 50) { //绘制次数
                    this.count++;
                } else {
                    this.sparks.delete(this);
                    !this.sparks.size && this.die();
                }
            }

            draw() {
                this.ctx.fillStyle = this.color;
                this.ctx.fillRect(this.x * (1 - Math.pow(0.81, this.count)), this.y * (1 - Math.pow(0.81, this.count)), .9, .9);
            }
        }

        class Fireworks { //烟花
            constructor({canvas,ctx,ocanvas,octx}) {
                this.ctx = ctx;
                this.ocanvas = ocanvas;
                this.octx = octx;
                this.x = (Math.random()*8/10) * canvas.width;
                this.y = 0;
                this.speed = 10 + 10 * Math.random();
                this.targetY = (.8 + Math.random()) / 2 * canvas.height; //爆炸高度
                this.radius = 2 + 2 * Math.random();
                this.color = '#' + (0xf7f2a6 * Math.random() | 0).toString(16).padStart(6, '0');
                this.sparks = new Set(); //爆炸火花
                this.die = () => {
                    this.dead = true;
                };
            }

            rise() { //烟花上升
                if (this.y < this.targetY) {
                    this.y += this.speed;
                    this.speed *= 0.98;
                    this.speed < 6 && (this.speed = 6);
                }

                if (this.y >= this.targetY) {
                    if (!this.sparks.size) { //爆炸，添加火花
                        if (Math.random() < 0.4) { //祝福文字
                            this.getTextPoints().forEach(function (point) {
                                this.sparks.add(new TextPoint(this, point));
                            }, this);
                        } else {
                            let num = 30 + parseInt(40 * Math.random()), //火花数
                                i = num;

                            while (i--) {
                                this.sparks.add(new Spark(this, 2 * Math.PI * i / num));
                            }
                        }
                    } else { //已经爆炸了，移除爆炸火花
                        this.sparks.forEach(spark => spark.move());
                    }
                }
            }

            draw() {
                if (this.y < this.targetY) { //绘制上升的烟花
                    this.ctx.fillStyle = this.color;
                    this.ctx.beginPath();
                    this.ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
                    this.ctx.fill();
                } else { //绘制爆炸火花
                    this.ctx.save();
                    this.ctx.translate(this.x, this.y);
                    this.ctx.scale(1, -1);
                    this.sparks.forEach(spark => spark.draw());
                    this.ctx.restore();
                }
            }

            getTextPoints() { //获取文字点的数据
                let points = [],imageData,x = this.ocanvas.width / 2,y = this.ocanvas.height / 2;

                this.octx.clearRect(0, 0, this.ocanvas.width, this.ocanvas.height);
                this.octx.font = "100px 宋体 bold";
                this.octx.textAlign = 'center';
                this.octx.textBaseline = 'middle';
                this.octx.fillStyle = 'rgba(255,255,255,1)';
                this.octx.fillText(['HAPPY NEW YEAR', '狗年大吉', '万事如意', '飞黄腾达', '财源广进'][Math.random() * 5 | 0], x, y);
                imageData = this.octx.getImageData(0, 0, this.ocanvas.width, this.ocanvas.height);
                for (let j = 0; j < imageData.height; j += 2) {
                    for (let i = 0; i < imageData.width; i += 2) {
                        let index = (j * imageData.width + i) * 4;

                        if (imageData.data[index + 3]) { //非完全透明的点
                            points.push({
                                x: i - x,
                                y: j - y
                            });
                        }
                    }
                }

                return points;
            }
        }

        let page = {
            init() {
                this.canvas = document.querySelector(container);
                this.$canvas=$(container);
                this.ctx = this.canvas.getContext('2d');
                this.ocanvas = document.createElement('canvas'); //创建离屏的canvas
                this.ocanvas.width = 130;
                this.ocanvas.height = 120;
                this.octx = this.ocanvas.getContext('2d');
                this.fireworks = new Set();
                this.addEventListener();
                this.onResize();      
                setTimeout(() => this.draw(), 130);
            },
            onResize() {

                //设置canvas绘图尺寸，会重置canvas
                this.canvas.width = this.ocanvas.width = Tutil.Float(this.$canvas.width());
                this.canvas.height = this.ocanvas.height = Tutil.Float(this.$canvas.height());
                //调整canvas坐标系，以左下角为坐标原点，y轴向上
                this.ctx.scale(1, -1);
                this.ctx.translate(0, -this.canvas.clientHeight);
                //重设烟花
                this.fireworks.clear();
                for (let i = 0; i < 6; i++) {
                    this.fireworks.add(new Fireworks(this));
                }
            },
            addEventListener() {
                window.addEventListener('resize', () => this.onResize());
            },
            draw() {
                this.ctx.fillStyle = 'rgba(0,0,0,.19)';
                this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
                //绘制烟花
                this.fireworks.forEach(firework => {
                    if (firework.dead) {
                        this.fireworks.delete(firework);
                    } else {
                        firework.draw();
                        firework.rise();
                    }
                });
                //新增烟花
                Math.random() < 0.02 && this.fireworks.add(new Fireworks(this));
                requestAnimationFrame(() => this.draw());
            }
        };
        if(!$(container).length){
            return {start(){},stop(){}};
           }
        return {
            start() {
                page.init();
            },
            stop() {
                
            }
        }
    };
}();