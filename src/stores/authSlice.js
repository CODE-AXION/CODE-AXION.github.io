import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    user: false,
    isLoading: true,
    error: null,
    isLoggedIn: (localStorage.getItem('isLoggedIn') != null) ? localStorage.getItem('isLoggedIn') : false ,
};

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
            state.isLoading = false;
            state.error = null;
        },
        setError: (state, action) => {
            state.error = action.payload;
            state.isLoading = false;
        },
        setLoading: (state) => {
            state.isLoading = true;
        },
        setLoggedIn: (state, action) => {
            state.isLoggedIn = action.payload;
            localStorage.setItem('isLoggedIn', action.payload);
        },
    },
});

export const { setUser, setError, setLoading, setLoggedIn } = userSlice.actions;

export default userSlice.reducer;