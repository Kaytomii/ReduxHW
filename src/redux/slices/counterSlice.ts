import { createSlice } from "@reduxjs/toolkit";

type CounterType = {
                value:number;
};

const initialState: CounterType = {
                value:0,
}

const counterSlice = createSlice({
                name:"counter",
                initialState,
                reducers:{
                                increment:(state)=>{
                                                return {value:state.value + 1};
                                },
                                decrement:(state)=>{
                                                return {value:state.value - 1};
                                },
                                reset:(state)=>{
                                                return {value:state.value * 0};
                                }
                },
});

export const counterReducer = counterSlice.reducer;
export const {increment} = counterSlice.actions;
export const {decrement} = counterSlice.actions;
export const {reset} = counterSlice.actions;
export type {CounterType}