import createCanvas from "./createCanvas.js";
import chuckArt from "./chuckArt.js";
// import drawPolygon from "./drawPolygon.js";
// import getPixelData from "./getPixelData.js";
// import { RgbToHsl, HslToRgb } from "./colorConverters.js";

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
  ctx2.fillRect(0, 0, ctx.canvas.width * 2,  ctx.canvas.height * 2);

  var chuck = new chuckArt(ctx, ctx2);

  //chuck.pixelate(ctx, ctx2, pixelSize, 0);
  chuck.pixelate2(40, 0);
  //chuck.pixelate(ctx, ctx2, 30, 10);
  //chuck.pixelate(ctx, ctx2, 10, 5);
  //chuck.pixelate(6, 4);
  //chuck.pixelate(5, 3);
  chuck.pixelate(4, 2);
  chuck.pixelate(3, 1);
};

image.src = "/images/jimi.png";