import { c } from "atomico";

function component() {
    return <host shadowDom>...</host>;
}

export const Component = c(component);

customElements.define("my-component", Component);
