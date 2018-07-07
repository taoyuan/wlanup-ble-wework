import {now, Supplicant, SupplicantCreds, SupplicantStatus} from "../../src";

export class MockSuccessSupplicant implements Supplicant {

  connect(creds: SupplicantCreds): Promise<string> {
    return Promise.resolve('0123456789');
  }

  status(): Promise<SupplicantStatus> {
    return Promise.resolve({
      timestamp: now(),
      wifi_connected: true,
      ip_address: '192.168.1.111',
      mac_address: '60:03:08:a8:e6:a5'
    })
  }

}

export class MockFaulureSupplicant implements Supplicant {

  connect(creds: SupplicantCreds): Promise<string> {
    throw new Error('Could not connect to specified WiFi network, is the key correct?')
  }

  status(): Promise<SupplicantStatus> {
    return Promise.resolve({
      timestamp: now(),
      wifi_connected: false,
      mac_address: '60:03:08:a8:e6:a5'
    })
  }

}

