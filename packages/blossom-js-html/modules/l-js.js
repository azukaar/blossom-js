import { BlossomComponent, BlossomDeserialise, BlossomRegister, BlossomInterpolate } from 'blossom-js-custom-element';

class JsComponent extends BlossomComponent {
  render() {
    return BlossomInterpolate(BlossomDeserialise(this.props.children), this);
  }
}

BlossomRegister({
  name: 'l-js',
  element: JsComponent,
});
