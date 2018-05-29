import { Component, register } from 'blossom-js-custom-element';

class redirectComponent extends Component {
  render() {
    let url = this.props.base;
    if (!url.match(/\/$/)) {
      url += '/';
    }
    document.querySelector('*').setCtx('BlossomRouteBase', url);
    return '';
  }
}

register({
  name: 'l-meta-route',
  element: redirectComponent,
});
