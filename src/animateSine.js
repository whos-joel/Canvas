export function setTweenerData(tweeners, out, radius) {
  for (let i = 0; i < tweeners.length; i++) {
    let tweener = tweeners[i];
    let polygon = tweener.polygon;
    if (out) {
      if (i == tweeners.length - 1 || tweeners[i + 1].polygon.rotation <= 270) {
        setOutData(tweener, polygon, i, radius);
      }
    } else {
      if (i == 0 || tweeners[i - 1].polygon.rotation >= 90) {
        setInData(tweener, polygon, i, radius);
      }
    }
  }
}

function setOutData(tweener, polygon, i, radius) {
  let fromRadius = radius / 3 - i * 20;
  let toRadius = 0;

  let fromBorder = 20 - i;
  let toBorder = 0;

  if (polygon.rotation > 0) {
    setTweenData(tweener, polygon, {
      f: 0.65,
      r1: 360,
      r2: 0,
      rc: -55,
      fromRadius,
      toRadius,
      fromBorder,
      toBorder,
      s1: 1,
      s2: 0,
    });
  } else {
    polygon.rotation = 0;
  }
}

function setInData(tweener, polygon, i, radius) {
  let fromRadius = 0;
  let toRadius = radius / 3 - i * 20;

  let fromBorder = 0;
  let toBorder = 20 - i;

  if (polygon.rotation < 360) {
    setTweenData(tweener, polygon, {
      f: 0.65,
      r1: 0,
      r2: 360,
      rc: 55,
      fromRadius,
      toRadius,
      fromBorder,
      toBorder,
      s1: 0,
      s2: 1,
    });
  } else {
    polygon.rotation = 360;
  }
}

function setTweenData(
  tweener,
  polygon,
  { f, r1, r2, rc, fromRadius, toRadius, fromBorder, toBorder, s1, s2 }
) {
  //tweener.friction += f;
  //tweener.progress = getProgress(r1, r2, polygon.rotation);
  let d = 200;

  let s = stretchCurve(3, d, tweener.progress, sinCurve);
  
  //polygon.rotation = r1 + sinCurve(r1, r2, tweener.progress, d);
  polygon.rotation = r1 + (s * (r2 - r1));
  if (polygon.radius !== toRadius)
    polygon.radius =
      fromRadius + (s * (toRadius - fromRadius))//sinCurve(fromRadius, toRadius, s, 1); //sinCurve(fromRadius, toRadius, tweener.progress, d);

  polygon.borderRadius =
    fromBorder + (s * (toBorder - fromBorder))//sinCurve(fromBorder, toBorder, tweener.progress, d);
  polygon.strokeWidth = s1 +  (s * (s2 - s1))//sinCurve(s1, s2, tweener.progress, d);

  tweener.progress++;
}

function stretchCurve(amount, duration, progress, func){
  let p = progress / duration;
  for (let i = 0; i < amount; i++) {
    p = func(0, 1, p, 1);
  }
  return p;
}

export function sinCurve(from, to, current, duration) {
  return Math.sin((Math.PI / 2) * (current / duration)) * (to - from);
}

export function cosCurve(from, to, current, duration) {
  return (
    to - from - Math.cos((Math.PI / 2) * (current / duration)) * (to - from)
  );
}
