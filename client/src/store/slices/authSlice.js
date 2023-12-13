import { createSlice } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';

/**
 * @satisfies {Awaited<ReturnType<import('src/hooks/trpc')['trpc']['auth']['login']['useMutation']>['mutate']>}
 * */
const initialState = {
  token: JSON.parse(localStorage.getItem('authState'))?.token ?? null,
  _refreshToken: JSON.parse(localStorage.getItem('authState'))?._refreshToken ?? null,
  user: JSON.parse(localStorage.getItem('authState'))?.user ?? null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload;
      localStorage.setItem('authState', JSON.stringify(state));
      console.log('authSlice.change.fired', state);
    },
    setRefreshToken: (state, action) => {
      state._refreshToken = action.payload;
      localStorage.setItem('authState', JSON.stringify(state));
      console.log('authSlice.change.fired', state);
    },
    setUser: (state, action) => {
      state.user = action.payload;
      localStorage.setItem('authState', JSON.stringify(state));
      console.log('authSlice.change.fired', state);
    },
    logout: (state, action) => {
      state.token = null;
      state._refreshToken = null;
      state.user = null;
      localStorage.removeItem('authState');
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
    dispatch(AuthActions.logout());
  };
  const refreshToken = (token) => {
    dispatch(AuthActions.setToken(token));
  };

  return { ...auth, login, logout, refreshToken };
};
