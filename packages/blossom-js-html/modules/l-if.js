import { Component, register } from 'blossom-js-custom-element';

class IfComponent extends Component {
  render() {
    if (this.props.cond) {
      return this.props.children;
    }
    return '';
  }
}

register({
  name: 'l-if',
  element: IfComponent,
});
