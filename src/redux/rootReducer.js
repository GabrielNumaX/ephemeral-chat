import { combineReducers } from 'redux';  
import appReducer from './app/appReducer'; 
// import productReducer from './product/reducer'
// import categoryReducer from './category/reducer'
// import managerReducer from './manager/reducer'
// import homeReducer from './home/reducer'
// import bannerReducer from './banner/reducer';
// import testimonialReducer from './testimonial/reducer';

export default combineReducers({ 
  app: appReducer,
//   product: productReducer,
//   category: categoryReducer,
//   banner: bannerReducer,
//   testimonial: testimonialReducer,
//   manager: managerReducer,
//   home: homeReducer
});