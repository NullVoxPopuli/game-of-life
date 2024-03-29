import Service, { service } from '@ember/service';

// Yes, state can be this easy!
export default class Display extends Service {
  @service router;

  get queryParams() {
    return this.router.currentRoute?.queryParams ?? {};
  }

  get showHistory() {
    return this.queryParams['showHistory'] === '1';
  }

  get seed() {
    return this.queryParams['seed'];
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

  /**
  * Allows batching QP updates
  */
  #frame;
  #qps;
  #setQP = (qps) => {
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

  setWidth = (num) => this.#setQP({ width: num });
  setHeight = (num) => this.#setQP({ height: num });

  toggleLines = () => this.#setQP({ hideLines: this.hideLines ? '0' : '1' });
  toggleIso = () => this.#setQP({ iso: this.iso ? '0' : '1' });

  toggleHistory = () =>
    this.#setQP({
      showHistory: this.showHistory ? '0' : '1',
      iso: this.showHistory ? this.iso : '0',
    });

  updateSeed = (board) => {
    this.#setQP({
      seed: board.getSeed(),
    });
  };

  setDelay = (ms) => {
    this.#setQP({ delay: ms });

    let s = ms / 1000;

    document.querySelector(':root').style.setProperty('--iteration-delay', `${s}s`);
  };
}
