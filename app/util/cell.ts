import { assert } from '@ember/debug';
import { tracked } from '@glimmer/tracking';
import { findNeighbors, ai } from './helpers';

import type { CellUtil, State } from './types';

export class Cell {
  #x?: number;
  #y?: number;
  #util: CellUtil;

  constructor(util: CellUtil) {
    this.#util = util;
  }

  setCoordinates(x: number, y: number) {
    this.#x = x;
    this.#y = y;
  }

  toJSON() {
    return {
      // Is there any benefit to this just being a boolean?
      // rather than an object with one property?
      alive: this.alive,
      // This state probably isn't needed,
      // as it's encoded via containing array index.
      // It may be useful for debugging if things get out of order.
      // x: this.#x,
      // y: this.#y,
    };
  }

  @tracked manuallySet?: boolean;

  toggle = () => (this.alive = !this.alive);

  get previous(): State.Cell {
    assert('[BUG]: missing x', this.#x);
    assert('[BUG]: missing y', this.#y);
    return this.#util.previousCell(this.#x, this.#y);
  }

  get alive() {
    if (this.manuallySet !== undefined) return this.manuallySet;

    return this.derivedAlive;
  }
  set alive(value) {
    this.manuallySet = value;
  }


  get derivedAlive() {
    const previous = this.previous;

    if (!previous) {
      return this.manuallySet ?? false;
    }

    const liveNeighbors = this.neighbors.filter((n) => n.alive).length;

    return ai(previous.alive, liveNeighbors);
  }

  get neighbors() {
    const { previous: board } = this.#util;

    assert('[BUG]: missing x', this.#x);
    assert('[BUG]: missing y', this.#y);


    return findNeighbors({
      x: this.#x,
      y: this.#y,
      board,
    });
  }
}
