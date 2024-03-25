import { tracked } from '@glimmer/tracking';
import { findNeighbors, ai } from './helpers';

export class Cell {
  #x;
  #y;
  #parentState;

  constructor(x, y, state) {
    this.#x = x;
    this.#y = y;
    this.#parentState = state;
  }

  toJSON() {
    return {
      alive: this.alive,
      label: this.label,
      // This state probably isn't needed,
      // as it's encoded via containing array index.
      // It may be useful for debugging if things get out of order.
      x: this.#x,
      y: this.#y,
    };
  }

  @tracked manuallySet;

  toggle = () => (this.alive = !this.alive);

  get previous() {
    return this.#parentState.previewCell(this.#x, this.#y);
  }

  get derivedAlive() {
    let previous = this.previous;

    if (!previous) {
      return this.initial;
    }

    let liveNeighbors = this.neighbors.filter((n) => n.alive).length;

    return ai(previous, liveNeighbors);
  }

  get alive() {
    if (this.manuallySet !== undefined) return this.manuallySet;

    return this.derivedAlive;
  }
  set alive(value) {
    this.manuallySet = value;
  }

  get label() {
    return `${this.#x} x ${this.#y}`;
  }

  #neighbors = [];

  /**
   * This is a compute-once getter.
   * It never needs to re-evaluate.
   */
  get neighbors() {
    if (this.#neighbors.length) {
      return this.#neighbors;
    }

    let { maxY, maxX, previous: board } = this.#parentState;

    this.#neighbors = findNeighbors({
      x: this.#x,
      y: this.#y,
      maxX,
      maxY,
      board,
    });

    return this.#neighbors;
  }
}
