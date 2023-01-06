import { jsx as _jsx } from "atomico/jsx-runtime";
import { c } from "atomico";
function component4() {
    return _jsx("host", { shadowDom: true, children: "..." });
}
component4.props = { message: String };
export const Component4 = c(component4);
customElements.define("my-component-4", Component4);
