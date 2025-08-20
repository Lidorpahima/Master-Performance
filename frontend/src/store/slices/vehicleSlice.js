import { createSlice } from '@reduxjs/toolkit';

const vehicleSlice = createSlice({
  name: 'vehicles',
  initialState: {
    list: [],
    loading: false,
    error: null,
    selectedVehicle: null
  },
  reducers: {
    setVehicles: (state, action) => {
      state.list = action.payload;
      state.loading = false;
    },
    addVehicle: (state, action) => {
      state.list.push(action.payload);
    },
    updateVehicle: (state, action) => {
      const index = state.list.findIndex(v => v.id === action.payload.id);
      if (index !== -1) {
        state.list[index] = action.payload;
      }
    },
    setSelectedVehicle: (state, action) => {
      state.selectedVehicle = action.payload;
    }
  }
});

export const { setVehicles, addVehicle, updateVehicle, setSelectedVehicle } = vehicleSlice.actions;
export default vehicleSlice.reducer;
