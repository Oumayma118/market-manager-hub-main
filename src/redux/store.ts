import { configureStore } from '@reduxjs/toolkit';
import centersReducer from './slices/centersSlice';
import localsReducer from './slices/localsSlice';
import ownersReducer from './slices/ownersSlice';
import activitiesReducer from './slices/activitiesSlice';
import settingsReducer from './slices/settingsSlice';

export const store = configureStore({
  reducer: {
    centers: centersReducer,
    locals: localsReducer,
    owners: ownersReducer,
    activities: activitiesReducer,
    settings: settingsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
