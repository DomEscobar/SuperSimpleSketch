import { stage } from './stage'
import { setMode } from './actions';
import { globalConfig } from './config';

export function drawArrow() {
    var arrow = new Konva.Arrow({
        x: stage.stage.getPointerPosition().x,
        y: stage.stage.getPointerPosition().y,
        points: [0, 0, 1, 1],
        pointerLength: 10,
        pointerWidth: 10,
        fill: globalConfig.strokeColor,
        stroke: globalConfig.strokeColor,
        strokeWidth: globalConfig.brushSize,
        name: 'rect',
        draggable: false,
    });

    stage.tmpDropElement = arrow;
    stage.layer.add(arrow);
    stage.layer.draw();
}

export function addImage(src) {
    var imageObj = new Image();
    imageObj.crossOrigin = 'Anonymous';

    imageObj.onload = function () {
        drawImage(this);
    };
    imageObj.src = src;
}

export function drawPointerSelection() {
    x1 = stage.stage.getPointerPosition().x;
    y1 = stage.stage.getPointerPosition().y;
    x2 = stage.stage.getPointerPosition().x;
    y2 = stage.stage.getPointerPosition().y;

    stage.selectionRectangle.visible(true);
    stage.selectionRectangle.width(0);
    stage.selectionRectangle.height(0);
    stage.layer.draw();
}

export function drawLine() {
    stage.isPaint = true;
    var pos = stage.stage.getPointerPosition();
    stage.lastLine = new Konva.Line({
        stroke: globalConfig.strokeColor,
        strokeWidth: globalConfig.brushSize,
        name: 'rect',
        globalCompositeOperation: 'source-over',
        points: [pos.x, pos.y],
    });
    stage.layer.add(stage.lastLine);
}

export function drawImage(imageObj) {
    var darthVaderImg = new Konva.Image({
        image: imageObj,
        x: stage.stage.getPointerPosition().x,
        y: stage.stage.getPointerPosition().y,
        width: 10,
        height: 10,
        name: 'rect',
        draggable: false,
    });

    stage.tmpDropElement = darthVaderImg;
    stage.layer.add(darthVaderImg);
    stage.layer.draw();
}

export function drawtext() {
    var textNode = new Konva.Text({
        text: 't',
        x: stage.stage.getPointerPosition().x,
        y: stage.stage.getPointerPosition().y,
        fontSize: 20,
        fill: globalConfig.strokeColor,
        draggable: false,
        width: 100,
        name: 'rect',
    });

    textNode.on('transform', function () {
        // reset scale, so only with is changing by transformer
        textNode.setAttrs({
            width: textNode.width() * textNode.scaleX(),
            height: textNode.height() * textNode.scaleY(),
            scaleX: 1,
            scaleY: 1,
        });
    });

    setMode('pointer')
    addHandler(textNode)
    stage.layer.add(textNode);
    stage.layer.draw();
    setTimeout(function () {
        setTextWriteable(textNode)
    }, 200)
}

export function drawRect() {
    var rect2 = new Konva.Rect({
        x: stage.stage.getPointerPosition().x,
        y: stage.stage.getPointerPosition().y,
        width: 10,
        height: 10,
        fill: globalConfig.strokeColor,
        stroke: globalConfig.fillColor,
        name: 'rect',
        draggable: false,
    });

    stage.tmpDropElement = rect2;
    stage.layer.add(rect2);
    stage.layer.draw();
}


//----- TEXT ---------
function addHandler(textNode) {
    textNode.on('dblclick tap', () => {
        setTextWriteable(textNode)
    });
}

// ---- Text writeable
function setTextWriteable(textNode) {
    textNode.hide();
    stage.layer.draw();

    // create textarea over canvas with absolute position
    var textPosition = textNode.absolutePosition();
    var stageBox = stage.stage.container().getBoundingClientRect();
    var areaPosition = {
        x: stageBox.left + textPosition.x,
        y: stageBox.top + textPosition.y,
    };

    var textarea = document.createElement('textarea');
    document.body.appendChild(textarea);

    textarea.value = textNode.text();
    textarea.style.position = 'absolute';
    textarea.style.top = areaPosition.y + 'px';
    textarea.style.left = areaPosition.x + 'px';
    textarea.style.width = textNode.width() - textNode.padding() * 2 + 'px';
    textarea.style.height =
        textNode.height() - textNode.padding() * 2 + 5 + 'px';
    textarea.style.fontSize = textNode.fontSize() + 'px';
    textarea.style.border = 'none';
    textarea.style.padding = '0px';
    textarea.style.margin = '0px';
    textarea.style.overflow = 'hidden';
    textarea.style.background = 'none';
    textarea.style.zIndex = 2;
    textarea.style.outline = 'none';
    textarea.style.color = globalConfig.fillColor;
    textarea.style.resize = 'none';
    textarea.style.lineHeight = textNode.lineHeight();
    textarea.style.fontFamily = textNode.fontFamily();
    textarea.style.transformOrigin = 'left top';
    textarea.style.textAlign = textNode.align();
    textarea.style.color = textNode.fill();
    var rotation = textNode.rotation();
    var transform = '';
    if (rotation) {
        transform += 'rotateZ(' + rotation + 'deg)';
    }

    var px = 0;
    var isFirefox =
        navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
    if (isFirefox) {
        px += 2 + Math.round(textNode.fontSize() / 20);
    }
    transform += 'translateY(-' + px + 'px)';

    textarea.style.transform = transform;
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 3 + 'px';

    textarea.focus();

    function removeTextarea() {
        textarea.parentNode.removeChild(textarea);
        window.removeEventListener('click', handleOutsideClick);
        textNode.show();
        stage.transformer.forceUpdate();
        stage.layer.draw();
    }

    function setTextareaWidth(newWidth) {
        if (!newWidth) {
            // set width for placeholder
            newWidth = textNode.placeholder.length * textNode.fontSize();
        }
        // some extra fixes on different browsers
        var isSafari = /^((?!chrome|android).)*safari/i.test(
            navigator.userAgent
        );
        var isFirefox =
            navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
        if (isSafari || isFirefox) {
            newWidth = Math.ceil(newWidth);
        }

        var isEdge =
            document.documentMode || /Edge/.test(navigator.userAgent);
        if (isEdge) {
            newWidth += 1;
        }
        textarea.style.width = newWidth + 'px';
    }

    textarea.addEventListener('keydown', function (e) {
        // hide on enter
        // but don't hide on shift + enter
        if (e.keyCode === 13 && !e.shiftKey) {
            textNode.text(textarea.value);
            removeTextarea();
        }
        // on esc do not set value back to node
        if (e.keyCode === 27) {
            removeTextarea();
        }
    });

    textarea.addEventListener('keydown', function (e) {
        var scale = textNode.getAbsoluteScale().x;
        setTextareaWidth(textNode.width() * scale);
        textarea.style.height = 'auto';
        textarea.style.height =
            textarea.scrollHeight + textNode.fontSize() + 'px';
    });

    function handleOutsideClick(e) {
        if (e.target !== textarea) {
            textNode.text(textarea.value);
            removeTextarea();
        }
    }
    setTimeout(() => {
        window.addEventListener('click', handleOutsideClick);
    });

}


