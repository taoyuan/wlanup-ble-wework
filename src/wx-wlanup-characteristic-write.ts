import Characteristic = require("bleno/lib/characteristic");
import {Parser} from "./parser";

export class WxWlanupCharacteristicWrite extends Characteristic {

  _parser: Parser = new Parser();

  onPacket: (packet) => void;

  constructor() {
    super({
      uuid: 'FCC7',
      properties: ['write'],
    });

    this._parser.on('packet', packet => this.onPacket && this.onPacket(packet));
  }

  onWriteRequest(data, offset, withoutResponse, callback) {
    this._parser.parse(data);
    callback && callback(Characteristic.RESULT_SUCCESS);
  };
}
