import React, { useMemo } from 'react'
import { useAppSelector } from 'src/store'
import Modal from './Modal'
import Drawer from './Drawer'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ResponsiveModal = (props: any): JSX.Element => {
  const { isMdWindow } = useAppSelector((state) => state.Stocks)

  const renderComponent = useMemo(() => {
    if (isMdWindow) {
      return <Modal {...props} />
    }
    return <Drawer {...props} />
  }, [props, isMdWindow])

  return <>{renderComponent}</>
}

export default ResponsiveModal
