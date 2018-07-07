import * as bleno from "bleno";
import {buildScanData, startCustomAdvertising, stopAdvertising, WxWlanupService} from "./src";
import {MockSuccessSupplicant} from "./test/mocks/mock-supplicant";

const sn = 'DLBY000000000001';
const deviceId = '7040252286565956865';
const secretNo = 'a15aa20deaea81bb6ab83ea46f73ea97';

const supplicant = new MockSuccessSupplicant();
const wxWlanupService = new WxWlanupService(supplicant, {
  sn,
  key: secretNo
});

bleno.on('stateChange', function (state) {
  console.log('on -> stateChange: ' + state);
  if (state === 'poweredOn') {
    startCustomAdvertising([wxWlanupService.uuid], buildScanData(deviceId));
  } else {
    stopAdvertising();
  }
});

bleno.on('advertisingStart', function (error) {
  console.log('on -> advertisingStart: ' + (error ? 'error ' + error : 'success'));

  if (!error) {
    bleno.setServices([
      wxWlanupService
    ]);
  }
});

wxWlanupService.ee.on('error', (err) => {
  console.error(err);
  bleno.disconnect();
});
