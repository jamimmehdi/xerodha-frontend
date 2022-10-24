import { configureStore } from '@reduxjs/toolkit'
import BuyingSellingSlice from '../helper/BuyingSellingSlice'
import UserSlice from '../helper/UserSlice'

export default configureStore({
    reducer: {
        buy_sell: BuyingSellingSlice,
        user: UserSlice
    }
})