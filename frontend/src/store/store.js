import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from 'redux';
import { thunk } from 'redux-thunk';

import authReducer from './slices/authSlice';
import tuningReducer from './slices/tuningSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  tuning: tuningReducer,
});

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth'] // only auth will be persisted
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }).concat(thunk),
});

export const persistor = persistStore(store);