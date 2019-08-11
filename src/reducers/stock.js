import _ from "lodash";

const stock = (state, action) => {
  console.log(action);
  switch (action.type) {
    case "ADD_STOCK":
      return {
        ...action.payload
      };

    default:
      return state;
  }
};

const stocks = (state = [], action) => {
  switch (action.type) {
    case "ADD_STOCK":
      return [...state, stock(undefined, action)];
    case "REMOVE_STOCK":
      console.log(action);
      console.log(state);
      return _.remove(state, i => i.code === action.payload.code);
    default:
      return state;
  }
};

export default stocks;
