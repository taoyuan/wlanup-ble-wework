import PrimaryService = require("bleno/lib/primary-service");
import * as Bignum from "bignum";
import {randomBytes} from "crypto";
import {Supplicant} from "./supplicant";
import {WxWlanupCharacteristicWrite} from "./wx-wlanup-characteristic-write";
import {WxWlanupCharacteristicIndicate} from "./wx-wlanup-characteristic-indicate";
import {CMD, HandshakeResponse, Packet, WiFiCreds} from "./packet";
import {encodePacket, hmacsha1, nextId, sort} from "./utils";
import {EventEmitter} from "events";

export interface WxWlanupServiceOptions {
  sn: string;
  key: string;
}

export class WxWlanupService extends PrimaryService {
  _authorized: boolean = false;
  _nonce: Bignum;

  sn: string;
  key: string;

  characteristics;

  ee: EventEmitter;
  ccWrite: WxWlanupCharacteristicWrite;
  ccIndicate: WxWlanupCharacteristicIndicate;

  constructor(protected supplicant: Supplicant, options: WxWlanupServiceOptions) {
    super({uuid: 'FCE7'});

    this.sn = options.sn;
    this.key = options.key;

    this.ee = new EventEmitter();

    this.ccWrite = new WxWlanupCharacteristicWrite();
    this.ccWrite.onPacket = packet => this.handle(packet);
    this.ccIndicate = new WxWlanupCharacteristicIndicate(this.ee);

    this.characteristics = [this.ccWrite, this.ccIndicate];

    this.init();
  }

  protected init() {
    this.ee.on('subscribe', () => {
      console.log('subscribe');
      if (!this._authorized) {
        this.sendHandshakeRequest(this.sn)
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

  sendHandshakeRequest(sn: string) {
    console.log('sendHandshakeRequest');
    this._nonce = Bignum.fromBuffer(randomBytes(8));
    this.send(CMD.REQ_HANDSHAKE, {
      client_nonce: this._nonce.toString(10),
      sn,
      scene: "handshake"
    }, nextId())
  }

  handle(packet: Packet) {
    if (!this._authorized) {
      switch (packet.cmd) {
        case CMD.RES_HANDSHAKE:
          this.handleHandshakeResponse(packet);
          break;
        case CMD.RES_CONFIRM_HANDSHAKE:
          this.handleHandshakeConfirm(packet);
          break;
        default:
          console.warn('Unauthorized request');
          break;
      }
      return;
    }

    switch (packet.cmd) {
      case CMD.PUSH_SET_WIFI:
        this.handleWiFiConnect(packet);
        break;
      case CMD.RES_REPORT_DEVICE_STATUS:
      case CMD.PUSH_GET_DEVICE_STATUS:
        this.handleReqStatus(packet);
        break;
      default:
        console.warn('unknown packet', packet);
        break;
    }
  }

  /**
   *
   *
   *
   Packet {
      magicNumber: 254,
      version: 1,
      type: 0,
      cmd: 10001,
      body:
       { client_nonce: '2182195003008728305',
         sn: 'DLBY000000000001',
         scene: 'handshake' },
      seq: 2 }
   =>

   Packet {
      magicNumber: 254,
      version: 1,
      type: 0,
      length: 120,
      cmd: 20001,
      seq: 0,
      body: {
        errcode: 0,
        server_nonce: '16097309590180193298',
        signature: '25bd85b40c1ced971e24f5c5ee95efeedec25d04',
        errmsg: 'ok'
      }
    }
   */
  async handleHandshakeResponse(packet: Packet) {
    const res = <HandshakeResponse>packet.body;
    if (res.errcode) {
      return this.ee.emit('error', new Error(res.errmsg));
    }

    let sorted = sort('wework', this._nonce.toString(), res.server_nonce, 'handshake');
    let signature = hmacsha1(this.key, sorted);
    if (signature !== res.signature) {
      return this.ee.emit('error', new Error('Unauthorized'));
    }

    // confirm signature
    sorted = sort(this.sn, res.server_nonce, 'handshake');
    signature = hmacsha1(this.key, sorted);
    return this.send(CMD.REQ_CONFIRM_HANDSHAKE, {signature}, nextId());
  }

  async handleHandshakeConfirm(packet: Packet) {
    if (packet.body.errcode) {
      return this.ee.emit('error', new Error(packet.body.errmsg));
    }

    this._authorized = true;
  }

  async handleWiFiConnect(packet: Packet) {
    console.log('handle connect', packet);
    const creds = <WiFiCreds> packet.body;
    try {
      await this.supplicant.connect({
        ssid: creds.ssid,
        key: creds.password
      });
    } finally {
      await this.reportStatus(packet.seq);
    }
  }

  async handleReqStatus(packet: Packet) {
    return this.reportStatus(packet.seq);
  }

  async reportStatus(seq: number) {
    const status = await this.supplicant.status();
    return await this.send(CMD.REQ_REPORT_DEVICE_STATUS, status, seq);
  }

  send(cmd, data, seq) {
    return this.write(new Packet(cmd, data, seq));
  }

  write(packet: Packet) {
    console.log('write packet', packet);
    return this.ccIndicate.write(encodePacket(packet));
  }
}
