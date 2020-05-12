import drawPolygon from "./drawPolygon.js";
import { setTweenerData, sinCurve, cosCurve } from "./animateSine.js";
import createCanvas from "./createCanvas.js";
///import setTweenerData from "./animate.js";

let polygons = [];
let polygonCount = 8;
let polygonSides = 5;
let running = false;
let tweeners = [];
let out = false;
let start = -1;
let progress = 0;

const width = 800;
const height = 800;

function draw(canvas, tweeners) {
  const ctx = canvas.getContext("2d");
  ctx.save();
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.translate(0, 0);

  for (let i = 0; i < tweeners.length; i++) {
    drawPolygon(ctx, tweeners[i].polygon);
  }

  ctx.restore();
}

const canvas = createCanvas({
  width: width,
  height: height,
  position: "absolute",
});

function step(timestamp) {
  //if(start === -1) start = timestamp;

  //let progress = timestamp - start;

  progress++;

  setTweenerData(tweeners, out, width, progress);

  draw(canvas, tweeners);

  if (
    !out &&
    tweeners.filter((t) => t.polygon.rotation >= 360).length === tweeners.length
  ) {
    reset();
    progress = 0;
    out = true;
  } else if (
    out &&
    tweeners.filter((t) => t.polygon.rotation === 0).length === tweeners.length
  ) {
    reset();
    progress = 0;
    out = false;
  }

  if (running) window.requestAnimationFrame(step);
}

window.addEventListener("click", listener);

function listener() {
  running = !running;
  if (running) {
    window.requestAnimationFrame(step);
  }
}

function init() {
  tweeners = [];
  for (let i = 0; i < polygonCount; i++) {
    polygons.push({
        x: width / 2,
        y: height / 2,
        radius: 0,
        sides: polygonSides,
        rotation: 0,
        borderRadius: 20,
        strokeWidth: 0,
        strokeColor: "rgba(255, 255, 255, .15)",
        fill: "rgba(205, 100, 100, .15)",
    });
    tweeners.push({
      friction: 1,
      progress: 0,
      polygon: polygons[i]
    });
  }
}

function reset() {
  for (let i = 0; i < polygonCount; i++) {
    tweeners[i].friction = 1;
    tweeners[i].progress = 0;
  }
}

init();

drawCurves(cosCurve, 700);
drawCurves(sinCurve, 550);

function drawCurves(func, x) {
  const ctx = canvas.getContext("2d");
  let arr = [];
  for (let i = 0; i <= 10; i++) {
    arr.push(func(0, 100, i, 10));

    let y = i === 0 ? 0 : arr.reduce((a, b) => a + b + 5, 0) - arr[i] - 5;
    ctx.fillStyle = 'green';
    ctx.fillRect(x, y, 100, arr[i])
  }
}
