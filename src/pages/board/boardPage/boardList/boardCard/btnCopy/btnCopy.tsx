import { LinkIcon } from '@chakra-ui/icons'
import { Link, LinkProps, Text } from '@chakra-ui/react'
import * as React from 'react'
import { categoriesStore } from 'src/stores';

interface IBtnCopy extends LinkProps {
  noteId: INotes['id']
  categoryId: INotes['categoryId']
  show?: boolean
}

export const BtnCopy = ({ show = true, noteId, categoryId, ...rest }: IBtnCopy) => {
  const [isСopied, setIsCopied] = React.useState(false)
  const copyUrl = () => {
    if (isСopied) return
    const currentUrl = document.location.href
    navigator.clipboard.writeText(currentUrl + '?id=' + noteId.toString())
      .then(() => {
        setIsCopied(true)
        setTimeout(() => setIsCopied(prev => !prev), 3000)
      })
  }
  return (
    <>
      {show && (
        <Link
          onClick={copyUrl}
          variant={'brandLinkClickable'}
          as={'button'}
          display={'flex'}
          alignItems={'center'}
          gap={1}
          {...rest}
        >
          <LinkIcon
            display={'block'}
          />
          <Text>
            {!isСopied ? 'Копировать ссылку' : 'Скопировано'}
          </Text>
        </Link>
      )}
    </>
  )
}
