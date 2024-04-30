import Component from '@glimmer/component';
import { service } from '@ember/service';
import { on } from '@ember/modifier';

import { Size } from './size';
import type { StateService } from 'life/services/state';
import type { DisplayService } from 'life/services/display';

export class Config extends Component {
  @service declare state: StateService;
  @service declare display: DisplayService;

  <template>
    <footer class="config">
      <button type="button" {{on "click" this.display.toggleLines}}>
        {{#if this.display.hideLines}}
          Show Lines
        {{else}}
          Hide Lines
        {{/if}}
      </button>

      <button type="button" {{on "click" this.display.toggleIso}} disabled={{this.display.showHistory}}>
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
    </footer>
  </template>
}
