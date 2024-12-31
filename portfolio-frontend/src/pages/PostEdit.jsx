import { Container } from '@mui/material'
import PostUpdate from '../components/post/PostUpdate'
import { useDispatch, useSelector } from 'react-redux'
import { fetchPostByIdThunk, updatePostThunk } from '../features/postSlice'
import { useCallback, useEffect } from 'react'
import { useParams } from 'react-router-dom'

const PostEdit = () => {
   const { id } = useParams()
   const dispatch = useDispatch()
   const { post } = useSelector((state) => state.posts)
   useEffect(() => {
      dispatch(fetchPostByIdThunk(id))
   }, [dispatch, id])

   const handleSubmit = useCallback(
      (postData) => {
         dispatch(updatePostThunk({ id, postData }))
            .unwrap()
            .then((post) => {
               window.location.href = `/post/detail/${post.id}`
               console.log(postData)
            })
            .catch((err) => {
               console.error('게시물 수정 실패 : ', err)
               alert('게시물을 수정할 수 없습니다.', err)
            })
      },
      [dispatch, id]
   )
   return <Container maxWidth="lg">{post && <PostUpdate onSubmit={handleSubmit} initialValues={post} />}</Container>
}

export default PostEdit
