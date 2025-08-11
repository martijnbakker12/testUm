import { createStore, combineReducers } from 'redux';

const initialLoginState = { isLoggedIn: false, userId: null };
function loginState(state = initialLoginState, action) {
  switch (action.type) {
    case 'USER_LOGIN':
      return { isLoggedIn: true, userId: action.payload.userId };
    case 'USER_LOGOUT':
      return { isLoggedIn: false, userId: null };
    default:
      return state;
  }
}

const initialTableState = { selectedRow: null };
function tableState(state = initialTableState, action) {
  switch (action.type) {
    case 'SELECT_ROW':
      return { selectedRow: action.payload.row };
    case 'DESELECT_ROW':
      return { selectedRow: null };
    default:
      return state;
  }
}

const store = createStore(
  combineReducers({
    loginState,
    tableState,
  })
);

export default store;
