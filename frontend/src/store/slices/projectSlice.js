import { createSlice } from '@reduxjs/toolkit';

const projectSlice = createSlice({
  name: 'projects',
  initialState: {
    list: [],
    loading: false,
    error: null,
    selectedProject: null
  },
  reducers: {
    setProjects: (state, action) => {
      state.list = action.payload;
      state.loading = false;
    },
    addProject: (state, action) => {
      state.list.push(action.payload);
    },
    updateProject: (state, action) => {
      const index = state.list.findIndex(p => p.id === action.payload.id);
      if (index !== -1) {
        state.list[index] = action.payload;
      }
    },
    setSelectedProject: (state, action) => {
      state.selectedProject = action.payload;
    }
  }
});

export const { setProjects, addProject, updateProject, setSelectedProject } = projectSlice.actions;
export default projectSlice.reducer;
