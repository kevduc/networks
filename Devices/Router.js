import IpDevice from "./IpDevice.js";

export default class Router extends IpDevice {
    constructor(mac, ip) {
        super(mac, ip);
    }

    onConnect(device) {
        console.log(device, "connected.")
    }

    onDisconnect(device) {
        console.log(device, "disconnected.")
    }
}