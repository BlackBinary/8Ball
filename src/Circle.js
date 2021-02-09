export default class Circle {
  constructor(x, y, radius) {
    this.x = x;
    this.y = y;
    this.radius = radius;
  }

  colission(circle) {
    const dx = circle.x - this.x;
    const dy = circle.y - this.y;
    const rSum = this.radius + circle.radius;
    return (dx * dx + dy * dy <= rSum * rSum);
  }
}
