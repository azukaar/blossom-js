import {BlossomComponent, BlossomRegister} from 'blossom-js-custom-element';

class AComponent extends BlossomComponent {
    render() {
        return `<a onclick="event.preventDefault(); navigateTo('${this.state['href']}')" href='${this.state['href']}'>${this.state['children']}</a>`;
    }
};

BlossomRegister({
    name : "l-a",
    element: AComponent
});