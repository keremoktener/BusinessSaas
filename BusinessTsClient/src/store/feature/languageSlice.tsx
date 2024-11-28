import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { changeLanguage } from "i18next";
import i18n from "i18next";
interface LanguageState {
  language: string;
}

const initialState: LanguageState = {
    language: i18n.language || "tr",
};

const languageSlice = createSlice({
  name: "language",
  initialState,
  reducers: {
    setLanguage(state, action: PayloadAction<string>) {
      state.language = action.payload;
      changeLanguage(action.payload);
    },
    toggleLanguage(state) {
      const newLanguage = state.language === "en" ? "tr" : "en";
      state.language = newLanguage;
      changeLanguage(newLanguage);
    }
  },
});

export const { setLanguage, toggleLanguage } = languageSlice.actions;
export default languageSlice.reducer;
