/// <reference types="node" />
import PrimaryService = require("bleno/lib/primary-service");
import * as Bignum from "bignum";
import { Supplicant } from "./supplicant";
import { WxWlanupCharacteristicWrite } from "./wx-wlanup-characteristic-write";
import { WxWlanupCharacteristicIndicate } from "./wx-wlanup-characteristic-indicate";
import { Packet } from "./packet";
import { EventEmitter } from "events";
export interface WxWlanupServiceOptions {
    sn: string;
    key: string;
}
export declare class WxWlanupService extends PrimaryService {
    protected supplicant: Supplicant;
    _authorized: boolean;
    _nonce: Bignum;
    sn: string;
    key: string;
    characteristics: any;
    ee: EventEmitter;
    ccWrite: WxWlanupCharacteristicWrite;
    ccIndicate: WxWlanupCharacteristicIndicate;
    constructor(supplicant: Supplicant, options: WxWlanupServiceOptions);
    protected init(): void;
    sendHandshakeRequest(sn: string): void;
    handle(packet: Packet): void;
    handleHandshakeResponse(packet: Packet): Promise<boolean | void>;
    handleHandshakeConfirm(packet: Packet): Promise<boolean | undefined>;
    handleWiFiConnect(packet: Packet): Promise<void>;
    handleReqStatus(packet: Packet): Promise<void>;
    reportStatus(seq: number): Promise<void>;
    send(cmd: any, data: any, seq: any): void;
    write(packet: Packet): void;
}
