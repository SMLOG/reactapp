import { combineReducers } from "redux";
import stocks from "./stock";

const stockApp = combineReducers({
  stocks
});

export default stockApp;
