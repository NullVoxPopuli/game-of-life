import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class extends Route {
  @service state;

  beforeModel() {
    this.state.createBoard();

    this.state.addShape({
      shape: [
        [0, 1, 0],
        [1, 1, 1],
      ],
      at: { x: 10, y: 10 },
    });
  }
}
