const {BlossomComponent, BlossomRegister} = require('blossom-js-custom-element');

class LoopComponent extends BlossomComponent {
    render() {
        return this.state['l-from'].map((value) => {
            return `<span ${this.scopeString(value, 'loop')}>` + this.state.children + '</span>';
        }).join('');
    }
};

BlossomRegister({
    name : "l-loop",
    element: LoopComponent
});