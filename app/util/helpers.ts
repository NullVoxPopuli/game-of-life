import { assert } from '@ember/debug';
import { TrackedArray } from 'tracked-built-ins';
import { Cell } from './cell';
import type { State, ActiveBoardState, CellUtil } from 'life/util/types';

/**
 * For performance, when we are running the game,
 * we don't want to be re-calculating x/y.
 * While the game is running, we cannot change the dimensions.
 */
export function setCoordinates(boardState: ActiveBoardState) {
  for (let y = 0; y < boardState.length; y++) {
    const row = boardState[y];
    assert('[BUG]: cannot set coordinates without row', row);
    for (let x = 0; x < row.length; x++) {
      const cell = row[x] as Cell;
      assert('[BUG]: cannot set coordinates without cell', cell);
      cell.setCoordinates(x, y);
    }
  }
}

export function createRow({ width, util }: { width: number; util: CellUtil }): Cell[] {
  const row = new TrackedArray();

  for (let x = 0; x < width; x++) {
    row.push(new Cell(util));
  }

  // We don't actually care that this is tracked.
  // it *is* important, but the whole point of TrackedArray
  // at runtime is to behave like regular Arrays.
  return row as Cell[];
}

export function createBoard({
  width,
  height,
  util,
}: {
  width: number;
  height: number;
  util: CellUtil;
}): ActiveBoardState {
  const board = new TrackedArray<Cell[]>();
  for (let y = 0; y < height; y++) {
    const row = createRow({ width, util });
    board.push(row);
  }

  setCoordinates(board);

  return board;
}

/**
 *
 * From https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life
 *
 * This set of rules does not cover the full set of states
 *
 * - Any live cell with fewer than two live neighbors dies, as if by underpopulation.
 * - Any live cell with two or three live neighbors lives on to the next generation.
 * - Any live cell with more than three live neighbors dies, as if by overpopulation.
 * - Any dead cell with exactly three live neighbors becomes a live cell, as if by reproduction.
 *
 * From https://www.nytimes.com/2020/12/28/science/math-conway-game-of-life.html
 *
 * - Birth rule:
 *     An empty, or “dead,” cell with precisely three “live” neighbors (full cells) becomes live.
 * - Death rule:
 *     A live cell with zero or one neighbors dies of isolation;
 *     a live cell with four or more neighbors dies of overcrowding.
 * - Survival rule:
 *     A live cell with two or three neighbors remains alive.
 *
 * ---
 * Extracted functions can easily be unit tested in isolation
 */
export function ai(alive: boolean, liveNeighbors: number) {
  if (!alive) {
    return liveNeighbors === 3;
  }

  return alive && (liveNeighbors === 2 || liveNeighbors === 3);
}

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
 *
 * ---
 * Extracted functions can easily be unit tested in isolation
 */
export function findNeighbors({ x, y, board }: { x: number; y: number; board: State.Board }) {
  const result = [];

  assert('[BUG]: should not call findNeighbors with no rows', board[0]);

  const maxX = board[0].length;
  const maxY = board.length;

  const prevX = x - 1;
  const prevY = y - 1;
  const nextX = x + 1;
  const nextY = y + 1;

  // Lots of ! here.
  // TS doesn't have a way to, in the type system,
  // describe the size of an array, afaik
  if (prevY >= 0) {
    result.push(board[prevY]![x]);
  }
  if (nextY < maxY) {
    result.push(board[nextY]![x]);
  }
  if (prevX >= 0) {
    result.push(board[y]![prevX]);
  }
  if (nextX < maxX) {
    result.push(board[y]![nextX]);
  }

  if (prevX >= 0) {
    if (prevY >= 0) {
      result.push(board[prevY]![prevX]);
    }

    if (nextY < maxY) {
      result.push(board[nextY]![prevX]);
    }
  }

  if (nextX < maxX) {
    if (prevY >= 0) {
      result.push(board[prevY]![nextX]);
    }

    if (nextY < maxY) {
      result.push(board[nextY]![nextX]);
    }
  }

  return result as State.Cell[];
}
