import { configureStore } from '@reduxjs/toolkit';
import loadingReducer from './ui/loadingSlice';

import userReducer from './authSlice'
import chatRecuer  from './chat/chat';

export default configureStore({
  reducer: {
    loading: loadingReducer,
    user: userReducer,
    chat: chatRecuer
  },
  devTools: true
});
