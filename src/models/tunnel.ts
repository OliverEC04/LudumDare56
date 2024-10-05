import {Hub} from "./hub.ts";

export enum TunnelType {
    dug,
    mud,
    feces
}

export class Tunnel {
    begin: Hub;
    end: Hub;
    damage: number[];
    type: TunnelType;
    enabled: boolean;

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