import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { addLike, removeLike, checkLike } from '../api/portfolioApi'

// 좋아요 누르기
export const addLikeThunk = createAsyncThunk('liked/addLike', async (postId, { rejectWithValue }) => {
   try {
      const response = await addLike(postId)
      return response.data
   } catch (err) {
      return rejectWithValue(err.response?.data?.message || '좋아요 실패')
   }
})

// 좋아요 취소하기
export const removeLikeThunk = createAsyncThunk('liked/removeLike', async (postId, { rejectWithValue }) => {
   try {
      // eslint-disable-next-line
      const response = await removeLike(postId)
      return postId
   } catch (err) {
      return rejectWithValue(err.response?.data?.message || '좋아요 취소 실패')
   }
})

// 좋아요 상태 확인
export const checkLikeThunk = createAsyncThunk('liked/checkLike', async (postId, { rejectWithValue }) => {
   try {
      const response = await checkLike(postId)
      return response.data
   } catch (err) {
      return rejectWithValue(err.response?.data?.message || '좋아요 확인 실패')
   }
})

const pageSlice = createSlice({
   name: 'liked',
   initialState: {
      liked: false,
      loading: false,
      error: null,
   },
   reducers: {},
   extraReducers: (builder) => {
      builder
         .addCase(addLikeThunk.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(addLikeThunk.fulfilled, (state, action) => {
            state.loading = false
            state.liked = true
         })
         .addCase(addLikeThunk.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
         })
      builder
         .addCase(removeLikeThunk.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(removeLikeThunk.fulfilled, (state, action) => {
            state.loading = false
            state.liked = false
         })
         .addCase(removeLikeThunk.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
         })
      builder
         .addCase(checkLikeThunk.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(checkLikeThunk.fulfilled, (state, action) => {
            state.loading = false
            state.liked = action.payload.success
         })
         .addCase(checkLikeThunk.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
         })
   },
})

export default pageSlice.reducer
