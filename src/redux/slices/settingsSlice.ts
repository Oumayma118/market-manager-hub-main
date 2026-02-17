import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SettingsState {
  language: string;
  currency: string;
  notifications: {
    newTenants: boolean;
    latePayments: boolean;
    monthlyReports: boolean;
  };
  animations: boolean;
  theme: 'light' | 'dark' | 'system';
}

const loadSettings = (): SettingsState => {
  try {
    const saved = localStorage.getItem('indh-settings');
    if (saved) return JSON.parse(saved);
  } catch {}
  return {
    language: 'fr',
    currency: 'MAD',
    notifications: {
      newTenants: true,
      latePayments: true,
      monthlyReports: false,
    },
    animations: true,
    theme: 'light',
  };
};

const initialState: SettingsState = loadSettings();

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setLanguage(state, action: PayloadAction<string>) {
      state.language = action.payload;
      localStorage.setItem('indh-settings', JSON.stringify(state));
    },
    setCurrency(state, action: PayloadAction<string>) {
      state.currency = action.payload;
      localStorage.setItem('indh-settings', JSON.stringify(state));
    },
    setNotification(state, action: PayloadAction<{ key: keyof SettingsState['notifications']; value: boolean }>) {
      state.notifications[action.payload.key] = action.payload.value;
      localStorage.setItem('indh-settings', JSON.stringify(state));
    },
    setAnimations(state, action: PayloadAction<boolean>) {
      state.animations = action.payload;
      localStorage.setItem('indh-settings', JSON.stringify(state));
    },
    setTheme(state, action: PayloadAction<'light' | 'dark' | 'system'>) {
      state.theme = action.payload;
      localStorage.setItem('indh-settings', JSON.stringify(state));
    },
  },
});

export const { setLanguage, setCurrency, setNotification, setAnimations, setTheme } = settingsSlice.actions;
export default settingsSlice.reducer;
