// 定义一个通用的 Shape 对象
class Shape {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    move(dx, dy) {
        this.x += dx;
        this.y += dy;
    }
}

// 定义 Ball 对象，继承自 Shape
class Ball extends Shape {
    constructor(x, y, color) {
        super(x, y);
        this.color = color;
        this.radius = 10; // 球的半径
        this.speed = 2; // 减慢球的速度
        this.direction = { x: Math.random() * 2 - 1, y: Math.random() * 2 - 1 }; // 随机初始方向
    }

    update() {
        // 移动球
        this.move(this.direction.x * this.speed, this.direction.y * this.speed);

        // 检查球是否碰到边界，如果是，则改变方向
        if (this.x - this.radius < 0 || this.x + this.radius > canvas.width) {
            this.direction.x *= -1;
        }
        if (this.y - this.radius < 0 || this.y + this.radius > canvas.height) {
            this.direction.y *= -1;
        }
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    }

    // 检测小球之间的碰撞
    checkCollision(ball) {
        if (distance(this, ball) < this.radius + ball.radius) {
            // 小球碰撞后随机变色
            this.color = getRandomColor();
        }
    }
}

// 定义 DemonCircle 对象，继承自 Shape
class DemonCircle extends Shape {
    constructor(x, y, color) {
        super(x, y);
        this.color = color;
        this.radius = 20; // 恶魔圈的半径
        this.speed = 5; // 恶魔圈的速度
        this.isMoving = false; // 添加一个标志位，用于判断恶魔圈是否在移动
    }

    // 固定恶魔圈的位置
    update() {
        // 如果恶魔圈在移动，则更新位置
        if (this.isMoving) {
            // 这里可以添加玩家控制的逻辑，例如根据键盘输入来移动恶魔圈
            // 为了简化，我们假设恶魔圈会自动追逐最近的球
            let targetBall = balls[0];
            for (let i = 1; i < balls.length; i++) {
                if (distance(this, balls[i]) < distance(this, targetBall)) {
                    targetBall = balls[i];
                }
            }
            let dx = targetBall.x - this.x;
            let dy = targetBall.y - this.y;
            let angle = Math.atan2(dy, dx);
            this.move(Math.cos(angle) * this.speed, Math.sin(angle) * this.speed);
        }
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    }
}

// 辅助函数：计算两个形状之间的距离
function distance(shape1, shape2) {
    let dx = shape2.x - shape1.x;
    let dy = shape2.y - shape1.y;
    return Math.sqrt(dx * dx + dy * dy);
}

// 初始化 canvas 和上下文
let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

// 初始化球和恶魔圈
let balls = [];
for (let i = 0; i < 20; i++) { // 增加小球的数量
    balls.push(new Ball(Math.random() * canvas.width, Math.random() * canvas.height, getRandomColor()));
}
let demonCircle = new DemonCircle(Math.random() * canvas.width, Math.random() * canvas.height, "black");

// 游戏循环
function gameLoop() {
    requestAnimationFrame(gameLoop);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 更新和绘制所有球
    for (let i = 0; i < balls.length; i++) {
        for (let j = i + 1; j < balls.length; j++) {
            balls[i].checkCollision(balls[j]);
        }
        balls[i].update();
        balls[i].draw(ctx);
    }

    // 更新和绘制恶魔圈
    demonCircle.update();
    demonCircle.draw(ctx);

    // 检查碰撞
    for (let i = 0; i < balls.length; i++) {
        if (distance(balls[i], demonCircle) < balls[i].radius + demonCircle.radius) {
            // 球被恶魔圈吃掉
            balls.splice(i, 1);
            i--;
        }
    }

    // 绘制计数器
    ctx.fillStyle = "black";
    ctx.font = "20px Arial";
    ctx.fillText("剩余小球：" + balls.length, 10, 30);
}

// 开始游戏循环
gameLoop();

// 添加键盘事件处理，控制恶魔圈的移动
document.addEventListener("keydown", function(event) {
    switch (event.key) {
        case "ArrowLeft":
            demonCircle.isMoving = true;
            demonCircle.move(-demonCircle.speed, 0);
            break;
        case "ArrowUp":
            demonCircle.isMoving = true;
            demonCircle.move(0, -demonCircle.speed);
            break;
        case "ArrowRight":
            demonCircle.isMoving = true;
            demonCircle.move(demonCircle.speed, 0);
            break;
        case "ArrowDown":
            demonCircle.isMoving = true;
            demonCircle.move(0, demonCircle.speed);
            break;
    }
});

// 辅助函数：生成随机颜色
function getRandomColor() {
    let letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}
