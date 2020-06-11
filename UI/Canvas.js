import Item from "./Item.js";
import { extractTransforms } from "../libraries/Utils.js";

export default class Canvas {
    constructor(htmlElement) {
        this.htmlElement = htmlElement;
        this.currentZindex = 1;
        this.selection = document.querySelector('#selection');

        this.htmlElement.addEventListener('dragover', ev => ev.preventDefault());
        this.htmlElement.addEventListener('drop', ev => {
            let mousePosition = { x: ev.offsetX, y: ev.offsetY };

            if (ev.target !== this.htmlElement) {
                mousePosition = Canvas.toCanvasPosition(ev);
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

        this.htmlElement.addEventListener('mousedown', ev => {
            if (ev.target !== this.htmlElement) return;
            let selectionStartEvent = new Event('selectionstart');
            selectionStartEvent.mousePosition = { x: ev.offsetX, y: ev.offsetY };
            this.selection.dispatchEvent(selectionStartEvent);
        });

        this.htmlElement.addEventListener('mousemove', ev => {
            let mousePosition = { x: ev.offsetX, y: ev.offsetY };

            if (ev.target !== this.htmlElement) {
                mousePosition = Canvas.toCanvasPosition(ev);
            }

            let selectionMoveEvent = new Event('selectionmove');
            selectionMoveEvent.mousePosition = mousePosition;
            this.selection.dispatchEvent(selectionMoveEvent);
        });

        this.htmlElement.addEventListener('mouseup', ev => {
            let mousePosition = { x: ev.offsetX, y: ev.offsetY };

            if (ev.target !== this.htmlElement) {
                mousePosition = Canvas.toCanvasPosition(ev);
            }

            let selectionStopEvent = new Event('selectionstop');
            selectionStopEvent.mousePosition = mousePosition;
            this.selection.dispatchEvent(selectionStopEvent);
        });
    }

    static toCanvasPosition(ev) {
        let rect = ev.target.getBoundingClientRect();
        let tfs = extractTransforms(ev.target);

        let offset = {x: ev.offsetX, y: ev.offsetY};
        if ("scaleX" in tfs) offset.x = rect.width - offset.x; // TODO: use tf.value
        if ("scaleY" in tfs) offset.y = rect.height - offset.y;

        return { x: offset.x + rect.x, y: offset.y + rect.y };
    }
}