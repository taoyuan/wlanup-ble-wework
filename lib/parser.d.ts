/// <reference types="node" />
import BufferList = require("bl");
import { EventEmitter } from "events";
import { Packet } from "./packet";
export declare class Parser extends EventEmitter {
    settings: any;
    error: any;
    packet: Packet;
    _list: BufferList;
    _states: string[];
    _stateCounter: number;
    constructor(opts?: any);
    _resetState(): void;
    parse(buf: Buffer | Buffer[]): number;
    _parse(buf: Buffer): number;
    _parseHeader(): boolean;
    _parsePayload(): boolean;
    _newPacket(): boolean;
}
