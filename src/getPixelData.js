export default function getPixelData(ctx, size) {
  let colors = [];
  const xLen = ctx.canvas.width / size;
  const yLen = ctx.canvas.height / size;

  for (let y = 0; y < yLen; y++) {
    for (let x = 0; x < xLen; x++) {
      let data = ctx.getImageData(x * size, y * size, size, size).data;
      colors.push(getAverageValue(data));
    }
  }
  return colors;
}

function getRgba(data) {
  const length = data.length / 4;
  let rgba = [];
  for (let i = 0; i < length; i++) {
    let q = i * 4;
    rgba.push({
      r: data[q],
      g: data[q + 1],
      b: data[q + 2],
      a: data[q + 3],
    });
  }
  return rgba;
}

function getAverageValue(data) {
  let rgba = getRgba(data);
  let r = 0;
  let g = 0;
  let b = 0;
  let a = 0;
  for (let i = 0; i < rgba.length; i++) {
    r += rgba[i].r;
    g += rgba[i].g;
    b += rgba[i].b;
    a += rgba[i].a;
  }
  return {
    r: r / rgba.length,
    g: g / rgba.length,
    b: b / rgba.length,
    a: a / rgba.length,
  };
}
