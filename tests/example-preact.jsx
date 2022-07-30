/** @jsxImportSource preact */
import { useState } from "preact/hooks";
import "./style.css";

export function Component() {
    const [state] = useState();
    return (
        <>
            <button>welcome! {state}</button>
        </>
    );
}
