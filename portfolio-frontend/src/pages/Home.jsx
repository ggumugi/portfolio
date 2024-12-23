import { Container } from '@mui/material'
import Paper from '@mui/material/Paper'
import InputBase from '@mui/material/InputBase'
import IconButton from '@mui/material/IconButton'
import SearchIcon from '@mui/icons-material/Search'
import PostList from '../components/post/PostList'

const Home = () => {
   return (
      <Container maxWidth="lg">
         <Paper component="form" sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 600, margin: 'auto', marginTop: '100px' }}>
            <InputBase sx={{ ml: 1, flex: 1 }} placeholder="프로젝트명 검색" inputProps={{ 'aria-label': 'search google maps' }} />
            <IconButton type="button" sx={{ p: '10px' }} aria-label="search">
               <SearchIcon />
            </IconButton>
         </Paper>
         <PostList />
      </Container>
   )
}

export default Home
