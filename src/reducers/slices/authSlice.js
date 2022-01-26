import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const API_URL = "http://localhost:8090";

// 임시로 refreshToken도 여기에 저장해둠

const initialState = {
  status: null,
  authTokens: {},
  isAuth: false
};

export const login = createAsyncThunk(
  "auth/login",
  async (data, dispatch, getState) => {
    const response = await axios.post(`${API_URL}/v1/login`, {
      ...data
    });
    localStorage.setItem("authTokens", JSON.stringify(response.data.data));
    return response.data.data;
  }
);

export const register = createAsyncThunk(
  "auth/register",
  async (data, dispatch, getState) => {
    const response = await axios.post(`${API_URL}/v1/register`, {
      ...data
    });
    return response.data.data;
  }
);

export const logout = createAsyncThunk(
  "auth/logout",
  async (dispatch, getState) => {
    if (getState.isAuth === true) {
      return;
    }
  }
);

const slice = createSlice({
  name: "sample",
  initialState,
  reducers: {
    logout: (state, action) => {}
  },
  extraReducers: {
    [login.pending]: (state, action) => {
      state.status = "loading";
    },
    [login.fulfilled]: (state, action) => {
      state.status = "success";
      state.isAuth = true;
      state.authTokens = action.payload;
    },
    [login.rejected]: (state, action) => {
      state.status = "failed";
      state.error = action.error;
    },
    [register.pending]: (state, action) => {
      state.status = "loading";
    },
    [register.fulfilled]: (state, action) => {
      state.status = "success";
    },
    [register.rejected]: (state, action) => {
      state.status = "failed";
      state.error = action.error;
    },
    [logout.pending]: (state, action) => {},
    [logout.fulfilled]: (state, action) => {
      Object.assign(state, initialState);
    },
    [logout.rejected]: (state, action) => {}
  }
});

export default slice.reducer;

export function refresh() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());

    try {
    } catch (e) {
      console.log(e);
      dispatch(slice.actions.hasError(e));
    }
  };
}
