import BufferList = require("bl");
import {EventEmitter} from "events";
import {Packet} from "./packet";

export class Parser extends EventEmitter {
  settings;
  error;
  packet: Packet;
  _list: BufferList;
  _states: string[];
  _stateCounter: number;

  constructor(opts?) {
    super();
    this.settings = opts || {};

    this._states = [
      '_parseHeader',
      '_parsePayload',
      '_newPacket',
    ];

    this._resetState()
  }

  _resetState() {
    this.packet = new Packet();
    this.error = null;
    this._list = new BufferList();
    this._stateCounter = 0;
  }

  parse(buf: Buffer | Buffer[]) {
    if (Array.isArray(buf)) {
      for (const b of buf) {
        this._parse(b);
      }
    } else {
      this._parse(buf);
    }
    return this._list.length;
  }

  _parse(buf: Buffer) {
    if (this.error) this._resetState();

    this._list.append(buf);

    while ((this.packet.length !== -1 || this._list.length > 0)
    && this[this._states[this._stateCounter]]()
    && !this.error) {
      this._stateCounter++;
      if (this._stateCounter >= this._states.length) this._stateCounter = 0;
    }

    return this._list.length;
  }

  _parseHeader() {
    if (this._list.length < Packet.HEADER_SIZE) {
      return false;
    }

    let offset = 0;
    this.packet.magicNumber = this._list.readUInt8(offset++);
    this.packet.version = this._list.readUInt8(offset++);
    this.packet.length = this._list.readUInt16BE(offset) - Packet.HEADER_SIZE;
    offset += 2;
    this.packet.cmd = this._list.readUInt16BE(offset);
    offset += 2;
    this.packet.seq = this._list.readUInt16BE(offset);
    offset += 2;
    this.packet.type = this._list.readUInt8(offset++);

    this._list.consume(offset);

    return true;
  }

  _parsePayload() {
    if (this.packet.length > this._list.length) {
      return false;
    }

    this.packet.payload = this._list.slice(0, this.packet.length);

    let count = this.packet.length;
    while (this._list.length > count && this._list.readUInt8(count++) === 0) {
      // no-op
    }
    this._list.consume(count);
    return true;
  }

  _newPacket() {
    if (this.packet) {
      if (this.packet.type === 0) {
        this.packet.body = JSON.parse(this.packet.payload.toString('utf8'));
      }
      this.emit('packet', this.packet);
    }

    this.packet = new Packet();
    return true;
  }

}
