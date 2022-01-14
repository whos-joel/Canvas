export default function createCanvas({ width, height, position = "inherit" }):HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.setAttribute("width", width);
  canvas.setAttribute("height", height);
  canvas.style.position = position;
  document.getElementsByTagName("body")[0].append(canvas);
  return canvas;
}
