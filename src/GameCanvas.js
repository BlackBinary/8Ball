/* eslint-disable max-classes-per-file */
// https://www.dimensions.com/element/9-foot-billiards-pool-table
// Inch * 10
import Pocket from './Pocket';
import Ball, { BALL_RADIUS } from './Ball';

const CANVAS_WIDTH = 1140;
const CANVAS_HEIGHT = 640;

const CUSHION_SIZE = 20;
const RAIL_SIZE = 50;

const SLATE_OFFSET = CUSHION_SIZE + RAIL_SIZE;
const SLATE_WIDTH = CANVAS_WIDTH - (SLATE_OFFSET * 2);
const SLATE_HEIGHT = CANVAS_HEIGHT - (SLATE_OFFSET * 2);

const POCKET_OFFSET = 50;

const POCKETS = [
  [CANVAS_WIDTH / 2, POCKET_OFFSET],
  [CANVAS_WIDTH / 2, CANVAS_HEIGHT - POCKET_OFFSET],
  [POCKET_OFFSET, POCKET_OFFSET],
  [POCKET_OFFSET, CANVAS_HEIGHT - POCKET_OFFSET],
  [CANVAS_WIDTH - POCKET_OFFSET, POCKET_OFFSET],
  [CANVAS_WIDTH - POCKET_OFFSET, CANVAS_HEIGHT - POCKET_OFFSET],
];

const APEX_X = (CANVAS_WIDTH / 2) + 100;
const APEX_Y = CANVAS_HEIGHT / 2;
const WHITE_X = (CANVAS_WIDTH / 2) - 200;

const FPS = 60;
const FPS_MS = 1000 / FPS;

const DEBUG = true;

class Table {
  constructor(ctx) {
    // Rail
    ctx.beginPath();
    ctx.fillStyle = '#593a27';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    ctx.stroke();
    // Cushion
    ctx.beginPath();
    ctx.fillStyle = '#042B01';
    ctx.fillRect(
      (CANVAS_WIDTH - SLATE_WIDTH - CUSHION_SIZE) / 2,
      (CANVAS_HEIGHT - SLATE_HEIGHT - CUSHION_SIZE) / 2,
      SLATE_WIDTH + CUSHION_SIZE,
      SLATE_HEIGHT + CUSHION_SIZE,
    );
    ctx.stroke();
    ctx.closePath();
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
    ctx.closePath();
  }
}

function angle(a, e) {
  const dy = e.y - a.y;
  const dx = e.x - a.x;
  const theta = Math.atan2(dy, dx); // range (-PI, PI]
  // theta *= 180 / Math.PI; // rads to degs, range (-180, 180]
  // if (theta < 0) theta = 360 + theta; // range [0, 360)
  return theta;
}

function distance(d, e) {
  const a = e.x - d.x;
  const b = e.y - d.y;

  return Math.sqrt(a * a + b * b);
}

export default class GameCanvas {
  constructor() {
    const canvas = document.createElement('canvas');

    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;

    this.ctx = canvas.getContext('2d');

    this.table = new Table(this.ctx, this.pockets);
    this.mouse = { x: 0, y: 0 };

    canvas.addEventListener('mousemove', (e) => {
      this.cRect = canvas.getBoundingClientRect();
      this.mouse = {
        x: Math.round(e.clientX - this.cRect.left),
        y: Math.round(e.clientY - this.cRect.top),
      };
    });

    this.mouseDown = [0, 0, false];

    canvas.addEventListener('mousedown', (e) => {
      this.mouseDown = {
        x: Math.round(e.clientX - this.cRect.left),
        y: Math.round(e.clientY - this.cRect.top),
        down: true,
      };
    });

    canvas.addEventListener('mouseup', (e) => {
      this.mouseDown = { x: 0, y: 0, down: false };
    });

    const f = 1.7;

    const ballTypes = {
      white: ['white', false, false],
      one: ['yellow', false, 1],
      two: ['blue', false, 2],
      three: ['red', false, 3],
      four: ['purple', false, 4],
      five: ['orange', false, 5],
      six: ['green', false, 6],
      seven: ['brown', false, 7],
      eight: ['black', false, 8],
      nine: ['yellow', true, 9],
      ten: ['blue', true, 10],
      eleven: ['red', true, 11],
      twelfe: ['purple', true, 12],
      thirteen: ['orange', true, 13],
      fourteen: ['green', true, 14],
      fifteen: ['brown', true, 15],
    };

    const ballsOrder = Object.keys(ballTypes);
    ballsOrder.splice(0, 2);
    ballsOrder.sort(() => 0.5 - Math.random());

    this.balls = [
      // WHITE
      [WHITE_X, APEX_Y, ...ballTypes.white], // Always white
      // ROW 1
      [APEX_X, APEX_Y, ...ballTypes.one], // Always one
      // ROW 2
      [APEX_X + (BALL_RADIUS * f), APEX_Y - BALL_RADIUS],
      [APEX_X + (BALL_RADIUS * f), APEX_Y + BALL_RADIUS],
      // ROW 3
      [APEX_X + (BALL_RADIUS * (f * 2)), APEX_Y],
      [APEX_X + (BALL_RADIUS * (f * 2)), APEX_Y - (BALL_RADIUS * 2)],
      [APEX_X + (BALL_RADIUS * (f * 2)), APEX_Y + (BALL_RADIUS * 2)],
      // ROW 4
      [APEX_X + (BALL_RADIUS * (f * 3)), APEX_Y - BALL_RADIUS],
      [APEX_X + (BALL_RADIUS * (f * 3)), APEX_Y + BALL_RADIUS],
      [APEX_X + (BALL_RADIUS * (f * 3)), APEX_Y - (BALL_RADIUS * 3)],
      [APEX_X + (BALL_RADIUS * (f * 3)), APEX_Y + (BALL_RADIUS * 3)],
    ];

    this.balls = this.balls
      .map((ball, index) => [
        ...ball,
        ...ballTypes[ballsOrder[index]],
      ])
      .map(([x, y, color, stripe, name]) => {
        const ball = new Ball(this.ctx, x, y);
        ball.setColor(color || '#000');
        ball.setStripe(stripe);
        ball.setName(name);
        return ball;
      });

    this.dragDistance = 0;

    setInterval(() => {
      this.ctx.shadowBlur = 0;
      this.ctx.shadowColor = '';
      this.table = new Table(this.ctx);
      this.balls = this.balls.map(({ x, y, color }) => {
        const ball = new Ball(this.ctx, x, y);
        ball.setColor(color);
        ball.setName();
        return ball;
      });

      const distanceToWhite = distance(this.mouse, this.balls[0]);
      const angleToWhite = angle(this.mouse, this.balls[0]);

      const lineEndX = this.balls[0].x + distanceToWhite * Math.cos(angleToWhite);
      const lineEndY = this.balls[0].y + distanceToWhite * Math.sin(angleToWhite);

      if (this.mouseDown.down) {
        this.dragDistance = distance(this.mouse, this.mouseDown);
        this.balls[0].x = lineEndX;
        this.balls[0].y = lineEndY;
        this.dragDistance = 0;
      }

      if (DEBUG) {
        this.ctx.beginPath();
        this.ctx.moveTo(this.mouse.x, this.mouse.y);
        this.ctx.lineTo(this.balls[0].x, this.balls[0].y);

        this.ctx.lineTo(lineEndX, lineEndY);

        this.ctx.stroke();
        this.ctx.closePath();
        this.balls.forEach((ball1) => {
          this.balls.forEach((ball2) => {
            if (ball1 !== ball2) {
              if (ball1.colission(ball2)) {
                // console.log(ball1, ball2);
              }
            }
          });
        });
      }
      // console.log(this.balls);
      this.pockets = POCKETS.map(([x, y]) => {
        const pocket = new Pocket(this.ctx, x, y);
        pocket.setColor('#000');
        this.balls.forEach((ball) => {
          if (ball.colission(pocket)) {
            pocket.setColor('#ffffff');
            ball.setColor('#ffffff');
          }
        });
        return pocket;
      });
      if (DEBUG) {
        this.ctx.font = '30px Arial';
        this.ctx.fillText(`${this.mouse.x}, ${this.mouse.y}`, 300, 200);
      }
    }, DEBUG ? FPS_MS * 2 : FPS_MS);

    return canvas;
  }
}
