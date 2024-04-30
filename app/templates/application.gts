import './app.css';

import { assert } from '@ember/debug';
import Component from '@glimmer/component';
import { service } from '@ember/service';
import { pageTitle } from 'ember-page-title';
import Route from 'ember-route-template';

import { Controls } from './controls';
import { Header } from './header';

import type { TOC } from '@ember/component/template-only';
import type { ActiveBoardState, State } from 'life/util/types';
import type { StateService } from 'life/services/state';
import type { DisplayService } from 'life/services/display';

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

const addOne = (n: number) => n + 1;

const scrollToRight = () => {
  document.body.parentElement?.scrollTo({
    behavior: 'instant',
    left: document.body.scrollWidth,
  });
};

class Display extends Component {
  @service declare state: StateService;
  @service declare display: DisplayService;

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
          <HistoricalGrid @board={{board}} @index={{addOne i}} />
          {{(scrollToRight)}}
        {{/each}}
      {{/if}}

      <Grid
        @board={{this.state.currentState}}
        @index="var(--count)"
        class={{if this.display.iso "iso"}}
      />
    </div>
  </template>
}

const getRows = (board: State.Board) => board.length;
const getColumns = (board: State.Board) => {
  assert(`[BUG] can't have a board with no columns`, board[0]);
  return board[0].length;
};

const Grid: TOC<{
  Element: HTMLDivElement;
  Args: {
    board: ActiveBoardState;
    index: string | number;
  };
}> = <template>
  <div
    class="board"
    style="
        --index: {{@index}};
        --columns: {{getColumns @board}};
        --rows: {{getRows @board}};
      "
    ...attributes
  >
    {{#each @board as |row|}}
      {{#each row as |cell|}}
        <button class={{if cell.alive "alive"}} onclick={{cell.toggle}} type="button"></button>
      {{/each}}
    {{/each}}
  </div>
</template>;

const HistoricalGrid: TOC<{
  Args: {
    board: State.Board;
    index: string | number;
  };
}> = <template>
  <div
    class="board historical"
    style="
        --index: {{@index}};
        --columns: {{getColumns @board}};
        --rows: {{getRows @board}};
      "
  >
    {{#each @board as |row|}}
      {{#each row as |cell|}}
        <button class={{if cell.alive "alive"}} disabled type="button"></button>
      {{/each}}
    {{/each}}
  </div>
</template>;
