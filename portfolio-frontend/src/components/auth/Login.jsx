import { TextField, Button, Container, Typography } from '@mui/material'
import { Link } from 'react-router-dom'
import { styled } from '@mui/material/styles'

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
   return (
      <Container maxWidth="lg" sx={{ marginTop: '150px' }}>
         <Typography variant="h4" gutterBottom sx={{ color: 'white' }}>
            로그인
         </Typography>

         <form>
            <CustomTextField label="이메일" name="email" fullWidth margin="normal" />
            <CustomTextField label="비밀번호" type="password" name="password" fullWidth margin="normal" />

            <Button variant="contained" color="secondary" type="submit" fullWidth sx={{ position: 'relative', marginTop: '20px', marginBottom: '5px' }}>
               로그인
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
