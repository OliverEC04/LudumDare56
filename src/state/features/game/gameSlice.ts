import {createSlice} from '@reduxjs/toolkit';
import {Node, NodeType} from '../../../models/node.ts';
import {Tunnel} from '../../../models/tunnel.ts';

interface GameState {
	nodes: Node[];
	tunnels: Tunnel[];
	home: Node;
	targetNode: Node | null;
	termites: number;
}

const initialState: GameState = {
	nodes: [],
	tunnels: [],
	home: new Node(0, 0, NodeType.home, 1, 0, []),
	targetNode: null,
	termites: 10,
};

export const gameSlice = createSlice({
	name: 'game',
	initialState,
	reducers: {
		update: (state) => {
			state.termites = state.termites * 1.1;
		},
		updateGraph: (state) => {
			const placeTermites = (startNode: Node) => {
				if (startNode.assignedTermites < startNode.size) return;
			};

			state.home.tunnels
				.sort((a, b) => a.size - b.size)
				.forEach(tunnel => {
					placeTermites(tunnel.end);
					return tunnel;
				});
		},
	},
});

export const {update} = gameSlice.actions;

export default gameSlice.reducer;