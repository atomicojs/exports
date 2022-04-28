import { css, c } from "atomico";
import style from "./style.css";

function component() {
    return <>ea</>;
}

component.styles = [
    style,
    css`
        @import "normalize.css";
        :host {
            width: 300px;
        }
    `,
];

export const Component = c(component);

customElements.define("my-component", Component);
