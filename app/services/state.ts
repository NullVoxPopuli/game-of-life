import Service, { service } from '@ember/service';
import { registerDestructor } from '@ember/destroyable';
import { assert } from '@ember/debug';
import { tracked } from '@glimmer/tracking';
import { Board } from 'life/util/board';
import type { BoardConfig, State } from 'life/util/types';
import type Owner from '@ember/owner';
import type { DisplayService } from 'life/services/display';

// Yes, state can be this easy!
export class StateService extends Service {
  @service declare display: DisplayService;

  @tracked _board: Board | undefined;

  @tracked previous: State.Board | undefined;

  constructor(owner: Owner) {
    super(owner);

    const handleClick = (event: Event) => {
      if (!this._board) return;

      if (event.target instanceof HTMLElement) {
        const element = event.target?.parentElement;
        if (element instanceof HTMLElement) {
          if (element.classList.contains('board')) {
            this.display.updateSeed(this._board);
          }
        }
      }
    };

    document.addEventListener('click', handleClick);

    registerDestructor(this, () => document.removeEventListener('click', handleClick));
  }

  get board() {
    assert('Cannot access _board before it is created', this._board);
    return this._board.state;
  }

  get isStable() {
    assert('Cannot access _board before it is created', this._board);
    if (!this.previous) return false;

    return this._board.equals(this.previous);
  }

  deleteHistory = () => void (this.previous = undefined);

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
    assert('Cannot access _board before it is created', this._board);

    const current = this._board.toJSON();

    this._board.clearManuallySet();

    this.previous = current;
  };
}

export default StateService;
