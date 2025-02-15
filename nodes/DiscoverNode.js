﻿module.exports = function (RED) {
    var Broadlink = require("./Broadlink.js");
    function broadlinkNode(config) {
        RED.nodes.createNode(this, config);
        var node = this;
        this.on('input', function (msg) {
            node.status({fill:"blue",shape:"ring",text:"Discovering Devices"});
            var b = new Broadlink();
            b.discover();
            setTimeout(function () {
                var dev = [];

                function getType(devtype) {
                    if (devtype == 0) return 'SP1';
                    else if (devtype == 0x2711) return 'SP2';
                    else if (devtype == 0x2719 || devtype == 0x7919 || devtype == 0x271a || devtype == 0x791a) return 'Honeywell SP2';
                    else if (devtype == 0x2720) return 'SPMini';
                    else if (devtype == 0x753e) return 'SP3';
                    else if (devtype == 0x7D00) return 'OEM branded SP3';
                    else if (devtype == 0x947a || devtype == 0x9479) return 'SP3s';
                    else if (devtype == 0x2728) return 'SPMini2';
                    else if (devtype == 0x2733 || devtype == 0x273e) return 'OEM branded SPMini';
                    else if (devtype == 0x7530 || devtype == 0x7918) return 'OEM branded SPMini2';
                    else if (devtype == 0x2736) return 'SPMiniPlus';
                    else if (devtype == 0x2712) return 'RM2';
                    else if (devtype == 0x2737) return 'RM Mini';
                    else if (devtype == 0x273d) return 'RM Pro Phicomm';
                    else if (devtype == 0x2783) return 'RM2 Home Plus';
                    else if (devtype == 0x277c) return 'RM2 Home Plus GDT';
                    else if (devtype == 0x272a) return 'RM2 Pro Plus';
                    else if (devtype == 0x2787) return 'RM2 Pro Plus2';
                    else if (devtype == 0x279d) return 'RM2 Pro Plus3';
                    else if (devtype == 0x27a9) return 'RM2 Pro Plus300';
                    else if (devtype == 0x278b) return 'RM2 Pro Plus BL';
                    else if (devtype == 0x2797) return 'RM2 Pro Plus HYC';
                    else if (devtype == 0x27a6) return 'RM2 Pro PP';
                    else if (devtype == 0x278f) return 'RM Mini Shate';
                    else if (devtype == 0x27c2) return 'RM Mini 3';
                    else if (devtype == 0x2714) return 'A1';
                    else if (devtype == 0x4EB5) return 'MP1';
                    else if (devtype == 0x4ef7) return 'Honyar OEM MP1';
                    else if (devtype == 0x2722) return 'S1(SmartOne Alarm Kit)';
                    else if (devtype == 0x6026) return 'RM4 Pro';
                    else if (devtype == 0x7d11) return 'SP Mini 3';
                    else if (devtype == 0x27d1) return 'New RM Mini 3';
                    else if (devtype == 0x4e97) return 'RM4 Mini';
                    else if (devtype == 0x5f36) return 'RM Mini 3 newer';
                    else if (devtype == 0x51da) return 'RM4b';
                    else if (devtype == 0x610e) return 'RM4 Mini';
                    else if (devtype == 0x648d) return 'RM4 Mini';
                    else if (devtype == 0x610f) return 'RM4c';
                    else if (devtype == 0x61a2) return 'RM4 Pro';
                    else if (devtype == 0x62bc) return 'RM4c';
                    else if (devtype == 0x62be) return 'RM4c';
                    else if (devtype == 0x6539) return 'RM4c Mini';
                    else if (devtype == 0x649b) return 'RM4 Pro';
                    else if (devtype == 0x653c) return 'RM4 Pro';
                    else if (devtype == 0x653a) return 'RM4 Mini';
                    else if (devtype == 0x7547) return 'SC1 - Use the SP2 Node';
                    else if (devtype == 0x5213) return 'RM4 Pro';
                    else if (devtype == 0xa56c) return 'SmartPlug4';
                    else if (devtype == 0x520b) return 'RM4 Pro';
                    else if (devtype == 0x520d) return 'RM4c Mini';
                    else if (devtype == 0x5216) return 'RM4c Mini';
                    else if (devtype == 0x648a) return 'RM4c Mini';
                    else if (devtype == 0x648d) return 'RM4c Mini';
                    else if (devtype == 0x5209) return 'RM4 Pro';
                    else return 'Broadlink: Unconfigured Device Type: Log an issue with the device details and typeid returned as this may be a new device type.';
                }
                
                for (var device in b.devices) {
                    dev.push(
                        {
                            mac: device,
                            ip: b.devices[device].address,
                            typeid: b.devices[device].type.toString(16),
                            type: getType(b.devices[device].type),
                            name: b.devices[device].name,
                            cloud: b.devices[device].cloud,
                            msgdata: b.devices[device].fullmsg
                        });
                }
                if (dev.length == 0) {
                    node.status({fill:"red",shape:"ring",text:"No Devices Found"});
                }
                else {
                    node.status({fill:"green",shape:"ring",text:"Found Some Devices"});
                    msg.payload = dev;
                    node.send(msg);
                }

            }, 3000);//timeout
        });

    }
    RED.nodes.registerType("Discover", broadlinkNode);
}
