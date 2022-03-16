import { c } from "atomico";
import style from "./style.css";

function component() {
    return <>ea</>;
}

component.styles = style;

export const Component = c(component);

customElements.define("my-component", Component);
