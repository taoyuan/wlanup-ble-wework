import Characteristic = require("bleno/lib/characteristic");
import {Parser} from "./parser";

export class WeworkBlewcCharacteristicRead extends Characteristic {

  _parser: Parser = new Parser();

  onRead: (offset) => any;

  constructor() {
    super({
      uuid: 'FCC9',
      properties: ['read'],
    });
  }

  async onReadRequest(offset, callback) {
    if (this.onRead) {
      callback(Characteristic.RESULT_SUCCESS, await this.onRead(offset));
    }
  };
}
