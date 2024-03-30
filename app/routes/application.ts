import Route from '@ember/routing/route';
import { service } from '@ember/service';

import type { StateService } from 'life/services/state';
import type { DisplayService } from 'life/services/display';

type Transition = Parameters<Route['beforeModel']>[0]

export default class extends Route {
  @service declare state: StateService;
  @service declare display: DisplayService;

  queryParams = {
    delay: { refreshModel: false },
    width: { refreshModel: false },
    height: { refreshModel: false },
    iso: { refreshModel: false },
    hideLines: { refreshModel: false },
    showHistory: { refreshModel: false },
    seed: { refreshModel: false },
  };

  beforeModel(transition: Transition) {
    const { width, height, seed, delay } = transition.to?.queryParams || {};

    this.display.setDelay(Number(delay));

    const board = this.state.restore({
      width: Number(width) || 20,
      height: Number(height) || 20,
      seed: String(seed || ''),
    });

    if (!seed) {
      board.addShape({
        shape: [
          [0, 1, 0],
          [1, 1, 1],
        ],
        at: { x: 5, y: 5 },
      });

      board.addShape({
        shape: [
          [0, 1],
          [1, 0],
          [1, 0],
        ],
        at: { x: 0, y: 16 },
      });

      // "still-life"
      board.addShape({
        shape: [
          [1, 1],
          [1, 1],
        ],
        at: { x: 16, y: 16 },
      });

      // "glider"
      board.addShape({
        shape: [
          [0, 1, 0],
          [0, 0, 1],
          [1, 1, 1],
        ],
        at: { x: 8, y: 0 },
      });

      // Acorn
      board.addShape({
        shape: [
          [0, 1, 0, 0, 0, 0, 0],
          [0, 0, 0, 1, 0, 0, 0],
          [1, 1, 0, 0, 1, 1, 1],
        ],
        at: { x: 7, y: 10 },
      });
    }
  }
}
