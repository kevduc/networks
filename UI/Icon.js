import Item from "./Item.js";

export default class Icon {
    constructor(htmlElement) {
        this.htmlElement = htmlElement;
        this.htmlElement.classList.add('disable-selection');

        this.htmlElement.addEventListener('dragstart', ev => {
            let devicePixelRatio = window.devicePixelRatio || 1;
            let data = {
                action: "create",
                type: ev.target.id,
                itemOffsetX: ev.offsetX,
                itemOffsetY: ev.offsetY,
                itemWidth: 2.54 * parseFloat(window.getComputedStyle(ev.target).getPropertyValue('width')) / (devicePixelRatio * 96)
            };

            ev.dataTransfer.setData("application/json", JSON.stringify(data));
        });

        this.htmlElement.addEventListener('dblclick', ev => {
            let type = this.htmlElement.id;
            let canvas = document.querySelector('#canvas');
            let rect = canvas.getBoundingClientRect();
            let position = { x: rect.width/2, y: rect.height/2};
            new Item(canvas, type, position, true);
        })
    }
}