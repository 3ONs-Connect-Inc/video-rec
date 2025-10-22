import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface User {
  uid: string;
  email: string;
  displayName?: string;  
  role?: "admin" | "user"; 
}  
  
interface SessionState {   
  user: User | null;
  role: "admin" | "user" | null;
  loading: boolean;
}
  
const initialState: SessionState = {
  user: null,
  role: null,
  loading: false, // start in loading until auth listener resolves
};

const sessionSlice = createSlice({
  name: "session",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<User>) {
      state.user = action.payload;
      state.role = action.payload?.role ?? null; 
      state.loading = false;
    },
    clearUser(state) {
      state.user = null;
      state.role = null;
      state.loading = false;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
  },
});

export const { setUser, clearUser, setLoading } = sessionSlice.actions;
export default sessionSlice.reducer;
