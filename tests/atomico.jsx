import { c } from "atomico";
import style from "./style.css";

function component() {
    console.log(style);
    return <host class="button">"ea"</host>;
}

customElements.define("my-component", c(component));
