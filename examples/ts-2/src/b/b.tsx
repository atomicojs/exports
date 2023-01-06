import { c } from "atomico";

function component3() {
    return <host shadowDom>...</host>;
}

component3.props = { message: String };

export const Component3 = c(component3);

customElements.define("my-component-3", Component3);
