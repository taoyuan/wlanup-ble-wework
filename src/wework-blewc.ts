import {WeworkBlewcService, WeworkBlewcServiceOptions} from "./wework-blewc-service";
import {Supplicant} from "./supplicant";
import {buildScanData} from "./utils";
import {EventEmitter} from "events";

export interface WeworkBlewcOptions extends WeworkBlewcServiceOptions {
  did: string;
}

export class WeworkBlewc extends EventEmitter {
  readonly service: WeworkBlewcService;

  constructor(supplicant: Supplicant, protected options: WeworkBlewcOptions) {
    super();
    this.service = new WeworkBlewcService(supplicant, options, this);
  }

  buildScanData(): Buffer {
    return buildScanData(this.options.did);
  }

}
