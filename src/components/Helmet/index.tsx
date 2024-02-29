import { type ReactNode } from 'react'
import { Helmet as ReactHelmet } from 'react-helmet'
import { useIntl } from 'react-intl'

interface HelmetProps {
  children?: ReactNode
  title?: string
}
const Helmet = ({ children, title }: HelmetProps): JSX.Element => {
  const intl = useIntl()

  return (
    <ReactHelmet>
      {title && <title>{intl.formatMessage({ id: title })}</title>}
      {children}
    </ReactHelmet>
  )
}

export default Helmet
