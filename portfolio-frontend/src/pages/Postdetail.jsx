import PostView from '../components/post/PostView'
import { Container } from '@mui/material'

const Postdetail = ({ isAuthenticated, user }) => {
   return (
      <Container>
         <PostView isAuthenticated={isAuthenticated} user={user} />
      </Container>
   )
}

export default Postdetail
