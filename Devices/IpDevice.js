import Device from "./Device.js"

export default class IpDevice extends Device {

    static parseIntIp(ip) {
        return parseInt(ip.split('.').map(n => parseInt(n).toString(16)).join(''), 16);
    }

    constructor(mac, ip) {
        super(mac)
        this.ARPCache = [];
        this.routingTable = [{ destination: "127.0.0.0/8", gateway: "127.0.0.1", metric: 1 }];
        this.ip = ip;
    }

    getGateway(ip) { // TODO: Luleå algorithm?
        let ipInt = IpDevice.parseIntIp(ip);
        for (route of this.routingTable) {
            let [baseAddress, netmask] = route.destination.split('/');
            if (netmask === undefined) netmask = 32;

            let netmaskInt = parseInt('1'.repeat(netmask).padEnd(32,'0'), 2);
            let baseAddressInt = IpDevice.parseIntIp(baseAddress);
            
            if (ipInt & netmaskInt === baseAddressInt) return route.gateway; // TODO: don't ignore metrics
        }
    }
}