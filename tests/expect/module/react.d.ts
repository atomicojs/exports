import { MyComponent as _MyComponent } from "demo";
import { auto } from "@atomico/react";
export const MyComponent = auto(_MyComponent);
declare namespace JSX {
    interface IntrinsicElements{
      "my-component": Component<typeof _MyComponent>;
    }
}