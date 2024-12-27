import { TextField, Button, Container, Typography } from '@mui/material'
import { useState, useCallback } from 'react'
import { styled } from '@mui/material/styles'
import { useDispatch, useSelector } from 'react-redux'
import { registerUserThunk } from '../../features/authSlice'
import CircularProgress from '@mui/material/CircularProgress'

// import { useDispatch, useSelector } from 'react-redux'

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

const Signup = () => {
   const [email, setEmail] = useState('')
   const [nick, setNick] = useState('')
   const [password, setPassword] = useState('')
   const [confirmPassword, setConfirmPassword] = useState('')
   const [isSignupComplete, setIsSignupComplete] = useState(false)
   const dispatch = useDispatch()
   const { loading, error } = useSelector((state) => state.auth)
   const handleSignup = useCallback(() => {
      if (!email.trim() || !nick.trim() || !password.trim() || !confirmPassword.trim()) {
         alert('모든 필드를 입력해주세요.')
         return
      }

      if (password !== confirmPassword) {
         alert('비밀번호가 일치하지 않습니다.')
         return
      }
      dispatch(registerUserThunk({ email, nick, password }))
         .unwrap()
         .then(() => {
            setIsSignupComplete(true)
         })
         .catch((error) => {
            console.error('회원가입 실패 : ', error)
         })
   }, [email, nick, password, confirmPassword, dispatch])

   if (isSignupComplete) {
      return (
         <Container maxWidth="sm" sx={{ mt: '150px' }}>
            <Typography variant="h4" gutterBottom align="center" style={{ color: 'white' }}>
               회원가입이 완료되었습니다
            </Typography>
            <Typography variant="body1" align="center" style={{ marginTop: '20px', color: 'white' }}>
               로그인 페이지로 이동하거나 다른 작업을 계속 진행할 수 있습니다.
            </Typography>
            <Button
               variant="contained"
               color="secondary"
               fullWidth
               style={{ marginTop: '20px' }}
               onClick={() => (window.location.href = '/login')} // 로그인 페이지로 이동
            >
               로그인 하러 가기
            </Button>
         </Container>
      )
   }
   if (error) {
      alert('회원가입 중 오류 발생 : ', error.message)
   }
   return (
      <Container maxWidth="sm" sx={{ mt: '100px' }}>
         <Typography variant="h4" gutterBottom sx={{ color: 'white' }}>
            회원가입
         </Typography>

         <CustomTextField label="이메일" variant="outlined" fullWidth margin="normal" value={email} onChange={(e) => setEmail(e.target.value)} />
         <CustomTextField label="사용자 이름" variant="outlined" fullWidth margin="normal" value={nick} onChange={(e) => setNick(e.target.value)} />
         <CustomTextField label="비밀번호" variant="outlined" type="password" fullWidth margin="normal" value={password} onChange={(e) => setPassword(e.target.value)} />
         <CustomTextField label="비밀번호 확인" variant="outlined" type="password" fullWidth margin="normal" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
         <Button variant="contained" color="secondary" fullWidth style={{ marginTop: '20px' }} onClick={handleSignup}>
            {loading ? <CircularProgress size={24} color="secondary" /> : '회원가입'}
         </Button>
      </Container>
   )
}
export default Signup
