import * as React from 'react'
import { Link as WouterLink } from 'wouter';
import { VStack } from '@chakra-ui/react';
import { Heading, Text, Link } from '@chakra-ui/react'
import { Box } from '@chakra-ui/react';

export default function Header() {
  return (
    <VStack align={'start'} spacing={[0, null, 1]}>
      <Heading
        as='h1'
        maxWidth={['250px', null, 'none']}
        size={'xl'}
        color={'gray.700'}
      >
        Доска Объявлений
      </Heading>
      <Text as='p' fontSize='sm' color={'gray.400'}>
        Объявление можно опубликовать в <Link as={WouterLink} to='/' variant={'brandLinkClickable'}>инфоцентре</Link>
      </Text>
    </VStack>
  )
}
