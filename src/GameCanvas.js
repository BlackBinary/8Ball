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
  let theta = Math.atan2(dy, dx); // range (-PI, PI]
  theta *= 180 / Math.PI; // rads to degs, range (-180, 180]
  // if (theta < 0) theta = 360 + theta; // range [0, 360)
  return theta;
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
      .map(([x, y, color]) => {
        const ball = new Ball(this.ctx, x, y);
        console.log(color);
        ball.setColor(color || '#000');
        return ball;
      });

    setInterval(() => {
      this.ctx.shadowBlur = 0;
      this.ctx.shadowColor = '';
      this.table = new Table(this.ctx);
      this.balls = this.balls.map(({ x, y, color }) => {
        const ball = new Ball(this.ctx, x, y);
        ball.setColor(color);
        // ball.x += 1;
        // ball.y += 1;
        return ball;
      });

      if (DEBUG) {
        this.ballTest = new Ball(this.ctx, this.mouseX, this.mouseY);
        this.ballTest.setColor('#000');
        this.balls.forEach((ball) => {
          if (ball.colission(this.ballTest)) {
            this.ballTest.setColor('#FF3300');
            console.log(angle(this.ballTest, ball));
            this.ctx.beginPath();
            this.ctx.moveTo(this.ballTest.x, this.ballTest.y);
            this.ctx.lineTo(ball.x, ball.y);
            this.ctx.stroke();
            this.ctx.closePath();
          }
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
        if (DEBUG && this.ballTest.colission(pocket)) {
          pocket.setColor('#ffffff');
          this.ballTest.setColor('#ffffff');
        }
        return pocket;
      });
      if (DEBUG) {
        this.ctx.font = '30px Arial';
        this.ctx.fillText(`${this.mouseX}, ${this.mouseY}`, 300, 200);
      }
    }, DEBUG ? FPS_MS * 2 : FPS_MS);

    return canvas;
  }
}
