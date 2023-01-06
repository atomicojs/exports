import { Component2 as _Component2 } from "ts-2/a";
import { Component } from "@atomico/react";
export const Component2: Component<typeof _Component2>;
declare namespace JSX {
   interface IntrinsicElements{
      "my-component-2": Component<typeof _Component2>;
   }
}