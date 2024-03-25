import Component from '@glimmer/component';
import { service } from '@ember/service';
import { pageTitle } from 'ember-page-title';
import Route from 'ember-route-template';

import { Controls } from './controls';

export default Route(
  <template>
    {{pageTitle "Game of Life"}}

    <Display />
    <Board />
    <br />
    <Controls />
  </template>
);

class Display extends Component {
  @service state;

  get isShowingHistory() {
    return this.state.showHistory;
  }

  <template>
    <div class="boards">
      <Board @board={{this.state.board}} />

      {{#if this.isShowingHistory}}
        {{#each this.state.history as |board|}}
          <Board @board={{board}} />
        {{/each}}
      {{/if}}
    </div>
  </template>
}

const not = (x) => !x;

class Board extends Component {
  @service state;

  <template>
    <div
      class="board"
      style="display: grid; grid-template-columns: repeat({{this.state.maxX}}, 1fr); grid-template-rows: repeat({{this.state.maxY}}, 1fr);"
    >
      {{#each @board as |row|}}
        {{#each row as |cell|}}
          <button
            class={{if cell.alive "alive"}}
            onclick={{cell.toggle}}
            disabled={{not cell.toggle}}
            aria-label="Cell for {{cell.label}}"
          ></button>
        {{/each}}
      {{/each}}
    </div>
  </template>
}
