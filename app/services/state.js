import Service from '@ember/service';
import { TrackedArray } from 'tracked-built-ins';
import { tracked } from '@glimmer/tracking';
import { Board } from './board';

// Yes, state can be this easy!
export default class State extends Service {
  @tracked maxY = 5;
  @tracked maxX = 5;
  @tracked _board;
  @tracked showHistory = false;

  history = new TrackedArray();

  // non-component prop-drilling
  addShape = (...args) => this._board.addShape(...args);
  hasShape = (...args) => this._board.hasShape(...args);
  shapeAt = (...args) => this._board.shapeAt(...args);
  asJSON = () => this._board.toJSON();

  get board() {
    return this._board.state;
  }

  get previous() {
    return this.history.at(-1);
  }

  previewCell = (x, y) => {
    return this.previous?.[y]?.[x];
  };

  passTime = () => {
    this.#snapshot();
  };

  toggleHistory = () => (this.showHistory = !this.showHistory);

  createBoard = (x, y) => {
    this.maxX = x;
    this.maxY = y;
    this._board = new Board(x, y, this);
  };

  #snapshot = () => {
    let current = this._board.toJSON();

    this._board.clearManuallySet();

    // this is now "previous"
    this.history.push(current);
  };
}
