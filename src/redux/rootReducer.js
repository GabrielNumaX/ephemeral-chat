import { combineReducers } from 'redux';  
import appReducer from './app/appReducer'; 


export default combineReducers({ 
  app: appReducer,
});