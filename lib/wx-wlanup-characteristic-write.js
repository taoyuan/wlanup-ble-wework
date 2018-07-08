"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Characteristic = require("bleno/lib/characteristic");
const parser_1 = require("./parser");
class WxWlanupCharacteristicWrite extends Characteristic {
    constructor() {
        super({
            uuid: 'FCC7',
            properties: ['write'],
        });
        this._parser = new parser_1.Parser();
        this._parser.on('packet', packet => this.onPacket && this.onPacket(packet));
    }
    onWriteRequest(data, offset, withoutResponse, callback) {
        this._parser.parse(data);
        callback && callback(Characteristic.RESULT_SUCCESS);
    }
    ;
}
exports.WxWlanupCharacteristicWrite = WxWlanupCharacteristicWrite;
//# sourceMappingURL=wx-wlanup-characteristic-write.js.map