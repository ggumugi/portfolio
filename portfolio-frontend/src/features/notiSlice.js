import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { addNotification, removeNotification, checkNotification } from '../api/portfolioApi'

// 알림 추가
export const addNotificationThunk = createAsyncThunk('noti/addNotification', async (postId, { rejectWithValue }) => {
   try {
      const response = await addNotification(postId)
      return response.data
   } catch (err) {
      return rejectWithValue(err.response?.data?.message || '알림 추가 실패')
   }
})

// 알림 읽음처리
export const removeNotificationThunk = createAsyncThunk('noti/removeNotification', async (id, { rejectWithValue }) => {
   try {
      const response = await removeNotification(id)
      return response.data
   } catch (err) {
      return rejectWithValue(err.response?.data?.message || '알림 삭제 실패')
   }
})

// 알림 확인
export const checkNotificationThunk = createAsyncThunk('noti/checkNotification', async (_, { rejectWithValue }) => {
   try {
      const response = await checkNotification()
      return response.data
   } catch (err) {
      return rejectWithValue(err.response?.data?.message || '알림 확인 실패')
   }
})

const notiSlice = createSlice({
   name: 'noti',
   initialState: {
      notifications: [], // 알림 목록
      loading: false, // 로딩 상태
      error: null, // 에러 메시지
   },
   reducers: {},
   extraReducers: (builder) => {
      builder
         // 알림 추가
         .addCase(addNotificationThunk.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(addNotificationThunk.fulfilled, (state, action) => {
            state.loading = false
            state.notifications.push(action.payload) // 알림 추가
            state.isRead = false
         })
         .addCase(addNotificationThunk.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
         })
         // 알림 삭제
         .addCase(removeNotificationThunk.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(removeNotificationThunk.fulfilled, (state, action) => {
            state.loading = false
            state.notifications = state.notifications.filter((noti) => noti.id !== action.payload.id) // 알림 삭제
            state.isRead = true
         })
         .addCase(removeNotificationThunk.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
         })
         // 알림 확인
         .addCase(checkNotificationThunk.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(checkNotificationThunk.fulfilled, (state, action) => {
            state.loading = false
         })
         .addCase(checkNotificationThunk.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
         })
   },
})

export default notiSlice.reducer
