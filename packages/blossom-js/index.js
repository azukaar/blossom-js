const {BlossomComponent, BlossomRegister, BlossomResolveScope, BlossomInterpolate} = require('blossom-js-custom-element');
const BlossomRouter = require('blossom-js-router');
require('blossom-js-html');

if(typeof module !== 'undefined' && module.exports) {
    module.exports = {BlossomComponent, BlossomRegister, BlossomResolveScope, BlossomInterpolate, BlossomRouter};
}