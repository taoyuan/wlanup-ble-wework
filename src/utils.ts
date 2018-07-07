import * as crypto from "crypto";
import * as Bignum from "bignum";
import {Packet} from "./packet";

let ID = 1;

export function nextId() {
  return ID++;
}

export function buildScanData(deviceId: string): Buffer {
  // https://work.weixin.qq.com/api/doc#14078
  const data = Buffer.alloc(22);
  const deviceIdNum = new Bignum(deviceId);
  let offset = 0;
  offset = data.writeUInt8(0x15, offset);
  offset = data.writeUInt8(0xFF, offset);
  offset = data.writeUInt16BE(0x0000, offset);
  offset = data.writeUInt8(0xEE, offset);
  // 是否绑定，企微回复，暂未启用，默认设置为 1
  offset = data.writeUInt8(0x01, offset);
  deviceIdNum.toBuffer({endian: 'big', size: 'auto'}).copy(data, offset);
  return data;
}

export function sign(seed: string, time?: number): Buffer {
  const t = time || nowInMinute();
  const s = seed + t;

  const md5sum = crypto.createHash('md5');
  md5sum.update(s);
  const buf = md5sum.digest();
  return Buffer.from(buf.slice(0, 8).reverse());
}

export function now(): number {
  return Math.floor(Date.now() / 1000);
}

export function nowInMinute(): number {
  return Math.floor(now() / 60);
}

export function encodePacket(packet: Packet) {
  let payload = packet.payload;
  if (!payload && packet.body) {
    payload = Buffer.from(JSON.stringify(packet.body));
    packet.length = Packet.HEADER_SIZE + payload.length;
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

export function fragment(data: Buffer, chunkSize: number = 20): Buffer[] {
  const answer: Buffer[] = [];

  let chunk: Buffer | null = null;

  for (let offset = 0; offset < data.length; offset += chunkSize) {
    const end = Math.min(offset + chunkSize, data.length);
    if (offset + chunkSize < data.length) {
      answer.push(data.slice(offset, end));
    } else {
      chunk = chunk ||  Buffer.allocUnsafe(chunkSize);
      chunk.fill(0);
      data.slice(offset, end).copy(chunk);
      answer.push(chunk);
    }
  }

  return answer;

}

export function mixin(derivedCtor: any, baseCtors: any[]) {
  baseCtors.forEach(baseCtor => {
    Object.getOwnPropertyNames(baseCtor.prototype).forEach(name => {
      derivedCtor.prototype[name] = baseCtor.prototype[name];
    });
  });
  
}

export function sort(...args: string[]) {
  return args.sort().join('');
}

export function hmacsha1(key: string, data: string): string {
  const hmac = crypto.createHmac('sha1', key);
  hmac.update(data);
  return hmac.digest('hex');
}

