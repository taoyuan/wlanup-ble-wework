import * as bleno from "bleno";
import {startCustomAdvertising, stopAdvertising, WeworkBlewc} from "./src";
import {MockSuccessSupplicant} from "./test/mocks/mock-supplicant";

const sn = 'DLBY000000000001';
const did = '7040252286565956865';
const key = 'a15aa20deaea81bb6ab83ea46f73ea97';

const supplicant = new MockSuccessSupplicant();
const wework = new WeworkBlewc(supplicant, {sn, key, did});

bleno.on('stateChange', function (state) {
  console.log('on -> stateChange: ' + state);
  if (state === 'poweredOn') {
    startCustomAdvertising(bleno, [wework.service.uuid], wework.buildScanData());
  } else {
    stopAdvertising(bleno);
  }
});

bleno.on('advertisingStart', function (error) {
  console.log('on -> advertisingStart: ' + (error ? 'error ' + error : 'success'));

  if (!error) {
    bleno.setServices([wework.service]);
  }
});

wework.on('error', (err) => {
  console.error(err);
  bleno.disconnect();
});
