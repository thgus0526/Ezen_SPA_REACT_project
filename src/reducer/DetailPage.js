import { createSlice } from '@reduxjs/toolkit';

const initState = {
  isRoad: '',
  isDate: '',
  isType: '',
  isMessage: '',
  isCoordX: '127.02445',
  isCoordY: '37.495855',
};

const DetailPageReducer = createSlice({
  name: 'DetailPage',
  initialState: initState,
  reducers: {
    DetailPage: (state, action) => {
      state.isRoad = action.payload.isRoad;
      state.isDate = action.payload.isDate;
      state.isType = action.payload.isType;
      state.isMessage = action.payload.isMessage;
      state.isCoordX = action.payload.isCoordX;
      state.isCoordY = action.payload.isCoordY;
    },
  },
});

export default DetailPageReducer.reducer;
export const { DetailPage } = DetailPageReducer.actions;
