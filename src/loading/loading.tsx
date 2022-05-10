import * as React from 'react'
import styles from './loading.module.scss'
import { TailSpin } from 'react-loader-spinner'

export default function Loading({ isLoading, children }: { isLoading: boolean, children: React.ReactNode }) {
  if (isLoading) {
    return <TailSpin width={100} height={100} wrapperClass={styles.spinner} color='currentColor' />
  } else {
    { children }
  }
}
