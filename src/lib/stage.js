import { dropTmpElement, deselectDraggable, deselectElement, selectTmpElement, clickOnElement } from './actions'
import { drawLine } from './draw_utils'

export const stage = {
    clickedTmpDropElement: null,
    stage: null,
    layer: null,
    transformer: null,
    clickedType: null,
    mode: 'brush',
    draggable: null,
    clickedElement: null,
    x1: null, y1: null, x2: null, y2: null, // pointer selection
    tmpDropElement: null,
    selectionRectangle: null,
    isPaint: false,
    lastLine: null,
    selectedimg: null,
    pointerPaletteElement : null
}

let tmpX, tmpY;

let selectedimg


export function initStage() {

    const width = document.getElementById('container').getBoundingClientRect().width
    const height = document.getElementById('container').getBoundingClientRect().height;

    stage.stage = new Konva.Stage({
        container: 'container',
        width: width,
        height: height,
    });

    stage.layer = new Konva.Layer();
    stage.stage.add(stage.layer);
    stage.layer.draw();

    stage.selectionRectangle = new Konva.Rect({
        fill: 'rgba(0,0,255,0.5)',
    });
    stage.layer.add(stage.selectionRectangle);


    stage.stage.on('keypress', (e) => {
        var e;
        if (!e) e = window.event;

        var keyCode = e.keyCode;
        if (keyCode == '27') {
            // TODO 
        }
    });

    stage.stage.on('mousedown touchstart', (e) => {

        if (stage.clickedTmpDropElement) {
            tmpX = stage.stage.getPointerPosition().x;
            tmpY = stage.stage.getPointerPosition().y;
            dropTmpElement(stage.clickedTmpDropElement)
            return;
        }

        if (stage.mode === "brush") {
            drawLine()
        }

        if (stage.mode === "pointer") {
            // do nothing if we mousedown on eny shape
            if (e.target !== stage) {
                return;
            }

            drawPointerSelection()
        }
    });

    stage.stage.on('mousemove touchmove', () => {

        let x1 = stage.x1;
        let x2 = stage.x2;
        let y1 = stage.y1;
        let y2 = stage.y2;


        x2 = stage.stage.getPointerPosition().x;
        y2 = stage.stage.getPointerPosition().y;

        if (stage.tmpDropElement) {
            var newWidth = x2 - tmpX
            var newHeight = y2 - tmpY

            if (stage.clickedType === 'arrow') {
                stage.tmpDropElement.points([0, 0, newWidth, newHeight])
            } else {
                stage.tmpDropElement.width(newWidth)
                stage.tmpDropElement.height(newHeight)
            }

            stage.layer.batchDraw();
            return;
        }

        // no nothing if we didn't start selection
        if (!stage.selectionRectangle.visible()) {

            if (stage.isPaint) {
                const pos = stage.stage.getPointerPosition();
                var newPoints = stage.lastLine.points().concat([pos.x, pos.y]);
                stage.lastLine.points(newPoints);
                stage.layer.batchDraw();
            }
            return;
        }

        stage.selectionRectangle.setAttrs({
            x: Math.min(x1, x2),
            y: Math.min(y1, y2),
            width: Math.abs(x2 - x1),
            height: Math.abs(y2 - y1),
        });
        stage.layer.batchDraw();
    });

    stage.stage.on('mouseup touchend', () => {

        if (stage.tmpDropElement) {
            clickOnElement(stage.tmpDropElement)
            stage.tmpDropElement = null
        }

        if (!stage.selectionRectangle.visible()) {
            stage.isPaint = false;
            return;
        }
        setTimeout(() => {
            stage.selectionRectangle.visible(false);
            stage.layer.batchDraw();
        });

        var shapes = stage.stage.find('.rect').toArray();
        var box = stage.selectionRectangle.getClientRect();
        var selected = shapes.filter((shape) =>
            Konva.Util.haveIntersection(box, shape.getClientRect())
        );

        if (stage.transformer
        ) {
            stage.transformer
                .nodes(selected);
        }

        stage.layer.batchDraw();
    });

    stage.stage.on('click tap', function (e) {

        if (stage.selectionRectangle.visible()) {
            return;
        }

        if (e.target === stage.stage && stage.transformer
        ) {
            stage.transformer
                .nodes([]);
            deselectDraggable()
            stage.layer.draw();
            return;
        }

        if (!e.target.hasName('rect')) {
            return;
        }

        const metaPressed = e.evt.shiftKey || e.evt.ctrlKey || e.evt.metaKey;
        const isSelected = stage.transformer
            && stage.transformer
                .nodes() && stage.transformer
                    .nodes().indexOf(e.target) >= 0;

        if (!metaPressed && !isSelected && stage.transformer
        ) {

            clickOnElement(e.target)

        } else if (metaPressed && isSelected) {

            const nodes = stage.transformer
                .nodes().slice();
            nodes.splice(nodes.indexOf(e.target), 1);
            stage.transformer
                .nodes(nodes);
        }

        stage.layer.draw();
    });

}