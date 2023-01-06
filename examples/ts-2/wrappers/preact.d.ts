import { Component1 as _Component1 } from "ts-2/";
import { Component } from "@atomico/react/preact";
export const Component1: Component<typeof _Component1>;
declare namespace JSX {
   interface IntrinsicElements{
      "my-component-1": Component<typeof _Component1>;
   }
}