export const addStock = stock => ({
  type: "ADD_STOCK",
  payload: stock
});

export const removeStock = stock => ({
  type: "REMOVE_STOCK",
  payload: stock
});
