import { createBoard, createRow, setCoordinates } from './helpers';
import { assert } from '@ember/debug';
import { Cell } from './cell';
import type { CellUtil, Shape, At } from './types';

import { compressToEncodedURIComponent, decompressFromEncodedURIComponent } from 'lz-string';

export class Board {
  #util: CellUtil;

  state: Cell[][];

  constructor(width: number, height: number, util: CellUtil) {
    this.#util = util;
    this.state = createBoard({ width, height, util });
  }

  get width() {
    assert(`You may not access width before there are rows`, this.state[0]);
    return this.state[0].length;
  }

  get height() {
    return this.state.length;
  }

  at = (x: number, y: number) => this.state[y]?.[x];

  growLeft = () => {
    for (let y = 0; y < this.state.length; y++) {
      const row = this.state[y];
      assert(`Cannot grow left without a row`, row);

      const cell = new Cell(this.#util);
      row.unshift(cell);
    }
    this.updateCoordinates();
  };

  growRight = () => {
    for (let y = 0; y < this.state.length; y++) {
      const row = this.state[y];
      assert(`Cannot grow right without a row`, row);

      const cell = new Cell(this.#util);
      row.push(cell);
    }
    this.updateCoordinates();
  };

  growUp = () => {
    this.state.unshift(createRow({ width: this.width, util: this.#util }));
    this.updateCoordinates();
  };

  growDown = () => {
    this.state.push(createRow({ width: this.width, util: this.#util }));
    this.updateCoordinates();
  };
  shrinkLeft = () => {
    for (let y = 0; y < this.state.length; y++) {
      this.state[y]?.shift();
    }
    this.updateCoordinates();
  };
  shrinkRight = () => {
    for (let y = 0; y < this.state.length; y++) {
      this.state[y]?.pop();
    }
    this.updateCoordinates();
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

  addShape = ({ shape, at }: { shape: Shape; at: At }) => {
    for (let y = 0; y < shape.length; y++) {
      const row = shape[y];
      assert(`Cannot add shape without a row`, row);
      for (let x = 0; x < row.length; x++) {
        const value = row[x];
        const cell = this.state[at.y + y]?.[at.x + x];

        assert(`Cannot add shape without a cell`, cell);
        cell.alive = Boolean(value);
      }
    }
  };

  hasAnyShape = () => {
    for (let y = 0; y < this.state.length; y++) {
      const row = this.state[y];
      assert(`Cannot add shape without a row`, row);
      for (let x = 0; x < row.length; x++) {
        const cell = row[x];

        if (cell?.alive) {
          return true;
        }
      }
    }

    return false;
  };

  getSeed = () => {
    const result: { x: number[]; y: number[]} = { x: [], y: [] };

    this.eachCell(({ x, y, cell }) => {
      if (cell.alive) {
        result.x.push(x);
        result.y.push(y);
      }
    });

    const json = JSON.stringify(result);
    return compressToEncodedURIComponent(json);
  };

  restoreSeed = (seed: string) => {
    let coords: { x: number[]; y: number[]} = { x: [], y: [] };

    try {
      const json = decompressFromEncodedURIComponent(seed);
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
      const x = coords.x[i] as number;
      const y = coords.y[i] as number;

      this.state[y]![x]!.alive = true;
    }
  };

  eachCell = (callback: (options: { x: number; y: number; cell: Cell }) => void) => {
    for (let y = 0; y < this.state.length; y++) {
      const row = this.state[y];
      assert(`Cannot add shape without a row`, row);
      for (let x = 0; x < row.length; x++) {
        const cell = row[x];

        assert(`Cannot add shape without a cell`, cell);
        callback({ x, y, cell });
      }
    }
  };

  hasShape = ({ shape, at }) => {
    for (let y = 0; y < shape.length; y++) {
      const row = shape[y];
      for (let x = 0; x < row.length; x++) {
        const value = row[x];
        const alive = Boolean(value);
        const current = this.state[at.y + y]?.[at.x + x]?.alive;

        if (alive !== current) {
          return false;
        }
      }
    }

    return true;
  };

  shapeAt = ({ at, width, height }) => {
    const result = [];

    for (let y = 0; y < height; y++) {
      const row = [];

      for (let x = 0; x < width; x++) {
        const cell = this.state[at.y + y]?.[at.x + x];

        assert(`Cannot add shape without a cell`, cell);
        row.push(cell.alive ? 1 : 0);
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
      const row = anotherBoard[y];
      const ourRow = this.state[y];

      if (ourRow.length !== row.length) return false;

      for (let x = 0; x < row.length; x++) {
        const anotherCell = row[x];
        const ourCell = ourRow[x];

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

    const board = this.state;

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
