import { Card, CardContent, CardMedia, Typography, Divider } from '@mui/material'
import { Link } from 'react-router-dom'

const PostList = ({ post, isAuthenticated, user }) => {
   const { title, img, comment, UserId } = post

   return (
      <Card
         sx={{
            margin: 'auto',
            mb: 3,
            backgroundColor: 'black',
            borderRadius: '8px',
            height: '330px', // 카드 높이 줄이기
            width: '350px', // 카드 너비 100%로 설정
            display: 'flex',
            flexDirection: 'column', // 콘텐츠 세로 정렬
         }}
      >
         {/* 카드 미리보기 이미지 */}
         {img ? (
            <Link to={`/post/detail/${post.id}`}>
               <CardMedia
                  component="img"
                  height="200px"
                  image={process.env.REACT_APP_API_URL + img}
                  alt={title}
                  sx={{
                     objectFit: 'container',
                     borderTopLeftRadius: '8px',
                     borderTopRightRadius: '8px',
                     backgroundColor: '#f0f0f0',
                  }}
               />
            </Link>
         ) : (
            <Link to={`/post/detail/${post.id}`}>
               <CardMedia
                  component="img"
                  height="200px"
                  image="/images/nophoto1.jpg"
                  alt={title}
                  sx={{
                     objectFit: 'cover',
                     borderTopLeftRadius: '8px',
                     borderTopRightRadius: '8px',
                     backgroundColor: '#f0f0f0',
                  }}
               />
            </Link>
         )}

         <CardContent sx={{ color: 'white', flexGrow: 1, padding: '10px' }}>
            {/* 제목 */}
            <Typography
               variant="h6"
               sx={{
                  fontWeight: 'bold',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  fontSize: '16px',
               }}
            >
               {title}
            </Typography>

            {/* 설명 */}
            <Typography
               variant="body2"
               sx={{
                  mt: 1,
                  mb: 2,
                  fontSize: '12px', // 설명 크기 줄이기
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
               }}
            >
               {comment ? comment : '설명이 없습니다.'}
            </Typography>
         </CardContent>

         <Divider sx={{ borderColor: '#444' }} />

         <CardContent sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Link to={`/user/${UserId}`}>
               <Typography variant="body2" sx={{ color: '#bbb' }}>
                  작성자: {post?.User.nick}
               </Typography>
            </Link>
         </CardContent>
      </Card>
   )
}

export default PostList
