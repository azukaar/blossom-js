import { Component, register } from 'blossom-js-custom-element';

class IntervalComponent extends Component {
  onMount() {
    this.timer = setInterval(() => {
      if (this.props.ontick) {
        this.props.ontick();
      }
      this.refresh();
    }, this.props.timer);
  }

  onUnmount() {
    clearInterval(this.timer);
  }

  render() {
    return this.props.children;
  }
}

register({
  name: 'l-interval',
  element: IntervalComponent,
});
