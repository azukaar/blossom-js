import { Component, deserialise, register, interpolate } from 'blossom-js-custom-element';

class ScriptComponent extends Component {
  render() {
    interpolate(deserialise(this.props.children), this);
    return '';
  }
}

register({
  name: 'l-script',
  element: ScriptComponent,
});
