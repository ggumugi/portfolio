import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/authSlice'
import postReducer from '../features/postSlice'
import pageReducer from '../features/pageSlice'

const store = configureStore({
   reducer: {
      auth: authReducer,
      posts: postReducer,
      page: pageReducer,
   },
})

export default store
