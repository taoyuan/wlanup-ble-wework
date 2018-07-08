/// <reference types="node" />
import Characteristic = require("bleno/lib/characteristic");
import { EventEmitter } from "events";
export declare class WeworkBlewcCharacteristicIndicate extends Characteristic {
    protected ee?: EventEmitter | undefined;
    _maxValueSize: number;
    _updateValueCallback?: any;
    constructor(ee?: EventEmitter | undefined);
    onSubscribe(maxValueSize: number, updateValueCallback: Function): void;
    onUnsubscribe(): void;
    onIndicate(): void;
    write(data: Buffer): void;
}
