import { configureStore } from "@reduxjs/toolkit";
import { counterReducer } from "./slices/counterSlice";
import { cartReducer } from "./slices/cartSlice";

export const Store = configureStore({
                reducer: {
                                counter: counterReducer,
                                cart: cartReducer,
                },
})

export type RootState = ReturnType<typeof Store.getState>;