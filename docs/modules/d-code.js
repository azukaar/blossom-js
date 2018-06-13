class CodeComponent extends Blossom.Component {
  onUpdate() {
    if (this.randomId && this.codeToDisplay) {
      setTimeout(() => 
        require(["vs/editor/editor.main"], () => {
          let editor = monaco.editor.create(document.getElementById(this.randomId), {
            value: this.codeToDisplay,
            language: 'html',
            theme: 'vs-dark'
          });
        }), 500);
    }
  }
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

    this.randomId = parseInt(Math.random() * 100000, 10);

    if (this.props.codeonly) {
      this.codeToDisplay = code;
      return `
        <div id="${this.randomId}" class="code single"></div>
      `;
    }

    if (!this.props.DOM) {
      this.codeToDisplay = code;
      return `<div id="${this.randomId}" class="code"></div>
      <div class="preview">
<l-closure>
${this.props.children}
</l-closure>
      </div>`;
    }

    this.randomId2 = parseInt(Math.random() * 100000, 10);
    this.codeToDisplay = code;

    return `<div id="${this.randomId}" class="code"></div>
      <div class="hidden">
        <l-closure>
          ${this.props.children}
        </l-closure>
      </div>
      <div id="${this.randomId2}" class="code"></div>`;
  }
}

Blossom.register({
  name: 'd-code',
  element: CodeComponent,
});
