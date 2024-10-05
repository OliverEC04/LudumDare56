import {Hub} from "./hub.ts";

export enum TunnelType {
    dug,
    mud,
    feces
}

export class Placement{
    public hub: Hub;
    public y: number;
    public x: number;

    constructor(hub: Hub, y: number, x: number) {
        this.hub = hub;
        this.y = y;
        this.x = x;
    }
}

export class Tunnel {
    public begin: Hub;
    public end: Hub;
    public damage: number[];
    public type: TunnelType;
    public enabled: boolean;

    constructor(
        begin: Hub,
        end: Hub,
        damage: number[],
        type: TunnelType
    ) {
        this.begin = begin;
        this.end = end;
        this.damage = damage;
        this.type = type;
        this.enabled = true;
        this.begin.AddTunnel(this);
        this.end.AddTunnel(this);
    }
}