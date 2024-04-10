import Route from '@ember/routing/route';
import { service } from '@ember/service';

import type { StateService } from 'life/services/state';
import type { DisplayService } from 'life/services/display';

type Transition = Parameters<Route['beforeModel']>[0];

const BUTTON_SIZE = 32; // px
const PADDING = 6; // buttons

function maxWidth() {
  return Math.floor((window.innerWidth - PADDING * BUTTON_SIZE) / BUTTON_SIZE);
}
function maxHeight() {
  return Math.floor((window.innerHeight - PADDING * BUTTON_SIZE) / BUTTON_SIZE);
}

function randomXYWithin(width: number, height: number) {
  const x = Math.round(Math.random() * width);
  const y = Math.round(Math.random() * height);
  return { x, y };
}

export default class ApplicationRoute extends Route {
  @service declare state: StateService;
  @service declare display: DisplayService;

  queryParams = {
    // We don't care about route lifecycles,
    // we do pure derived data here.
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

    this.display.setDelay(Number(delay) || 150);

    const board = this.state.restore({
      width: Number(width) || maxWidth(),
      height: Number(height) || maxHeight(),
      seed: String(seed || ''),
    });

    if (!seed) {
      board.addShape({
        shape: [
          [0, 1, 0],
          [1, 1, 1],
        ],
        at: randomXYWithin(board.width - 3, board.height - 2),
      });

      board.addShape({
        shape: [
          [0, 1],
          [1, 0],
          [1, 0],
        ],
        at: randomXYWithin(board.width - 2, board.height - 3),
      });

      // "still-life"
      board.addShape({
        shape: [
          [1, 1],
          [1, 1],
        ],
        at: randomXYWithin(board.width - 2, board.height - 2),
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
        at: randomXYWithin(board.width - 7, board.height - 3),
      });
    }
  }
}
