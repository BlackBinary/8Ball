/* eslint-disable max-classes-per-file */
// https://www.dimensions.com/element/9-foot-billiards-pool-table
// Inch * 10
const CANVAS_WIDTH = 1140;
const CANVAS_HEIGHT = 640;

const CUSHION_SIZE = 20;
const RAIL_SIZE = 50;

const SLATE_OFFSET = CUSHION_SIZE + RAIL_SIZE;
const SLATE_WIDTH = CANVAS_WIDTH - (SLATE_OFFSET * 2);
const SLATE_HEIGHT = CANVAS_HEIGHT - (SLATE_OFFSET * 2);

const POCKET_RADIUS = 40;
const POCKET_OFFSET = 50;

const POCKETS = [
  [CANVAS_WIDTH / 2, POCKET_OFFSET],
  [CANVAS_WIDTH / 2, CANVAS_HEIGHT - POCKET_OFFSET],
  [POCKET_OFFSET, POCKET_OFFSET],
  [POCKET_OFFSET, CANVAS_HEIGHT - POCKET_OFFSET],
  [CANVAS_WIDTH - POCKET_OFFSET, POCKET_OFFSET],
  [CANVAS_WIDTH - POCKET_OFFSET, CANVAS_HEIGHT - POCKET_OFFSET],
];

const BALL_RADIUS = 20;

const FPS = 60;
const FPS_MS = 1000 / FPS;

const DEBUG = true;

class Circle {
  constructor(x, y, radius) {
    this.x = x;
    this.y = y;
    this.radius = radius;
  }
}

class Ball extends Circle {
  constructor(ctx, x, y) {
    super(x, y, BALL_RADIUS);
    ctx.beginPath();
    ctx.fillStyle = 'red';
    ctx.arc(this.x, this.y, BALL_RADIUS, 0, 2 * Math.PI);
    ctx.fill();
  }
}

class Pocket extends Circle {
  constructor(ctx, x, y) {
    super(x, y, POCKET_RADIUS);
    ctx.beginPath();
    ctx.fillStyle = '#000000';
    ctx.arc(x, y, this.radius, 0, 2 * Math.PI);
    ctx.fill();
  }
}

function colission(c1, c2) {
  const dx = c2.x - c1.x;
  const dy = c2.y - c1.y;
  const rSum = c1.radius + c2.radius;
  return (dx * dx + dy * dy <= rSum * rSum);
}

class Table {
  constructor(ctx) {
    // Rail
    ctx.beginPath();
    ctx.fillStyle = '#593a27';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    // Cushion
    ctx.beginPath();
    ctx.fillStyle = '#042B01';
    ctx.fillRect(
      (CANVAS_WIDTH - SLATE_WIDTH - CUSHION_SIZE) / 2,
      (CANVAS_HEIGHT - SLATE_HEIGHT - CUSHION_SIZE) / 2,
      SLATE_WIDTH + CUSHION_SIZE,
      SLATE_HEIGHT + CUSHION_SIZE,
    );
    // Slate
    ctx.beginPath();
    ctx.fillStyle = '#0a6c03';
    ctx.fillRect(
      (CANVAS_WIDTH - SLATE_WIDTH) / 2,
      (CANVAS_HEIGHT - SLATE_HEIGHT) / 2,
      SLATE_WIDTH,
      SLATE_HEIGHT,
    );
    ctx.stroke();
  }
}

export default class GameCanvas {
  constructor() {
    const canvas = document.createElement('canvas');

    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;

    this.ctx = canvas.getContext('2d');

    this.table = new Table(this.ctx, this.pockets);
    this.mouseX = 0;
    this.mouseY = 0;

    canvas.addEventListener('mousemove', (e) => {
      this.cRect = canvas.getBoundingClientRect();
      this.mouseX = Math.round(e.clientX - this.cRect.left);
      this.mouseY = Math.round(e.clientY - this.cRect.top);
    });

    setInterval(() => {
      this.table = new Table(this.ctx);
      this.pockets = POCKETS.map(([x, y]) => new Pocket(this.ctx, x, y));
      if (DEBUG) {
        this.ctx.font = '30px Arial';
        this.ctx.fillText(`${this.mouseX}, ${this.mouseY}`, 200, 200);
        this.ballTest = new Ball(this.ctx, this.mouseX, this.mouseY);
        this.pockets.forEach((pocket) => {
          console.log(colission(pocket, this.ballTest));
        });
      }
    }, DEBUG ? FPS_MS * 12 : FPS_MS);

    return canvas;
  }
}
