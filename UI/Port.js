import Link from "./Link.js";

export default class Port {
    constructor(item) {
        let port = document.createElement('div');
        port.draggable = 'true';
        port.classList.add("item-port");
        this.htmlElement = port;
        this.htmlElement.classList.add('disable-selection');
        item.appendChild(port);

        this.htmlElement.addEventListener('dragstart', ev => {
            let data = {
                action: "link",
                itemId: ev.target.parentElement.id
            };

            ev.dataTransfer.setData("application/json", JSON.stringify(data));
        });

        this.htmlElement.addEventListener('dragover', ev => ev.preventDefault());

        this.htmlElement.addEventListener('drop', ev => {
            if (!ev.target.classList.contains('item-port')) return;
            ev.preventDefault();

            let data = JSON.parse(ev.dataTransfer.getData("application/json"));

            switch (data.action) {
                case 'link':
                    let fromItem = document.querySelector(`#${data.itemId}`);
                    let toItem = this.htmlElement.parentElement;
                    if (fromItem !== toItem)
                        new Link(fromItem.parentElement).connect(fromItem, toItem);
                    break;
                default:
                    break;
            }
        });
    }
}