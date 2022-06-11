import { Link, LinkProps } from '@chakra-ui/react'
import * as React from 'react'

export const ToggleBtn = ({ children, ...rest }: React.PropsWithChildren<LinkProps>) => {
  return (
    <Link
      as={'button'}
      variant={'brandLinkClickable'}
      // display='inline-block'
      // _focus={{
      //   outline: 'none'
      // }}
      {...rest}
    >
      {children}
    </Link>
  )
}