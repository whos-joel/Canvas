function drawPolygon({sides, radius, borderRadius, strokeColor, strokeWidth, fill}) {
  const canvas = createCanvas(radius);

  const ctx = canvas.getContext("2d");
  ctx.translate(radius * 2, radius * 2);
  ctx.strokeStyle = strokeColor ?? "#aaa";
  ctx.lineWidth = strokeWidth ?? 1;
  ctx.fillStyle = fill;

  let controlPoints = getControlPoints(sides, radius);
  let points = getPoints2(borderRadius, controlPoints);
  //let points = getPoints(borderRadius, controlPoints);

  // for (let i = 0; i < sides; i++) {
  //   if (i === 0) {
  //     ctx.moveTo(controlPoints[0].x, controlPoints[0].y);
  //   } else {
  //     ctx.lineTo(controlPoints[i].x, controlPoints[i].y);
  //   }
  // }

  //ctx.closePath();
  //ctx.stroke();

  //   ctx.fillStyle = "#ccaa00";
  //   ctx.fillRect(-2.5, -2.5, 5, 5);
  //   ctx.fillStyle = "#aa00aa";
  //   ctx.fillRect(controlPoints[0].x - 2.5, controlPoints[0].y - 2.5, 5, 5);
  //   ctx.fillStyle = "#00aaaa";
  //   ctx.fillRect(controlPoints[1].x - 2.5, controlPoints[1].y - 2.5, 5, 5);

  //   for (let i = 0; i < sides; i++) {
  //     ctx.fillStyle = "#00aa00";
  //     ctx.fillRect(points[i][0].x - 2.5, points[i][0].y - 2.5, 5, 5);
  //     ctx.fillStyle = "#0000aa";
  //     ctx.fillRect(points[i][1].x - 2.5, points[i][1].y - 2.5, 5, 5);
  //   }

  //ctx.strokeStyle = "#cc0000";

  for (let i = 0; i < sides; i++) {
    if (i === 0) {
      ctx.moveTo(points[i][0].x, points[i][0].y);
      ctx.lineTo(points[i][1].x, points[i][1].y);
    } else {
      ctx.quadraticCurveTo(
        controlPoints[i].x,
        controlPoints[i].y,
        points[i][0].x,
        points[i][0].y
      );
      ctx.lineTo(points[i][1].x, points[i][1].y);
    }
  }

  ctx.quadraticCurveTo(
    controlPoints[0].x,
    controlPoints[0].y,
    points[0][0].x,
    points[0][0].y
  );

  ctx.closePath();
  ctx.stroke();
  ctx.fill();
  return canvas;
}

function createCanvas(radius) {
  const canvas = document.createElement("canvas");
  canvas.setAttribute("width", radius * 4);
  canvas.setAttribute("height", radius * 4);
  canvas.style.position = "absolute";
  document.getElementsByTagName("body")[0].append(canvas);
  return canvas;
}

function getControlPoints(sides, radius) {
  const radian = (2 * Math.PI) / sides;
  let cp = [];
  for (let i = 0; i < sides; i++) {
    const x = Math.sin(radian * i) * radius;
    const y = Math.cos(radian * i) * radius;
    cp.push({ x: x, y: y });
  }
  return cp;
}

function getPoints(radius, controlPoints) {
  let hypotenuse = getHypotenuse(
    controlPoints[0].x,
    controlPoints[1].x,
    controlPoints[0].y,
    controlPoints[1].y
  );

  const radian = 0.5 * Math.PI - (2 * Math.PI) / controlPoints.length;
  const upper = hypotenuse - radius;

  let p = [];

  for (let i = 0; i < controlPoints.length; i++) {
    const sin = Math.sin(-radian * i + 1);
    const cos = Math.cos(-radian * i + 1);
    const cp = controlPoints[i];
    p.push([
      {
        y: sin * radius + controlPoints[i].x,
        x: cos * radius + controlPoints[i].y,
      },
      {
        y: sin * upper + controlPoints[i].x,
        x: cos * upper + controlPoints[i].y,
      },
    ]);
  }

  return p;
}

function getPoints2(radius, controlPoints) {
  let hypotenuse = getHypotenuse(
    controlPoints[0].x,
    controlPoints[1].x,
    controlPoints[0].y,
    controlPoints[1].y
  );
  const upper = hypotenuse - radius;

  let p = [];

  for (let i = 0; i < controlPoints.length; i++) {
    const x =
      (i < controlPoints.length - 1
        ? controlPoints[i + 1].x
        : controlPoints[0].x) - controlPoints[i].x;
    const y =
      (i < controlPoints.length - 1
        ? controlPoints[i + 1].y
        : controlPoints[0].y) - controlPoints[i].y;

    let radian = Math.atan2(y, x);

    const sin = Math.sin(radian);
    const cos = Math.cos(radian);

    p.push([
      {
        x: cos * radius + controlPoints[i].x,
        y: sin * radius + controlPoints[i].y,
      },
      {
        x: cos * upper + controlPoints[i].x,
        y: sin * upper + controlPoints[i].y,
      },
    ]);
  }

  return p;
}

function toRadian(degrees) {
  return (Math.PI / 180) * degrees;
}

function getHypotenuse(x1, x2, y1, y2) {
  let x = x1 - x2;
  let y = y1 - y2;
  return Math.sqrt(x * x + y * y);
}

var polygons = [];

function create(sides, borderRadius) {
  for (let i = 1; i <= 1; i++) {
    polygons.push(drawPolygon({
      sides: sides,
      radius: 100,
      borderRadius: borderRadius,
      fill: "#ccc"
    }));
  }
}

create(7, 8);


