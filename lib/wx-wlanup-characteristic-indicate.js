"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Characteristic = require("bleno/lib/characteristic");
const utils_1 = require("./utils");
class WxWlanupCharacteristicIndicate extends Characteristic {
    constructor(ee) {
        super({
            uuid: 'FCC8',
            properties: ['indicate'],
        });
        this.ee = ee;
    }
    onSubscribe(maxValueSize, updateValueCallback) {
        this._maxValueSize = maxValueSize || 20;
        this._updateValueCallback = updateValueCallback;
        this.ee && this.ee.emit('subscribe', maxValueSize, updateValueCallback);
    }
    onUnsubscribe() {
        this._updateValueCallback = undefined;
        this.ee && this.ee.emit('unsubscribe');
    }
    onIndicate() {
        this.ee && this.ee.emit('indicate');
    }
    write(data) {
        if (!this._updateValueCallback) {
            return;
        }
        const fragments = utils_1.fragment(data, this._maxValueSize);
        for (const buf of fragments) {
            this._updateValueCallback(buf);
            this.ee && this.ee.emit('write', buf);
        }
    }
}
exports.WxWlanupCharacteristicIndicate = WxWlanupCharacteristicIndicate;
//# sourceMappingURL=wx-wlanup-characteristic-indicate.js.map