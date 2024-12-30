import { Route, Routes } from 'react-router-dom'
import './styles/common.css'
import Navbar from './components/menu/Navbar'
import Home from './pages/Home'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import PostAdd from './pages/PostAdd'
import UserDetail from './pages/UserDetail'
import PostEdit from './pages/PostEdit'
import Postdetail from './pages/Postdetail'
import { useDispatch, useSelector } from 'react-redux'
import { checkAuthStatusThunk } from './features/authSlice'
import { useEffect } from 'react'

function App() {
   const dispatch = useDispatch()
   const { isAuthenticated, user } = useSelector((state) => state.auth)

   useEffect(() => {
      dispatch(checkAuthStatusThunk())
   }, [dispatch])
   return (
      <>
         <Navbar isAuthenticated={isAuthenticated} user={user} />
         <Routes>
            <Route path="/" element={<Home isAuthenticated={isAuthenticated} user={user} />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/post/add" element={<PostAdd />} />
            <Route path="/post/edit/:id" element={<PostEdit />} />
            {/* <Route path="/post/detail/:id" element={<Postdetail />} /> */}
            <Route path="/post/detail/:id" element={<Postdetail isAuthenticated={isAuthenticated} user={user} />} />
            <Route path="/user/:id" element={<UserDetail isAuthenticated={isAuthenticated} user={user} />} />
         </Routes>
      </>
   )
}

export default App
