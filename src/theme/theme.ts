import { extendTheme, textDecoration } from "@chakra-ui/react"

export const theme = extendTheme({
  colors: {
    brand: {
      300: '#6BBDB0',
    },
  },
  components: {
    Link: {
      variants: {
        brandLink: {
          color: 'brand.300',
          _hover: {
            color: 'brand.300',
            textDecoration: 'none',
          },
          _focus: {
            outline: 'none',
            boxShadow: 'none',
          },
        }
      }
    }
  }
})
