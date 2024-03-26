import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class extends Route {
  @service state;

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

    this.state.addShape({
      shape: [
        [1, 1],
        [1, 1],
      ],
      at: { x: 16, y: 16 },
    });

    this.state.addShape({
      shape: [
        [0, 1, 0],
        [0, 0, 1],
        [1, 1, 1],
      ],
      at: { x: 8, y: 0 },
    });
  }
}
