import { BlossomComponent, BlossomRegister } from 'blossom-js-custom-element';

class IntervalComponent extends BlossomComponent {
  onMount() {
    console.log(111, this.props.timer)
    this.timer = setInterval(() => this.refresh(), this.props.timer);
  }

  onUnmount() {
    clearInterval(this.timer);
  }

  render() {
    console.log(123);
    return this.props.children;
  }
}

BlossomRegister({
  name: 'l-interval',
  element: IntervalComponent,
});
