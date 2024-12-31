import { useState, useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Button from '@mui/material/Button'
import Pagination from '@mui/material/Pagination'
import ButtonGroup from '@mui/material/ButtonGroup'
import Box from '@mui/material/Box'
import Grid2 from '@mui/material/Grid2'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import { styled } from '@mui/material/styles'
import { Container } from '@mui/material'
import Typography from '@mui/material/Typography'
import { updateAuthThunk } from '../../features/authSlice'
import { useNavigate, useParams } from 'react-router-dom'
import PostList from '../post/PostList'
import { fetchPostsByUserIdThunk, getPostsByLikedThunk } from '../../features/postSlice'

const CustomTextField = styled(TextField)({
   '& .MuiInputLabel-root': {
      color: 'white',
   },
   '& .MuiInputBase-input': {
      color: 'white',
   },
   '& .MuiOutlinedInput-root': {
      '& fieldset': {
         borderColor: 'white',
      },
      '&:hover fieldset': {
         borderColor: 'gray',
      },
      '&.Mui-focused fieldset': {
         borderColor: 'white', // 포커스 시 테두리 색상 변경
      },
   },
   '& .MuiInputLabel-root.Mui-focused': {
      color: 'white', // 포커스 시 레이블 색상 변경
   },
})

const UserForm = ({ isAuthenticated, user }) => {
   const { id } = useParams()
   const dispatch = useDispatch()
   const navigate = useNavigate()
   const [nick, setNick] = useState('')
   const [password, setPassword] = useState('')
   const [confirmPassword, setConfirmPassword] = useState('')
   const [selectedButton, setSelectedButton] = useState('게시글')
   const [page, setPage] = useState(1)
   const { posts, pagination, loading } = useSelector((state) => state.posts)

   useEffect(() => {
      if (selectedButton === '게시글') {
         dispatch(fetchPostsByUserIdThunk({ page, id }))
      }
      if (selectedButton === '관심글') {
         dispatch(getPostsByLikedThunk({ page, id }))
      }
   }, [dispatch, page, id, selectedButton])

   // 버튼 클릭 시 상태 업데이트
   const handleButtonClick = (buttonName) => {
      setSelectedButton(buttonName)
      setPage(1)
   }
   const handleUpdate = useCallback(() => {
      if (password !== confirmPassword) {
         alert('비밀번호가 일치하지 않습니다.')
         return
      }

      const formData = new FormData()

      // `nick`, `password` 추가
      formData.append('nick', nick)
      formData.append('password', password)

      // API 호출
      dispatch(updateAuthThunk(formData))
         .unwrap()
         .then(() => {
            navigate('/')
            alert('정보를 수정했습니다.')
         })
         .catch((err) => {
            console.error('정보 수정 실패 : ', err)
            alert('정보를 수정할 수 없습니다.')
         })
   }, [nick, password, confirmPassword, dispatch, navigate])

   const handlePageChange = useCallback((event, value) => {
      setPage(value)
   }, [])

   return (
      <Box
         sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            '& > *': {
               mt: 3,
            },
         }}
      >
         {/* 버튼 그룹 */}
         <ButtonGroup
            variant="outlined"
            aria-label="Basic button group"
            sx={{
               borderColor: 'white',
            }}
         >
            {/* 게시글 버튼 */}
            <Button
               onClick={() => handleButtonClick('게시글')}
               sx={{
                  color: selectedButton === '게시글' ? 'black' : 'white',
                  backgroundColor: selectedButton === '게시글' ? 'white' : 'transparent',
                  borderColor: 'white',
                  fontSize: '16px',
                  padding: '10px 20px',
                  '&:hover': {
                     backgroundColor: 'rgba(255, 255, 255, 0.2)',
                     borderColor: 'white',
                  },
               }}
            >
               게시글
            </Button>

            {/* 내 정보 버튼 */}
            {Number(id) === user?.id && (
               <Button
                  onClick={() => handleButtonClick('내 정보')}
                  sx={{
                     color: selectedButton === '내 정보' ? 'black' : 'white',
                     backgroundColor: selectedButton === '내 정보' ? 'white' : 'transparent',
                     borderColor: 'white',
                     fontSize: '16px',
                     padding: '10px 20px',
                     '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.2)',
                        borderColor: 'white',
                     },
                  }}
               >
                  내 정보
               </Button>
            )}

            {/* 관심글 버튼 */}
            <Button
               onClick={() => handleButtonClick('관심글')}
               sx={{
                  color: selectedButton === '관심글' ? 'black' : 'white',
                  backgroundColor: selectedButton === '관심글' ? 'white' : 'transparent',
                  borderColor: 'white',
                  fontSize: '16px',
                  padding: '10px 20px',
                  '&:hover': {
                     backgroundColor: 'rgba(255, 255, 255, 0.2)',
                     borderColor: 'white',
                  },
               }}
            >
               관심글
            </Button>
         </ButtonGroup>

         {/* 선택된 버튼에 따라 다른 자료 렌더링 */}
         <Box sx={{ mt: '10px' }}>
            {selectedButton === '게시글' && (
               <>
                  {posts.length > 0 ? (
                     <>
                        <Grid2 container spacing={3} sx={{ mt: 3 }}>
                           {posts.map((post) => (
                              <Grid2 item xs={12} sm={6} md={4} key={post.id}>
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
               </>
            )}
            {selectedButton === '내 정보' && (
               <Container maxWidth="sm" sx={{ mt: '35px' }}>
                  <Typography variant="h5" gutterBottom sx={{ color: 'white', mb: '0' }}>
                     email : {user?.email}
                  </Typography>
                  <CustomTextField label="사용자 이름" variant="outlined" fullWidth margin="normal" value={nick} onChange={(e) => setNick(e.target.value)} />
                  <CustomTextField label="비밀번호" variant="outlined" type="password" fullWidth margin="normal" value={password} onChange={(e) => setPassword(e.target.value)} />
                  <CustomTextField label="비밀번호 확인" variant="outlined" type="password" fullWidth margin="normal" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                  <Button variant="contained" color="secondary" fullWidth style={{ marginTop: '10px' }} onClick={handleUpdate}>
                     수정하기
                  </Button>
               </Container>
            )}
            {selectedButton === '관심글' && (
               <>
                  {posts.length > 0 ? (
                     <>
                        <Grid2 container spacing={3} sx={{ mt: 3 }}>
                           {posts?.map((liked) => (
                              <Grid2 item xs={12} sm={6} md={4} key={liked?.Post?.id}>
                                 <PostList post={liked?.Post} isAuthenticated={isAuthenticated} user={user} />
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
               </>
            )}
         </Box>
      </Box>
   )
}

export default UserForm
