import { createSlice } from '@reduxjs/toolkit'

export const UserSlice = createSlice({
    name: 'user',
    initialState: {
        logged_in: false,
        user: null,
        user_balance: null
    },
    reducers: {
        setUser: (state, action) => {
            state.user = { ...action.payload };
            state.logged_in = true;
            localStorage.setItem('user', JSON.stringify(action.payload));
        },
        removeUser: (state) => {
            state.user = null;
            state.logged_in = false;
            localStorage.removeItem('user');
        },
        updateUserBalance: (state, action) => {
            state.user_balance = { ...action.payload }
        }
    }
})

// Action creators are generated for each case reducer function
export const { setUser, removeUser, updateUserBalance } = UserSlice.actions

export default UserSlice.reducer