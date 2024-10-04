import type {PayloadAction} from '@reduxjs/toolkit'
import {createSlice} from '@reduxjs/toolkit'

interface LayoutState {
    sideMenuOpen: boolean;
}

const initialState: LayoutState = {
    sideMenuOpen: false,
}

export const layoutSlice = createSlice({
    name: 'layout',
    initialState,
    reducers: {
        toggleSideMenuOpen: (state) => {
            state.sideMenuOpen = !state.sideMenuOpen;
        },
        setSideMenuOpen: (state, action: PayloadAction<boolean>) => {
            state.sideMenuOpen = action.payload;
        }
    },
})

export const {toggleSideMenuOpen, setSideMenuOpen} = layoutSlice.actions;

export default layoutSlice.reducer;