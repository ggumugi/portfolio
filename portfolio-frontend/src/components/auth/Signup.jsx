import { TextField, Button, Container, Typography, CircularProgress } from '@mui/material'
import { useState } from 'react'
import { styled } from '@mui/material/styles'

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
         borderColor: 'white',
      },
   },
})

const Signup = () => {
   const [email, setEmail] = useState('')
   const [nick, setNick] = useState('')
   const [password, setPassword] = useState('')
   const [confirmPassword, setConfirmPassword] = useState('')
   const [isSignupComplete, setIsSignupComplete] = useState(false) // 회원가입 완료 상태 추가

   //    const dispatch = useDispatch()
   //    const { loading, error } = useSelector((state) => state.auth)

   if (isSignupComplete) {
      return (
         <Container maxWidth="sm" sx={{ marginTop: '150px' }}>
            <Typography variant="h4" gutterBottom align="center">
               회원가입이 완료되었습니다!
            </Typography>
            <Typography variant="body1" align="center" style={{ marginTop: '20px' }}>
               로그인 페이지로 이동하거나 다른 작업을 계속 진행할 수 있습니다.
            </Typography>
            <Button
               variant="contained"
               color="primary"
               fullWidth
               style={{ marginTop: '20px' }}
               onClick={() => (window.location.href = '/login')} // 로그인 페이지로 이동
            >
               로그인 하러 가기
            </Button>
         </Container>
      )
   }
   return (
      <Container maxWidth="sm" sx={{ marginTop: '100px' }}>
         <Typography variant="h4" gutterBottom sx={{ color: 'white' }}>
            회원가입
         </Typography>

         <CustomTextField label="이메일" variant="outlined" fullWidth margin="normal" value={email} onChange={(e) => setEmail(e.target.value)} />
         <CustomTextField label="사용자 이름" variant="outlined" fullWidth margin="normal" value={nick} onChange={(e) => setNick(e.target.value)} />
         <CustomTextField label="비밀번호" variant="outlined" type="password" fullWidth margin="normal" value={password} onChange={(e) => setPassword(e.target.value)} />
         <CustomTextField label="비밀번호 확인" variant="outlined" type="password" fullWidth margin="normal" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
         <Button variant="contained" color="secondary" fullWidth style={{ marginTop: '20px' }}>
            {/* {loading ? <CircularProgress size={24} /> : '회원가입'} */}
            회원가입
         </Button>
      </Container>
   )
}
export default Signup
