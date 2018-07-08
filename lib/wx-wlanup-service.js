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
const PrimaryService = require("bleno/lib/primary-service");
const Bignum = require("bignum");
const crypto_1 = require("crypto");
const wx_wlanup_characteristic_write_1 = require("./wx-wlanup-characteristic-write");
const wx_wlanup_characteristic_indicate_1 = require("./wx-wlanup-characteristic-indicate");
const packet_1 = require("./packet");
const utils_1 = require("./utils");
const events_1 = require("events");
class WxWlanupService extends PrimaryService {
    constructor(supplicant, options) {
        super({ uuid: 'FCE7' });
        this.supplicant = supplicant;
        this._authorized = false;
        this.sn = options.sn;
        this.key = options.key;
        this.ee = new events_1.EventEmitter();
        this.ccWrite = new wx_wlanup_characteristic_write_1.WxWlanupCharacteristicWrite();
        this.ccWrite.onPacket = packet => this.handle(packet);
        this.ccIndicate = new wx_wlanup_characteristic_indicate_1.WxWlanupCharacteristicIndicate(this.ee);
        this.characteristics = [this.ccWrite, this.ccIndicate];
        this.init();
    }
    init() {
        this.ee.on('subscribe', () => {
            console.log('subscribe');
            if (!this._authorized) {
                this.sendHandshakeRequest(this.sn);
            }
        });
        this.ee.on('unsubscribe', () => {
            console.log('unsubscribe');
        });
        this.ee.on('indicate', () => {
            console.log('indicate');
        });
        this.ee.on('write', data => {
            console.log(data);
        });
    }
    sendHandshakeRequest(sn) {
        console.log('sendHandshakeRequest');
        this._nonce = Bignum.fromBuffer(crypto_1.randomBytes(8));
        this.send(packet_1.CMD.REQ_HANDSHAKE, {
            client_nonce: this._nonce.toString(10),
            sn,
            scene: "handshake"
        }, utils_1.nextId());
    }
    handle(packet) {
        if (!this._authorized) {
            switch (packet.cmd) {
                case packet_1.CMD.RES_HANDSHAKE:
                    this.handleHandshakeResponse(packet);
                    break;
                case packet_1.CMD.RES_CONFIRM_HANDSHAKE:
                    this.handleHandshakeConfirm(packet);
                    break;
                default:
                    console.warn('Unauthorized request');
                    break;
            }
            return;
        }
        switch (packet.cmd) {
            case packet_1.CMD.PUSH_SET_WIFI:
                this.handleWiFiConnect(packet);
                break;
            case packet_1.CMD.RES_REPORT_DEVICE_STATUS:
            case packet_1.CMD.PUSH_GET_DEVICE_STATUS:
                this.handleReqStatus(packet);
                break;
            default:
                console.warn('unknown packet', packet);
                break;
        }
    }
    handleHandshakeResponse(packet) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = packet.body;
            if (res.errcode) {
                return this.ee.emit('error', new Error(res.errmsg));
            }
            let sorted = utils_1.sort('wework', this._nonce.toString(), res.server_nonce, 'handshake');
            let signature = utils_1.hmacsha1(this.key, sorted);
            if (signature !== res.signature) {
                return this.ee.emit('error', new Error('Unauthorized'));
            }
            sorted = utils_1.sort(this.sn, res.server_nonce, 'handshake');
            signature = utils_1.hmacsha1(this.key, sorted);
            return this.send(packet_1.CMD.REQ_CONFIRM_HANDSHAKE, { signature }, utils_1.nextId());
        });
    }
    handleHandshakeConfirm(packet) {
        return __awaiter(this, void 0, void 0, function* () {
            if (packet.body.errcode) {
                return this.ee.emit('error', new Error(packet.body.errmsg));
            }
            this._authorized = true;
        });
    }
    handleWiFiConnect(packet) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('handle connect', packet);
            const creds = packet.body;
            try {
                yield this.supplicant.connect({
                    ssid: creds.ssid,
                    key: creds.password
                });
            }
            finally {
                yield this.reportStatus(packet.seq);
            }
        });
    }
    handleReqStatus(packet) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.reportStatus(packet.seq);
        });
    }
    reportStatus(seq) {
        return __awaiter(this, void 0, void 0, function* () {
            const status = yield this.supplicant.status();
            return yield this.send(packet_1.CMD.REQ_REPORT_DEVICE_STATUS, status, seq);
        });
    }
    send(cmd, data, seq) {
        return this.write(new packet_1.Packet(cmd, data, seq));
    }
    write(packet) {
        console.log('write packet', packet);
        return this.ccIndicate.write(utils_1.encodePacket(packet));
    }
}
exports.WxWlanupService = WxWlanupService;
//# sourceMappingURL=wx-wlanup-service.js.map