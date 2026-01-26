import { UserStats } from "@/lib/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
const statsSlice = createSlice({
  name:"stats",
  initialState: {
    id: "",
    plan: "",
    storage: {
      used_bytes: 0,
      limit_bytes: 0,
      percent: 0,
      is_full: false,
    },
    processing: {
      used_minutes: 0,
      limit_minutes: 0,
      percent: 0,
      is_full: false,
    },
    ai_credits: {
      used_actions: 0,
      limit_actions: 0,
      remaining: 0,
      is_empty: false,
    },
  },
  reducers: {
    setStats: (state, action: PayloadAction<UserStats>) => {
      return action.payload;
    },
  },
});


export const {setStats}=statsSlice.actions;
export default statsSlice;
