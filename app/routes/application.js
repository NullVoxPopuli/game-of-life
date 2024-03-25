import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class extends Route {
  @service state;

  beforeModel() {
    this.state.createBoard(20, 20);

    this.state.addShape({
      shape: [
        [0, 1],
        [1, 0],
        [1, 0],
      ],
      at: { x: 0, y: 0 },
    });
  }
}
