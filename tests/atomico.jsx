import { c } from "atomico";

function component() {
    return <host></host>;
}

customElements.define("my-component", c(component));
