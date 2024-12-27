import { Paper, Box, Typography, IconButton, Button } from '@mui/material'
import { useNavigate, useParams } from 'react-router-dom'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { useEffect, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchPostByIdThunk } from '../../features/postSlice'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'

const PostView = ({ isAuthenticated, user }) => {
   const { id } = useParams()
   const navigate = useNavigate()
   const dispatch = useDispatch()
   const { post, loading, error } = useSelector((state) => state.posts)

   useEffect(() => {
      dispatch(fetchPostByIdThunk(id)) // 게시글 데이터를 불러옵니다.
   }, [dispatch, id])

   const handleDelete = useCallback(() => {}, [])

   // 로딩 중 또는 에러 처리
   if (loading) return <p>로딩 중...</p>
   if (error) return <p>에러발생 : {error}</p>

   return (
      <>
         {post && post.User.id && (
            <Box
               sx={{
                  mt: '30px',
                  paddingTop: '25px',
               }}
            >
               <Paper
                  sx={{
                     width: '90%',
                     padding: '20px',
                     display: 'flex',
                     flexDirection: 'column',
                     alignItems: 'center',
                     position: 'relative',
                     borderRadius: '8px',
                     backgroundColor: 'rgb(40,40,40)',
                     color: 'white',
                     m: 'auto',
                  }}
               >
                  {/* 뒤로가기 버튼 */}
                  <IconButton
                     onClick={() => navigate('/')}
                     sx={{
                        position: 'absolute',
                        top: '10px',
                        left: '10px', // 좌측 상단으로 이동
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        color: 'white',
                        '&:hover': {
                           backgroundColor: 'rgba(0, 0, 0, 0.7)',
                        },
                     }}
                  >
                     <ArrowBackIcon />
                  </IconButton>

                  {/* 제목 */}
                  <Typography
                     variant="h4"
                     gutterBottom
                     sx={{
                        fontWeight: 'bold',
                        mt: '25px',
                        mb: '20px',
                        wordBreak: 'break-word', // 긴 단어가 잘리거나 줄 바꿈이 되도록 설정
                        overflowWrap: 'break-word', // 긴 텍스트가 자동으로 줄 바꿈되도록 설정
                        whiteSpace: 'normal', // 줄 바꿈을 허용하도록 설정
                     }}
                  >
                     {post.title}
                  </Typography>

                  {/* 이미지 */}
                  <Box
                     sx={{
                        width: '600px',
                        height: '400px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginBottom: '30px',
                     }}
                  >
                     {post.img ? (
                        <Box
                           component="img"
                           src={`${process.env.REACT_APP_API_URL}${post.img}`} // 이미지 URL
                           alt="게시글 이미지"
                           sx={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'contain',
                              borderRadius: '8px',
                           }}
                        />
                     ) : (
                        <Box
                           component="img"
                           src="/images/nophoto1.jpg" // 이미지 URL
                           alt="게시글 이미지"
                           sx={{
                              maxWidth: '100%',
                              height: 'auto',
                              objectFit: 'contain',
                              borderRadius: '8px',
                           }}
                        />
                     )}
                  </Box>

                  {/* 설명 */}
                  <Typography variant="body1" sx={{ textAlign: 'justify', mb: '50px' }}>
                     {post.comment}
                  </Typography>

                  {/* 주소 */}
                  <Typography variant="body2" sx={{ color: 'lightgray', m: '0 auto' }}>
                     <a href={post.projectUrl.startsWith('http') ? post.projectUrl : `http://${post.projectUrl}`} target="_blank" rel="noopener noreferrer" style={{ color: 'lightgray' }}>
                        {post.projectUrl}
                     </a>
                  </Typography>
               </Paper>

               {/* 수정 및 삭제 버튼 */}
               {isAuthenticated && post.User.id === user.id && (
                  <Box
                     sx={{
                        display: 'flex',
                        justifyContent: 'space-between',

                        width: '90%',
                        m: 'auto',
                        mt: '50px',
                     }}
                  >
                     {/* 수정 버튼 */}
                     <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => navigate(`/post/edit/${id}`)} // 수정 페이지로 이동
                        sx={{
                           width: '30%', // 버튼 너비 조정
                           fontSize: '16px', // 글씨 크기
                        }}
                     >
                        수정
                     </Button>

                     {/* 삭제 버튼 */}
                     <Button
                        variant="contained"
                        color="error"
                        onClick={handleDelete} // 삭제 처리
                        sx={{
                           width: '30%', // 버튼 너비 조정
                           fontSize: '16px', // 글씨 크기
                        }}
                     >
                        삭제
                     </Button>
                  </Box>
               )}
               {isAuthenticated && post.User.id !== user.id && (
                  <Box
                     sx={{
                        display: 'flex',
                        justifyContent: 'center',

                        width: '90%',
                        m: 'auto',
                        mt: '50px',
                     }}
                  >
                     {/* 좋아요 버튼 */}
                     <Button
                        variant="contained"
                        color="primary"
                        onClick={() => {}} // 수정 페이지로 이동
                        sx={{
                           width: '30%', // 버튼 너비 조정
                           fontSize: '16px', // 글씨 크기
                        }}
                     >
                        <FavoriteBorderIcon />
                        &nbsp; 좋아요
                     </Button>
                  </Box>
               )}
            </Box>
         )}
      </>
   )
}

export default PostView
