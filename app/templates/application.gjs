import Component from '@glimmer/component';
import { service } from '@ember/service';
import { pageTitle } from 'ember-page-title';
import Route from 'ember-route-template';

import { Controls } from './controls';
import { Header } from './header';

export default Route(
  <template>
    {{pageTitle "Game of Life"}}

    <Header />

    <div class="app-container">
      <Display />
      <br />
      <footer>
        <Controls />
      </footer>
    </div>
  </template>
);

const addOne = (n) => n + 1;

let frame;
const scrollToRight = () => {
  if (frame) cancelAnimationFrame(frame);

  frame = requestAnimationFrame(() => {
    document.body.parentElement.scrollTo({
      behavior: 'smooth',
      left: document.body.scrollWidth + 1000,
    });
  });
};

class Display extends Component {
  @service state;
  @service display;

  get isShowingHistory() {
    return this.display.showHistory;
  }
  get showLines() {
    return this.display.showLines;
  }

  <template>
    <div
      class="boards
        {{if this.isShowingHistory 'showing-history'}}
        {{if this.showLines 'show-lines'}}
        "
      style="--count: {{addOne this.state.history.length}}"
    >
      {{#if this.isShowingHistory}}
        {{#each this.state.history as |board i|}}
          <Board @board={{board}} @index={{addOne i}} class="historical" />
          {{(scrollToRight)}}
        {{/each}}
      {{/if}}

      <Board @board={{this.state.board}} @index="var(--count)" />
    </div>
  </template>
}

const getRows = (board) => board.length;
const getColumns = (board) => board[0].length;

class Board extends Component {
  @service state;
  @service display;

  <template>
    <div
      class="board"
      style="
        --index: {{@index}};
        --columns: {{getColumns @board}};
        --rows: {{getRows @board}};
      "
      onauxclick={{this.display.toggleISO}}
      ...attributes
    >
      {{#each @board as |row|}}
        {{#each row as |cell|}}
          {{#if cell.toggle}}
            <button
              class={{if cell.alive "alive"}}
              onclick={{cell.toggle}}
              aria-label="Cell for {{cell.label}}" type="button"
            ></button>
          {{else}}
            <button class={{if cell.alive "alive"}} disabled type="button"></button>
          {{/if}}
        {{/each}}
      {{/each}}
    </div>
  </template>
}
