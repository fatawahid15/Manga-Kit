import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  manga: [],
  loading: false,
  error: "",
};

export const mangaSlice = createSlice({
  name: "manga",
  initialState,
  reducers: {
    pendingState(state) {
      state.loading = true;
      state.manga = [];
      state.error = "";
    },
    successState(state, action) {
      state.loading = false;
      state.manga = action.payload;
      state.error = "";
    },
    failState(state, action) {
      state.loading = false;
      state.manga = [];
      state.error = action.payload;
    },
  },
});

export const { pendingState, successState, failState } = mangaSlice.actions;

// Async thunk to fetch manga with optional search query
export const fetchMangaAsync = (searchQuery = "") => async (dispatch) => {
  try {
    dispatch(pendingState());

    const { data } = await axios.get("http://localhost:3000/pub/manga", {
      params: {
        limit: 28,  // or whatever limit you prefer
        search: searchQuery,  // Send the search query as a parameter
      },
    });

    console.log(data.mangas);

    dispatch(successState(data.mangas));
  } catch (error) {
    dispatch(failState(error.message));
  }
};

export default mangaSlice.reducer;
