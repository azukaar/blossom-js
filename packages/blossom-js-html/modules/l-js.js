import { Component, serialise, deserialise, register, interpolate } from 'blossom-js-custom-element';

class JsComponent extends Component {
  render() {
    return serialise(interpolate(deserialise(this.props.children), this));
  }
}

register({
  name: 'l-js',
  element: JsComponent,
});
