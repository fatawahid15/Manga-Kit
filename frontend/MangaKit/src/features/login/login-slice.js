import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { successState } from "../manga/manga-slice";

const initialState = {
  name: "",
  password: "",
  error: "",
};

export const loginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    successState(state, action){
        (state.name = action.payload),
        (state.password = action.payload),
        (state.error = "")
    }
  },
});
