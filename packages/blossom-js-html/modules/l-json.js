import { Component, register } from 'blossom-js-custom-element';

class JsonComponent extends Component {
  onMount() {
    this.props.loading = true;

    fetch(this.props.url)
      .then((res) => res.json())
      .then((json) => {
        this.setAliasableCtx('json', json);
        this.props.loading = false;
      });
  }

  render() {
    if (this.props.loading) {
      return `<l-preview>${this.props.children}</l-preview>`;
    }

    return this.props.children;
  }
}

register({
  name: 'l-json',
  element: JsonComponent,
});
