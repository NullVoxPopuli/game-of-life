import { TrackedArray } from 'tracked-built-ins';
import { Cell } from './cell';

export function createBoard({ width, height, state }) {
  let board = new TrackedArray();
  for (let y = 0; y < height; y++) {
    let row = new TrackedArray();

    for (let x = 0; x < width; x++) {
      row.push(new Cell(x, y, state));
    }
    board.push(row);
  }

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
export function ai(alive, liveNeighbors) {
  if (!alive) {
    return liveNeighbors === 3;
  }

  return liveNeighbors === 2 || liveNeighbors === 3;
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
export function findNeighbors({ x, y, maxX, maxY, board }) {
  let result = [];

  let prevX = x - 1;
  let prevY = y - 1;
  let nextX = x + 1;
  let nextY = y + 1;

  if (prevY >= 0) {
    result.push(board[prevY][x]);
  }
  if (nextY < maxY) {
    result.push(board[nextY][x]);
  }
  if (prevX >= 0) {
    result.push(board[y][prevX]);
  }
  if (nextX < maxX) {
    result.push(board[y][nextX]);
  }

  if (prevX >= 0) {
    if (prevY >= 0) {
      result.push(board[prevY][prevX]);
    }

    if (nextY < maxY) {
      result.push(board[nextY][prevX]);
    }
  }

  if (nextX < maxX) {
    if (prevY >= 0) {
      result.push(board[prevY][nextX]);
    }

    if (nextY < maxY) {
      result.push(board[nextY][nextX]);
    }
  }

  return result;
}
