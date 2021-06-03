import { c } from "atomico";
import style from "./style.css";

function component() {
    return <>ea</>;
}

component.styles = style;

customElements.define("my-component", c(component));
