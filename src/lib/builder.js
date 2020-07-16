import { setMode, selectTmpElement, toggleStrokePicker, setStrokeSize } from './actions'
import { drawSelectedPalette, addPaletteItem } from './palette_utils'
import { stage } from './stage'
import { openPicker } from './colorpicker'
import { POINTER_IMG, ARROW_IMG, TEXT_IMG, RECT_IMG, PENCIL_IMG, globalConfig } from './config'

export function build() {
    initPalette()
    initStrokePalette()
    setMode('pointer')
}

function initPalette() {
    stage.pointerPaletteElement = addPaletteItem(POINTER_IMG, function (e) {
        drawSelectedPalette(e.target)
        setMode('pointer')
    }, 'susi-pallette-item-selected')

    addPaletteItem(PENCIL_IMG, function (e) {
        drawSelectedPalette(e.target)
        setMode('brush')
    })

    addPaletteItem(TEXT_IMG, function (e) {
        drawSelectedPalette(e.target)
        selectTmpElement('text')
    })

    addPaletteItem(RECT_IMG, function (e) {
        drawSelectedPalette(e.target)
        selectTmpElement('rect')
    })

    addPaletteItem(ARROW_IMG, function (e) {
        drawSelectedPalette(e.target)
        selectTmpElement('arrow')
    })
}

function initStrokePalette() {
    var brushSize = document.createElement('div')
    brushSize.id = 'brushSize'
    brushSize.classList.add('susi-palette-color')
    brushSize.style.borderRadius = '50%'
    brushSize.style.backgroundColor = globalConfig.strokeColor

    var paletteItem = document.createElement('div')
    paletteItem.classList.add('susi-palette-item')

    var clickcallback = function () {
        toggleStrokePicker()
    }

    var strokeCHanger = document.createElement('input')
    strokeCHanger.type = 'range'
    strokeCHanger.style.position = 'absolute'
    strokeCHanger.style.right = '5px'

    strokeCHanger.id = 'strokeSize'
    strokeCHanger.style.display = 'none'
    strokeCHanger.addEventListener('change', function (e) {
        setStrokeSize(strokeCHanger.value)
    })

    paletteItem.appendChild(brushSize)
    paletteItem.appendChild(strokeCHanger)

    brushSize.addEventListener('click', clickcallback)
    brushSize.addEventListener('touchstart', clickcallback)

    document.getElementById('susi-general').appendChild(paletteItem)

    //---Stroke color -----
    var strokeColorItem = document.createElement('div')
    strokeColorItem.classList.add('susi-palette-item')
    strokeColorItem.classList.add('susi-palette-color')
    strokeColorItem.id = 'color'

    var clickcallbackItem = function () {
        openPicker(true)
    }
    strokeColorItem.addEventListener('click', clickcallbackItem)
    strokeColorItem.addEventListener('touchstart', clickcallbackItem)
    strokeColorItem.style.backgroundColor = globalConfig.strokeColor
    document.getElementById('susi-general').appendChild(strokeColorItem)

    //---outline color -----
    var outlineColorItem = document.createElement('div')
    outlineColorItem.classList.add('susi-palette-item')
    outlineColorItem.classList.add('susi-palette-color')
    outlineColorItem.classList.add('susi-palette-colorOuter')
    outlineColorItem.id = 'outerColor'

    var clickcallbackOutline = function () {
        openPicker(false)
    }
    outlineColorItem.addEventListener('click', clickcallbackOutline)
    outlineColorItem.addEventListener('touchstart', clickcallbackOutline)
    document.getElementById('susi-general').appendChild(outlineColorItem)

}