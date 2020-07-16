import { stage} from './stage'
import { globalConfig} from './config'
import { addImage, drawRect, drawArrow, drawtext, drawLine} from './draw_utils'
import { drawSelectedPalette} from './palette_utils'

export function setMode(_mode) {
    stage.mode = _mode
    deselectElement()

    if (stage.transformer) {
        stage.transformer.remove();
    }

    if (stage.mode == 'pointer') {
        drawSelectedPalette(stage.pointerPaletteElement)
        stage.transformer = new Konva.Transformer();
        stage.layer.add(stage.transformer);
        stage.layer.batchDraw();
    }
}

export function deselectDraggable() {
    if (!stage.draggable) {
        return;
    }

    stage.stage.draggable(false)
    stage.draggable = null;
}

export function deselectElement() {
    stage.clickedTmpDropElement = null
    stage.clickedElement = null
}

export function selectTmpElement(element) {
    stage.clickedTmpDropElement = element
    stage.clickedElement = element
}

export function dropTmpElement(type) {
    stage.clickedType = type

    if (type === 'image') {
        addImage(stage.selectedimg);
    }

    if (type === 'rect') {
        drawRect();
    }

    if (type === 'arrow') {
        drawArrow();
    }

    if (type === 'text') {
        drawtext();
    }

    stage.clickedTmpDropElement = null;
    stage.layer.draw();
}

export function clickOnElement(element) {
    setMode('pointer')
    stage.transformer.nodes([element]);
    deselectDraggable();
    element.draggable(true);
    stage.draggable = element;
}

export function toggleStrokePicker() {
    globalConfig.isStrokePickerVisible = !globalConfig.isStrokePickerVisible;
    document.getElementById('strokeSize').style.display = globalConfig.isStrokePickerVisible ? 'block' : 'none'
}

export function setStrokeSize(value) {
    globalConfig.brushSize = value
    document.getElementById('brushSize').firstElementChild.innerText = value
}