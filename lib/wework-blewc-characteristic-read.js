"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const Characteristic = require("bleno/lib/characteristic");
const parser_1 = require("./parser");
class WeworkBlewcCharacteristicRead extends Characteristic {
    constructor() {
        super({
            uuid: 'FCC9',
            properties: ['read'],
        });
        this._parser = new parser_1.Parser();
    }
    onReadRequest(offset, callback) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.onRead) {
                callback(Characteristic.RESULT_SUCCESS, yield this.onRead(offset));
            }
        });
    }
    ;
}
exports.WeworkBlewcCharacteristicRead = WeworkBlewcCharacteristicRead;
//# sourceMappingURL=wework-blewc-characteristic-read.js.map