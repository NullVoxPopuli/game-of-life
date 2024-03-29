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

  changeDimensions = (event) => {
    event.preventDefault();

    let formData = new FormData(event.currentTarget);
    let data = Object.fromEntries(formData.entries());

    let width = Number(data.width);
    let height = Number(data.height);

    this.display.setWidth(width);
    this.display.setHeight(height);

    let seed = this.state.getSeed();
    this.state.createBoard(width, height);
    this.state.restoreSeed(seed);
  };

  handleTop = (diff) => {
    this.state.deleteHistory();

    if (diff < 0) {
      this.state._board.shrinkUp();
    } else {
      this.state._board.growUp();
    }

    this.display.setHeight(this.state._board.height);
    this.display.updateSeed(this.state._board);
  };
  handleBottom = (diff) => {
    this.state.deleteHistory();

    if (diff < 0) {
      this.state._board.shrinkDown();
    } else {
      this.state._board.growDown();
    }

    this.display.setHeight(this.state._board.height);
    this.display.updateSeed(this.state._board);
  };
  handleLeft = (diff) => {
    this.state.deleteHistory();

    if (diff < 0) {
      this.state._board.shrinkLeft();
    } else {
      this.state._board.growLeft();
    }

    this.display.setWidth(this.state._board.width);
    this.display.updateSeed(this.state._board);
  };
  handleRight = (diff) => {
    this.state.deleteHistory();

    if (diff < 0) {
      this.state._board.shrinkRight();
    } else {
      this.state._board.growRight();
    }

    this.display.setWidth(this.state._board.width);
    this.display.updateSeed(this.state._board);
  };

  <template>
    <div class="dimensions">
      <div class="top">
        <SizeControls @onChange={{this.handleTop}}  />
      </div>
      <div class="left">
        <SizeControls @onChange={{this.handleLeft}}  />
      </div>
      <div class="x-and-y">{{this.state._board.width}}x{{this.state._board.height}}</div>
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
        grid-template-areas:
          ". t ."
          "l d r"
          ". b ."
        ;

        .left, .top, .right, .bottom, .x-and-y {
          display: flex;
          align-items: center;
        }
      }
      .top { grid-area: t; }
      .bottom { grid-area: b; }
      .left { grid-area: l; }
      .right { grid-area: r; }
      .x-and-y {
        grid-area: d; width: 2rem; height: 2rem;
        text-align: center;
    }
    </style>
  </template>
}

class SizeControls extends Component {
  inc = () => this.args.onChange(1);
  dec = () => this.args.onChange(-1);

  <template>
    <button aria-label="Increase" {{on "click" this.inc}}>+</button>
    <button aria-label="Decrease" {{on "click" this.dec}}>-</button>
  </template>
}

