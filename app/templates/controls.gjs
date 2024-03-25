import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { service } from '@ember/service';
import { on } from '@ember/modifier';

export class Controls extends Component {
  @service state;

  reset = () => this.state.createBoard(this.state.maxX, this.state.maxY);

  changeDimensions = (event) => {
    event.preventDefault();

    let formData = new FormData(event.currentTarget);
    let data = Object.fromEntries(formData.entries());

    let width = Number(data.width);
    let height = Number(data.height);

    this.state.createBoard(width, height);
  }

  @tracked delay = 200;
  updateDelay = (event) => this.delay = Number(event.target.value);

  @tracked frame;
  timeout;
  get isPlaying() {
    return Boolean(this.frame);
  }
  toggleAnimation = () => {
    if (this.frame) {
      cancelAnimationFrame(this.frame);
      clearTimeout(this.timeout);
      this.frame = undefined;
      return;
    }

    const play = () => {
      this.state.passTime();
      this.timeout = setTimeout(() => {
        this.frame = requestAnimationFrame(play);
      }, this.delay);
    }

    this.frame = requestAnimationFrame(play)
  };

  <template>
    <button {{on "click" this.toggleAnimation}}>
      {{#if this.isPlaying}}
        Stop
      {{else}}
        Play
      {{/if}}
    </button>

    <label>
      Delay
    <input type="number" name="delay" value={{this.delay}}
      {{on 'input' this.updateDelay}}
    />
    </label>

    <button {{on "click" this.state.passTime}}>
      Progress Time
    </button>

    <button {{on "click" this.state.toggleHistory}}>
      {{#if this.state.showHistory}}
        Hide History
      {{else}}
        Show History
      {{/if}}
    </button>

  <button {{on 'click' this.reset}}>Reset</button>

  <form {{on 'submit' this.changeDimensions}}>
    <label>
      Width:
      <input type="number" name="width" value={{this.state.maxX}} />
    </label>

    <label>
      Height:
      <input type="number" name="height" value={{this.state.maxY}} />
    </label>

    <button>Update Dimensions</button>
  </form>
  </template>
}
