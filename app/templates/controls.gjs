import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { service } from '@ember/service';
import { on } from '@ember/modifier';

export class Controls extends Component {
  @service state;
  @service display;

  reset = () => this.state.reset();

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

      this.state.history.length = 0;

    const play = () => {
      if (this.state.isStable) {
        this.toggleAnimation();
      }

      this.state.passTime();
      this.timeout = setTimeout(() => {
        this.frame = requestAnimationFrame(play);
      }, this.delay);
    }

    this.frame = requestAnimationFrame(play)
  };

  toggleIso = () => {
    let last = [...document.querySelectorAll('.board')].reverse()?.[0];
    last?.classList?.toggle?.('iso');
  }

  <template>
    <div>
      <button type="button" {{on "click" this.toggleAnimation}}>
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

      <button type="button" {{on "click" this.state.passTime}}>
        Progress Time
      </button>

      <button type="button" {{on "click" this.display.toggleHistory}}>
        {{#if this.display.showHistory}}
          Hide History
        {{else}}
          Show History
        {{/if}}
      </button>

      <button type="button" {{on "click" this.display.toggleLines}}>
        {{#if this.display.showLines}}
          Hide Lines
        {{else}}
          Show Lines
        {{/if}}
      </button>

      <button type="button" {{on "click" this.toggleIso}}>
        {{#if this.isIso}}
          Flat
        {{else}}
          Iso
        {{/if}}
      </button>

    <button type="button" {{on 'click' this.reset}}>Reset</button>

  </div>
  <form {{on 'submit' this.changeDimensions}}>
    <label>
      Width:
      <input type="number" name="width" value={{this.state.maxX}} />
    </label>

    <label>
      Height:
      <input type="number" name="height" value={{this.state.maxY}} />
    </label>

    <button type="submit">Update Dimensions</button>
  </form>
  </template>
}
