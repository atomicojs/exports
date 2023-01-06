import { jsx as _jsx } from "atomico/jsx-runtime";
import { c } from "atomico";
function component1() {
    return _jsx("host", { shadowDom: true, children: "..." });
}
component1.props = { message: String };
export const Component1 = c(component1);
customElements.define("my-component-1", Component1);
