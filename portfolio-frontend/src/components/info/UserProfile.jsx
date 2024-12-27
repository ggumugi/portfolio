import { useState, useEffect, useCallback } from 'react'
import { Box, Button, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { updateAuthThunk } from '../../features/authSlice'

const UserProfile = ({ isAuthenticated, user }) => {
   const dispatch = useDispatch()
   const navigate = useNavigate()
   const [imagePreview, setImagePreview] = useState(`${process.env.REACT_APP_API_URL}/userUploads${user?.img}`)
   const [imgFile, setImgFile] = useState(null) // 이미지 파일 객체

   // 사진 업로드 핸들러
   const handleImageChange = useCallback((e) => {
      const file = e.target.files && e.target.files[0]
      if (file) {
         const reader = new FileReader()
         reader.onloadend = () => {
            setImagePreview(reader.result)
         }
         reader.readAsDataURL(file)
         setImgFile(file)
      }
   }, [])

   // 이미지 업로드 및 저장 처리
   const handleImageUpload = useCallback(
      (e) => {
         e.preventDefault()

         const formData = new FormData()
         if (imgFile) {
            const encodedFile = new File([imgFile], encodeURIComponent(imgFile.name), { type: imgFile.type })
            formData.append('img', encodedFile) // 이미지 파일 추가
         }

         dispatch(updateAuthThunk(formData))
            .unwrap()
            .then(() => {
               console.log(formData)
               window.location.href = '/' // 성공 후 홈으로 이동
            })
            .catch((err) => {
               console.error('프로필 등록 실패: ', err)
               alert('프로필을 등록할 수 없습니다.', err)
            })
      },
      [imgFile, dispatch]
   )

   useEffect(() => {
      if (!isAuthenticated) {
         alert('로그인이 필요합니다.')
         navigate('/login')
      }
   }, [isAuthenticated, navigate])

   return (
      <Box
         sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            mt: 4,
         }}
      >
         {/* 프로필 사진 */}
         <Box
            sx={{
               width: '250px',
               height: '250px',
               borderRadius: '50%',
               overflow: 'hidden',
               mb: 2,
               display: 'flex',
               justifyContent: 'center',
               alignItems: 'center',
               border: '2px solid #ccc',
            }}
         >
            {imagePreview ? (
               <Box
                  component="img"
                  src={imagePreview}
                  alt="프로필 사진"
                  sx={{
                     width: '100%',
                     height: '100%',
                     objectFit: 'cover',
                  }}
               />
            ) : (
               <Typography variant="h5" sx={{ color: 'gray' }}>
                  +
               </Typography>
            )}
         </Box>

         {/* 사진 업로드 버튼 */}
         <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
               variant="contained"
               color="secondary"
               component="label"
               sx={{
                  mb: 2,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
               }}
            >
               프로필 업로드
               <input type="file" name="img" accept="image/*" hidden onChange={handleImageChange} />
            </Button>

            {/* 저장 버튼 */}
            <Button
               variant="contained"
               color="secondary"
               onClick={handleImageUpload}
               sx={{
                  mb: 2,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
               }}
            >
               저장
            </Button>
         </Box>

         {/* 사용자 이름 */}
         <Typography variant="h6" sx={{ color: 'white' }}>
            {user?.nick}
         </Typography>
      </Box>
   )
}

export default UserProfile
