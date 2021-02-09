import GameCanvas from './GameCanvas';

export default class App {
  constructor() {
    const appComponent = document.createElement('div');

    appComponent.id = 'app';

    const gameCanvas = new GameCanvas();

    appComponent.appendChild(gameCanvas);

    return appComponent;
  }
}
