import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class extends Route {
  @service state;

  queryParams = {
    delay: { refreshModel: false },
    width: { refreshModel: false },
    height: { refreshModel: false },
    iso: { refreshModel: false },
    hideLines: { refreshModel: false },
    showHistory: { refreshModel: false },
    seed: { refreshModel: false },
  };

  beforeModel() {
    this.state.createBoard(20, 20);

    this.state.addShape({
      shape: [
        [0, 1, 0],
        [1, 1, 1],
      ],
      at: { x: 5, y: 5 },
    });

    this.state.addShape({
      shape: [
        [0, 1],
        [1, 0],
        [1, 0],
      ],
      at: { x: 0, y: 16 },
    });

    // "still-life"
    this.state.addShape({
      shape: [
        [1, 1],
        [1, 1],
      ],
      at: { x: 16, y: 16 },
    });

    // "glider"
    this.state.addShape({
      shape: [
        [0, 1, 0],
        [0, 0, 1],
        [1, 1, 1],
      ],
      at: { x: 8, y: 0 },
    });

    // Acorn
    this.state.addShape({
      shape: [
        [0, 1, 0, 0, 0, 0, 0],
        [0, 0, 0, 1, 0, 0, 0],
        [1, 1, 0, 0, 1, 1, 1],
      ],
      at: { x: 7, y: 10 },
    });
  }
}
