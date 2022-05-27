import * as React from 'react'
import { Link } from 'wouter';
import { VStack } from '@chakra-ui/react';
import { Heading } from '@chakra-ui/react'
import { InfoText } from 'src/components/infoText/infoText';

export default function Header() {
  return (
    <VStack align={'flex-start'} spacing={'2px'}>
      <Heading as='h1' fontSize={'2rem'} lineHeight={1.5}>Объявления</Heading>
      <InfoText>
        Публикуются в <Link to='/'>инфоцентре</Link>
      </InfoText>
    </VStack>
  )
}
