export default function drawPolygon(
  ctx,
  {
    x = 0,
    y = 0,
    sides = 5,
    radius = 100,
    rotation = 0,
    borderRadius = 0,
    strokeColor = "#999",
    strokeWidth = 1,
    fill = "#ccc",
  }
) {
  if (sides < 3) throw "Cannot draw polygon with less than 3 sides";

  ctx.strokeStyle = strokeColor;
  ctx.lineWidth = strokeWidth;
  ctx.fillStyle = fill;

  let controlPoints = getControlPoints(sides, radius, rotation);
  let points = getPoints(borderRadius, controlPoints);

  for (let i = 0; i < sides; i++) {
    if (i === 0) {
      ctx.moveTo(points[i][0].x + x, points[i][0].y + y);
      ctx.lineTo(points[i][1].x + x, points[i][1].y + y);
    } else {
      ctx.quadraticCurveTo(
        controlPoints[i].x + x,
        controlPoints[i].y + y,
        points[i][0].x + x,
        points[i][0].y + y
      );
      ctx.lineTo(points[i][1].x + x, points[i][1].y + y);
    }
  }

  ctx.quadraticCurveTo(
    controlPoints[0].x + x,
    controlPoints[0].y + y,
    points[0][0].x + x,
    points[0][0].y + y
  );

  if (strokeWidth > 0) ctx.stroke();
  ctx.fill();

  ctx.closePath();
  ctx.beginPath();
}

function getControlPoints(sides, radius, rotation) {
  const segmentRadian = toRadian(360 / sides);
  const rotationRadian = toRadian(rotation);
  let cp = [];
  for (let i = 0; i < sides; i++) {
    const x = Math.sin(segmentRadian * i + rotationRadian) * radius;
    const y = Math.cos(segmentRadian * i + rotationRadian) * radius;
    cp.push({ x: x, y: y });
  }
  return cp;
}

function getPoints(cornerRadius, controlPoints) {
  let hypotenuse = Math.hypot(
    controlPoints[0].x - controlPoints[1].x,
    controlPoints[0].y - controlPoints[1].y
  );

  const upper = hypotenuse - cornerRadius;

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
        x: cos * cornerRadius + controlPoints[i].x,
        y: sin * cornerRadius + controlPoints[i].y,
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
