import { c } from "atomico";

function component2() {
    return <host shadowDom>...</host>;
}

component2.props = { message: String };

export const Component2 = c(component2);

customElements.define("my-component-2", Component2);
