import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';

// Yes, state can be this easy!
export default class Display extends Service {
  @tracked showHistory = false;
  @tracked showLines = true;

  toggleLines = () => (this.showLines = !this.showLines);
  toggleHistory = () => (this.showHistory = !this.showHistory);

  // TODO: should all toggleables be stored on the DOM?
  toggleISO = (event) => {
    event.preventDefault();
    event.currentTarget.classList.toggle('iso');
  };
}
