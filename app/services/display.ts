import type RouterService from '@ember/routing/router-service';
import Service, { service } from '@ember/service';
import type { Board } from 'life/util/board';
import type { BoardConfig } from 'life/util/types';

type QPs = Record<string, string | number>;


function boolToBinaryString(input: boolean) {
  return input ? '1' : '0';
}

// Yes, state can be this easy!
export class DisplayService extends Service {
  @service declare router: RouterService;

  get queryParams(): QPs {
    return ((this.router.currentRoute?.queryParams ?? {}) as QPs);
  }

  get showHistory() {
    return this.queryParams['showHistory'] === '1';
  }

  get seed() {
    return String(this.queryParams['seed'] || '');
  }

  get hideLines() {
    return this.queryParams['hideLines'] === '1';
  }

  get iso() {
    return this.queryParams['iso'] === '1';
  }

  get delay() {
    return Number(this.queryParams['delay']) || 150;
  }

  get width() {
    return Number(this.queryParams['width']) || 20;
  }

  get height() {
    return Number(this.queryParams['height']) || 20;
  }

  get boardConfig(): BoardConfig {
    return {
      width: this.width,
      height: this.height,
      seed: this.seed,
    };
  }

  /**
  * Allows batching QP updates
  */
  #frame?: number;
  #qps?: QPs;
  #setQP = (qps: QPs) => {
    if (this.#frame) cancelAnimationFrame(this.#frame);

    this.#qps = {
      ...this.queryParams,
      ...this.#qps,
      ...qps,
    };

    this.#frame = requestAnimationFrame(() => {
      this.router.transitionTo({
        queryParams: this.#qps,
      });
    });
  }

  setWidth = (num: number) => this.#setQP({ width: num });
  setHeight = (num: number) => this.#setQP({ height: num });

  toggleLines = () => this.#setQP({ hideLines: this.hideLines ? '0' : '1' });
  toggleIso = () => this.#setQP({ iso: this.iso ? '0' : '1' });

  toggleHistory = () =>
    this.#setQP({
      showHistory: this.showHistory ? '0' : '1',
      iso: this.showHistory ? boolToBinaryString(this.iso) : '0',
    });

  updateSeed = (board: Board) => {
    this.#setQP({
      seed: board.getSeed(),
    });
  };

  setDelay = (ms: number) => {
    this.#setQP({ delay: ms });

    const s = ms / 1000;

    const root = document.querySelector(':root');

    if (root instanceof HTMLElement) {
      root.style.setProperty('--iteration-delay', `${s}s`);
    }
  };
}

export default DisplayService;
