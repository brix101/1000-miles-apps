declare module "*.jpg";
declare module "*.png";
declare module "*.woff2";
declare module "*.woff";
declare module "*.ttf";

declare module "*.svg" {
  import React = require("react");

  export const ReactComponent: React.SFC<
    React.SVGProps<SVGSVGElement> & {
      width?: string | number;
      height?: string | number;
    }
  >;
  const src: string;
  export default src;
}
