import Router from "./Devices/Router.js"
import Computer from "./Devices/Computer.js";
import Canvas from "./UI/Canvas.js";
import Icon from "./UI/Icon.js";

let router = new Router();
let computer = new Computer();

// console.log(router.formattedMac(), computer.formattedMac());

document.addEventListener('DOMContentLoaded', () => {
    let canvas = new Canvas(document.querySelector('#canvas'));
    let icons = Array.from(document.querySelectorAll('.icon')).map(el => new Icon(el));
})