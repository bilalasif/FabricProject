const initCanvas = (id) => {
    return new fabric.Canvas(id, {
        width: 500,
        height: 500,
        selection: false
    })
}
const setBackground = (url, canvas) => {
    fabric.Image.fromURL(url, (img) => {
        canvas.backgroundImage = img;
        canvas.renderAll()
    })
}
const setBackgroundColor = (color) => {
    canvas.backGroundColor = color
    canvas.renderAll()
}

const toggleMode = (mode) => {
    if (mode === modes.pan) {
        if (currentMode === modes.pan) {
            currentMode = ''
        } else {
            currentMode = modes.pan
            canvas.isDrawingMode = false
            canvas.renderAll()
        }
    } else if (mode == modes.drawing) {
        if (currentMode === modes.drawing) {
            currentMode = ''
            canvas.isDrawingMode = false
            canvas.renderAll()
        } else {
            currentMode = modes.drawing
            canvas.isDrawingMode = true
            canvas.renderAll()
        }
    }
    console.log(mode)

}
const setPanEvents = (canvas) => {
    canvas.on('mouse:move', (event) => {
        if (mousePressed && currentMode === modes.pan) {
            canvas.setCursor('grab')
            canvas.renderAll()
            const mEvent = event.e;
            const delta = new fabric.Point(mEvent.movementX, mEvent.movementY)
            canvas.relativePan(delta)
        }
    })
    canvas.on('mouse:down', (event) => {
        mousePressed = true
        if (currentMode === modes.pan) {
            canvas.setCursor('grab')
            canvas.renderAll()
        }
    })
    canvas.on('mouse:up', (event) => {
        mousePressed = false
        canvas.setCursor('default')
        canvas.renderAll()
    })
}
let mousePressed = false;
let currentMode;
const modes = {
    pan: 'pan',
    drawing: 'drawing'
}
const canvas = initCanvas('canvas')
setBackground("./assets/skyimage.jpg", canvas)
    // setBackgroundColor('white')
setPanEvents(canvas)