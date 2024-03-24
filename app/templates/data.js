import { TrackedArray } from 'tracked-built-ins';
import { tracked } from '@glimmer/tracking';

export const maxX = 10;
export const maxY = 10;

export const board = new TrackedArray();

export class Cell {
  #x;
  #y;

  constructor(x, y) {
    this.#x = x;
    this.#y = y;
  }

  @tracked alive = false;

  toggle = () => (this.alive = !this.alive);

  get label() {
    return `${this.#x} x ${this.#y}`;
  }

  #neighbors = [];

  /**
   * There are up to 8 neighbors
   *
   * a | b | C
   * d |   | e
   * f | g | h
   *
   *
   * x-1,y-1 |  x,y-1 | x+1,y-1
   * x-1,y   |  x,y   | x+1,y
   * x-1,y+1 |  x,y+1 | x+1,y+1
   */
  get neighbors() {
    if (this.#neighbors.length) {
      return this.neighbors;
    }

    let prevX = this.#x - 1;
    let prevY = this.#y - 1;
    let nextX = this.#x + 1;
    let nextY = this.#y + 1;

    if (prevY >= 0) {
      this.#neighbors.push(board[prevY][this.#x]);
    }
    if (nextY < maxY) {
      this.neighbors.push(board[nextY][this.#x]);
    }
    if (prevX >= 0) {
      this.#neighbors.push(board[this.#y][prevX]);
    }
    if (nextX < maxX) {
      this.#neighbors.push(board[this.#y][prevX]);
    }

    if (prevX >= 0) {
      if (prevY >= 0) {
        this.#neighbors.push(board[prevY][prevX]);
      }

      if (nextY < maxY) {
        this.neighbors.push(board[nextY][prevX]);
      }
    }

    if (nextX < maxX) {
      if (prevY >= 0) {
        this.#neighbors.push(board[prevY][nextX]);
      }

      if (nextY < maxY) {
        this.#neighbors.push(board[nextY][nextX]);
      }
    }

    return this.#neighbors;
  }
}
