import PriorityQueue from "ts-priority-queue/src/PriorityQueue";
import {Tunnel} from "./tunnel.ts";

type QueueObject = {tunnel: Tunnel, length: number};

export class TunnelQueue{
    private readonly queue: PriorityQueue<QueueObject>;

    constructor() {
        this.queue = new PriorityQueue({comparator: TunnelQueue.comparer})
    }

    public get length(): number{
        return this.queue.length;
    }
    
    public enqueue(length: number, tunnel: Tunnel){
        this.queue.queue({length: length, tunnel: tunnel});
    }

    public dequeue(){
        this.queue.dequeue();
    }

    public peekLength(): number{
        return this.queue.peek().length;
    }

    public peekTunnel(): Tunnel{
        return this.queue.peek().tunnel;
    }
    
    public clear(){
        this.queue.clear();
    }

    private static comparer(a: QueueObject, b: QueueObject): number{
        return a.length - b.length;
    }
}