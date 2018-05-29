import { Component, register, serialise } from 'blossom-js-custom-element';

class LoopComponent extends Component {
  render() {
    const contextNames = [
      this.props['alias-loop'] || 'loop',
      this.props['alias-key'] || 'key',
    ];

    return this.props.from && this.props.from.map((value, key) => {
      const context = {
        [contextNames[0]]: value,
        [contextNames[1]]: key,
      };

      return `<l-ctx ctx='${serialise(context)}'>${this.props.children}</l-ctx>`;
    }).join('');
  }
}

register({
  name: 'l-loop',
  element: LoopComponent,
});
