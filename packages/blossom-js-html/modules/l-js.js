import { BlossomComponent, BlossomRegister, BlossomInterpolate } from 'blossom-js-custom-element';

class JsComponent extends BlossomComponent {
  render() {
    return BlossomInterpolate(this.state.children, this.state.scope, this);
  }
}

BlossomRegister({
  name: 'l-js',
  element: JsComponent,
});
