import {Node} from "./node.ts";

export enum TunnelType {
    dug,
    mud,
    feces
}

export class Tunnel {
    begin: Node;
    end: Node;
    damage: number[];
    size: number;
    type: TunnelType;
    enabled: boolean;

    constructor(
        begin: Node,
        end: Node,
        damage: number[],
        size: number,
        type: TunnelType,
        enabled: boolean
    ) {
        this.begin = begin;
        this.end = end;
        this.damage = damage;
        this.size = size;
        this.type = type;
        this.enabled = enabled;
    }
}