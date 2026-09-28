import { createSlice } from "@reduxjs/toolkit";

type Product = {
                id: string | number;
                [key: string]: unknown;
};

type CartItem = Product & {
                quantity: number;
};

type CartState = {
                items: CartItem[];
};

const initialState: CartState = {
                items: [],
};

const cartSlice = createSlice({
                name: "cart",
                initialState,
                reducers: {
                                addToCart: (state, action: { payload: Product }) => {
                                                const product = action.payload;
                                                const existingItem = state.items.find((item) => item.id === product.id);

                                                if (existingItem) {
                                                                existingItem.quantity += 1;
                                                } else {
                                                                state.items.push({ ...product, quantity: 1 });
                                                }
                                },
                                removeFromCart: (state, action: { payload: string | number }) => {
                                                state.items = state.items.filter((item) => item.id !== action.payload);
                                },
                                increaseQuantity: (state, action: { payload: string | number }) => {
                                                const item = state.items.find((cartItem) => cartItem.id === action.payload);

                                                if (item) {
                                                                item.quantity += 1;
                                                }
                                },
                                decreaseQuantity: (state, action: { payload: string | number }) => {
                                                const item = state.items.find((cartItem) => cartItem.id === action.payload);

                                                if (item && item.quantity > 1) {
                                                                item.quantity -= 1;
                                                } else if (item) {
                                                                state.items = state.items.filter((cartItem) => cartItem.id !== action.payload);
                                                }
                                },
                                clearCart: (state) => {
                                                state.items = [];
                                },
                },
});

export const cartReducer = cartSlice.reducer;
export const { addToCart, removeFromCart, increaseQuantity, decreaseQuantity, clearCart } = cartSlice.actions;
export type { CartItem, CartState, Product };
