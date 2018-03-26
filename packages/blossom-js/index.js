const {BlossomComponent, BlossomRegister, BlossomResolveScope, BlossomInterpolate} = require('blossom-js-custom-element');
const BlossomHTMLComponents = require('blossom-js-html');
const BlossomRouter = require('blossom-js-router');

if(typeof module !== 'undefined' && module.exports) {
    module.exports = {BlossomComponent, BlossomRegister, BlossomResolveScope, BlossomInterpolate, BlossomHTMLComponents, BlossomRouter};
}