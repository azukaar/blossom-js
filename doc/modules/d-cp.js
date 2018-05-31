class CpComponent extends Blossom.Component {
  render() {
    const Component = `<l-${this.props.c}></l-${this.props.c}>`;
    return `${Blossom.serialise(Component)}`;
  }
}

Blossom.register({
  name: 'd-cp',
  element: CpComponent,
});
