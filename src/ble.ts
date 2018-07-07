export function startCustomAdvertising(bleno, serviceUuids: string[], scanData: Buffer): Promise<void> {
  return new Promise((resolve, reject) => {
    if (bleno.state !== 'poweredOn') {
      return reject(new Error('Could not start advertising, state is ' + bleno.state + ' (not poweredOn)'));
    } else {
      const undashedServiceUuids: string[] = [];

      if (serviceUuids && serviceUuids.length) {
        for (let i = 0; i < serviceUuids.length; i++) {
          undashedServiceUuids[i] = removeDashes(serviceUuids[i]);
        }
      }

      bleno.startAdvertisingWithEIRData(buildAdvertisement(undashedServiceUuids), scanData, err => err ? reject(err) : resolve());
    }
  })
}

export function stopAdvertising(bleno): Promise<void> {
  return new Promise(resolve => bleno.stopAdvertising(resolve));
}

function removeDashes(uuid) {
  if (uuid) {
    uuid = uuid.replace(/-/g, '');
  }

  return uuid;
}

function buildAdvertisement(serviceUuids: string[]) {
  let advertisementDataLength = 3;

  let serviceUuids16bit: Buffer[] = [];
  let serviceUuids128bit: Buffer[] = [];
  let i = 0;

  if (serviceUuids && serviceUuids.length) {
    for (i = 0; i < serviceUuids.length; i++) {
      const matched = serviceUuids[i].match(/.{1,2}/g);
      if (!matched) continue;

      let serviceUuid = new Buffer(matched.reverse().join(''), 'hex');

      if (serviceUuid.length === 2) {
        serviceUuids16bit.push(serviceUuid);
      } else if (serviceUuid.length === 16) {
        serviceUuids128bit.push(serviceUuid);
      }
    }
  }

  if (serviceUuids16bit.length) {
    advertisementDataLength += 2 + 2 * serviceUuids16bit.length;
  }

  if (serviceUuids128bit.length) {
    advertisementDataLength += 2 + 16 * serviceUuids128bit.length;
  }

  let advertisementData = new Buffer(advertisementDataLength);

  // flags
  advertisementData.writeUInt8(2, 0);
  advertisementData.writeUInt8(0x01, 1);
  advertisementData.writeUInt8(0x06, 2);

  let advertisementDataOffset = 3;

  if (serviceUuids16bit.length) {
    advertisementData.writeUInt8(1 + 2 * serviceUuids16bit.length, advertisementDataOffset);
    advertisementDataOffset++;

    advertisementData.writeUInt8(0x03, advertisementDataOffset);
    advertisementDataOffset++;

    for (i = 0; i < serviceUuids16bit.length; i++) {
      serviceUuids16bit[i].copy(advertisementData, advertisementDataOffset);
      advertisementDataOffset += serviceUuids16bit[i].length;
    }
  }

  if (serviceUuids128bit.length) {
    advertisementData.writeUInt8(1 + 16 * serviceUuids128bit.length, advertisementDataOffset);
    advertisementDataOffset++;

    advertisementData.writeUInt8(0x06, advertisementDataOffset);
    advertisementDataOffset++;

    for (i = 0; i < serviceUuids128bit.length; i++) {
      serviceUuids128bit[i].copy(advertisementData, advertisementDataOffset);
      advertisementDataOffset += serviceUuids128bit[i].length;
    }
  }

  return advertisementData;
}
