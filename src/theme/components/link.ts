const brandLink = {
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

const brandLinkClickable = (() => {
  const commonStyle = {
    content: '""',
    position: 'absolute',
    left: '0',
    right: '0',
    height: '1rem',
  }

  return {
    ...brandLink,
    position: 'relative',
    _before: {
      ...commonStyle,
      bottom: '100%',
    },
    _after: {
      ...commonStyle,
      top: '100%'
    }
  }
})()

export const Link = {
  variants: {
    brandLink,
    brandLinkClickable,
  }
}