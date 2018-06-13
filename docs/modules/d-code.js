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

    const randomId = parseInt(Math.random() * 100000, 10);

    if (this.props.codeonly) {
      return `
        <div id="${randomId}" class="code"></div>
        require(["vs/editor/editor.main"], function () {
          let editor = monaco.editor.create(document.getElementById('${randomId}'), {
            value: ${JSON.stringify(Blossom.serialise(code))},
            language: 'javascript',
            theme: 'vs-dark'
          });
        });
      `;
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
