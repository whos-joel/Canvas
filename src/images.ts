import createCanvas from "./createCanvas";
import chuckArt from "./chuckArt";
import "./../styles/site.less";
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
    height: height
  });

  let ctx = canvas.getContext("2d");
  ctx.drawImage(image, 0, 0, image.width, image.height, 0, 0, width, height);

  const canvasToPaint = createCanvas({
    width: ctx.canvas.width * 2,
    height: ctx.canvas.height * 2,
    appendToElement: "#image-container"
  });

  const ctx2 = canvasToPaint.getContext("2d");
  ctx2.fillStyle = "#000";
  ctx2.fillRect(0, 0, ctx.canvas.width * 2,  ctx.canvas.height * 2);

  var chuck = new chuckArt(ctx, ctx2);

  //chuck.pixelate(ctx, ctx2, pixelSize, 0);
  //chuck.pixelate2(40, 0);
  //chuck.pixelate(ctx, ctx2, 30, 10);
  //chuck.pixelate(ctx, ctx2, 10, 5);
  //chuck.pixelate(6, 4);
  //chuck.pixelate(5, 3);
  //chuck.pixelate(4, 2);
  //chuck.pixelate(3, 1);
  let size = 3;
  // chuck.pixelateRandom(size,{
  //   position: {
  //     range: {min: 0, max: size}
  //   },
  //   sides:{
  //     props: 4,
  //     range: {min: 0, max: 4}
  //   },
  //   radius:{
  //     props: size,
  //     range: {min: 0, max: size}
  //   },
  //   rotation:{
  //     props: 0,
  //     range: {min: 0, max: 360}
  //   },
  //   borderRadius:{
  //     props: 3,
  //     range: {min: 0, max: size / 4}
  //   }
  // });

  chuck.pixelateRandom(size,{
    position: {
      range: {min: 0, max: 0}
    },
    sides:{
      props: 4,
      range: {min: 0, max: 0}
    },
    radius:{
      range: {min: 0, max: 0}
    },
    rotation:{
      props: 0,
      range: {min: 0, max: 0}
    },
    borderRadius:{
      props: 0,
      range: {min: 0, max: 0}
    }
  });
  chuck.pixelateRandom(size,{
    position: {
      range: {min: size, max: size}
    },
    sides:{
      props: 4,
      range: {min: 0, max: 8}
    },
    radius:{
      range: {min: 0, max: 0}
    },
    rotation:{
      props: 0,
      range: {min: 0, max: 0}
    },
    borderRadius:{
      props: 0,
      range: {min: 0, max: 0}
    }
  });
};

image.src = "/images/jimi.png";