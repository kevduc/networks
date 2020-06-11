import { extractTransforms } from "../libraries/Utils.js";

export default class Link {
    constructor(canvas) {
        let div = document.createElement('div');
        div.classList.add('link');
        div.classList.add('ethernet-link');

        this.htmlElement = div;
        this.htmlElement.classList.add('disable-selection');
        this.htmlElement.style.display = 'none';
        canvas.appendChild(this.htmlElement);

        this.linkedItems = [];
        this.selected = false;

        this.htmlElement.addEventListener('click', ev => {
            let offset = { x: ev.offsetX, y: ev.offsetY };
            let rect = this.htmlElement.getBoundingClientRect();

            // let tfs = extractTransforms(this.htmlElement);
            // if ("scaleX" in tfs) offset.x = rect.width - offset.x; // TODO: use tf.value
            // if ("scaleY" in tfs) offset.y = rect.height - offset.y;

            let ratio = rect.height / rect.width;
            let sum = offset.y + offset.x;
            let w = sum / (1 + ratio);
            let h = ratio * w;

            let dw = w - offset.x;
            let dh = h - offset.y;
            if (dw * dw + dh * dh < Math.pow(5,2)) // TODO: fix overlapping link divs
                this.select();
        })

        this.htmlElement.addEventListener('select', ev => this.select());

        document.addEventListener('mousedown', ev => this.deselect(), { useCapture: true });

        document.addEventListener('keyup', ev => {
            if (ev.key == "Delete" && this.selected) {
                this.delete();
            }
        });
    }

    connect(item1, item2) {
        this.htmlElement.style.display = '';
        // this.htmlElement.classList.replace('ethernet-link','wifi-link'); // TODO: WiFi link for WiFi devices
        this.linkedItems = [item1, item2];

        item1.addEventListener('dragend', this.refreshLink.bind(this));
        item2.addEventListener('dragend', this.refreshLink.bind(this));

        item1.addEventListener('remove', this.delete.bind(this));
        item2.addEventListener('remove', this.delete.bind(this));

        this.refreshLink();
    }

    select() {
        this.selected = true;
        this.htmlElement.classList.add('selected');
    }

    deselect() {
        this.selected = false;
        this.htmlElement.classList.remove('selected');
    }

    refreshLink() {
        let getCenterPosition = item => {
            let rect = item.getBoundingClientRect();
            return { x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 };
        }

        let positions = this.linkedItems.map(getCenterPosition);
        let rect = {
            left: Math.min(positions[0].x, positions[1].x),
            top: Math.min(positions[0].y, positions[1].y),
            width: positions[1].x - positions[0].x,
            height: positions[1].y - positions[0].y
        };

        if (rect.width == 0) rect.width = 3;
        if (rect.height == 0) rect.height = 3;

        this.htmlElement.style.left = `${rect.left}px`;
        this.htmlElement.style.top = `${rect.top}px`;
        this.htmlElement.style.width = `${Math.abs(rect.width)}px`;
        this.htmlElement.style.height = `${Math.abs(rect.height)}px`;

        let transform = '';
        if (rect.width < 0 && rect.height > 0) transform += "scaleX(-1) ";
        if (rect.width > 0 && rect.height < 0) transform += "scaleY(-1) ";
        this.htmlElement.style.transform = transform;
    }

    delete() {
        let [item1, item2] = this.linkedItems;

        item1.removeEventListener('dragend', this.refreshLink.bind(this));
        item2.removeEventListener('dragend', this.refreshLink.bind(this));

        item1.removeEventListener('remove', this.delete.bind(this));
        item2.removeEventListener('remove', this.delete.bind(this));
        this.htmlElement.remove();
    }
}