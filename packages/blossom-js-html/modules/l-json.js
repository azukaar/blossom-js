import { Component, register, serialise } from 'blossom-js-custom-element';

class JsonComponent extends Component {
  onMount() {
    this.loading = true;

    fetch(this.props.url)
      .then(res => res.json())
      .then((json) => {
        this.loading = false;
        this.json = json;
        this.refresh();
      });
  }

  render() {
    if (this.loading) {
      return `<l-preview>${this.props.children}</l-preview>`;
    }

    return `<l-ctx json='${serialise(this.json)}'>${this.props.children}</l-ctx>`;
  }
}

register({
  name: 'l-json',
  element: JsonComponent,
});
