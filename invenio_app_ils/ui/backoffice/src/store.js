import { createStore, applyMiddleware, combineReducers } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';

import { loanDetailsReducer } from './pages/LoanDetails/reducer';
import { itemDetailsReducer } from './pages/ItemDetails/reducer';

const rootReducer = combineReducers({
  loanDetails: loanDetailsReducer,
  itemDetails: itemDetailsReducer,
});

const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(thunk))
);

export default store;