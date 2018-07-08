import {assert} from "chai";

import {Parser, WeworkBlewcService} from "../src";
import {MockSuccessSupplicant} from "./mocks/mock-supplicant";
import {samples} from "./support";
import * as s from "./support";

describe('service', () => {

  it('should set wifi', (done) => {
    const res: Buffer[] = [];

    const service = new WeworkBlewcService(new MockSuccessSupplicant(), {
      sn: '123',
      key: '456'
    });
    // hacking
    service._authorized = true;
    service.ccIndicate.onSubscribe(20, (data) => {
      res.push(Buffer.from(data));
    });

    for (let i = 0; i < samples.PUSH_SET_WIFI.length; i++) {
      service.ccWrite.onWriteRequest(Buffer.from(s.samples.PUSH_SET_WIFI[i], 'hex'), null, null, () => {
      });
    }

    const expected = {
      magicNumber: 254,
      version: 1,
      type: 0,
      length: 109,
      cmd: 10004,
      seq: 0,
      body: {
        timestamp: undefined,
        wifi_connected: true,
        ip_address: '192.168.1.111',
        mac_address: '60:03:08:a8:e6:a5'
      }
    };

    setTimeout(() => {
      const parser = new Parser();
      parser.on('packet', packet => {
        expected.body.timestamp = packet.body.timestamp;
        assert.deepInclude(packet, expected);
        done();
      });
      parser.parse(res);
    }, 500);
  });
});
