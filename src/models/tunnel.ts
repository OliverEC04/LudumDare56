import {Hub} from "./hub.ts";

export enum TunnelType {
    dug,
    mud,
    feces
}

export type Placement = { hub: number, y: number, x: number};

export type Tunnel = {
    id: number,
    begin: Hub,
    end: Hub,
    damage: number[],
    type: TunnelType,
    enabled: boolean,
}

export function createTunnel(id: number, begin: Hub, end: Hub, damage: number[], type: TunnelType): Tunnel{
    return {
        id: id,
        begin: begin,
        end: end,
        damage: damage,
        type: type,
        enabled: true,
    }
}