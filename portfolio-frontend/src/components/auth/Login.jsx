import { TextField, Button, Container, Typography } from '@mui/material'
import { useState, useMemo, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { styled } from '@mui/material/styles'
import { loginUserThunk } from '../../features/authSlice'

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
         borderColor: 'white',
      },
   },
})

const Login = () => {
   const [email, setEmail] = useState('')
   const [password, setPassword] = useState('')
   const dispatch = useDispatch()
   const navigate = useNavigate()
   const { loading, error } = useSelector((state) => state.auth)

   const handleLogin = useCallback(
      (e) => {
         e.preventDefault()
         if (email.trim() && password.trim()) {
            dispatch(loginUserThunk({ email, password }))
               .unwrap()
               .then(() => navigate('/')) // 성공 = 메인페이지
               .catch((error) => {
                  console.error('로그인 실패 : ', error)
               }) // 실패 시 에러
         }
      },
      [dispatch, email, password, navigate]
   )
   const loginButtonContent = useMemo(() => (loading ? '로딩중' : '로그인'), [loading])
   if (error) {
      alert('로그인 중 오류 발생 : ' + error.message)
   }
   return (
      <Container maxWidth="lg" sx={{ marginTop: '150px' }}>
         <Typography variant="h4" gutterBottom sx={{ color: 'white' }}>
            로그인
         </Typography>

         <form onSubmit={handleLogin}>
            <CustomTextField label="이메일" value={email} name="email" fullWidth margin="normal" onChange={(e) => setEmail(e.target.value)} />
            <CustomTextField label="비밀번호" type="password" value={password} name="password" fullWidth margin="normal" onChange={(e) => setPassword(e.target.value)} />

            <Button variant="contained" color="secondary" type="submit" fullWidth sx={{ position: 'relative', marginTop: '20px', marginBottom: '5px' }} disabled={loading}>
               {loginButtonContent}
            </Button>
         </form>

         <p style={{ color: 'white' }}>
            계정이 없으신가요?{' '}
            <Link to="/signup" style={{ color: '#A0A0FF', textDecoration: 'none' }}>
               회원가입
            </Link>
         </p>
      </Container>
   )
}

export default Login
