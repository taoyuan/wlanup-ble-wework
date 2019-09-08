# wlanup-ble-wework

[![Greenkeeper badge](https://badges.greenkeeper.io/taoyuan/wlanup-ble-wework.svg)](https://greenkeeper.io/)

## events

### Raw Data

* `data` - received raw data

### Packet

* `packet` - every parsed packet form wework to device 

### Handshake

* `handshake:request` - device to wework handshake
* `handshake:response` - wework to device handshake confirmation

### WiFi Connect
* `wifi:connect` - wework to device set wifi credentials
* `wifi:connect:result` - the result of wifi connect


### Status
* `status:request` - wework to device request wifi status
* `status:report` - device to work report wifi status
* `status:response` - wework to device confirm that wework received the wifi status
