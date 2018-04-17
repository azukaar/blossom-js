import { BlossomComponent, BlossomRegister, BlossomInterpolate } from 'blossom-js-custom-element';

class JsComponent extends BlossomComponent {
  render() {
    return BlossomInterpolate(this.props.children, this.props.scope, this);
  }
}

BlossomRegister({
  name: 'l-js',
  element: JsComponent,
});
