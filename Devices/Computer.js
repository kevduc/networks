import IpDevice from "./IpDevice.js";

export default class Computer extends IpDevice {
    constructor(mac, ip) {
        super(mac, ip);
    }
}