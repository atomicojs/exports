import { c } from "atomico";

function component1() {
    return <host shadowDom>...</host>;
}

component1.props = { message: String };

export const Component1 = c(component1);

customElements.define("my-component-1", Component1);
