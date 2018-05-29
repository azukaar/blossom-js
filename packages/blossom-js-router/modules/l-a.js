import { Component, register } from 'blossom-js-custom-element';

class AComponent extends Component {
  render() {
    return `<a onclick="event.preventDefault(); navigateTo('${this.props.href}')" href='${this.props.href}'>${this.props.children}</a>`;
  }
}

register({
  name: 'l-a',
  element: AComponent,
});
