import { Component, register } from 'blossom-js-custom-element';

class IncludeComponent extends Component {
  onMount() {
    this.props.loading = true;

    fetch(this.props.url)
      .then(res => res.text())
      .then((res) => {
        this.props.children = res;
        this.props.loading = false;
      });
  }

  render() {
    if (this.props.loading) {
      return '';
    }

    return this.props.children;
  }
}

register({
  name: 'l-include',
  element: IncludeComponent,
});
