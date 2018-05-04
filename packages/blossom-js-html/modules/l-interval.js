import { BlossomComponent, BlossomRegister } from 'blossom-js-custom-element';

class IntervalComponent extends BlossomComponent {
  onMount() {
    this.timer = setInterval(() => this.refresh(), this.props.timer);
  }

  onUnmount() {
    clearInterval(this.timer);
  }

  render() {
    return this.props.children;
  }
}

BlossomRegister({
  name: 'l-interval',
  element: IntervalComponent,
});
