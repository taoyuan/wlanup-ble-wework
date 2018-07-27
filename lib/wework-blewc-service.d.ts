/// <reference types="node" />
import PrimaryService = require("bleno/lib/primary-service");
import * as Bignum from "bignum";
import { Supplicant } from "./supplicant";
import { WeworkBlewcCharacteristicRead } from "./wework-blewc-characteristic-read";
import { WeworkBlewcCharacteristicWrite } from "./wework-blewc-characteristic-write";
import { WeworkBlewcCharacteristicIndicate } from "./wework-blewc-characteristic-indicate";
import { Packet } from "./packet";
import { EventEmitter } from "events";
export interface WeworkBlewcServiceOptions {
    sn: string;
    key: string;
}
export declare class WeworkBlewcService extends PrimaryService {
    protected supplicant: Supplicant;
    _authorized: boolean;
    _nonce: Bignum;
    sn: string;
    key: string;
    uuid: string;
    characteristics: any;
    ee: EventEmitter;
    reader: WeworkBlewcCharacteristicRead;
    writer: WeworkBlewcCharacteristicWrite;
    indicator: WeworkBlewcCharacteristicIndicate;
    constructor(supplicant: Supplicant, options: WeworkBlewcServiceOptions, ee?: EventEmitter);
    protected init(): void;
    sendHandshakeRequest(sn: string): void;
    handle(packet: Packet): void;
    handleHandshakeResponse(packet: Packet): Promise<boolean | void>;
    handleHandshakeConfirm(packet: Packet): Promise<boolean | undefined>;
    handleWiFiConnect(packet: Packet): Promise<void>;
    handleReqStatus(packet: Packet): Promise<void>;
    reportStatus(seq: number, status?: any): Promise<void>;
    handleReportStatusResponse(packet: Packet): Promise<void>;
    send(cmd: any, data: any, seq: any): void;
    write(packet: Packet): void;
}
