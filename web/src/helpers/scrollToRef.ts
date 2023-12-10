
export const scrollToRef = (
  ref: React.RefObject<HTMLElement>,
  smooth: boolean = false
): void => {
  ref.current.scrollIntoView(
    {
      behavior: smooth ? 'smooth' : 'auto'
    }
  )
}
