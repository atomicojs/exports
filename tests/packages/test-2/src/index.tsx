import { c } from "atomico";

function component() {
    return <host shadowDom>...</host>;
}

component.props = { message: String };

export const Component = c(component);

customElements.define("my-component", Component);
