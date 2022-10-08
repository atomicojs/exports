import { html, css, c } from "atomico";

function myComponent() {}

export const MyComponent = c(myComponent);

customElements.define("my-component", MyComponent);
