import { jsx as _jsx } from "atomico/jsx-runtime";
import { c } from "atomico";
function component() {
    return _jsx("host", { shadowDom: true, children: "..." });
}
export const Component = c(component);
customElements.define("my-component", Component);
