// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference types="react-scripts" />
import { type AriaAttributes, type DOMAttributes } from 'react'

interface Error {
  error?: FetchBaseQueryError | SerializedError | undefined
}

declare module '@mui/material/styles' {
  interface BreakpointOverrides {
    xs: true // removes the `xs` breakpoint
    sm: true
    md: true
    lg: true
    xl: true
  }
}
declare module 'react' {
  interface ImgHTMLAttributes<T> extends HTMLAttributes<T> {
    fetchPriority?: 'high' | 'low' | 'auto'
  }
}
