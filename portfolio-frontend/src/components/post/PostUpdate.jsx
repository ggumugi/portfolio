import { useState, useCallback, useMemo } from 'react'
import { Box, IconButton, TextField, Button } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { useNavigate } from 'react-router-dom'

const PostUpdate = ({ onSubmit, initialValues = {} }) => {
   const navigate = useNavigate()
   const [imagePreview, setImagePreview] = useState(initialValues.img ? process.env.REACT_APP_API_URL + initialValues.img : '')

   const [title, setTitle] = useState(initialValues.title || '')
   const [imgFile, setImgFile] = useState(null)
   const [comment, setComment] = useState(initialValues.comment || '')
   const [projectUrl, setProjectUrl] = useState(initialValues.projectUrl || '')

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

   const handleRemoveImage = useCallback(() => {
      setImagePreview(null)
   }, [])

   const handleCancel = useCallback(() => {
      const confirmCancel = window.confirm('정말로 취소하시겠습니까?')
      if (confirmCancel) {
         navigate('/')
      }
   }, [navigate])
   const handleSubmit = useCallback(
      (e) => {
         e.preventDefault()
         if (!title.trim()) {
            alert('제목을 입력하세요.')
            return
         }
         if (!projectUrl.trim()) {
            alert('프로젝트 URL을 입력하세요.')
            return
         }
         const formData = new FormData()
         formData.append('title', title)
         formData.append('comment', comment)
         formData.append('projectUrl', projectUrl)
         if (imgFile) {
            const encodedFile = new File([imgFile], encodeURIComponent(imgFile.name), { type: imgFile.type })
            formData.append('img', encodedFile) //이미지 파일 추가
         } else {
            formData.append('img', null)
         }
         onSubmit(formData)
      },
      [title, comment, projectUrl, imgFile, onSubmit]
   )
   const submitButtonLabel = useMemo(() => (initialValues.id ? '수정하기' : '등록하기'), [initialValues.id])

   return (
      <Box
         component="form"
         sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            '& .MuiTextField-root': {
               backgroundColor: 'lightblack',
               '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                     borderColor: 'white',
                  },
                  '&:hover fieldset': {
                     borderColor: 'white',
                  },
                  '&.Mui-focused fieldset': {
                     borderColor: 'white',
                  },
               },
               '& .MuiInputLabel-root': {
                  color: 'white',
               },
               '& .MuiInputBase-input': {
                  color: 'white',
               },
            },
         }}
         noValidate
         autoComplete="off"
         onSubmit={handleSubmit}
      >
         {/* 제목 입력 칸 */}
         <div style={{ width: '80%', margin: '0 auto' }}>
            <TextField
               id="outlined-title"
               label="제목"
               fullWidth
               value={title}
               onChange={(e) => setTitle(e.target.value)}
               sx={{
                  mt: 2,
               }}
            />
         </div>

         {/* 이미지 미리보기 칸 */}
         <div>
            <Box
               sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  mt: 3,
                  mb: 1,
                  position: 'relative',
               }}
            >
               {imagePreview ? (
                  <Box
                     sx={{
                        position: 'relative',
                        width: '800px',
                        height: '400px',
                     }}
                  >
                     <Box
                        component="img"
                        src={imagePreview}
                        alt="미리보기"
                        sx={{
                           width: '800px',
                           height: '400px',
                           objectFit: 'contain',
                           borderRadius: '8px',
                        }}
                     />
                     <IconButton
                        onClick={handleRemoveImage}
                        sx={{
                           position: 'absolute',
                           top: '8px',
                           right: '8px',
                           backgroundColor: 'rgba(0,0,0,0.5)',
                           color: 'white',
                           '&:hover': {
                              backgroundColor: 'rgba(0,0,0,0.7)',
                           },
                        }}
                     >
                        <CloseIcon />
                     </IconButton>
                  </Box>
               ) : (
                  <Box
                     sx={{
                        width: '800px',
                        height: '400px',
                        backgroundColor: 'gray',
                        border: '1px dashed white',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderRadius: '8px',
                        color: 'white',
                     }}
                  >
                     이미지 미리보기
                  </Box>
               )}
               <Button variant="contained" color="secondary" component="label" sx={{ mt: 1 }}>
                  이미지 업로드
                  <input type="file" accept="image/*" hidden onChange={handleImageChange} />
               </Button>
            </Box>
         </div>

         {/* 설명 입력 칸 */}
         <div style={{ width: '80%', margin: '0 auto' }}>
            <TextField
               id="outlined-description"
               label="설명"
               multiline
               rows={5}
               fullWidth
               value={comment}
               onChange={(e) => setComment(e.target.value)}
               sx={{
                  mt: 2,
               }}
            />
         </div>

         {/* 주소 입력 칸 */}
         <div style={{ width: '80%', margin: '0 auto' }}>
            <TextField
               id="outlined-url"
               label="주소"
               fullWidth
               value={projectUrl}
               onChange={(e) => setProjectUrl(e.target.value)}
               sx={{
                  mt: 2,
               }}
            />
         </div>

         {/* 버튼들을 한 줄에 나란히 배치 */}
         <Box
            sx={{
               display: 'flex',
               justifyContent: 'space-between',
               width: '30%',
               mt: 3,
            }}
         >
            {/* 등록하기 버튼 */}
            <Button variant="contained" color="secondary" type="submit">
               {submitButtonLabel}
            </Button>

            {/* 취소하기 버튼 */}
            <Button variant="contained" color="error" onClick={handleCancel}>
               취소하기
            </Button>
         </Box>
      </Box>
   )
}

export default PostUpdate
