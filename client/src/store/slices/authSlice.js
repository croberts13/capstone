import { createSlice } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';

/**
 * @type {Awaited<ReturnType<import('src/hooks/trpc')['trpc']['auth']['login']['useMutation']>['mutate']>}
 * */
const initialState = {
  token: JSON.parse(localStorage.getItem('token')),
  refreshToken: JSON.parse(localStorage.getItem('refreshToken')),
  user: JSON.parse(localStorage.getItem('user')),
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setToken: (state, action) => {
      localStorage.setItem('token', action.payload);
      state.token = action.payload;
      console.log('authSlice.change.fired', state);
    },
    setRefreshToken: (state, action) => {
      localStorage.setItem('refreshToken', action.payload);
      state.refreshToken = action.payload;
      console.log('authSlice.change.fired', state);
    },
    setUser: (state, action) => {
      state.user = action.payload;
      console.log('authSlice.change.fired', state);
    },
  },
});

export const AuthActions = authSlice.actions;
export default authSlice;

export const useAuthSelector = () =>
  useSelector((/** @type {import('..').RootState} */ state) => state.auth);

export const useAuth = () => {
  const auth = useAuthSelector();
  /** @type {import('..').Dispatch} */
  const dispatch = useDispatch();

  // make login ,logout and refreshToken
  const login = (/** @type {ReturnType<import('src/hooks/trpc')>} */ data) => {
    dispatch(AuthActions.setToken(data.token));
    dispatch(AuthActions.setRefreshToken(data.refreshToken));
    dispatch(AuthActions.setUser(data.user));
  };

  const logout = () => {
    dispatch(AuthActions.setToken(null));
    dispatch(AuthActions.setRefreshToken(null));
    dispatch(AuthActions.setUser(null));
  };
  const refreshToken = (token) => {
    dispatch(AuthActions.setToken(token));
  };

  return { ...auth, login, logout, refreshToken };
};
