import { type ReactNode } from 'react'
import { Helmet as ReactHelmet } from 'react-helmet'

const Helmet = ({ children }: { children: ReactNode }): JSX.Element => {
  return <ReactHelmet>{children}</ReactHelmet>
}

export default Helmet
