import { build } from './builder'
import { initPicker } from './colorpicker'
import { stage, initStage } from './stage';
import { selectTmpElement } from './actions';

export class SuSiSketch {

    constructor(images) {

        initStage()
        initPicker()
        build()

        if (images) {
            this.setImageIcons(images)
        }
    }

    export() {
        var dataURL = stage.stage.toDataURL({ pixelRatio: 3 });
        return dataURL;
    }

    clear() {
        stage.layer.clear()
        stage.layer.destroyChildren()
    }

    setImageIcons(images) {
        var i;
        for (i = 0; i < images.length; i++) {
            var imgElement = document.createElement('img')
            imgElement.src = images[i]
            imgElement.style.width = '32px'
            imgElement.addEventListener('click', function (e) {
                selectTmpElement('image')
                stage.selectedimg = e.target.src

                this.currentSelectedImage = this
                this.classList.add('susi_selected_imge')
            })

            document.getElementById('images-container').appendChild(imgElement)
        }
    }
}