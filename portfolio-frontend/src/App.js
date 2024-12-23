import { Route, Routes } from 'react-router-dom'
import './styles/common.css'
import Navbar from './components/menu/Navbar'
import Home from './pages/Home'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'

function App() {
   return (
      <>
         <Navbar />
         <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            {/* <Route path="/post/add" element={} />
            <Route path="/post/edit/:id" element={} />
            <Route path="/post/detail/:id" element={} />
            <Route path="/user" element={} />
            <Route path="/user/:id" element={} /> */}
         </Routes>
      </>
   )
}

export default App
