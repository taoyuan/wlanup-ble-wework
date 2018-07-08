/// <reference types="node" />
import { Packet } from "./packet";
export declare function nextId(): number;
export declare function buildScanData(deviceId: string): Buffer;
export declare function sign(seed: string, time?: number): Buffer;
export declare function now(): number;
export declare function nowInMinute(): number;
export declare function encodePacket(packet: Packet): Buffer;
export declare function fragment(data: Buffer, chunkSize?: number): Buffer[];
export declare function mixin(derivedCtor: any, baseCtors: any[]): void;
export declare function sort(...args: string[]): string;
export declare function hmacsha1(key: string, data: string): string;
