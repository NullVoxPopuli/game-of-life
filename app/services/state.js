import Service from '@ember/service';
import { TrackedArray } from 'tracked-built-ins';
import { tracked } from '@glimmer/tracking';
import { createBoard } from './helpers';

// Yes, state can be this easy!
export default class State extends Service {
  @tracked maxY = 20;
  @tracked maxX = 20;

  @tracked showHistory = false;

  history = new TrackedArray();

  #board;

  get board() {
    return this.#board.state;
  }

  addShape = (...args) => this.#board.addShape(...args);

  get previous() {
    return this.history.at(-1);
  }

  previewCell = (x, y) => {
    return this.previous?.[y]?.[x];
  };

  passTime = () => {
    this.snapshot();
  };

  toggleHistory = () => (this.showHistory = !this.showHistory);

  createBoard = () => {
    this.#board = new Board(this.maxX, this.maxY, this);
  };

  snapshot = () => {
    let current = this.#board.toJSON();

    // this is now "previous"
    this.history.push(current);
  };
}

class Board {
  constructor(width, height, state) {
    this.state = createBoard({ width, height, state });
  }

  at = (x, y) => this.state[y][x];

  addShape = ({ shape, at }) => {
    for (let y = 0; y < shape.length; y++) {
      let row = shape[y];
      for (let x = 0; x < row.length; x++) {
        let value = row[x];
        this.state[at.y + y][at.x + x].alive = Boolean(value);
      }
    }
  };

  toJSON() {
    return this.state.map((row) => row.map((cell) => cell.toJSON()));
  }
}
