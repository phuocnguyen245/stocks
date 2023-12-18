import { useState } from 'react'

export interface UseModalProps {
  open: boolean
  toggle: () => void
  show: () => void
  hide: () => void
}

const useModal = (_open?: boolean): UseModalProps => {
  const [open, setOpen] = useState(() => {
    return !!_open
  })

  const toggle = (): void => {
    setOpen((prev) => !prev)
  }

  const show = (): void => {
    setOpen(true)
  }

  const hide = (): void => {
    setOpen(false)
  }

  return { open, toggle, show, hide }
}

export default useModal
