import { InfoOutlineIcon } from '@chakra-ui/icons'
import { TextProps, Text, HStack } from '@chakra-ui/react'
import * as React from 'react'

export interface IInfoText extends TextProps {
  spacing?: number | string
}

export const InfoText = ({ children, ...rest }: React.PropsWithChildren<IInfoText>) => {
  return (
    <HStack spacing={'4px'} align={'center'}>
      <InfoOutlineIcon boxSize={'20px'} color={'gray.300'}></InfoOutlineIcon>
      <Text as='p' fontSize='sm' color={'gray.300'} {...rest}>
        {children}
      </Text>
    </HStack>
  )
}
