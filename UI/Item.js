import Port from "./Port.js";
import Link from "./Link.js";

export default class Item {
    constructor(canvas, type, position, center) {
        let img = document.createElement('img');
        img.src = `/images/icons/${type}.svg`;
        img.classList.add("item-img");
        img.classList.add("disable-selection");

        let div = document.createElement('div');
        div.id = Item.generateId();
        div.classList.add('item');
        div.style = `position: absolute; left: ${position.x}px; top: ${position.y}px;`;
        if (center) div.style.transform = `translate(-50%, -50%)`;
        div.appendChild(img);
        new Port(div);

        this.htmlElement = div;
        this.select();

        this.htmlElement.addEventListener('dragstart', ev => {
            if (ev.target !== this.htmlElement.querySelector('.item-img')) return;

            let data = {
                action: "move",
                itemId: ev.target.parentElement.id,
                itemOffsetX: ev.offsetX,
                itemOffsetY: ev.offsetY
            };

            ev.dataTransfer.setData("application/json", JSON.stringify(data));
        });

        this.htmlElement.addEventListener('drop', ev => {
            if (!ev.target.classList.contains('item-img') && !ev.target.classList.contains('item')) return;
            ev.preventDefault();

            let data = JSON.parse(ev.dataTransfer.getData("application/json"));

            switch (data.action) {
                case 'link':
                    let fromItem = document.querySelector(`#${data.itemId}`);
                    let toItem = this.htmlElement;
                    if (fromItem !== toItem)
                        new Link(fromItem.parentElement).connect(fromItem, toItem);
                    break;
                default:
                    break;
            }
        });

        this.htmlElement.addEventListener('click', ev => {
            this.select();
        });

        document.addEventListener('keyup', ev => {
            if (ev.key == "Delete" && this.selected) {
                let binEvent = new Event('bin');
                binEvent.item = this.htmlElement;
                document.querySelector('#bin').dispatchEvent(binEvent);
            }
        });

        document.addEventListener('mousedown', ev => this.deselect(), { useCapture: true });

        canvas.appendChild(this.htmlElement);

        if (center) {
            let rect = this.htmlElement.getBoundingClientRect();
            div.style.left = `${rect.left}px`;
            div.style.top = `${rect.top}px`;
            div.style.transform = 'none';
        }
    }

    move(position) {
        this.htmlElement.style.left = `${position.x}px`;
        this.htmlElement.style.top = `${position.y}px`;
    }

    select() {
        this.selected = true;
        this.htmlElement.style.borderColor = "lightskyblue";
    }

    deselect() {
        this.selected = false;
        this.htmlElement.style.borderColor = "rgba(255, 255, 255, 0)";
    }

    static N = 0;

    static generateId() {
        let id = `item${Item.N}`;
        Item.N++;
        return id;
    }
}