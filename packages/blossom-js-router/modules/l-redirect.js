import { Component, register } from 'blossom-js-custom-element';

class redirectComponent extends Component {
  render() {
    window.navigateTo(this.props.to);
  }
}

register({
  name: 'l-redirect',
  element: redirectComponent,
});
