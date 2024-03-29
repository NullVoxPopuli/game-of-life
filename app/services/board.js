import { createBoard, createRow, setCoordinates } from './helpers';
import { Cell } from './cell';

import { compressToEncodedURIComponent, decompressFromEncodedURIComponent } from 'lz-string';

export class Board {
  #stateService;

  constructor(width, height, stateService) {
    this.#stateService = stateService;
    this.state = createBoard({ width, height, state: stateService });
  }

  get width() {
    return this.state[0].length;
  }

  get height() {
    return this.state.length;
  }

  at = (x, y) => this.state[y][x];

  growLeft = () => {
    for (let y = 0; y < this.state.length; y++) {
      let row = this.state[y];

      let cell = new Cell(NaN, y, this.#stateService);
      row.unshift(cell);
    }
    this.updateCoordinates();
  };

  growRight = () => {
    for (let y = 0; y < this.state.length; y++) {
      let row = this.state[y];

      let cell = new Cell(NaN, y, this.#stateService);
      row.push(cell);
    }
    this.updateCoordinates();
  };

  growUp = () => {
    this.state.unshift(createRow({ width: this.width, state: this.#stateService }));
    this.updateCoordinates();
  };

  growDown = () => {
    this.state.push(createRow({ width: this.width, state: this.#stateService }));
    this.updateCoordinates();
  };
  shrinkLeft = () => {
    for (let y = 0; y < this.state.length; y++) {
      this.state[y].shift();
    }
  };
  shrinkRight = () => {
    for (let y = 0; y < this.state.length; y++) {
      this.state[y].pop();
    }
  };
  shrinkDown = () => {
    this.state.pop();
    this.updateCoordinates();
  };
  shrinkUp = () => {
    this.state.shift();
    this.updateCoordinates();
  };

  updateCoordinates = () => setCoordinates(this.state);

  addShape = ({ shape, at }) => {
    for (let y = 0; y < shape.length; y++) {
      let row = shape[y];
      for (let x = 0; x < row.length; x++) {
        let value = row[x];
        this.state[at.y + y][at.x + x].alive = Boolean(value);
      }
    }
  };

  hasAnyShape = () => {
    let result = false;

    this.eachCell(({ cell }) => {
      if (cell.alive) {
        result = true;
      }
    });

    return result;
  };

  getSeed = () => {
    let result = { x: [], y: [] };

    this.eachCell(({ x, y, cell }) => {
      if (cell.alive) {
        result.x.push(x);
        result.y.push(y);
      }
    });

    let json = JSON.stringify(result);
    return compressToEncodedURIComponent(json);
  };

  restoreSeed = (seed) => {
    let coords = { x: [], y: [] };

    try {
      let json = decompressFromEncodedURIComponent(seed);
      coords = JSON.parse(json);
    } catch (e) {
      // TODO: toast messages
      console.error(e);
      return;
    }

    if (coords.x.length !== coords.y.length) {
      console.error(`X's and Y's are of different length`);
      return;
    }

    for (let i = 0; i < coords.x.length; i++) {
      let x = coords.x[i];
      let y = coords.y[i];

      this.state[y][x].alive = true;
    }
  };

  eachCell = (callback) => {
    for (let y = 0; y < this.state.length; y++) {
      let row = this.state[y];
      for (let x = 0; x < row.length; x++) {
        let cell = row[x];

        callback({ x, y, cell });
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

  clear = () => {
    this.eachCell(({ cell }) => (cell.alive = false));
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
