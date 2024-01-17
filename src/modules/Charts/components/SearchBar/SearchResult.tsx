import { Box, Typography } from '@mui/material'
import React, { ChangeEvent, UIEventHandler, useEffect, useRef, useState } from 'react'
import type { Board } from 'src/Models'
import { useGetBoardQuery } from 'src/services/stocks.services'

const SearchResult = ({ search }: { search: string }): JSX.Element => {
  const boxRef = useRef<HTMLDivElement>(null)
  const [data, setData] = useState<Board[]>([])
  const [pagination, setPagination] = useState({
    page: 0,
    size: 10,
    totalItems: 0,
    search: ''
  })

  const { data: boardData } = useGetBoardQuery(
    { ...pagination },
    { refetchOnMountOrArgChange: true, skip: !pagination.search }
  )

  useEffect(() => {
    setPagination((prev) => ({ ...prev, search }))
  }, [search])

  useEffect(() => {
    if (boardData?.data?.data?.length) {
      setData((prev) => [...prev, ...(boardData?.data?.data ?? [])])
    }
  }, [boardData])

  useEffect(() => {
    const boxElement = boxRef.current
    boxElement?.addEventListener('scroll', onScroll)

    return () => {
      boxElement?.removeEventListener('scroll', onScroll)
    }
  }, [])

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onScroll = (): void => {
    if (boxRef?.current) {
      const scrollHeight = boxRef?.current?.scrollHeight ?? 0
      const scrollTop = boxRef?.current?.scrollTop ?? 0
      const clientHeight = boxRef?.current?.clientHeight ?? 0

      if (scrollTop + clientHeight >= scrollHeight) {
        // if (pagination.page * pagination.size < pagination.totalItems) {
        setPagination((prev) => ({ ...prev, page: prev.page + 1 }))
        // }
      }
    }
  }

  return (
    <Box
      bgcolor={'#f9f3fe'}
      borderRadius={2}
      width='100%'
      maxWidth='410px'
      maxHeight='410px'
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
          borderRadius={2}
          sx={{
            cursor: 'pointer',
            '&:hover': {
              background: '#f8dffa'
            }
          }}
        >
          <Box display='flex' justifyContent='space-between' alignItems='center' mb={0.25}>
            <Typography>{item.liveboard.Symbol}</Typography>
            <Typography>{item.liveboard.Close}</Typography>
          </Box>
          <Box display='flex' justifyContent='space-between' alignItems='center'>
            <Typography flex={1} textOverflow='ellipsis' whiteSpace='nowrap' overflow='hidden'>
              {item.CompanyName}
            </Typography>
            <Typography
              width={80}
              textAlign='right'
            >{`${item.liveboard.Change} / ${item.liveboard.ChangePercent}`}</Typography>
          </Box>
        </Box>
      ))}
    </Box>
  )
}

export default SearchResult
