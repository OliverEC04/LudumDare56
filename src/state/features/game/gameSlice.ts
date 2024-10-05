import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {Hub, HubType} from '../../../models/hub.ts';
import {Placement, Tunnel, TunnelType} from '../../../models/tunnel.ts';

interface GameState {
	hubs: Hub[];
	tunnels: Tunnel[];
	home: Hub;
	termites: number;
}

const home = new Hub(0, 0, HubType.home, 10, 0);
const food = new Hub(1, 1, HubType.food, 10, 0);
const none = new Hub(0.25, 0.5, HubType.none, 0, 0);

const tunnel1 = new Tunnel(home, none, [0, 1, 2, 3], TunnelType.dug);
const tunnel2 = new Tunnel(none, food, [0, 1, 2, 3], TunnelType.dug);

const initialState: GameState = {
	hubs: [home, food, none],
	tunnels: [tunnel1, tunnel2],
	home: home,
	termites: 0,
};

export const gameSlice = createSlice({
	name: 'game',
	initialState,
	reducers: {
        addTunnel: (state, action: PayloadAction<Placement>) => {
            const placement = action.payload;
            const hub = new Hub(placement.x, placement.y, HubType.none, 0, 0);
            state.tunnels.push(new Tunnel(placement.hub, hub, [], TunnelType.dug));
            state.hubs.push(hub);
        },
	},
});

export const {addTunnel} = gameSlice.actions;

export default gameSlice.reducer;