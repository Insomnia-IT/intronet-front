import * as React from 'react'
import { Container } from 'react-bulma-components'
import Note from './note/note'

export default function NotePage() {
  const params = new URLSearchParams(window.location.search)
  return (
    <Container>
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        padding: '20px'
      }}>
        <Note id={parseInt(params.get('id'))}></Note>
      </div>
    </Container>
  )
}
