import * as React from 'react'
import { Global } from '@emotion/react'

const Fonts = () => (
  <Global
    styles={`
      /* latin-cyrilic */
      @font-face {
        font-family: 'PT-Mono';
        font-style: normal;
        font-weight: 700;
        font-display: swap;
        src: url('./fonts/fonts/PT-Mono_Bold.woff2') format('woff2');
        unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
      }
      /* latin-cyrilic */
      @font-face {
        font-family: 'Open-Sans';
        font-style: normal;
        font-weight: 400;
        font-display: swap;
        src: url('./fonts/fonts/Open-Sans_Regular.woff2') format('woff2');
        unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
      }
      `}
  />
)

export default Fonts