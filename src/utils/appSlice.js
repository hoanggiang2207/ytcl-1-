import { createSlice } from '@reduxjs/toolkit';

const appSlice = createSlice({
  name: 'app',
  initialState: {
    sidebarVisible: true, // Default visibility
  },
  reducers: {
    toggleSidebar(state) {
      state.sidebarVisible = !state.sidebarVisible;
    },
  },
});

export const { toggleSidebar } = appSlice.actions;

export default appSlice.reducer;
