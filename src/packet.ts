export enum CMD {
  PUSH_SET_WIFI = 30003,
  PUSH_GET_DEVICE_STATUS = 30002,
  REQ_HANDSHAKE = 10001,
  RES_HANDSHAKE = 20001,
  REQ_CONFIRM_HANDSHAKE = 10002,
  RES_CONFIRM_HANDSHAKE = 20002,
  REQ_REPORT_DEVICE_STATUS = 10004,
  RES_REPORT_DEVICE_STATUS = 20004,
}

export const MAGIC_NUMBER = 0XFE;

export interface WiFiCreds {
  ssid: string;
  bssid: string;
  password: string;
}

export interface HandshakeRequet {
  sn: string;
  client_nonce: string;
  scene: string;
}

export interface HandshakeResponse {
  errcode: number;
  errmsg: string;
  signature: string;
  server_nonce: string;
}

export class Packet {
  static HEADER_SIZE = 9;

  magicNumber: number = 0xFE;
  version: number = 1;
  length: number;
  cmd: CMD;
  seq: number;
  type: number = 0;
  payload: Buffer;
  body: any;

  constructor(cmd?: CMD, data?: any, seq?: number) {
    if (cmd) this.cmd = cmd;
    if (data) this.body = data;
    if (seq) this.seq = seq;
  }

}
