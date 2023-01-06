import { jsx as _jsx } from "atomico/jsx-runtime";
import { c } from "atomico";
function component() {
    return _jsx("host", { shadowDom: true, children: "..." });
}
component.props = { message: String };
export const Component = c(component);
customElements.define("my-component", Component);
