import { combineReducers } from 'redux';
import { configureStore } from '@reduxjs/toolkit';
import thunk, { ThunkMiddleware } from 'redux-thunk';
import authReducer from '../reducers/Auth.reducer'; // Adjust the path to your Auth.reducer file
import { composeWithDevTools } from '@redux-devtools/extension';



const rootReducer = combineReducers({
  auth: authReducer, // Combine your reducers here
});

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware(),
  devTools: process.env.NODE_ENV !== 'production', // Enable Redux DevTools conditionally
});

export default store;









