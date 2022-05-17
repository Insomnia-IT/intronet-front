import * as React from 'react'
import styles from './loading.module.scss'
import { TailSpin } from 'react-loader-spinner'

const padding: number = 5

export default function Loading({ isLoading, children, className, width = 100, height = 100 }: { isLoading: boolean, children: React.ReactNode, className?: string, width?: number, height?: number }) {
  if (isLoading) {
    return <TailSpin width={width - padding * 2} height={height - padding * 2} wrapperClass={styles.spinner + ' ' + className} color='currentColor' wrapperStyle={{ padding: padding.toString() + 'px' }} />
  } else {
    return (<>{children}</>)
  }
}
