import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../Auth/authSlice';
import userReducer from '../Auth/userSlice';
import { apiSlice } from '../Auth/apiSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    [apiSlice.reducerPath]: apiSlice.reducer, // API slice reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware), // Adding RTK Query middleware
});

export default store;
