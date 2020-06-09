import { randint } from "../libraries/Utils.js"

export default class Device {
    static MacList = new Set();

    static generateMac() {
        let binaryMAC = randint(Math.pow(2,48) - 1).toString(2);
        binaryMAC = `${binaryMAC.substring(0,7)}0${binaryMAC.substring(8)}`; // Universally administered (and no need to check if it's the broadcast address)
        return parseInt(binaryMAC,2).toString(16).padStart(8, '0');
    }

    constructor(mac) {
        if (mac === undefined) {
            let numTries = 1e3;
            while (numTries > 0 && Device.MacList.has(mac = Device.generateMac())) numTries--;
            Device.MacList.add(mac);
        }
        this.mac = mac;
        this.connections = new Set();
    }

    onConnect(device) {}
    onDisconnect(device) {}

    connect(device) {
        this.connections.add(device);
        this.onConnect(device);
    }

    disconnect(device) {
        this.connections.delete(device);
        this.onDisconnect(device);
    }

    formattedMac() {
        return this.mac.match(/.{1,2}/g).join(':');
    }
}