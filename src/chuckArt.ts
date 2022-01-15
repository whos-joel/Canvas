import drawPolygon from "./drawPolygon";
import getPixelData from "./getPixelData";
import { RgbToHsl, HslToRgb } from "./colorConverters";

export default class ChuckArt {
  ctxToCopy: CanvasRenderingContext2D;
  ctxToPaint: CanvasRenderingContext2D;

  constructor(ctxToCopy: CanvasRenderingContext2D, ctxToPaint: CanvasRenderingContext2D) {
    this.ctxToCopy = ctxToCopy;
    this.ctxToPaint = ctxToPaint;
  }

  pixelate(size: number, br: number): void {
    const data = getCanvasData({ctxToCopy: this.ctxToCopy, size: size})

    for (let y = 0; y < data.height; y++) {
      for (let x = 0; x < data.width; x++) {
        let i = x + y * data.width;
        //   if (br === 0 || size === 10 || size === 3 || Math.round(Math.random() * size) >= size / 2)
        //     draw(ctx2, x * size * 2, y * size * 2, size, pixels[i], 4, i, br);
        if (
          (size === 3 && y > data.height / 4 && y < data.height - data.height / 4 && x > data.width / 4 && x < data.width - data.width / 4) ||
          br === 0 ||
          //size === 10 ||
          //size === 3 ||
          Math.round(Math.random() * size) >= size / 2
        )
          draw(this.ctxToPaint, x * size * 2, y * size * 2, size, data.pixels[i], 4, i, br);
      }
    }
  }

  pixelate2(size: number, br: number): void {
    const data = getCanvasData({ctxToCopy: this.ctxToCopy, size: size})
    let coords = [];

    for (let y = 0; y < data.height; y++) {
      for (let x = 0; x < data.width; x++) {
        let i = x + y * data.width;
        coords.push({ x: x * size * 2, y: y * size * 2, pixel: data.pixels[i] });
      }
    }

    for (let i = 0; i < data.pixels.length; i++) {
      let r = Math.floor(Math.random() * coords.length);
      let coord = coords.splice(r, 1);
      draw2(this.ctxToPaint, coord[0].x, coord[0].y, size, coord[0].pixel, 4, i, br);
    }
  }
}

type CanvasData = {pixels: Rgb[], width:number, height:number}
type CanvasSetting = {ctxToCopy: CanvasRenderingContext2D, size:number}
function getCanvasData({ctxToCopy, size}:CanvasSetting): CanvasData{
  return{
    pixels : getPixelData(ctxToCopy, size),
    width: Math.ceil(ctxToCopy.canvas.width / size),
    height: Math.ceil(ctxToCopy.canvas.height / size)
  }
}

function draw(ctx: CanvasRenderingContext2D, x: number, y: number, rad: number, pixel: Rgb, n: number, p: number, br: number): void {
  let colors =
    rad <= 3
      ? modifyColor(pixel, Math.random() * 45 - 22, Math.random() * 0.25 - 0.125, Math.random() * 0.25 - 0.125)
      : modifyColor(pixel, Math.random() * 190 - 95, Math.random() * 0.5 - 0.25, Math.random() * 0.5 - 0.25);

  let newRad = br === 0 ? Math.hypot(rad, rad) : rad;

  let s = Math.round(Math.random() * (rad > 10 ? 6 : 2)) + 3;

  drawPolygon(ctx, {
    x: br === 0 ? x + rad : x + rad * (Math.random() * 2),
    y: br === 0 ? y + rad : y + rad * (Math.random() * 2),
    sides: Math.random() * br === 0 ? 8 : s,
    radius: newRad > 3 ? newRad : Math.random() * 10 - 3,
    rotation: br === 0 ? 45 : p,
    borderRadius: 0,
    strokeColor: "rgba(255, 255, 255, .25)",
    strokeWidth: rad > 5 ? 0 : 0,
    fill: colors[0], //newRad === 3 ? colors[0] : colors[Math.floor(Math.random() * 4)],
  });
}

function draw2(ctx: CanvasRenderingContext2D, x: number, y: number, rad: number, pixel: Rgb, n: number, p: number, br: number): void {
  let colors =
    rad <= 3
      ? modifyColor(pixel, Math.random() * 45 - 22, Math.random() * 0.25 - 0.125, Math.random() * 0.25 - 0.125)
      : modifyColor(pixel, Math.random() * 190 - 95, Math.random() * 0.5 - 0.25, Math.random() * 0.5 - 0.25);

  let newRad = Math.hypot(rad, rad) + (Math.ceil(Math.random() * rad));

  let s = Math.round(Math.random() * (rad > 10 ? 6 : 2)) + 4;

  drawPolygon(ctx, {
    x: x + rad,
    y: y + rad,
    sides: s,
    radius: newRad,
    rotation: p,
    borderRadius: newRad / 5,
    strokeColor: "rgba(255, 255, 255, .25)",
    strokeWidth: 0,
    fill: colors[0], //newRad === 3 ? colors[0] : colors[Math.floor(Math.random() * 4)],
  });
}

function getExtractColors(color, n, a) {
  let colors = [`rgba(${color.r}, ${color.g},${color.b}, ${a})`];
  let r = color.r;
  let g = color.g;
  let b = color.b;
  for (let i = 0; i < n; i++) {
    let r1 = Math.random() * r;
    let g1 = Math.random() * g;
    let b1 = Math.random() * b;
    r -= r1;
    g -= g1;
    b -= b1;
    colors.push(`rgba(${r1}, ${g1}, ${b1}, ${color.a})`);
  }
  colors.push(`rgba(${r}, ${g}, ${b}, ${color.a})`);
  return colors;
}

function modifyColor(rgb: Rgb, h: number, s: number, l: number): string[] {
  let hsl = RgbToHsl(rgb.r, rgb.g, rgb.b);
  hsl.h += h;
  //hsl.h = hsl.h > 360 ? 100 : hsl.h < 0 ? 0 : hsl.h;
  hsl.s += hsl.s * s;
  hsl.s = hsl.s > 100 ? 100 : hsl.s < 0 ? 0 : hsl.s;
  hsl.l += hsl.l * l;
  hsl.l = hsl.l > 100 ? 100 : hsl.l < 0 ? 0 : hsl.l;
  let rgb2 = HslToRgb(hsl.h, hsl.s, hsl.l);

  return [formatRgba(rgb2.r, rgb2.g, rgb2.b, 1)];
}

function drawRect(ctx, x, y, w, h, fill) {
  ctx.fillStyle = fill;
  ctx.fillRect(x, y, w, h);
}

function drawCircle(ctx, x, y, r, h, fill) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2, true);
  ctx.fill();
}

function formatRgba(r: number, g: number, b: number, a: number): string {
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}
