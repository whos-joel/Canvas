import createCanvas from "./createCanvas.js";
import drawPolygon from "./drawPolygon.js";
import getPixelData from "./getPixelData.js";
import { RgbToHsl, HslToRgb } from "./colorConverters.js";

let image = new Image();

image.onload = function () {
  let pixelSize = 60;
  let width = image.width + (image.width % pixelSize);
  let height = image.height + (image.height % pixelSize);

  const canvas = createCanvas({
    width: width,
    height: height,
  });

  let ctx = canvas.getContext("2d");
  ctx.drawImage(image, 0, 0, image.width, image.height, 0, 0, width, height);

  const canvas2 = createCanvas({
    width: ctx.canvas.width * 2,
    height: ctx.canvas.height * 2,
  });

  const ctx2 = canvas2.getContext("2d");
  ctx2.fillStyle = "#000";
  ctx2.fillRect(0, 0, 750 * 2, 440 * 2);

  pixelate(ctx, ctx2, pixelSize, 0);
  //pixelate(ctx, ctx2, 50, 10);
  pixelate(ctx, ctx2, 30, 10);
  pixelate(ctx, ctx2, 10, 5);
  pixelate(ctx, ctx2, 6, 4);
  //pixelate(ctx, ctx2, 5, 3);
  //pixelate(ctx, ctx2, 4, 2);
  pixelate(ctx, ctx2, 3, 1);
};

image.src = "/images/jimi.png";

function pixelate(ctx, ctx2, size, br) {
  let pixels = getPixelData(ctx, size);

  const xLen = ctx.canvas.width / size;
  const yLen = ctx.canvas.height / size;

  for (let y = 0; y < yLen; y++) {
    for (let x = 0; x < xLen; x++) {
      let i = x + y * xLen;
      //   if (br === 0 || size === 10 || size === 3 || Math.round(Math.random() * size) >= size / 2)
      //     drawChuck(ctx2, x * size * 2, y * size * 2, size, pixels[i], 4, i, br);
      if (
        (size === 3 && y > yLen / 4 &&
          y < yLen - yLen / 4 &&
          x > xLen / 4 &&
          x < xLen - xLen / 4) ||
        br === 0 ||
        //size === 10 ||
        //size === 3 ||
        Math.round(Math.random() * size) >= size / 2
      )
        drawChuck(ctx2, x * size * 2, y * size * 2, size, pixels[i], 4, i, br);
    }
  }
}

function drawChuck(ctx, x, y, rad, pixel, n, p, br) {
  let colors = rad <= 3 ? modifyColor(pixel, Math.random() * 45 - 22, Math.random() * .25 -.125, Math.random() * .25 -.125) : modifyColor(pixel, Math.random() * 190 - 95, Math.random() * .5 -.25, Math.random() * .5 -.25);

  let newRad = br === 0 ? Math.hypot(rad, rad) : rad;

  let s = Math.round(Math.random() * (rad > 10 ? 6 : 2)) + 3;

  drawPolygon(ctx, {
    x: br === 0 ? x + rad : x + rad * (Math.random() * 2),
    y: br === 0 ? y + rad : y + rad * (Math.random() * 2),
    sides: br === 0 ? 8 : s,
    radius: newRad > 3 ? newRad : Math.random() * 10 - 3,
    rotation: br === 0 ? 45 : p,
    borderRadius: 2,
    strokeColor: "rgba(255, 255, 255, .25)",
    strokeWidth: rad > 5 ? 0 : 0,
    fill: colors[0]//newRad === 3 ? colors[0] : colors[Math.floor(Math.random() * 4)],
  });

  //   if(br === 0)
  //     for (let i = 0; i < n; i++) {
  //       drawPolygon(ctx, {
  //         x: x + rad,
  //         y: y + rad,
  //         sides: 6 - i,//Math.round((Math.random() * (p % 5)) + 3),
  //         radius: rad + 3 - i * 2,
  //         rotation: p * 7,
  //         borderRadius: Math.ceil(3 - i / 2),
  //         strokeColor: "#000",
  //         strokeWidth: 0,
  //         fill: i === n - 1 ? colors[0] : colors[i + 2],
  //       });
  //     }
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

function modifyColor({r, g, b}, h, s, l){
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

function formatRgba(r, g, b, a){
    return `rgba(${r}, ${g}, ${b}, ${a})`
}


