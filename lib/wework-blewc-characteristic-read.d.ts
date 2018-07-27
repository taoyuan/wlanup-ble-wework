import Characteristic = require("bleno/lib/characteristic");
import { Parser } from "./parser";
export declare class WeworkBlewcCharacteristicRead extends Characteristic {
    _parser: Parser;
    onRead: (offset: any) => any;
    constructor();
    onReadRequest(offset: any, callback: any): Promise<void>;
}
