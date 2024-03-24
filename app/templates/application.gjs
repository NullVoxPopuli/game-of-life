import { pageTitle } from 'ember-page-title';
import Route from 'ember-route-template';
import { Cell, board, maxX, maxY } from './data';

import { TrackedArray } from 'tracked-built-ins';

export default Route(
  <template>
    {{pageTitle "Game of Life"}}

    <Board />
  </template>
);

for (let y = 0; y < maxY; y++) {
  let column = new TrackedArray();

  for (let x = 0; x < maxX; x++) {
    column.push(new Cell(x, y));
  }
  board.push(column);
}

const Board = <template>
  <div
    style="display: grid; grid-template-columns: repeat({{maxX}}, 1fr); grid-template-rows: repeat({{maxY}}, 1fr);"
  >
    {{#each board as |row|}}
      {{#each row as |cell|}}
        {{log cell}}
        <button
          class={{if cell.alive "alive"}}
          onclick={{cell.toggle}}
          aria-label="Cell for {{cell.label}}"
        ></button>
      {{/each}}
    {{/each}}
  </div>
</template>;
