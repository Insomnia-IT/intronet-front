import { extendTheme, theme as defaultTheme } from "@chakra-ui/react"
import { Link } from "./components/link"

export const theme = extendTheme({
  colors: {
    brand: {
      300: '#6BBDB0',
    },
  },
  components: {
    Link,
  }
})
