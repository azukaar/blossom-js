const {BlossomComponent, BlossomRegister} = require('blossom-js-custom-element');

class IfComponent extends BlossomComponent {
    render() {
        if(this.state['l-cond']) {
            return this.state.children;
        }
        else return '';
    }
};

BlossomRegister({
    name : "l-if",
    element: IfComponent,
    attributes : [
        "l-cond"
    ]
});

if(typeof module !== 'undefined' && module.exports) {
    module.exports = IfComponent;
}