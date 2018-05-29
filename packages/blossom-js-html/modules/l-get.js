import { Component, register } from 'blossom-js-custom-element';

class GetComponent extends Component {
  render() {
    let result = '';
    Object.keys(this.props).forEach((name) => {
      result += ` ${this.ctx[name]}`;
    });

    return result;
  }
}

register({
  name: 'l-get',
  element: GetComponent,
});
