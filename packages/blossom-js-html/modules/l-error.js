import { Component, register } from 'blossom-js-custom-element';

class ErrorComponent extends Component {
  render() {
    return this.props.children;
  }
}

register({
  name: 'l-error',
  element: ErrorComponent,
});
