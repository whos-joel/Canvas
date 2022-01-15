type CanvasSettings = {width:number, height:number, position?:string, appendToElement?:string}

export default function createCanvas({ width, height, position = "inherit", appendToElement}:CanvasSettings):HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.setAttribute("width", width.toString());
  canvas.setAttribute("height", height.toString());
  canvas.style.position = position;
  if(appendToElement)
    document.querySelector(appendToElement).append(canvas);
  return canvas;
}
