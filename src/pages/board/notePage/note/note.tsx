import * as React from 'react'
import { notesStore } from 'src/stores';

export default function Note({ id }: { id: number }) {
  const note = notesStore.getNote(id)

  return (
    <article>
      <h2 className='mb-2 is-size-4 has-text-weight-semibold'>{note.title}</h2>
      <p>{note.text}</p>
    </article>
  )
}
