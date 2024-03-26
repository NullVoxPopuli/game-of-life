import { createBoard } from './helpers';

export class Board {
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

  hasShape = ({ shape, at }) => {
    for (let y = 0; y < shape.length; y++) {
      let row = shape[y];
      for (let x = 0; x < row.length; x++) {
        let value = row[x];
        let alive = Boolean(value);
        let current = this.state[at.y + y][at.x + x].alive;

        if (alive !== current) {
          return false;
        }
      }
    }

    return true;
  };

  shapeAt = ({ at, width, height }) => {
    let result = [];

    for (let y = 0; y < height; y++) {
      let row = [];

      for (let x = 0; x < width; x++) {
        let value = this.state[at.y + y][at.x + x];
        row.push(value.alive ? 1 : 0);
      }

      result.push(row);
    }

    return result;
  };

  /**
   * @param {Cell[][]} anotherBoard
   */
  equals = (anotherBoard) => {
    if (!anotherBoard) return false;

    if (anotherBoard.length !== this.state.length) return false;

    for (let y = 0; y < anotherBoard.length; y++) {
      let row = anotherBoard[y];
      let ourRow = this.state[y];

      if (ourRow.length !== row.length) return false;

      for (let x = 0; x < row.length; x++) {
        let anotherCell = row[x];
        let ourCell = ourRow[x];

        if (!ourCell) return false;
        if (anotherCell.alive !== ourCell.alive) return false;
      }
    }

    return true;
  };

  clearManuallySet = () => {
    this.state.forEach((row) => row.forEach((cell) => (cell.manuallySet = undefined)));
  };

  log = () => {
    let str = '';

    let board = this.state;

    board.forEach((row) => {
      row.forEach((cell) => {
        str += ` ${cell.alive ? 1 : 0} `;
      });
      str += `\n`;
    });

    console.info(str);
  };

  toJSON() {
    return this.state.map((row) => row.map((cell) => cell.toJSON()));
  }
}
