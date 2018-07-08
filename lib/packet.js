"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var CMD;
(function (CMD) {
    CMD[CMD["PUSH_SET_WIFI"] = 30003] = "PUSH_SET_WIFI";
    CMD[CMD["PUSH_GET_DEVICE_STATUS"] = 30002] = "PUSH_GET_DEVICE_STATUS";
    CMD[CMD["REQ_HANDSHAKE"] = 10001] = "REQ_HANDSHAKE";
    CMD[CMD["RES_HANDSHAKE"] = 20001] = "RES_HANDSHAKE";
    CMD[CMD["REQ_CONFIRM_HANDSHAKE"] = 10002] = "REQ_CONFIRM_HANDSHAKE";
    CMD[CMD["RES_CONFIRM_HANDSHAKE"] = 20002] = "RES_CONFIRM_HANDSHAKE";
    CMD[CMD["REQ_REPORT_DEVICE_STATUS"] = 10004] = "REQ_REPORT_DEVICE_STATUS";
    CMD[CMD["RES_REPORT_DEVICE_STATUS"] = 20004] = "RES_REPORT_DEVICE_STATUS";
})(CMD = exports.CMD || (exports.CMD = {}));
class Packet {
    constructor(cmd, data, seq) {
        this.magicNumber = 0xFE;
        this.version = 1;
        this.type = 0;
        if (cmd)
            this.cmd = cmd;
        if (data)
            this.body = data;
        if (seq)
            this.seq = seq;
    }
}
Packet.HEADER_SIZE = 9;
exports.Packet = Packet;
//# sourceMappingURL=packet.js.map