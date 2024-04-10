import Component from '@glimmer/component';
import { assert } from '@ember/debug';
import { tracked } from '@glimmer/tracking';
import { service } from '@ember/service';
import { on } from '@ember/modifier';

import type { StateService } from 'life/services/state';
import type { DisplayService } from 'life/services/display';

export class Lifetime extends Component {
  @service declare state: StateService;
  @service declare display: DisplayService;

  restart = () => {
    let config = this.display.boardConfig;
    this.state.deleteHistory();
    this.state.restore(config);
  };

  updateDelay = (event: Event) => {
    assert(
      '[BUG]: callback should only be used on input elements',
      event.target instanceof HTMLInputElement
    );

    let ms = Number(event.target.value);
    this.display.setDelay(ms);
  };

  @tracked frame: number | undefined;
  // timeout is used to artificially slow down
  // the animation
  // (computers are too fast (60fps is ~ 16.67ms per frame)
  @tracked timeout: number | undefined;

  get isPlaying() {
    return this.frame !== undefined || this.timeout !== undefined;
  }

  start = () => {
    const play = () => {
      assert('[BUG]: Board not instantiate.', this.state._board);

      if (!this.state._board.hasAnyShape()) {
        return this.stop();
      }

      if (this.state.isStable) {
        this.stop();
      }

      this.state.passTime();
      this.timeout = setTimeout(() => {
        this.frame = requestAnimationFrame(play);
      }, this.display.delay);
    };

    this.frame = requestAnimationFrame(play);
  }

  stop = () => {
    if (this.frame !== undefined) {
      cancelAnimationFrame(this.frame);
      this.frame = undefined;
    }

    if (this.timeout !== undefined) {
      clearTimeout(this.timeout);
      this.timeout = undefined;
    }
  }


  toggleAnimation = () => {
    if (this.isPlaying) {
      return this.stop();
    }

    this.start();
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
