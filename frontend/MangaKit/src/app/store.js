import { configureStore } from "@reduxjs/toolkit";
import manga from '../features/manga/manga-slice'

export const store = configureStore({
  reducer: {
    manga
  },
});
