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
  timeout: number | undefined;
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
      assert('[BUG]: Board not instantiate.', this.state._board);

      if (!this.state._board.hasAnyShape()) {
        this.frame = 1;
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
