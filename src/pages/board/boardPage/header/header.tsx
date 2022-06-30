import * as React from 'react'
import { Link as WouterLink } from 'wouter';
import { VStack } from '@chakra-ui/react';
import { Text, Link } from '@chakra-ui/react'
import { Heading } from 'src/components/heading/heading';

export default function Header() {
  return (
    <VStack align={'start'} spacing={[0, null, 1]}>
      <Heading
        maxWidth={['250px', null, 'none']}
        level={1}
      >
        Доска Объявлений
      </Heading>
      <Text as='p' fontSize='sm' color={'gray.400'}>
        Объявление можно опубликовать в <Link as={WouterLink} to='/' variant={'brandLinkClickable'}>инфоцентре</Link>
      </Text>
    </VStack>
  )
}
