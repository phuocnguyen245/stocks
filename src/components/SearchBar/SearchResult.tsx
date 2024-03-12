import { Box, Divider, Typography, useTheme } from '@mui/material'
import { Fragment, memo, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import type { Board } from 'src/models'
import { useGetBoardQuery } from 'src/services/stocks.services'

interface SearchResultProps {
  search: string
  isMd: boolean
  isTextField?: boolean
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setValue?: (name: string, value: string) => void
}

const SearchResult = ({ setValue, isTextField, search, isMd }: SearchResultProps): JSX.Element => {
  const theme = useTheme()
  const boxRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  const [data, setData] = useState<Board[]>([])
  const [pagination, setPagination] = useState({
    page: 0,
    size: 10,
    search: ''
  })
  const [totalItems, setTotalItems] = useState(0)

  const { data: boardData } = useGetBoardQuery(
    { ...pagination },
    { refetchOnMountOrArgChange: true, skip: !search }
  )

  useEffect(() => {
    setData([])
    setPagination((prev) => {
      const newPagination = { ...prev, page: 0, search: search || '' }
      return newPagination
    })
  }, [search])

  useEffect(() => {
    if (boardData?.data?.data?.length) {
      setData((prev) => [...prev, ...(boardData?.data?.data ?? [])])
      setTotalItems(boardData?.data?.totalItems)
    } else {
      setData([])
      setTotalItems(0)
    }
  }, [boardData])

  useEffect(() => {
    if (data.length) {
      const boxElement = boxRef.current
      boxElement?.addEventListener('scroll', onScroll)

      return () => {
        boxElement?.removeEventListener('scroll', onScroll)
      }
    }
  }, [data])

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onScroll = (): void => {
    if (boxRef?.current) {
      const scrollHeight = boxRef?.current?.scrollHeight ?? 0
      const scrollTop = boxRef?.current?.scrollTop ?? 0
      const clientHeight = boxRef?.current?.clientHeight ?? 0

      if (scrollTop + clientHeight >= scrollHeight) {
        if ((pagination.page + 1) * pagination.size < totalItems) {
          setPagination((prev) => ({ ...prev, page: prev.page + 1 }))
        }
      }
    }
  }

  const onClickBoard = (code: string): void => {
    if (isTextField) {
      if (setValue) {
        setValue('code', code)
        return setData([])
      }
    }
    return navigate(`/charts/${code.toLowerCase()}`, { replace: true })
  }

  return (
    <Box
      bgcolor={theme.palette.mode === 'dark' ? '#3c3c3c' : '#f9f3fe'}
      borderRadius={2}
      width={isMd ? '100%' : '414px'}
      maxWidth={isMd ? '100%' : '400px'}
      maxHeight={isMd ? '414px' : '414px'}
      sx={{
        overflowY: 'auto',
        overflowX: 'hidden'
      }}
      className='watch-list'
      ref={boxRef}
    >
      {data.map((item) => (
        <Fragment key={item.symbol}>
          <Box
            py={1.5}
            px={2}
            sx={{
              cursor: 'pointer',
              '&:hover': {
                background: `${theme.palette.mode === 'dark' ? '#6e6e6e' : '#f8dffa'}`
              }
            }}
            onClick={() => onClickBoard(item.symbol)}
          >
            <Box display='flex' justifyContent='space-between' alignItems='center' mb={0.25}>
              <Typography fontWeight={600}>{item.symbol}</Typography>
              <Typography fontWeight={600}>{item.close}</Typography>
            </Box>
            <Box display='flex' justifyContent='space-between' alignItems='center' gap={0.75}>
              <Typography
                flex={1}
                textOverflow='ellipsis'
                whiteSpace='nowrap'
                overflow='hidden'
                fontSize={14}
              >
                {item.companyName}
              </Typography>
              <Typography
                width={80}
                textAlign='right'
                fontWeight={600}
                whiteSpace='nowrap'
                fontSize={14}
                sx={{
                  color:
                    item.changePercent > 0
                      ? 'success.main'
                      : item.changePercent < 0
                        ? 'error.main'
                        : 'warning.main'
                }}
              >{`${item.change} / ${item.changePercent}%`}</Typography>
            </Box>
          </Box>
          <Divider />
        </Fragment>
      ))}
    </Box>
  )
}

export default memo(SearchResult)
