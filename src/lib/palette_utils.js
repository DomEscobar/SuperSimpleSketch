import { globalConfig } from './config'

export function clearSelectedPalette() {
    document.getElementsByClassName('susi-pallette-item-selected')[0].classList.remove('susi-pallette-item-selected')
}

export function drawSelectedPalette(element) {
    clearSelectedPalette()

    if (element.classList.contains('susi-pallette-item-selected'))
        return

    element.classList.add('susi-pallette-item-selected')
}

export function addPaletteItem(imgsrc, clickcallback, styleName) {
    var imgElement = document.createElement('img')
    imgElement.src = imgsrc

    var paletteItem = document.createElement('div')
    paletteItem.classList.add('susi-palette-item')

    if (styleName) {
        paletteItem.classList.add(styleName)
    }

    paletteItem.appendChild(imgElement)

    document.getElementById('palette').appendChild(paletteItem)
    paletteItem.addEventListener('click', clickcallback)
    paletteItem.addEventListener('touchstart', clickcallback)

    return paletteItem
}

export function setStrokeSize(value) {
    brushSize = value
    document.getElementById('brushSize').firstElementChild.innerText = value
}

export function toggleStrokePicker() {
    globalConfig.isStrokePickerVisible = !globalConfig.isStrokePickerVisible;
    document.getElementById('strokeSize').style.display = isStrokePickerVisible ? 'block' : 'none'
}

