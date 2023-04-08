import "preact";

module "preact" {
  namespace JSX {
    export interface HTMLAttributes {
        flex?: boolean;
        column?: boolean;
        gap?: boolean | number | string;
    }
  }

}
