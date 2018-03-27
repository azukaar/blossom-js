import {BlossomComponent, BlossomRegister} from 'blossom-js-custom-element';

class JsonComponent extends BlossomComponent {
    onMount() {
        this.state['l-loading'] = true;

        fetch(this.state['l-url'])
            .then((res) => res.json())
            .then((json) => {
                this.state['l-loading'] = false;
                this.setScope(json, 'json');
                this.refresh();
            });
    }
    render() {
        if(this.state['l-loading']) {
            return '<l-preview>' + this.state.children + '</l-preview>';
        }
        else {
            return this.state.children;
        }
    }
};

BlossomRegister({
    name : "l-json",
    element: JsonComponent
});