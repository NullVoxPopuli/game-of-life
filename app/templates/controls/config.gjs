import Component from '@glimmer/component';
import { service } from '@ember/service';
import { on } from '@ember/modifier';

import { Size } from './size';

export class Config extends Component {
  @service state;
  @service display;

  reset = () => this.state.reset();

  <template>
    <footer class="config">
      <button type="button" {{on "click" this.display.toggleLines}}>
        {{#if this.display.hideLines}}
          Show Lines
        {{else}}
          Hide Lines
        {{/if}}
      </button>

      <button type="button" {{on "click" this.display.toggleIso}}>
        {{#if this.display.iso}}
          Flat
        {{else}}
          Iso
        {{/if}}
      </button>

      <Size />

      <button type="button" {{on "click" this.display.toggleHistory}}>
        {{#if this.display.showHistory}}
          Hide History
        {{else}}
          Show History
        {{/if}}
      </button>
      <hr />

      <button type="button" {{on "click" this.reset}}>Reset</button>
    </footer>
  </template>
}
