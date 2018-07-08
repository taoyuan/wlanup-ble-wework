"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const wework_blewc_service_1 = require("./wework-blewc-service");
const utils_1 = require("./utils");
const events_1 = require("events");
class WeworkBlewc extends events_1.EventEmitter {
    constructor(supplicant, options) {
        super();
        this.options = options;
        this.service = new wework_blewc_service_1.WeworkBlewcService(supplicant, options, this);
    }
    buildScanData() {
        return utils_1.buildScanData(this.options.did);
    }
}
exports.WeworkBlewc = WeworkBlewc;
//# sourceMappingURL=wework-blewc.js.map