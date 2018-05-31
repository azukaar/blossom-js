import { Component, register } from 'blossom-js-custom-element';

class AComponent extends Component {
  render() {
    let className = '';
    const currentPath = window.location.pathname;
    const relativePath = window.BlossomRouteBase ?
      window.BlossomRouteBase + this.props.href.replace(/^\//, '') :
      this.props.href;

    if (relativePath === currentPath) {
      className = 'class="active"';
    }

    return `<a ${className} onclick="event.preventDefault(); navigateTo('${this.props.href}')" href='${this.props.href}'>${this.props.children}</a>`;
  }
}

register({
  name: 'l-a',
  element: AComponent,
});
