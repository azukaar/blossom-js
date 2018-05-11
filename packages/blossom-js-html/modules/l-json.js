import { BlossomComponent, BlossomRegister } from 'blossom-js-custom-element';

class JsonComponent extends BlossomComponent {
  updateChildren(children) {
    if (!this.props.loading) {
      this.props.children = children;
    }
  }
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

BlossomRegister({
  name: 'l-json',
  element: JsonComponent,
});
