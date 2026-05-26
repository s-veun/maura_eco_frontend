import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/redux/store";

export type HomeState = {
  darkMode: boolean;
  language: string;
  currency: string;
  searchHistory: string[];
  trendingSearches: string[];
  selectedCategoryId?: number;
};

const initialState: HomeState = {
  darkMode: false,
  language: "EN",
  currency: "USD",
  searchHistory: [],
  trendingSearches: ["Dining table", "Office desk", "Cafe chairs", "Bar stools", "Reception table"],
  selectedCategoryId: undefined,
};

const homeSlice = createSlice({
  name: "home",
  initialState,
  reducers: {
    setDarkMode(state, action: PayloadAction<boolean>) {
      state.darkMode = action.payload;
    },
    setLanguage(state, action: PayloadAction<string>) {
      state.language = action.payload;
    },
    setCurrency(state, action: PayloadAction<string>) {
      state.currency = action.payload;
    },
    setSelectedCategoryId(state, action: PayloadAction<number | undefined>) {
      state.selectedCategoryId = action.payload;
    },
    addSearchHistory(state, action: PayloadAction<string>) {
      const keyword = action.payload.trim();
      if (!keyword) return;
      state.searchHistory = [keyword, ...state.searchHistory.filter((item) => item !== keyword)].slice(0, 8);
    },
    clearSearchHistory(state) {
      state.searchHistory = [];
    },
  },
});

export const {
  setDarkMode,
  setLanguage,
  setCurrency,
  setSelectedCategoryId,
  addSearchHistory,
  clearSearchHistory,
} = homeSlice.actions;

export const selectHomeState = (state: RootState) => state.home;

export default homeSlice.reducer;

