import { jsx as _jsx } from "atomico/jsx-runtime";
import { c } from "atomico";
function component2() {
    return _jsx("host", { shadowDom: true, children: "..." });
}
component2.props = { message: String };
export const Component2 = c(component2);
customElements.define("my-component-2", Component2);
