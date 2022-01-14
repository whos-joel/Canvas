export default function setTweenerData(tweeners, out, radius) {
    for (let i = 0; i < tweeners.length; i++) {
      let tweener = tweeners[i];
      let polygon = tweener.polygon;
      if (out) {
        if (i == tweeners.length - 1 || tweeners[i + 1].polygon.rotation <= 240) {
          setOutData(tweener, polygon, i, radius);
        }
      } else {
        if (i == 0 || tweeners[i - 1].polygon.rotation >= 120) {
          setInData(tweener, polygon, i, radius);
        }
      }
    }
  }
  
  function setOutData(tweener, polygon, i, radius) {
    let fromRadius = radius / 3 - i * 10;
    let toRadius = 0;
  
    let fromBorder = 20 - i;
    let toBorder = 0;
  
    if (polygon.rotation > 0) {
      setTweenData(tweener, polygon, {f:0.65, r1:360, r2:0, rc: -55, fromRadius, toRadius, fromBorder, toBorder, s1:1, s2:0});
    }else{
      polygon.rotation = 0;
      polygon.strokeWidth = 0;
    }
  }
  
  function setInData(tweener, polygon, i, radius) {
    let fromRadius = 0;
    let toRadius = radius / 3 - i * 10;
  
    let fromBorder = 0;
    let toBorder = 20 - i;
  
    if (polygon.rotation < 360) {
      setTweenData(tweener, polygon, {f:0.65, r1:0, r2:360, rc: 55, fromRadius, toRadius, fromBorder, toBorder, s1:0, s2:1});
    }else{
      polygon.rotation = 360;
    }
  }
  
  function setTweenData(
    tweener, polygon,
    { f, r1, r2, rc, fromRadius, toRadius, fromBorder, toBorder, s1, s2 }
  ) {
    tweener.friction += f;
    tweener.progress = getProgress(r1, r2, polygon.rotation);
  
    polygon.rotation += rc / tweener.friction;
    polygon.radius = getTweenValue(fromRadius, toRadius, tweener.progress);
    polygon.borderRadius = getTweenValue(fromBorder, toBorder, tweener.progress);
    polygon.strokeWidth = getTweenValue(s1, s2, tweener.progress);
  }
  
  function getTweenValue(from, to, progress) {
    let value = from + (to - from) * progress;
    return value;
  }
  
  function getProgress(from:number, to:number, current:number):number {
    let value = (current - from) / (to - from);
    return value;
  }