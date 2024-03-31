// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace State {
  export interface Cell {
    alive: boolean;
  }

  export type Board = Cell[][];
}

import type { Cell } from './cell';

export type ActiveRowState = Cell[];
export type ActiveBoardState = ActiveRowState[];

export type Shape = (0 | 1)[][];
export type At = { x: number; y: number };

export interface CellUtil {
  previousCell: (x: number, y: number) => State.Cell | undefined;
  previous: State.Board | undefined;
}

export interface BoardConfig {
  width: number;
  height: number;
  seed: string;
}
