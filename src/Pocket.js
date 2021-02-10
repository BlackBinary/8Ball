import Circle from './Circle';

export const POCKET_RADIUS = 40;

export default class Pocket extends Circle {
  constructor(ctx, x, y) {
    super(x, y, POCKET_RADIUS);
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
