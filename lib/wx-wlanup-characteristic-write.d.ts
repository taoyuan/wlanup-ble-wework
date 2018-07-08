import Characteristic = require("bleno/lib/characteristic");
import { Parser } from "./parser";
export declare class WxWlanupCharacteristicWrite extends Characteristic {
    _parser: Parser;
    onPacket: (packet: any) => void;
    constructor();
    onWriteRequest(data: any, offset: any, withoutResponse: any, callback: any): void;
}
