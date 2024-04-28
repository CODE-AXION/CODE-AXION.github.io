import { configureStore } from '@reduxjs/toolkit';
import loadingReducer from './ui/loadingSlice';

import userReducer from './authSlice'

export default configureStore({
  reducer: {
    loading: loadingReducer,
    user: userReducer
  },
  devTools: true
});
