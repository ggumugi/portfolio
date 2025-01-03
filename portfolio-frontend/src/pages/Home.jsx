import { Container, Pagination, Stack, Typography } from '@mui/material'
import Paper from '@mui/material/Paper'
import InputBase from '@mui/material/InputBase' // InputBase 사용
import IconButton from '@mui/material/IconButton'
import SearchIcon from '@mui/icons-material/Search'
import PostList from '../components/post/PostList'
import { useEffect, useState, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchPostsThunk } from '../features/postSlice'
import Grid2 from '@mui/material/Grid2'

const Home = ({ isAuthenticated, user }) => {
   const [page, setPage] = useState(1)
   const [searchQuery, setSearchQuery] = useState('') // 검색어 상태 추가
   const [triggerSearch, setTriggerSearch] = useState(false) // 검색 트리거 상태 추가
   const dispatch = useDispatch()
   const { posts, pagination, loading } = useSelector((state) => state.posts)

   useEffect(() => {
      dispatch(fetchPostsThunk(page))
   }, [dispatch, page])

   const filteredPosts = posts?.filter(
      (post) => post.title?.toLowerCase().replace(/\s+/g, '').includes(searchQuery.toLowerCase().replace(/\s+/g, '')) //
   )

   const handleSearchChange = (e) => {
      setSearchQuery(e.target.value)
      if (e.target.value.length === 0) {
         setTriggerSearch(false)
      }
   }

   const handleKeyDown = (e) => {
      if (e.key === 'Enter') {
         e.preventDefault()
         setTriggerSearch(true)
      }
   }

   // 페이지 변경 처리
   const handlePageChange = useCallback((event, value) => {
      setPage(value)
   }, [])

   // 검색을 트리거했을 때 게시물 필터링
   const filteredPostsToDisplay = triggerSearch ? filteredPosts : posts

   return (
      <Container maxWidth="lg">
         <Paper
            component="form"
            sx={{
               p: '2px 4px',
               display: 'flex',
               alignItems: 'center',
               width: 600,
               margin: 'auto',
               marginTop: '100px',
            }}
         >
            <InputBase
               sx={{
                  ml: 1,
                  flex: 1,
               }}
               placeholder="프로젝트명 검색"
               value={searchQuery}
               onChange={handleSearchChange}
               onKeyDown={handleKeyDown}
            />
            <IconButton type="button" sx={{ p: '10px' }} aria-label="search" onClick={() => setTriggerSearch(true)}>
               <SearchIcon />
            </IconButton>
         </Paper>

         {filteredPostsToDisplay.length > 0 ? (
            <>
               <Grid2 container spacing={3} sx={{ mt: 10 }}>
                  {' '}
                  {filteredPostsToDisplay.map((post) => (
                     <Grid2 xs={12} sm={6} md={4} key={post.id}>
                        {' '}
                        <PostList post={post} isAuthenticated={isAuthenticated} user={user} />
                     </Grid2>
                  ))}
               </Grid2>

               <Stack spacing={6} sx={{ mt: 3, alignItems: 'center' }}>
                  <Pagination
                     sx={{
                        '& .MuiPaginationItem-root': {
                           color: 'white',
                        },
                        '& .MuiPaginationItem-root.Mui-selected': {
                           backgroundColor: 'white',
                           color: 'black',
                        },
                     }}
                     count={pagination.totalPages}
                     page={page}
                     onChange={handlePageChange}
                  />
               </Stack>
            </>
         ) : (
            !loading && (
               <Typography variant="body1" align="center" sx={{ mt: '30px', color: 'white' }}>
                  게시물이 없습니다.
               </Typography>
            )
         )}
      </Container>
   )
}

export default Home
