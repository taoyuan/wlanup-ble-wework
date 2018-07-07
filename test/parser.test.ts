import "mocha";
import {Parser} from "../src";
import * as s from "./support";

describe('parser', () => {
  it('should parse', (done) => {
    const parser = new Parser();

    parser.once('packet', packet => {
      console.log(packet);
      done();
    });

    for (let i = 0; i < s.samples.PUSH_SET_WIFI.length; i++) {
      parser.parse(Buffer.from(s.samples.PUSH_SET_WIFI[i], 'hex'));
    }

  });
});
