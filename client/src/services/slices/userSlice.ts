import { createSlice } from "@reduxjs/toolkit/";

export interface User {
  email: string;
  id: string;
  name: string;
}
const initialState: { user: User | null } = {
  user: null,
};
const userSlice = createSlice({
  name: "userSlice",
  initialState,
  reducers: {
    setUser(state, action) {
      state.user = action.payload;
    },
    login(state, action) {
      state.user = action.payload.user;
    },
    logout(state) {
      state.user = null;
    },
  },
});

export const userActions = userSlice.actions;

export default userSlice.reducer;
