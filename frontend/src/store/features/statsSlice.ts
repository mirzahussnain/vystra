import { createSlice, PayloadAction } from "@reduxjs/toolkit";
interface StatsState {
  id: string;
  plan: string;
  storage: {
    used_bytes: number;
    limit_bytes: number;
    percent: number;
    is_full: boolean;
  };
  processing: {
    used_minutes: number;
    limit_minutes: number;
    percent: number;
    is_full: boolean;
  };
  ai_credits: {
    used_actions: number;
    limit_actions: number;
    remaining: number;
    is_empty: boolean;
  };
}
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
    setStats: (state, action: PayloadAction<StatsState>) => {
      return action.payload;
    },
  },
});


export const {setStats}=statsSlice.actions;
export default statsSlice;
