import { extendTheme } from "@chakra-ui/react";
import { Link } from "./components/link";

export const theme = extendTheme({
  fonts: {
    heading: `'PT Mono', sans-serif`,
    body: `'Open Sans', sans-serif`,
  },
  styles: {
    global: {
      "html, body": {
        color: "gray.700",
      },
    },
  },
  colors: {
    brand: {
      300: "#6BBDB0",
    },
  },
  components: {
    Link,
  },
});
