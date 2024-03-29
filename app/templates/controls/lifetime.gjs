import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { service } from '@ember/service';
import { on } from '@ember/modifier';

export class Lifetime extends Component {
  @service state;
  @service display;

  restart = () => {
    let seed = this.display.seed;
    this.state.reset();
    this.state.restoreSeed(seed);
  };

  updateDelay = (event) => {
    let ms = Number(event.target.value);
    this.display.setDelay(ms);
  };

  @tracked frame;
  // timeout is used to artificially slow down
  // the animation
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
      if (!this.state.hasAnyShape()) {
        return this.toggleAnimation();
      }

      if (this.state.isStable) {
        this.toggleAnimation();
      }

      this.state.passTime();
      this.timeout = setTimeout(() => {
        this.frame = requestAnimationFrame(play);
      }, this.display.delay);
    };

    this.state.history.length = 0;
    this.frame = requestAnimationFrame(play);
  };

  <template>
    <footer class="timeline">
      <button type="button" {{on "click" this.toggleAnimation}}>
        {{#if this.isPlaying}}
          Stop
        {{else}}
          Play
        {{/if}}
      </button>

      <label>
        Delay
        <input
          type="number"
          name="delay"
          value={{this.display.delay}}
          {{on "input" this.updateDelay}}
        />
      </label>

      <button type="button" {{on "click" this.state.passTime}}>
        Progress Time
      </button>

      <button type="button" {{on "click" this.restart}}>Restart</button>
    </footer>
  </template>
}
