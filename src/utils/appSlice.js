import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  sidebarVisible: true,
  
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    toggleSidebar(state) {
      state.sidebarVisible = !state.sidebarVisible;
    },
    
  },
});

export const { toggleSidebar } = appSlice.actions;
export default appSlice.reducer;
