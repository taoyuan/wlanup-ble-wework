import Characteristic = require("bleno/lib/characteristic");
import {Parser} from "./parser";

export class WeworkBlewcCharacteristicWrite extends Characteristic {

  _parser: Parser = new Parser();

  onPacket: (packet) => void;
  onData: (data) => void;

  constructor() {
    super({
      uuid: 'FCC7',
      properties: ['write'],
    });

    this._parser.on('packet', packet => this.onPacket && this.onPacket(packet));
  }

  onWriteRequest(data, offset, withoutResponse, callback) {
    if (this.onData) {
      this.onData(data);
    }
    this._parser.parse(data);
    callback && callback(Characteristic.RESULT_SUCCESS);
  };
}
