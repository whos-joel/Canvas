import drawPolygon from "./drawPolygon";
import getPixelData from "./getPixelData";
import { RgbToHsl, HslToRgb } from "./colorConverters";

export default class ChuckArt {
  ctx;
  ctx2;

  constructor(ctx, ctx2) {
    this.ctx = ctx;
    this.ctx2 = ctx2;
  }

  pixelate(size, br) {
    pixelate(this.ctx, this.ctx2, size, br);
  }

  pixelate2(size, br) {
    pixelate2(this.ctx, this.ctx2, size, br);
  }
}

function pixelate(ctx, ctx2, size, br) {
  let pixels = getPixelData(ctx, size);

  const xLen = Math.ceil(ctx.canvas.width / size);
  const yLen = Math.ceil(ctx.canvas.height / size);

  for (let y = 0; y < yLen; y++) {
    for (let x = 0; x < xLen; x++) {
      let i = x + y * xLen;
      //   if (br === 0 || size === 10 || size === 3 || Math.round(Math.random() * size) >= size / 2)
      //     draw(ctx2, x * size * 2, y * size * 2, size, pixels[i], 4, i, br);
      if (
        (size === 3 && y > yLen / 4 && y < yLen - yLen / 4 && x > xLen / 4 && x < xLen - xLen / 4) ||
        br === 0 ||
        //size === 10 ||
        //size === 3 ||
        Math.round(Math.random() * size) >= size / 2
      )
        draw(ctx2, x * size * 2, y * size * 2, size, pixels[i], 4, i, br);
    }
  }
}

function pixelate2(ctx, ctx2, size, br) {
  let pixels = getPixelData(ctx, size);

  const xLen = Math.ceil(ctx.canvas.width / size);
  const yLen = Math.ceil(ctx.canvas.height / size);

  let coords = [];

  for (let y = 0; y < yLen; y++) {
    for (let x = 0; x < xLen; x++) {
      let i = x + y * xLen;
      coords.push({ x: x * size * 2, y: y * size * 2, pixel: pixels[i] });
    }
  }

  for (let i = 0; i < pixels.length; i++) {
    let r = Math.floor(Math.random() * coords.length);
    let coord = coords.splice(r, 1);
    draw2(ctx2, coord[0].x, coord[0].y, size, coord[0].pixel, 4, i, br);
  }
}

function draw(ctx, x, y, rad, pixel, n, p, br) {
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

function draw2(ctx, x, y, rad, pixel, n, p, br) {
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

function modifyColor({ r, g, b }, h, s, l) {
  let hsl = RgbToHsl(r, g, b);
  hsl.h += h;
  //hsl.h = hsl.h > 360 ? 100 : hsl.h < 0 ? 0 : hsl.h;
  hsl.s += hsl.s * s;
  hsl.s = hsl.s > 100 ? 100 : hsl.s < 0 ? 0 : hsl.s;
  hsl.l += hsl.l * l;
  hsl.l = hsl.l > 100 ? 100 : hsl.l < 0 ? 0 : hsl.l;
  let rgb = HslToRgb(hsl.h, hsl.s, hsl.l);

  return [formatRgba(rgb.r, rgb.g, rgb.b, 1)];
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

function formatRgba(r, g, b, a) {
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}
