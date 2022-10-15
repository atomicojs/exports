import { MyComponent as _MyComponent } from "demo/atomico";
import { Component } from "@atomico/react/preact";
export const MyComponent: Component<typeof _MyComponent>;
declare namespace JSX {
   interface IntrinsicElements{
      "my-component": Component<typeof _MyComponent>;
   }
}