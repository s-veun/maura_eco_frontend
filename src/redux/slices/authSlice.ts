import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  clearStoredAuth,
  getStoredRefreshToken,
  getStoredToken,
  getStoredUser,
  setStoredRefreshToken,
  setStoredToken,
  setStoredUser,
  StoredAuthUser,
} from "@/lib/auth-storage";

interface AuthState {
  token: string | null;
  refreshToken: string | null;
  user: StoredAuthUser | null;
  isAuthenticated: boolean;
}

const storedToken = getStoredToken();
const storedRefreshToken = getStoredRefreshToken();
const storedUser = getStoredUser();

const initialState: AuthState = {
  token: storedToken,
  refreshToken: storedRefreshToken,
  user: storedUser,
  isAuthenticated: !!storedToken || !!storedUser,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{
        user?: StoredAuthUser;
        token?: string;
        refreshToken?: string;
        authenticated?: boolean;
      }>
    ) => {
      const { user, token, refreshToken, authenticated } = action.payload;
      if (user) {
        state.user = user;
        setStoredUser(user);
      }
      if (token) {
        state.token = token;
        setStoredToken(token);
      }
      if (refreshToken) {
        state.refreshToken = refreshToken;
        setStoredRefreshToken(refreshToken);
      }
      state.isAuthenticated = !!authenticated || !!state.token || !!state.user;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      clearStoredAuth();
    },
    setUser: (state, action: PayloadAction<StoredAuthUser>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      setStoredUser(action.payload);
    },
  },
});

export const { setCredentials, logout, setUser } = authSlice.actions;
export default authSlice.reducer;

export const selectCurrentUser = (state: { auth: AuthState }) => state.auth.user;
export const selectIsAuthenticated = (state: { auth: AuthState }) => state.auth.isAuthenticated;
