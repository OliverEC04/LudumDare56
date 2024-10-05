import {Hub} from "./hub.ts";

export enum TunnelType {
    dug,
    mud,
    feces
}

export type Placement = { hub: number, y: number, x: number};

export class Tunnel {
    public id: number;
    public begin: Hub;
    public end: Hub;
    public damage: number[];
    public type: TunnelType;
    public enabled: boolean;

    constructor(
        id: number,
        begin: Hub,
        end: Hub,
        damage: number[],
        type: TunnelType
    ) {
        this.id = id;
        this.begin = begin;
        this.end = end;
        this.damage = damage;
        this.type = type;
        this.enabled = true;
        this.begin.tunnels.push(this.id);
        this.end.tunnels.push(this.id);
    }
}