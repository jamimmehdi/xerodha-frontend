import { createSlice } from '@reduxjs/toolkit'

export const buyingSellingSlice = createSlice({
    name: 'buy_sell',
    initialState: {
        buy_modal_visibility: false,
        sell_modal_visibility: false,
        selected_symbol: null,
        current_holding_id: null,
        current_available_quantity: null,
    },
    reducers: {
        handleBuyModalOpen: (state) => {
            state.buy_modal_visibility = true;
        },

        handleBuyModalClose: (state) => {
            state.buy_modal_visibility = false;
        },
        handleSellModalOpen: (state, action) => {
            state.current_holding_id = action.payload.holding_id;
            state.current_available_quantity = action.payload.quantity;
            state.sell_modal_visibility = true;
        },

        handleSellModalClose: (state) => {
            state.sell_modal_visibility = false;
        },
        setSelectedSymbol: (state, action) => {
            state.selected_symbol = action.payload;
        }
    }
})

// Action creators are generated for each case reducer function
export const { handleBuyModalOpen, handleBuyModalClose, handleSellModalOpen, handleSellModalClose, setSelectedSymbol } = buyingSellingSlice.actions

export default buyingSellingSlice.reducer