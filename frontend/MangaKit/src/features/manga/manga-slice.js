import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  manga: [],
  loading: false,
  error: "",
  pagination: {
    currentPage: 1,
    totalPages: 1,
    limit: 20,
  },
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
      state.manga = action.payload.mangas;
      state.pagination = action.payload.pagination;
      state.error = "";
    },
    failState(state, action) {
      state.loading = false;
      state.manga = [];
      state.error = action.payload;
    },
    setPage(state, action) {
      state.pagination.currentPage = action.payload;
    },
  },
});

export const { pendingState, successState, failState, setPage } = mangaSlice.actions;

// Async thunk to fetch manga with pagination and optional search query
export const fetchMangaAsync = (searchQuery = "", page = 1) => async (dispatch) => {
  try {
    dispatch(pendingState());

    const { data } = await axios.get("https://mangakit.daseas.cloud/pub/manga/", {
      params: {
        limit: 21, 
        page,
        search: searchQuery,
      },
    });

    dispatch(successState({ mangas: data.mangas, pagination: data.pagination }));
  } catch (error) {
    dispatch(failState(error.message));
  }
};

export default mangaSlice.reducer;
