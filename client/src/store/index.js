import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';

const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
  },
});

/** @typedef {ReturnType<typeof store.getState} RootState */
/** @typedef {typeof store.dispatch} Dispatch */

export default store;
