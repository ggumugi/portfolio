import { Container } from '@mui/material'
import PostUpdate from '../components/post/PostUpdate'
import { useDispatch } from 'react-redux'
import { createPostThunk } from '../features/postSlice'
import { useCallback } from 'react'

const PostAdd = () => {
   const dispatch = useDispatch()
   const handleSubmit = useCallback(
      (postData) => {
         // postData  -  사용자가 입력한 게시물 데이터
         dispatch(createPostThunk(postData))
            .unwrap()
            .then((post) => {
               window.location.href = `/post/detail/${post.id}`
            })
            .catch((err) => {
               console.error('게시물 등록 실패 : ', err)
               alert('게시물을 등록할 수 없습니다.')
            })
      },
      [dispatch]
   )
   return (
      <Container maxWidth="lg">
         <PostUpdate onSubmit={handleSubmit} />
      </Container>
   )
}

export default PostAdd
