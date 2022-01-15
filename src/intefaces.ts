interface Hsl {
  h: number,
  s: number,
  l: number
}

interface Rgb {
  r: number,
  g: number,
  b: number
}

interface Rgba extends Rgb {
  a: number,
}

interface Coord {
  x: number,
  y: number
}
namespace whosJoel {
  export interface Range {
    min: number,
    max: number
  }
}