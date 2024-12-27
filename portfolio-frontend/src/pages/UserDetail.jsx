import { Container } from '@mui/material'
import UserProfile from '../components/info/UserProfile'
import UserForm from '../components/info/UserForm'

const UserDetail = ({ isAuthenticated, user }) => {
   return (
      <Container maxWidth="lg">
         <UserProfile isAuthenticated={isAuthenticated} user={user} />
         <UserForm isAuthenticated={isAuthenticated} user={user} />
      </Container>
   )
}
export default UserDetail
