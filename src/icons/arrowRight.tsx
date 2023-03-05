import * as React from 'react'
import { IICon } from './interfaces';

export default function ArrowRight({ className, width, height }: IICon) {
  return (
    <svg className={className} style={{ width, height }}
         viewBox="0 0 512 512">
      <title>Arrow Forward</title>
      <path height='100%' fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="48"
            d="M268 112l144 144-144 144M392 256H100" />
    </svg>
  )
}
