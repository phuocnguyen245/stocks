import { Skeleton as MUISkeleton, type SkeletonProps } from '@mui/material'

interface MUISkeletonProps extends SkeletonProps {}
const Skeleton = (props: MUISkeletonProps): JSX.Element => {
  return <MUISkeleton {...props} />
}

export default Skeleton
