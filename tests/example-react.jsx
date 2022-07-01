import { useState } from "react";
import "./style.css";

export function Component() {
    const [state] = useState();
    return (
        <>
            <button>welcome! {state}</button>
        </>
    );
}
