import { Box, Divider, Typography, useTheme } from '@mui/material'
import { Fragment, memo, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import type { Board } from 'src/Models'
import { useGetBoardQuery } from 'src/services/stocks.services'

interface SearchResultProps {
  search: string
  isMd: boolean
}
const SearchResult = ({ search, isMd }: SearchResultProps): JSX.Element => {
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
    { refetchOnMountOrArgChange: true, skip: !pagination.search }
  )

  useEffect(() => {
    if (boardData?.data?.data?.length) {
      setData((prev) => [...prev, ...(boardData?.data?.data ?? [])])
      setTotalItems(boardData?.data?.totalItems)
    } else {
      setData([])
      setTotalItems(0)
    }

    if (!search) {
      setPagination((prev) => ({ ...prev, page: 0, search: '' }))
      return setData([])
    } else {
      setPagination((prev) => ({ ...prev, page: 0, search }))
    }
  }, [boardData, search])

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
    navigate(`/stocks/${code.toLowerCase()}`, { replace: true })
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
        <Fragment key={item.liveboard.Symbol}>
          <Box
            py={1.5}
            px={2}
            sx={{
              cursor: 'pointer',
              '&:hover': {
                background: `${theme.palette.mode === 'dark' ? '#6e6e6e' : '#f8dffa'}`
              }
            }}
            onClick={() => onClickBoard(item.liveboard.Symbol)}
          >
            <Box display='flex' justifyContent='space-between' alignItems='center' mb={0.25}>
              <Typography fontWeight={600}>{item.liveboard.Symbol}</Typography>
              <Typography fontWeight={600}>{item.liveboard.Close}</Typography>
            </Box>
            <Box display='flex' justifyContent='space-between' alignItems='center' gap={0.75}>
              <Typography
                flex={1}
                textOverflow='ellipsis'
                whiteSpace='nowrap'
                overflow='hidden'
                fontSize={14}
              >
                {item.CompanyName}
              </Typography>
              <Typography
                width={80}
                textAlign='right'
                fontWeight={600}
                whiteSpace='nowrap'
                fontSize={14}
                sx={{
                  color:
                    item.liveboard.ChangePercent > 0
                      ? 'success.main'
                      : item.liveboard.ChangePercent < 0
                        ? 'error.main'
                        : 'warning.main'
                }}
              >{`${item.liveboard.Change} / ${item.liveboard.ChangePercent}%`}</Typography>
            </Box>
          </Box>
          <Divider />
        </Fragment>
      ))}
    </Box>
  )
}

export default memo(SearchResult)
