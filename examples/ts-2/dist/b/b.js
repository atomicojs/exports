import { jsx as _jsx } from "atomico/jsx-runtime";
import { c } from "atomico";
function component3() {
    return _jsx("host", { shadowDom: true, children: "..." });
}
component3.props = { message: String };
export const Component3 = c(component3);
customElements.define("my-component-3", Component3);
