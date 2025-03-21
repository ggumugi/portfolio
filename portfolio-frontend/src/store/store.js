import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/authSlice'
import postReducer from '../features/postSlice'
import pageReducer from '../features/pageSlice'
import likedReducer from '../features/likedSlice'
import notiReducer from '../features/notiSlice'

const store = configureStore({
   reducer: {
      auth: authReducer,
      posts: postReducer,
      page: pageReducer,
      liked: likedReducer,
      noti: notiReducer,
   },
})

export default store
