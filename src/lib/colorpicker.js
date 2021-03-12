
import { globalConfig } from './config';

let picker;

export function initPicker() {
    loadScript(() => {
        picker = AColorPicker.createPicker('.picker')
            .on('change', (picker, color) => {
                if (globalConfig.isStrokeColor) {
                    globalConfig.strokeColor = color
                    document.getElementById('color').style.background = color;
                } else {
                    globalConfig.fillColor = color
                    document.getElementById('outerColor').style.color = color;
                }
            });
        picker.hide()
    })
}


function loadScript(callback) {
    const existingScript = document.getElementById('acolorpickerjs')

    if (!existingScript) {
        const script = document.createElement('script')
        script.src = 'https://nokol.net/cdn/acolorpicker.js'
        script.id = 'acolorpickerjs'
        document.body.appendChild(script)

        script.onload = () => {
            if (callback) callback()
        };
    }

    if (existingScript && callback) callback()
}

export function openPicker(isColor) {
    globalConfig.isStrokeColor = isColor;
    picker.toggle()
    picker.color = isColor ? document.getElementById('color').style.background : document.getElementById('outerColor').style.color
}