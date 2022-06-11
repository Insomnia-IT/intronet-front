import { extendTheme } from "@chakra-ui/react";
import { Link } from "./components/link";

export const theme = extendTheme({
  fonts: {
    heading: `'PT Mono', sans-serif`,
    body: `'Open Sans', sans-serif`,
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
