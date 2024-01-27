'use strict';

const BALLS_COUNT = 100;
const SPEED_MIN = 100 / 1000; // px/ms (px/s / 1000)
const SPEED_MAX = 500 / 1000; // px/ms (px/s / 1000)

const WIDTH = 500;
const HEIGHT = 500;
const BALL_RADIUS = 5;

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.width = WIDTH;
canvas.style.width = WIDTH + 'px';
canvas.height = HEIGHT;
canvas.style.height = HEIGHT + 'px';


class Ball {

    /** @type {number} */ x;
    /** @type {number} */ y;
    /** @type {number} */ speedX;
    /** @type {number} */ speedY;
    /** @type {number} */ lastTimePoint;
    /** @type {string} */ color;


    /**
     * @param {number} speed px / ms
     * @param {number} angle in radians. between vector and X direction
     */
    constructor(x, y, speed, angle, color) {
        this.color = color;
        this.x = x;
        this.y = y;
        this.speedX = speed * Math.cos(angle);
        this.speedY = speed * Math.sin(angle);
        this.lastTimePoint = Date.now();
    };

    nextTick() {
        const newTime = Date.now();
        const deltaTime = newTime - this.lastTimePoint;
        this.lastTimePoint = newTime;

        let newX = this.x + deltaTime * this.speedX;
        let newY = this.y + deltaTime * this.speedY;

        const PADDING = BALL_RADIUS / 2;

        if (newX < PADDING) {
            this.speedX *= -1;
            newX = 2 * PADDING - newX;
            // newX = PADDING - newX + PADDING;
        } else if (newX > WIDTH - PADDING) {
            this.speedX *= -1;
            newX = 2 * (WIDTH - PADDING) - newX;
            // newX = WIDTH - PADDING - (newX - (WIDTH - PADDING));
        }

        if (newY < PADDING) {
            this.speedY *= -1;
            newY = 2 * PADDING - newY;
            // newY = PADDING - newY + PADDING;
        } else if (newY > HEIGHT - PADDING) {
            this.speedY *= -1;
            newY = 2 * (HEIGHT - PADDING) - newY;
            // newY = HEIGHT - PADDING - (newY - (HEIGHT - PADDING));
        }

        this.x = newX;
        this.y = newY;
    };

    draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, BALL_RADIUS, 0, 2 * Math.PI);
        ctx.fill();
    }
}

/** @type {Ball[]} */
const balls = [];

function generateBalls() {
    for (let i = 0; i < BALLS_COUNT; i++) {
        const x = Math.round(Math.random() * WIDTH);
        const y = Math.round(Math.random() * HEIGHT);
        const speed = map(Math.random(), 0, 1, SPEED_MIN, SPEED_MAX);
        const angle = Math.random() * 2 * Math.PI;
        const color = `hsl(${(Math.random() * 360)}, 100%, 50%)`;

        const ball = new Ball(x, y, speed, angle, color);
        balls.push(ball);
    }
}
generateBalls();

function onAnimationFrame(ms) {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);

    for (const ball of balls) {
        ball.nextTick();
        ball.draw();
    }

    window.requestAnimationFrame(onAnimationFrame);
} 
onAnimationFrame();

function map(num, frombottom, fromtop, tobottom, totop) {
    let a = num - frombottom;
    a *= (totop-tobottom)/(fromtop-frombottom);
    a += tobottom;
    return a;
}