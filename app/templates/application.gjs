import './app.css';

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
      <Controls />
    </div>
  </template>
);

const addOne = (n) => n + 1;

// let frame;
const scrollToRight = () => {
  // if (frame) cancelAnimationFrame(frame);

  // frame = requestAnimationFrame(() => {
  document.body.parentElement.scrollTo({
    behavior: 'instant',
    left: document.body.scrollWidth,
  });
  // });
};

class Display extends Component {
  @service state;
  @service display;

  get isShowingHistory() {
    return this.display.showHistory;
  }
  get showLines() {
    return !this.display.hideLines;
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

      <Board
        @board={{this.state.board}}
        @index="var(--count)"
        class={{if this.display.iso "iso"}}
      />
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
            <button class={{if cell.alive "alive"}} onclick={{cell.toggle}} type="button"></button>
          {{else}}
            <button class={{if cell.alive "alive"}} disabled type="button"></button>
          {{/if}}
        {{/each}}
      {{/each}}
    </div>
  </template>
}
