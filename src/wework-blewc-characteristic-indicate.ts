import Characteristic = require("bleno/lib/characteristic");
import {fragment} from "./utils";
import {EventEmitter} from "events";

export class WeworkBlewcCharacteristicIndicate extends Characteristic {
  _maxValueSize: number;
  _updateValueCallback?;

  constructor(protected ee?: EventEmitter) {
    super({
      uuid: 'FCC8',
      properties: ['indicate'],
    })
  }

  onSubscribe(maxValueSize: number, updateValueCallback: Function) {
    this._maxValueSize = maxValueSize || 20;
    this._updateValueCallback = updateValueCallback;
    this.ee && this.ee.emit('subscribe', maxValueSize, updateValueCallback);
  }

  onUnsubscribe() {
    this._updateValueCallback = undefined;
    this.ee && this.ee.emit('unsubscribe');
  }

  onIndicate() {
    this.ee && this.ee.emit('indicate');
  }

  write(data: Buffer) {
    if (!this._updateValueCallback) {
      return;
    }

    const fragments = fragment(data, this._maxValueSize);
    for (const buf of fragments) {
      this._updateValueCallback(buf);
      this.ee && this.ee.emit('write', buf);
    }
  }
}
