/// <reference types="node" />
import { WeworkBlewcService, WeworkBlewcServiceOptions } from "./wework-blewc-service";
import { Supplicant } from "./supplicant";
import { EventEmitter } from "events";
export interface WeworkBlewcOptions extends WeworkBlewcServiceOptions {
    did: string;
}
export declare class WeworkBlewc extends EventEmitter {
    protected options: WeworkBlewcOptions;
    readonly service: WeworkBlewcService;
    constructor(supplicant: Supplicant, options: WeworkBlewcOptions);
    buildScanData(): Buffer;
}
