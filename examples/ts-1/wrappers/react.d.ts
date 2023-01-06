import { Component as _Component } from "with-ts/";
import { Component } from "@atomico/react";
export const Component: Component<typeof _Component>;
declare namespace JSX {
   interface IntrinsicElements{
      "my-component": Component<typeof _Component>;
   }
}