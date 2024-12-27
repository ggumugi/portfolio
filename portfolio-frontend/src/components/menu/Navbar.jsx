import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import MenuIcon from '@mui/icons-material/Menu'
import Avatar from '@mui/material/Avatar'
import { Link, useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import Tooltip from '@mui/material/Tooltip'
import MenuItem from '@mui/material/MenuItem'
import Menu from '@mui/material/Menu'
import { useState } from 'react'
import { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { logoutUserThunk } from '../../features/authSlice'

const StyledAppBar = styled(AppBar)`
   && {
      background-color: rgb(221, 211, 176);
      color: rgb(54, 48, 22);
   }
`

const Navbar = ({ isAuthenticated, user }) => {
   const settings = ['내 정보', '글 쓰기', '로그아웃']
   const [anchorElUser, setAnchorElUser] = useState(null)
   const dispatch = useDispatch()
   const navigate = useNavigate()

   const handleLogout = useCallback(() => {
      dispatch(logoutUserThunk())
         .unwrap()
         .then(() => {
            navigate('/')
         })
         .catch((err) => {
            alert(err)
         })
   }, [dispatch, navigate])

   const handleOpenUserMenu = (event) => {
      setAnchorElUser(event.currentTarget)
   }
   const handleCloseUserMenu = () => {
      setAnchorElUser(null)
   }

   return (
      <Box sx={{ flexGrow: 1 }}>
         <StyledAppBar position="static">
            <Toolbar>
               <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                  <Link to="/">
                     <img src="/images/logo.png" alt="로고" width="50" style={{ display: 'inline-block', marginTop: '10px' }} />
                  </Link>
               </Typography>
               {isAuthenticated ? (
                  <>
                     {user.img ? <Avatar alt="userImg" src={`${process.env.REACT_APP_API_URL}/userUploads${user.img}`} sx={{ mr: 2, backgroundColor: 'lightgrey' }} /> : <Avatar alt="userImg" src="/images/man.png" sx={{ mr: 2, backgroundColor: 'lightgrey' }} />}

                     <Typography variant="h6" component="div" sx={{ mr: 2 }}>
                        {user?.nick} 님
                     </Typography>
                     <Tooltip title="Open settings">
                        <IconButton size="large" edge="start" color="inherit" aria-label="menu" onClick={handleOpenUserMenu} sx={{ mr: 1 }}>
                           <MenuIcon />
                        </IconButton>
                     </Tooltip>
                     <Menu
                        sx={{ mt: '45px' }}
                        id="menu-appbar"
                        anchorEl={anchorElUser}
                        anchorOrigin={{
                           vertical: 'top',
                           horizontal: 'right',
                        }}
                        keepMounted
                        transformOrigin={{
                           vertical: 'top',
                           horizontal: 'right',
                        }}
                        open={Boolean(anchorElUser)}
                        onClose={handleCloseUserMenu}
                     >
                        <MenuItem key={settings[0]} onClick={handleCloseUserMenu}>
                           <Typography sx={{ textAlign: 'center' }}>
                              <Link to="/user">{settings[0]}</Link>
                           </Typography>
                        </MenuItem>
                        <MenuItem key={settings[1]} onClick={handleCloseUserMenu}>
                           <Typography sx={{ textAlign: 'center' }}>
                              <Link to="/post/add">{settings[1]}</Link>
                           </Typography>
                        </MenuItem>
                        <MenuItem key={settings[2]} onClick={handleCloseUserMenu}>
                           <Typography sx={{ textAlign: 'center', color: 'red' }} onClick={handleLogout}>
                              {settings[2]}
                           </Typography>
                        </MenuItem>
                     </Menu>
                  </>
               ) : (
                  <Button color="inherit">
                     <Link to="/login">로그인</Link>
                  </Button>
               )}
            </Toolbar>
         </StyledAppBar>
      </Box>
   )
}

export default Navbar
