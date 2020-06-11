export default class Selection {
    constructor(htmlElement) {
        this.htmlElement = htmlElement;
        this.hide();
        this.selectionStartPoint = null;

        this.htmlElement.addEventListener('selectionstart', ev => {
            this.startSelection(ev.mousePosition);
        });

        this.htmlElement.addEventListener('selectionmove', ev => {
            if (this.selectionStartPoint === null) return;
            this.setRect(Selection.toRect(this.selectionStartPoint, ev.mousePosition));
        });

        this.htmlElement.addEventListener('selectionstop', ev => {
            if (this.selectionStartPoint === null) return;
            this.endSelection(ev.mousePosition);
        });

        document.addEventListener('mouseup', ev => {
            this.cancelSelection();
        })

    }

    static toRect(position1, position2) {
        let rect = {
            x: Math.min(position1.x, position2.x),
            y: Math.min(position1.y, position2.y),
            width: Math.abs(position1.x - position2.x),
            height: Math.abs(position1.y - position2.y)
        };
        return rect;
    }

    startSelection(position) {
        this.selectionStartPoint = position;
        this.setRect(Selection.toRect(this.selectionStartPoint, this.selectionStartPoint));
        this.show();
    }

    cancelSelection() {
        this.selectionStartPoint = null;
        this.hide();
    }

    endSelection(position) {
        let selectionRect = Selection.toRect(this.selectionStartPoint, position);
        this.selectionStartPoint = null;
        this.hide();

        let selectElement = element => {
            let rect = element.getBoundingClientRect();
            let center = { x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 };
            if (selectionRect.x < center.x && center.x < selectionRect.x + selectionRect.width
                && selectionRect.y < center.y && center.y < selectionRect.y + selectionRect.height)
                element.dispatchEvent(new Event('select'));
        }

        document.querySelector('#canvas').querySelectorAll('.item').forEach(selectElement);
        document.querySelector('#canvas').querySelectorAll('.link').forEach(selectElement);
    }

    show() {
        this.htmlElement.style.display = 'block';
    }

    hide() {
        this.htmlElement.style.display = 'none';
    }

    setRect(rect) {
        this.htmlElement.style.left = `${rect.x}px`;
        this.htmlElement.style.top = `${rect.y}px`;
        this.htmlElement.style.width = `${rect.width}px`;
        this.htmlElement.style.height = `${rect.height}px`;
    }
}