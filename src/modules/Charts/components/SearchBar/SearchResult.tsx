import { Box, Typography, useTheme } from '@mui/material'
import { memo, useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router'
import type { Board } from 'src/models'
import { useGetBoardQuery } from 'src/services/stocks.services'

const SearchResult = ({ search }: { search: string }): JSX.Element => {
  const theme = useTheme()
  const boxRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()
  const location = useLocation()

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
  }, [boardData])

  useEffect(() => {
    if (search) {
      setPagination((prev) => ({ ...prev, page: 0, search }))
    }
    setData([])
  }, [search])

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
      width='500px'
      maxWidth='600px'
      maxHeight='460px'
      sx={{
        overflowY: 'auto',
        overflowX: 'hidden'
      }}
      className='watch-list'
      ref={boxRef}
    >
      {data.map((item) => (
        <Box
          key={item.liveboard.Symbol}
          p={2}
          m={1}
          borderRadius={2}
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
            <Typography flex={1} textOverflow='ellipsis' whiteSpace='nowrap' overflow='hidden'>
              {item.CompanyName}
            </Typography>
            <Typography
              width={80}
              textAlign='right'
              fontWeight={600}
              sx={{
                color:
                  item.liveboard.ChangePercent > 0
                    ? 'success.main'
                    : item.liveboard.ChangePercent < 0
                      ? 'error.main'
                      : 'warning.main'
              }}
            >{`${item.liveboard.Change} / ${item.liveboard.ChangePercent}`}</Typography>
          </Box>
        </Box>
      ))}
    </Box>
  )
}

export default memo(SearchResult)
