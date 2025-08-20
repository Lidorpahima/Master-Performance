import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  list: [
    {
      id: 1,
      name: 'John Doe',
      email: 'john@masterperformance.com',
      role: 'customer',
      status: 'active'
    },
    {
      id: 2,
      name: 'Admin User',
      email: 'admin@master.com',
      role: 'admin',
      status: 'active'
    }
  ],
  loading: false,
  error: null
};

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    addUser: (state, action) => {
      state.list.push(action.payload);
    },
    updateUser: (state, action) => {
      const index = state.list.findIndex(user => user.id === action.payload.id);
      if (index !== -1) {
        state.list[index] = action.payload;
      }
    },
    deleteUser: (state, action) => {
      state.list = state.list.filter(user => user.id !== action.payload);
    }
  }
});

export const { addUser, updateUser, deleteUser } = userSlice.actions;
export default userSlice.reducer;