const {BlossomComponent, BlossomRegister, BlossomInterpolate} = require('blossom-js-custom-element');

class JsComponent extends BlossomComponent {
    render() {
        return BlossomInterpolate(this.state.children, this.state.scope, this);
    }
};

BlossomRegister({
    name : "l-js",
    element: JsComponent
});

if(typeof module !== 'undefined' && module.exports) {
    module.exports = JsComponent;
}