import Component from '@glimmer/component';
import { service } from '@ember/service';
import { on } from '@ember/modifier';

export class Size extends Component {
  @service state;
  @service display;

  get height() {
    return this.display.height;
  }

  get width() {
    return this.display.width;
  }

  handleTop = (diff) => {
    this.state.deleteHistory();

    if (diff < 0) {
      this.state.board.shrinkUp();
    } else {
      this.state.board.growUp();
    }

    this.display.setHeight(this.state.board.height);
    this.display.updateSeed(this.state.board);
  };
  handleBottom = (diff) => {
    this.state.deleteHistory();

    if (diff < 0) {
      this.state.board.shrinkDown();
    } else {
      this.state.board.growDown();
    }

    this.display.setHeight(this.state.board.height);
    this.display.updateSeed(this.state.board);
  };
  handleLeft = (diff) => {
    this.state.deleteHistory();

    if (diff < 0) {
      this.state.board.shrinkLeft();
    } else {
      this.state.board.growLeft();
    }

    this.display.setWidth(this.state.board.width);
    this.display.updateSeed(this.state.board);
  };
  handleRight = (diff) => {
    this.state.deleteHistory();

    if (diff < 0) {
      this.state.board.shrinkRight();
    } else {
      this.state.board.growRight();
    }

    this.display.setWidth(this.state.board.width);
    this.display.updateSeed(this.state.board);
  };

  <template>
    <div class="dimensions">
      <div class="top">
        <SizeControls @onChange={{this.handleTop}}  />
      </div>
      <div class="left">
        <SizeControls @onChange={{this.handleLeft}}  />
      </div>
      <div class="x-and-y">{{this.state.board.width}}x{{this.state.board.height}}</div>
      <div class="right">
        <SizeControls @onChange={{this.handleRight}}  />
      </div>
      <div class="bottom">
        <SizeControls @onChange={{this.handleBottom}}  />
      </div>
    </div>
    {{! prettier-ignore }}
    <style>
      .dimensions {
        display: grid;
        gap: 0.25rem;
        grid-template-areas:
          ". t ."
          "l d r"
          ". b ."
        ;

        .left, .top, .right, .bottom, .x-and-y {
          display: grid;
          gap: 0.25rem;
          grid-auto-flow: column;
          align-items: center;
        }
        .left, .right {
          grid-auto-flow: row;
        }

        button {
          border: none;
          width: 1.5rem;
          height: 1.5rem;
        }
      }
      .top { grid-area: t; }
      .bottom { grid-area: b; }
      .left { grid-area: l; }
      .right { grid-area: r; }
      .x-and-y {
        grid-area: d;
        text-align: center;
    }
    </style>
  </template>
}

class SizeControls extends Component {
  inc = () => this.args.onChange(1);
  dec = () => this.args.onChange(-1);

  <template>
    <button aria-label="Increase" type="button" {{on "click" this.inc}}>+</button>
    <button aria-label="Decrease" type="button" {{on "click" this.dec}}>-</button>
  </template>
}

