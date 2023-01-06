import { c } from "atomico";

function component4() {
    return <host shadowDom>...</host>;
}

component4.props = { message: String };

export const Component4 = c(component4);

customElements.define("my-component-4", Component4);
