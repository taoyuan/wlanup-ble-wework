"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const crypto = require("crypto");
const Bignum = require("bignum");
const packet_1 = require("./packet");
let ID = 1;
function nextId() {
    return ID++;
}
exports.nextId = nextId;
function buildScanData(deviceId) {
    const data = Buffer.alloc(22);
    const deviceIdNum = new Bignum(deviceId);
    let offset = 0;
    offset = data.writeUInt8(0x15, offset);
    offset = data.writeUInt8(0xFF, offset);
    offset = data.writeUInt16BE(0x0000, offset);
    offset = data.writeUInt8(0xEE, offset);
    offset = data.writeUInt8(0x01, offset);
    deviceIdNum.toBuffer({ endian: 'big', size: 'auto' }).copy(data, offset);
    return data;
}
exports.buildScanData = buildScanData;
function sign(seed, time) {
    const t = time || nowInMinute();
    const s = seed + t;
    const md5sum = crypto.createHash('md5');
    md5sum.update(s);
    const buf = md5sum.digest();
    return Buffer.from(buf.slice(0, 8).reverse());
}
exports.sign = sign;
function now() {
    return Math.floor(Date.now() / 1000);
}
exports.now = now;
function nowInMinute() {
    return Math.floor(now() / 60);
}
exports.nowInMinute = nowInMinute;
function encodePacket(packet) {
    let payload = packet.payload;
    if (!payload && packet.body) {
        payload = Buffer.from(JSON.stringify(packet.body));
        packet.length = packet_1.Packet.HEADER_SIZE + payload.length;
    }
    const answer = Buffer.allocUnsafe(packet.length);
    let offset = 0;
    answer.writeUInt8(packet.magicNumber, offset++);
    answer.writeUInt8(packet.version, offset++);
    answer.writeUInt16BE(packet.length, offset);
    offset += 2;
    answer.writeUInt16BE(packet.cmd, offset);
    offset += 2;
    answer.writeUInt16BE(packet.seq, offset);
    offset += 2;
    answer.writeUInt8(packet.type, offset++);
    payload.copy(answer, offset);
    return answer;
}
exports.encodePacket = encodePacket;
function fragment(data, chunkSize = 20) {
    const answer = [];
    let chunk = null;
    for (let offset = 0; offset < data.length; offset += chunkSize) {
        const end = Math.min(offset + chunkSize, data.length);
        if (offset + chunkSize < data.length) {
            answer.push(data.slice(offset, end));
        }
        else {
            chunk = chunk || Buffer.allocUnsafe(chunkSize);
            chunk.fill(0);
            data.slice(offset, end).copy(chunk);
            answer.push(chunk);
        }
    }
    return answer;
}
exports.fragment = fragment;
function mixin(derivedCtor, baseCtors) {
    baseCtors.forEach(baseCtor => {
        Object.getOwnPropertyNames(baseCtor.prototype).forEach(name => {
            derivedCtor.prototype[name] = baseCtor.prototype[name];
        });
    });
}
exports.mixin = mixin;
function sort(...args) {
    return args.sort().join('');
}
exports.sort = sort;
function hmacsha1(key, data) {
    const hmac = crypto.createHmac('sha1', key);
    hmac.update(data);
    return hmac.digest('hex');
}
exports.hmacsha1 = hmacsha1;
//# sourceMappingURL=utils.js.map