# wlanup-ble-wework

## events

### Packet

* `packet` - every packet form wework to device 

### Handshake

* `handshake:request` - device to wework handshake
* `handshake:response` - wework to device handshake confirmation

### WiFi connect
* `wifi:connect` - wework to device set wifi credentials
* `wifi:connect:result` - the result of wifi connect


### Status
* `status:request` - wework to device request wifi status
* `status:report` - device to work report wifi status
* `status:response` - wework to device confirm that wework received the wifi status
