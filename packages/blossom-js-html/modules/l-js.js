import { BlossomComponent, BlossomSerialise, BlossomDeserialise, BlossomRegister, BlossomInterpolate } from 'blossom-js-custom-element';

class JsComponent extends BlossomComponent {
  render() {
    return BlossomSerialise(BlossomInterpolate(BlossomDeserialise(this.props.children), this));
  }
}

BlossomRegister({
  name: 'l-js',
  element: JsComponent,
});
