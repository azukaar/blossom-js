import {BlossomComponent, BlossomRegister} from 'blossom-js-custom-element';

class IfComponent extends BlossomComponent {
    render() {
        return `<a onclick="event.preventDefault(); navigateTo('${this.state['href']}')" href='${this.state['href']}'>${this.state['children']}</a>`;
    }
};

BlossomRegister({
    name : "l-a",
    element: IfComponent
});