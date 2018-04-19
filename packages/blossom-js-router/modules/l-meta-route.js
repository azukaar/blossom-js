import { BlossomComponent, BlossomRegister } from 'blossom-js-custom-element';

class redirectComponent extends BlossomComponent {
  render() {
    let url = this.props.base;
    if (!url.match(/\/$/)) {
      url += '/';
    }
    state.BlossomRouteBase = url;
    return '';
  }
}

BlossomRegister({
  name: 'l-meta-route',
  element: redirectComponent,
});
