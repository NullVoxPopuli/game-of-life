import Service, { service } from '@ember/service';
import { registerDestructor } from '@ember/destroyable';
import { TrackedArray } from 'tracked-built-ins';
import { assert } from '@ember/debug';
import { tracked } from '@glimmer/tracking';
import { Board } from 'life/util/board';
import type { BoardConfig, State } from 'life/util/types';
import type Owner from '@ember/owner';
import type { DisplayService } from 'life/services/display';

// Yes, state can be this easy!
export class StateService extends Service {
  @service declare display: DisplayService;

  history = new TrackedArray<State.Board>();

  constructor(owner: Owner) {
    super(owner);

    const handleClick = (event: Event) => {
      if (!this._board) return;

      if (event.target instanceof HTMLElement) {
        const element = event.target?.parentElement;
        if (element instanceof HTMLElement) {
          if (element.classList.contains('board')) {
            this.display.updateSeed(this.board);
          }
        }
      }
    };

    document.addEventListener('click', handleClick);

    registerDestructor(this, () => document.removeEventListener('click', handleClick));
  }

  // Set via createBoard()
  @tracked _board: Board | undefined;
  get board() {
    assert('Cannot access _board before it is created', this._board);
    return this._board;
  }

  get currentState() {
    return this.board.state;
  }

  get isStable() {
    if (!this.previous) return false;

    return this.board.equals(this.previous);
  }

  get previous() {
    return this.history.at(-1);
  }

  deleteHistory = () => void (this.history.length = 0);

  restore = (config: BoardConfig) => {
    const board = this.createBoard(config.width, config.height);

    board.restoreSeed(config.seed);

    return board;
  };

  createBoard = (x: number, y: number): Board => {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const state = this;
    return (this._board = new Board(x, y, {
      previousCell: (x: number, y: number) => this.previous?.[y]?.[x],

      get previous() {
        return state.previous;
      },
    }));
  };

  passTime = () => {
    const current = this.board.toJSON();

    this.board.clearManuallySet();

    // this is now "previous"
    this.history.push(current);

    // Removes oldest snapshot (to keep memory under control)
    // It's possible 20 is too small, these *are* just JSON objects
    if (this.history.length > 20) {
      this.history.unshift();
    }
  };
}

export default StateService;
