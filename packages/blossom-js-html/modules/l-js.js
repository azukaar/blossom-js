import { BlossomComponent, BlossomRegister, BlossomInterpolate } from 'blossom-js-custom-element';

class JsComponent extends BlossomComponent {
  updateChildren(children) {
    if (!this.props.children) {
      this.props.children = children;
    }
  }

  render() {
    return BlossomInterpolate(this.props.children, this);
  }
}

BlossomRegister({
  name: 'l-js',
  element: JsComponent,
});
