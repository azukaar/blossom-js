import { BlossomComponent, BlossomRegister } from 'blossom-js-custom-element';

class ScopeComponent extends BlossomComponent {
  render() {
    Object.keys(this.props).forEach((name) => {
      this.parentElement.state.scope[name] = this.props[name];
    });

    return '';
  }
}

BlossomRegister({
  name: 'l-scope',
  element: ScopeComponent,
});
