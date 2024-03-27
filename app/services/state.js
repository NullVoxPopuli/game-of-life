import Service from '@ember/service';
import { TrackedArray } from 'tracked-built-ins';
import { tracked } from '@glimmer/tracking';
import { Board } from './board';

// Yes, state can be this easy!
export default class State extends Service {
  @tracked maxY = 5;
  @tracked maxX = 5;
  @tracked _board;

  history = new TrackedArray();

  // non-component prop-drilling
  addShape = (...args) => this._board.addShape(...args);
  hasShape = (...args) => this._board.hasShape(...args);
  shapeAt = (...args) => this._board.shapeAt(...args);
  hasAnyShape = () => this._board.hasAnyShape();
  asJSON = () => this._board.toJSON();

  get board() {
    return this._board.state;
  }

  get isStable() {
    return this._board.equals(this.previous);
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

  createBoard = (x, y) => {
    this.maxX = x;
    this.maxY = y;
    this._board = new Board(x, y, this);
  };

  reset = () => {
    this.history.length = 0;
    this.createBoard(this.maxX, this.maxY);
  };

  #snapshot = () => {
    let current = this._board.toJSON();

    this._board.clearManuallySet();

    // this is now "previous"
    this.history.push(current);

    // Removes oldest snapshot (to keep memory under control)
    // It's possible 20 is too small, these *are* just JSON objects
    if (this.history.length > 20) {
      this.history.unshift();
    }
  };
}
