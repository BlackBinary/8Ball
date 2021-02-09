import Circle from './Circle';

const BALL_RADIUS = 20;

export default class Ball extends Circle {
  constructor(ctx, x, y) {
    super(x, y, BALL_RADIUS);
    this.ctx = ctx;
    this.render();
  }

  setColor(color) {
    this.color = color;
    this.render();
  }

  render() {
    this.ctx.beginPath();
    this.ctx.fillStyle = this.color;
    this.ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    this.ctx.fill();
    this.ctx.closePath();
  }
}