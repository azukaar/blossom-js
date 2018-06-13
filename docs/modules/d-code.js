class CodeComponent extends Blossom.Component {
  render() {
    let code = this.props.children.replace(/^\n/, '').replace(/\n\s+$/, '');
    let minSpace = 99;

    code.split('\n').forEach((line) => {
      if (line.match(/^\s+/)) {
        const nbSpace = line.match(/^\s+/)[0].length;
        if (nbSpace < minSpace) minSpace = nbSpace;
      }
    });

    if (minSpace < 99) {
      let res = [];
      code.split('\n').forEach((line) => {
        res.push(line.slice(minSpace));
      });
      code = res.join('\n');
    }

    if (this.props.codeonly) {
      return `<div class="code">${Blossom.serialise(code)}</div>`;
    }

    if (!this.props.DOM) {
      return `<div class="code">${Blossom.serialise(code)}</div>
      <div class="preview">
<l-closure>
${this.props.children}
</l-closure>
      </div>`;
    }

    return `<div class="code">${Blossom.serialise(code)}</div>
      <div class="hidden">
        <l-closure>
          ${this.props.children}
        </l-closure>
      </div>
      <div class="code"><l-js>html_beautify(this.parentElement.parentElement.querySelector('.hidden').innerHTML)</l-js></div>`;
  }
}

Blossom.register({
  name: 'd-code',
  element: CodeComponent,
});
