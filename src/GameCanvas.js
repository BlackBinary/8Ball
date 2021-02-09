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

const POCKET_SIZE = 30;
const CORNER_POCKET_OFFSET = 30;

class Pocket {
  constructor(context, x, y) {
    context.fillStyle = '#000000';
    context.arc(x, y, POCKET_SIZE, 0, 2 * Math.PI);
    context.stroke();
  }
}

class Slate {
  constructor(context) {
    context.fillStyle = '#042B01';
    context.fillRect(
      (CANVAS_WIDTH - SLATE_WIDTH - CUSHION_SIZE) / 2,
      (CANVAS_HEIGHT - SLATE_HEIGHT - CUSHION_SIZE) / 2,
      SLATE_WIDTH + CUSHION_SIZE,
      SLATE_HEIGHT + CUSHION_SIZE,
    );
    context.fillStyle = '#0a6c03';
    context.fillRect(
      (CANVAS_WIDTH - SLATE_WIDTH) / 2,
      (CANVAS_HEIGHT - SLATE_HEIGHT) / 2,
      SLATE_WIDTH,
      SLATE_HEIGHT,
    );
    context.stroke();
  }
}

export default class GameCanvas {
  constructor() {
    const canvas = document.createElement('canvas');

    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;

    canvas.style = 'border: 1px solid #000000;';

    this.context = canvas.getContext('2d');

    this.context.fillStyle = '#593a27';
    this.context.fillRect(0, 0, canvas.width, canvas.height);

    this.slate = new Slate(this.context);

    [
      [CANVAS_WIDTH / 2, CORNER_POCKET_OFFSET],
      [CANVAS_WIDTH / 2, CANVAS_HEIGHT - CORNER_POCKET_OFFSET],
      [CORNER_POCKET_OFFSET, CORNER_POCKET_OFFSET],
      [CORNER_POCKET_OFFSET, CANVAS_HEIGHT - CORNER_POCKET_OFFSET],
    ].map(([x, y]) => new Pocket(this.context, x, y));

    return canvas;
  }
}
