import Item from "./Item.js";
import { extractTransforms } from "../libraries/Utils.js";

export default class Canvas {
    constructor(htmlElement) {
        this.htmlElement = htmlElement;
        this.currentZindex = 1;

        this.htmlElement.addEventListener('dragover', ev => ev.preventDefault());
        this.htmlElement.addEventListener('drop', ev => {
            let mousePosition = { x: ev.offsetX, y: ev.offsetY };

            if (ev.target !== this.htmlElement) {
                // if (!ev.target.classList.contains('item')) return;
                let rect = ev.target.getBoundingClientRect();
                let tfs = extractTransforms(ev.target);

                let offset = {x: ev.offsetX, y: ev.offsetY};
                if ("scaleX" in tfs) offset.x = rect.width - offset.x; // TODO: use tf.value
                if ("scaleY" in tfs) offset.y = rect.height - offset.y;

                mousePosition = { x: offset.x + rect.x, y: offset.y + rect.y };
            }

            ev.preventDefault();

            let data = JSON.parse(ev.dataTransfer.getData("application/json"));
            let itemLeft, itemTop, item;

            switch (data.action) {
                case "create":
                    let i = 0;
                    while (i < document.styleSheets[0].rules.length && document.styleSheets[0].rules[i].selectorText !== ".item-img") i++;
                    let canvasItemWidth = parseFloat(document.styleSheets[0].rules[i].style.width);

                    let zoomFactor = canvasItemWidth / data.itemWidth;
                    itemLeft = mousePosition.x - data.itemOffsetX * zoomFactor;
                    itemTop = mousePosition.y - data.itemOffsetY * zoomFactor;

                    item = new Item(this.htmlElement, data.type, { x: itemLeft, y: itemTop });
                    item.htmlElement.style.zIndex = ++this.currentZindex;
                    break;
                case "move":
                    itemLeft = mousePosition.x - data.itemOffsetX;
                    itemTop = mousePosition.y - data.itemOffsetY;
                    item = document.querySelector(`#${data.itemId}`);

                    item.style.left = `${itemLeft}px`;
                    item.style.top = `${itemTop}px`;
                    item.style.zIndex = ++this.currentZindex;
                    break;
                default:
                    break;
            }
        }, { useCapture: true });
    }
}