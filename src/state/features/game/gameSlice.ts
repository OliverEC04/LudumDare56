import {createSlice} from '@reduxjs/toolkit'
import {Node} from "../../../models/node.ts";
import {Tunnel} from "../../../models/tunnel.ts";

interface GameState {
    nodes: Node[];
    tunnels: Tunnel[];
    termites: number;
}

const initialState: GameState = {
    nodes: [],
    tunnels: [],
    termites: 10
}

export const gameSlice = createSlice({
    name: 'game',
    initialState,
    reducers: {
        update: (state) => {
            state.termites = state.termites * 1.1;
        }
    },
})

export const {update} = gameSlice.actions;

export default gameSlice.reducer;