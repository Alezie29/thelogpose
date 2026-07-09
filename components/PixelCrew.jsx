// Hand-drawn 16x16 pixel portraits of the Straw Hat crew.
// Each grid row is exactly 16 chars; "." is transparent, letters map to the palette.

const SKIN = "#F1C27D";
const SKIN_D = "#D9A066";
const EYE = "#16161A";

export const PIXELS = {
  Luffy: {
    colors: { S: "#E9C46A", R: "#C0392B", H: "#26201B", F: SKIN, E: EYE, c: "#B07A45", W: "#F5EFE4", V: "#D64541" },
    grid: [
      "................",
      ".....SSSSSS.....",
      "....SSSSSSSS....",
      "....RRRRRRRR....",
      "..SSSSSSSSSSSS..",
      ".SSSSSSSSSSSSSS.",
      "...HHHHHHHHHH...",
      "...HFFFFFFFFH...",
      "...HFEFFFFEFH...",
      "....FFFFFFcF....",
      "....FWWWWWWF....",
      ".....FFFFFF.....",
      "....VVVFFVVV....",
      "...VVVVFFVVVV...",
      "...VVVVVVVVVV...",
      "................",
    ],
  },
  Zoro: {
    colors: { G: "#4CAF6D", F: SKIN, E: EYE, x: "#8C6D4F", g: "#E9C46A", M: "#8A5040", V: "#1F5F3F" },
    grid: [
      "................",
      ".....GGGGGG.....",
      "....GGGGGGGG....",
      "...GGGGGGGGGG...",
      "...GFFFFFFFFG...",
      "...GFEFFFFxFG...",
      "...GFFFFFFFFGg..",
      "....FFFFFFFF.g..",
      "....FFMMMMFF.g..",
      ".....FFFFFF.....",
      "....VVVVVVVV....",
      "...VVVVVVVVVV...",
      "...VVVVVVVVVV...",
      "................",
      "................",
      "................",
    ],
  },
  Nami: {
    colors: { O: "#F39C4F", F: SKIN, E: EYE, M: "#C46A6A", W: "#F5F0E8" },
    grid: [
      "................",
      "....OOOOOOOO....",
      "...OOOOOOOOOO...",
      "..OOOOOOOOOOOO..",
      "..OOFFFFFFFFOO..",
      "..OOFEFFFFEFOO..",
      "..OOFFFFFFFFOO..",
      "..OOFFMMMMFFOO..",
      "..OO.FFFFFF.OO..",
      "..OO..FFFF..OO..",
      "..O...WWWW...O..",
      ".....WWWWWW.....",
      "....WWWWWWWW....",
      "................",
      "................",
      "................",
    ],
  },
  Usopp: {
    colors: { C: "#2F2A24", F: SKIN, f: SKIN_D, E: EYE, M: "#8A5040", b: "#2F2A24", O: "#7A8450" },
    grid: [
      "................",
      "...C.CCCCCC.C...",
      "..CCCCCCCCCCCC..",
      ".CCCCCCCCCCCCCC.",
      "..CCFFFFFFFFCC..",
      "..CCFEFFFFEFCC..",
      ".CCCFFFffFFFCCC.",
      "..CCFFFffFFFCC..",
      "....FFFffFFF....",
      "....FFFMMFFF....",
      ".....FFbbFF.....",
      "....OOOOOOOO....",
      "...OOOOOOOOOO...",
      "................",
      "................",
      "................",
    ],
  },
  Sanji: {
    colors: { Y: "#E8C95A", F: SKIN, E: EYE, M: "#8A5040", c: "#E8E4DA", K: "#23252B", W: "#F5F0E8" },
    grid: [
      "................",
      "....YYYYYYYY....",
      "...YYYYYYYYYY...",
      "...YYYYYYYYYY...",
      "...YYYYFFFFFY...",
      "...YYYYFEFFFY...",
      "...YYYYFFFFFY...",
      "....YYFFFFFF....",
      ".....FMMMMFcc...",
      "......FFFF......",
      "....KKKWWKKK....",
      "...KKKKWWKKKK...",
      "...KKKKKKKKKK...",
      "................",
      "................",
      "................",
    ],
  },
  Chopper: {
    colors: { P: "#D6568C", W: "#F5F0E8", A: "#8A5A3B", U: "#9C6B3F", F: "#EBC8A4", E: EYE, N: "#3D6FB4", R: "#7A2F4F" },
    grid: [
      "................",
      ".....PPPPPP.....",
      "....PPWPPWPP....",
      "....PPPWWPPP....",
      "..PPPPPPPPPPPP..",
      "AA...UUUUUU...AA",
      ".AA.UUFFFFUU.AA.",
      "....UFEFFEFU....",
      "....UFFNNFFU....",
      "....UFFFFFFU....",
      ".....UUUUUU.....",
      "....RRRRRRRR....",
      "....RRRRRRRR....",
      "................",
      "................",
      "................",
    ],
  },
  Robin: {
    colors: { K: "#241E2E", F: SKIN, E: EYE, M: "#B06070", V: "#6E4A9E" },
    grid: [
      "................",
      "....KKKKKKKK....",
      "..KKKKKKKKKKKK..",
      "..KKKKKKKKKKKK..",
      "..KKKFFFFFFKKK..",
      "..KKFEFFFFEFKK..",
      "..KKFFFFFFFFKK..",
      "..KKFFFMMFFFKK..",
      "..KK.FFFFFF.KK..",
      "..KK..FFFF..KK..",
      "..KK.VVVVVV.KK..",
      "..K..VVVVVV..K..",
      "................",
      "................",
      "................",
      "................",
    ],
  },
  Franky: {
    colors: { B: "#2D9CDB", F: SKIN, G: "#16161A", N: "#9AA6B2", M: "#8A5040", R: "#E74C3C", W: "#F5F0E8" },
    grid: [
      "................",
      "......BBBBB.....",
      "....BBBBBBB.....",
      "...BBBBBBBBB....",
      "....FFFFFFFF....",
      "...FGGGGGGGGF...",
      "....FFFNNFFF....",
      "....FFFNNFFF....",
      "....FMMMMMMF....",
      "...FFFFFFFFFF...",
      "...RRWRRRRWRR...",
      "..RRRRRRRRRRRR..",
      "................",
      "................",
      "................",
      "................",
    ],
  },
  Brook: {
    colors: { A: "#1D1D1D", W: "#EFEAD8", E: "#0D0D0D", K: "#3A3630", V: "#3E3550", R: "#D9833B" },
    grid: [
      "....AAAAAAAA....",
      "..AAAAAAAAAAAA..",
      ".AAAAAAAAAAAAAA.",
      ".AAAAAAAAAAAAAA.",
      "..AAWWWWWWWWAA..",
      "..AAWEEWWEEWAA..",
      "..AAWWWWWWWWAA..",
      "...AWWWEEWWWA...",
      "....WKWKWKWK....",
      ".....WWWWWW.....",
      "....VVVRRVVV....",
      "...VVVVVVVVVV...",
      "................",
      "................",
      "................",
      "................",
    ],
  },
  Jinbe: {
    colors: { K: "#1A2430", J: "#4A8FBF", E: EYE, W: "#F5F0E8", M: "#12303F", O: "#E67E22" },
    grid: [
      "................",
      "......KKKK......",
      ".....KKKKKK.....",
      "...JJJJJJJJJJ...",
      "..JJJJJJJJJJJJ..",
      "..JJKKJJJJKKJJ..",
      "..JJJEJJJJEJJJ..",
      "..JJJJJJJJJJJJ..",
      "..JJWMMMMMMWJJ..",
      "...JJJJJJJJJJ...",
      "...OOOOOOOOOO...",
      "..OOOKKKKKKOOO..",
      "..OOOOOOOOOOOO..",
      "................",
      "................",
      "................",
    ],
  },
};

export function PixelAvatar({ name, size = 64, style }) {
  const art = PIXELS[name];
  if (!art) return null;
  const rects = [];
  art.grid.forEach((row, y) => {
    for (let x = 0; x < row.length; x++) {
      const color = art.colors[row[x]];
      if (color) rects.push(<rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" fill={color} />);
    }
  });
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      shapeRendering="crispEdges"
      style={{ display: "block", ...style }}
      aria-label={name}
      role="img"
    >
      {rects}
    </svg>
  );
}
