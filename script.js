// 获取画布和上下文
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// 游戏状态
let gameRunning = false;
let score = 0;
let obstacles = [];
let animationId = null;

// 科幻小猫对象
const cat = {
    x: 50,
    y: 250,
    width: 40,
    height: 40,
    velocity: 0,
    gravity: 0.6,
    jumpPower: -18,
    isJumping: false,
    
    draw() {
        // 绘制科幻小猫
        // 身体
        ctx.fillStyle = '#00ffff'; // 霓虹蓝色
        ctx.fillRect(this.x + 5, this.y + 25, 30, 15);
        // 头部
        ctx.beginPath();
        ctx.arc(this.x + 20, this.y + 15, 15, 0, Math.PI * 2);
        ctx.fill();
        // 耳朵
        ctx.beginPath();
        ctx.moveTo(this.x + 10, this.y + 5);
        ctx.lineTo(this.x + 5, this.y - 5);
        ctx.lineTo(this.x + 15, this.y + 5);
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(this.x + 30, this.y + 5);
        ctx.lineTo(this.x + 25, this.y - 5);
        ctx.lineTo(this.x + 35, this.y + 5);
        ctx.fill();
        // 眼睛 - 科幻发光效果
        ctx.fillStyle = '#ff00ff'; // 霓虹粉色
        ctx.beginPath();
        ctx.arc(this.x + 15, this.y + 12, 4, 0, Math.PI * 2);
        ctx.arc(this.x + 25, this.y + 12, 4, 0, Math.PI * 2);
        ctx.fill();
        // 眼睛高光
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(this.x + 14, this.y + 11, 1, 0, Math.PI * 2);
        ctx.arc(this.x + 24, this.y + 11, 1, 0, Math.PI * 2);
        ctx.fill();
        // 胡须 - 激光效果
        ctx.strokeStyle = '#00ff00'; // 霓虹绿色
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(this.x + 10, this.y + 18);
        ctx.lineTo(this.x, this.y + 16);
        ctx.moveTo(this.x + 10, this.y + 20);
        ctx.lineTo(this.x, this.y + 20);
        ctx.moveTo(this.x + 10, this.y + 22);
        ctx.lineTo(this.x, this.y + 24);
        ctx.moveTo(this.x + 30, this.y + 18);
        ctx.lineTo(this.x + 40, this.y + 16);
        ctx.moveTo(this.x + 30, this.y + 20);
        ctx.lineTo(this.x + 40, this.y + 20);
        ctx.moveTo(this.x + 30, this.y + 22);
        ctx.lineTo(this.x + 40, this.y + 24);
        ctx.stroke();
        // 尾巴 - 机械效果
        ctx.fillStyle = '#00ffff';
        ctx.beginPath();
        ctx.moveTo(this.x + 5, this.y + 35);
        ctx.quadraticCurveTo(this.x - 5, this.y + 40, this.x, this.y + 50);
        ctx.quadraticCurveTo(this.x + 5, this.y + 45, this.x + 10, this.y + 35);
        ctx.fill();
        // 机械细节
        ctx.fillStyle = '#333';
        ctx.fillRect(this.x + 15, this.y + 35, 10, 5);
        
        // 添加轮廓线条发光效果
        ctx.strokeStyle = '#00ffff';
        ctx.lineWidth = 2;
        ctx.shadowColor = '#00ffff';
        ctx.shadowBlur = 15;
        // 头部轮廓
        ctx.beginPath();
        ctx.arc(this.x + 20, this.y + 15, 15, 0, Math.PI * 2);
        ctx.stroke();
        // 耳朵轮廓
        ctx.beginPath();
        ctx.moveTo(this.x + 10, this.y + 5);
        ctx.lineTo(this.x + 5, this.y - 5);
        ctx.lineTo(this.x + 15, this.y + 5);
        ctx.closePath();
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(this.x + 30, this.y + 5);
        ctx.lineTo(this.x + 25, this.y - 5);
        ctx.lineTo(this.x + 35, this.y + 5);
        ctx.closePath();
        ctx.stroke();
        // 身体轮廓
        ctx.strokeRect(this.x + 5, this.y + 25, 30, 15);
        // 尾巴轮廓
        ctx.beginPath();
        ctx.moveTo(this.x + 5, this.y + 35);
        ctx.quadraticCurveTo(this.x - 5, this.y + 40, this.x, this.y + 50);
        ctx.quadraticCurveTo(this.x + 5, this.y + 45, this.x + 10, this.y + 35);
        ctx.stroke();
        ctx.shadowBlur = 0;
        
        // 发光效果
        ctx.shadowColor = '#00ffff';
        ctx.shadowBlur = 10;
        ctx.fillStyle = 'rgba(0, 255, 255, 0.5)';
        ctx.beginPath();
        ctx.arc(this.x + 20, this.y + 30, 20, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
    },
    
    update() {
        // 应用重力
        this.velocity += this.gravity;
        this.y += this.velocity;
        
        // 地面碰撞检测
        if (this.y >= 250) {
            this.y = 250;
            this.velocity = 0;
            this.isJumping = false;
        }
    },
    
    jump() {
        if (!this.isJumping) {
            this.velocity = this.jumpPower;
            this.isJumping = true;
        }
    }
};

// 科幻障碍物类
class Obstacle {
    constructor() {
        this.x = canvas.width;
        this.y = 250;
        this.width = 20;
        this.height = 40;
        this.speed = 3; // 降低速度
        this.scored = false; // 标记是否已经得分
    }
    
    draw() {
        // 绘制科幻障碍物 - 外星机器人
        ctx.fillStyle = '#ff6600'; // 橙红色
        // 主体
        ctx.fillRect(this.x, this.y - this.height, this.width, this.height);
        // 头部
        ctx.beginPath();
        ctx.arc(this.x + this.width / 2, this.y - this.height - 10, 10, 0, Math.PI * 2);
        ctx.fill();
        // 眼睛
        ctx.fillStyle = '#00ff00'; // 绿色
        ctx.beginPath();
        ctx.arc(this.x + this.width / 2 - 3, this.y - this.height - 12, 2, 0, Math.PI * 2);
        ctx.arc(this.x + this.width / 2 + 3, this.y - this.height - 12, 2, 0, Math.PI * 2);
        ctx.fill();
        // 天线
        ctx.strokeStyle = '#00ffff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(this.x + this.width / 2, this.y - this.height - 20);
        ctx.lineTo(this.x + this.width / 2, this.y - this.height - 30);
        ctx.stroke();
        // 天线顶部
        ctx.fillStyle = '#ff00ff';
        ctx.beginPath();
        ctx.arc(this.x + this.width / 2, this.y - this.height - 30, 3, 0, Math.PI * 2);
        ctx.fill();
        // 腿部
        ctx.fillStyle = '#333';
        ctx.fillRect(this.x + 5, this.y, 3, 10);
        ctx.fillRect(this.x + 12, this.y, 3, 10);
        // 发光效果
        ctx.shadowColor = '#ff6600';
        ctx.shadowBlur = 10;
        ctx.fillStyle = 'rgba(255, 102, 0, 0.3)';
        ctx.beginPath();
        ctx.arc(this.x + this.width / 2, this.y - this.height / 2, 25, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
    }
    
    update() {
        this.x -= this.speed;
    }
    
    isOffScreen() {
        return this.x < -this.width;
    }
}

// 绘制科幻背景
function drawBackground() {
    // 太空背景
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#000033');
    gradient.addColorStop(1, '#000066');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // 星星
    ctx.fillStyle = 'white';
    for (let i = 0; i < 50; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const size = Math.random() * 2;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
    }
    
    // 地面 - 金属效果
    const groundGradient = ctx.createLinearGradient(0, 290, 0, 300);
    groundGradient.addColorStop(0, '#333');
    groundGradient.addColorStop(1, '#666');
    ctx.fillStyle = groundGradient;
    ctx.fillRect(0, 290, canvas.width, 10);
    
    // 地面发光效果
    ctx.fillStyle = 'rgba(0, 255, 255, 0.3)';
    ctx.fillRect(0, 295, canvas.width, 5);
}

// 生成障碍物
function generateObstacle() {
    if (Math.random() < 0.01) { // 1%的概率生成障碍物，减少障碍物数量
        obstacles.push(new Obstacle());
    }
}

// 检测碰撞
function checkCollision() {
    for (const obstacle of obstacles) {
        if (
            cat.x < obstacle.x + obstacle.width &&
            cat.x + cat.width > obstacle.x &&
            cat.y < obstacle.y &&
            cat.y + cat.height > obstacle.y - obstacle.height
        ) {
            return true;
        }
    }
    return false;
}

// 更新游戏状态
function updateGame() {
    if (!gameRunning) return;
    
    // 更新小猫
    cat.update();
    
    // 生成障碍物
    generateObstacle();
    
    // 更新障碍物
    for (let i = obstacles.length - 1; i >= 0; i--) {
        const obstacle = obstacles[i];
        obstacle.update();
        
        // 检查小猫是否成功跳跃躲避障碍物
        if (obstacle.x + obstacle.width < cat.x && !obstacle.scored) {
            // 只有当小猫在障碍物通过时处于跳跃状态，才得分
            if (cat.y < 250) {
                score++;
                document.getElementById('score').textContent = score;
                obstacle.scored = true;
            }
        }
        
        // 移除屏幕外的障碍物
        if (obstacle.isOffScreen()) {
            obstacles.splice(i, 1);
        }
    }
    
    // 检测碰撞
    if (checkCollision()) {
        endGame();
    }
}

// 绘制游戏
function drawGame() {
    drawBackground();
    cat.draw();
    
    for (const obstacle of obstacles) {
        obstacle.draw();
    }
}

// 游戏循环
function gameLoop() {
    updateGame();
    drawGame();
    animationId = requestAnimationFrame(gameLoop);
}

// 开始游戏
function startGame() {
    gameRunning = true;
    score = 0;
    obstacles = [];
    cat.y = 250;
    cat.velocity = 0;
    document.getElementById('score').textContent = score;
    document.getElementById('gameOver').style.display = 'none';
    
    if (animationId) {
        cancelAnimationFrame(animationId);
    }
    
    gameLoop();
}

// 结束游戏
function endGame() {
    gameRunning = false;
    document.getElementById('finalScore').textContent = score;
    document.getElementById('gameOver').style.display = 'block';
    cancelAnimationFrame(animationId);
}

// 事件监听
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        if (gameRunning) {
            cat.jump();
        } else {
            // 如果游戏未运行，检查是否在开始界面
            const startScreen = document.getElementById('startScreen');
            if (startScreen.style.display === 'block') {
                startGame();
            }
        }
    }
});

// 开始按钮
document.getElementById('startButton').addEventListener('click', startGame);

// 重新开始按钮
document.getElementById('restartButton').addEventListener('click', startGame);

// 初始化游戏 - 显示开始界面
function initGame() {
    const startScreen = document.getElementById('startScreen');
    startScreen.style.display = 'block';
    gameRunning = false;
}

// 修改开始游戏函数
function startGame() {
    // 隐藏开始界面
    const startScreen = document.getElementById('startScreen');
    startScreen.style.display = 'none';
    
    gameRunning = true;
    score = 0;
    obstacles = [];
    cat.y = 250;
    cat.velocity = 0;
    document.getElementById('score').textContent = score;
    document.getElementById('gameOver').style.display = 'none';
    
    if (animationId) {
        cancelAnimationFrame(animationId);
    }
    
    gameLoop();
}

// 初始化游戏
initGame();