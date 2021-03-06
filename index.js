const initCanvas = (id) => {
  return new fabric.Canvas(id, {
    width: 500,
    height: 500,
    selection: false,
  });
};
const setBackground = (url, canvas) => {
  fabric.Image.fromURL(url, (img) => {
    canvas.backgroundImage = img;
    canvas.renderAll();
  });
};
const setBackgroundColor = (color) => {
  canvas.backGroundColor = color;
  canvas.renderAll();
};

const toggleMode = (mode) => {
  if (mode === modes.pan) {
    if (currentMode === modes.pan) {
      currentMode = "";
    } else {
      currentMode = modes.pan;
      canvas.isDrawingMode = false;
      canvas.renderAll();
    }
  } else if (mode == modes.drawing) {
    if (currentMode === modes.drawing) {
      currentMode = "";
      canvas.isDrawingMode = false;
      canvas.renderAll();
    } else {
      currentMode = modes.drawing;
      canvas.isDrawingMode = true;
      canvas.freeDrawingBrush.color = color;
      canvas.renderAll();
    }
  }
};
const setPanEvents = (canvas) => {
  canvas.on("mouse:move", (event) => {
    if (mousePressed && currentMode === modes.pan) {
      canvas.setCursor("grab");
      canvas.renderAll();
      const mEvent = event.e;
      const delta = new fabric.Point(mEvent.movementX, mEvent.movementY);
      canvas.relativePan(delta);
    }
  });
  canvas.on("mouse:down", (event) => {
    mousePressed = true;
    if (currentMode === modes.pan) {
      canvas.setCursor("grab");
      canvas.renderAll();
    }
  });
  canvas.on("mouse:up", (event) => {
    mousePressed = false;
    canvas.setCursor("default");
    canvas.renderAll();
  });
};
const setColorListner = () => {
  const colorPicker = document.getElementById("colorPicker");
  colorPicker.addEventListener("change", (event) => {
    color = event.target.value;
    canvas.freeDrawingBrush.color = color;
    canvas.renderAll();
  });
};
const clearCanvas = (canvas, state) => {
  if (canvas) {
    state.val = canvas.toSVG();
    canvas.getObjects().forEach((o) => {
      if (o !== canvas.backgroundImage) {
        canvas.remove(o);
      }
    });
  }
};
const restoreCanvas = (canvas, state) => {
  if (state.val) {
    fabric.loadSVGFromString(state.val, (objects) => {
      console.log("objects", objects);
      objects = objects.filter(
        (o) => o["xlink:href"] !== "http://localhost:3000/assets/skyimage.jpg"
      );
      console.log("objects", objects);
      canvas.add(...objects);
      canvas.requestRenderAll();
    });
  }
};
const createRect = (canvas) => {
  const canvCenter = canvas.getCenter();
  const rect = new fabric.Rect({
    width: 100,
    height: 100,
    fill: "green",
    left: canvCenter.left,
    top: 0, //canvCenter.top,
    originX: "center",
    originY: "center",
    cornerColor: "white",
    // objectCaching: false
  });
  canvas.add(rect);
  canvas.renderAll();
  rect.animate("top", canvCenter.top, {
    onChange: canvas.renderAll.bind(canvas),
  });
  rect.on("selected", () => {
    rect.set("fill", "white");
    canvas.renderAll();
  });
  rect.on("deselected", () => {
    rect.set("fill", "green");
    canvas.renderAll();
  });
};
const createCircle = (canvas) => {
  const canvCenter = canvas.getCenter();
  const circle = new fabric.Circle({
    radius: 50,
    fill: "orange",
    left: canvCenter.left,
    top: -50, //canvCenter.top,
    originX: "center",
    originY: "center",
    cornerColor: "white",
    objectCaching: false,
  });
  canvas.add(circle);
  canvas.requestRenderAll();

  circle.animate("top", canvas.height - 50, {
    onChange: canvas.renderAll.bind(canvas),
    onComplete: () => {
      circle.animate("top", canvCenter.top, {
        onChange: canvas.renderAll.bind(canvas),
        easing: fabric.util.ease.easeOutBounse,
        duration: 200,
      });
    },
  });
  circle.on("selected", () => {
    circle.set("fill", "white");
    canvas.requestRenderAll();
  });
  circle.on("deselected", () => {
    circle.set("fill", "orange");

    canvas.requestRenderAll();
  });
};

const groupObjects = (canvas, group, shouldGroup) => {
  if (shouldGroup) {
    const objects = canvas.getObjects();
    group.val = new fabric.Group(objects, { cornerColor: "white" });
    clearCanvas(canvas, svgState);
    canvas.add(group.val);
    canvas.requestRenderAll();
  } else {
    group.val.destroy();
    const oldGroup = group.val.getObjects();
    canvas.remove(group.val);
    canvas.add(...oldGroup);
    group.val = null;
    canvas.requestRenderAll();
  }
};
const reader = new FileReader();
reader.addEventListener("load", () => {
  console.log("result", reader.result);
  fabric.Image.fromURL(reader.result, (img) => {
    canvas.add(img);
    canvas.requestRenderAll();
  });
});
const imgAdded = (e) => {
  console.log(e);
  const inputElem = document.getElementById("myImg");
  const file = inputElem.files[0];
  reader.readAsDataURL(file);
};
let svgState = {};
let group = {};
let mousePressed = false;
let color = "#000000";
let currentMode;
const modes = {
  pan: "pan",
  drawing: "drawing",
};
const bgUrl = "./assets/skyimage.jpg";
const canvas = initCanvas("canvas");
setBackground(bgUrl, canvas);
setPanEvents(canvas);
setColorListner();
const inputFile = document.getElementById("myImg");
inputFile.addEventListener("change", imgAdded);
