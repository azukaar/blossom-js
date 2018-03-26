const {BlossomComponent, BlossomRegister} = require('blossom-js-custom-element');

class IfComponent extends BlossomComponent {
    render() {
        return `<a onclick="event.preventDefault(); Router.navigateTo('${this.state['href']}')" href='${this.state['href']}'>${this.state['children']}</a>`;
    }
};

BlossomRegister({
    name : "l-if",
    element: IfComponent
});