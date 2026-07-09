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
    colors: { A: "#1D1D1D", W: "#EFEAD8", E: "#0D0D0D", n: "#0D0D0D", K: "#3A3630", V: "#3E3550", R: "#D9833B" },
    grid: [
      "....AAAAAAAA....",
      "..AAAAAAAAAAAA..",
      ".AAAAAAAAAAAAAA.",
      ".AAAAAAAAAAAAAA.",
      "..AAWWWWWWWWAA..",
      "..AAWEEWWEEWAA..",
      "..AAWWWWWWWWAA..",
      "...AWWWnnWWWA...",
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
  Whitebeard: {
    colors: { H: "#1F1B18", F: SKIN, E: EYE, M: "#5A3A2E", W: "#F2EEE2", C: "#E8E4D8" },
    grid: [
      "................",
      "....HHHHHHHH....",
      "...HHHHHHHHHH...",
      "...HFFFFFFFFH...",
      ".W.HFEFFFFEFH.W.",
      ".WWHFFFFFFFFHWW.",
      ".WWWFFFFFFFFWWW.",
      "..WWWWWWWWWWWW..",
      "...WWWWWWWWWW...",
      ".....FMMMMF.....",
      ".....FFFFFF.....",
      "....CCCCCCCC....",
      "...CCCCCCCCCC...",
      "................",
      "................",
      "................",
    ],
  },
  Ace: {
    colors: { A: "#E8862D", H: "#26201B", F: SKIN, E: EYE, k: "#C98F5F", M: "#8A5040", R: "#C0392B" },
    grid: [
      "................",
      ".....AAAAAA.....",
      "....AAAAAAAA....",
      "..AAAAAAAAAAAA..",
      "...HHHHHHHHHH...",
      "...HFFFFFFFFH...",
      "...HFEFFFFEFH...",
      "....FkFFFFkF....",
      "....FFMMMMFF....",
      ".....FFFFFF.....",
      "....FFFFFFFF....",
      "...FFRRRRRRFF...",
      "...FFFFFFFFFF...",
      "................",
      "................",
      "................",
    ],
  },
  Law: {
    colors: { W: "#F0EBE0", S: "#1A1A1A", H: "#1D1A16", F: SKIN, E: EYE, M: "#8A5040", Y: "#EAD94C" },
    grid: [
      "................",
      "....WWWWWWWW....",
      "...WWSWWWWSWW...",
      "...WWWWWWWWWW...",
      "...WWWWWWWWWW...",
      "...HFFFFFFFFH...",
      "...HFEFFFFEFH...",
      "....FFFFFFFF....",
      "....FFMMMMFF....",
      ".....FFHHFF.....",
      "....YYYYYYYY....",
      "...YYYYYYYYYY...",
      "...YYYYYYYYYY...",
      "................",
      "................",
      "................",
    ],
  },
  Shanks: {
    colors: { R: "#B5312B", F: SKIN, E: EYE, x: "#8C5A3C", M: "#8A5040", K: "#23252B", W: "#F5F0E8" },
    grid: [
      "................",
      "....RRRRRRRR....",
      "...RRRRRRRRRR...",
      "...RRRRRRRRRR...",
      "...RFFFFFFxFR...",
      "...RFEFFFFEFR...",
      "...RFFFFFFxFR...",
      "....FFFFFFFF....",
      "....FFMMMMFF....",
      ".....FFFFFF.....",
      "....KKKWWKKK....",
      "...KKKKWWKKKK...",
      "...KKKKKKKKKK...",
      "................",
      "................",
      "................",
    ],
  },
  Sabo: {
    colors: { B: "#3E6FD1", g: "#D9B44A", Y: "#E8CE7A", F: SKIN, E: EYE, M: "#8A5040", W: "#F5F0E8", C: "#2B4FA8" },
    grid: [
      ".....BBBBBB.....",
      ".....BBBBBB.....",
      ".....gggggg.....",
      "...BBBBBBBBBB...",
      "...YYYYYYYYYY...",
      "...YFEFFFFEFY...",
      "....FFFFFFFF....",
      "....FFMMMMFF....",
      ".....FFFFFF.....",
      ".....WWWWWW.....",
      "....CCCCCCCC....",
      "...CCCCCCCCCC...",
      "................",
      "................",
      "................",
      "................",
    ],
  },
  Hancock: {
    colors: { K: "#1A1420", F: SKIN, E: EYE, M: "#B04A6A", R: "#C03546" },
    grid: [
      "................",
      "....KKKKKKKK....",
      "..KKKKKKKKKKKK..",
      "..KKKKKKKKKKKK..",
      "..KKFFFFFFFFKK..",
      "..KKFEFFFFEFKK..",
      "..KKFFFFFFFFKK..",
      "..KKFFFMMFFFKK..",
      "..KKRFFFFFFRKK..",
      "..KK..FFFF..KK..",
      ".KK..RRRRRR..KK.",
      ".KK.RRRRRRRR.KK.",
      "................",
      "................",
      "................",
      "................",
    ],
  },
};

// Emotion variants: small pixel edits applied on top of a base portrait.
// Eyes are every "E" pixel, mouth every "M" pixel; characters without them
// (Franky's shades, Brook's teeth) simply skip those effects.
const FX_COLORS = {
  "1": "#241A12", // brow
  "2": "#5FB8E8", // tear
  "3": "#FFD34D", // star eyes
  "4": "#2A1114", // open mouth
  "5": "#C9925C", // closed lid
  "6": "#F5EFE4", // teeth
};

export const EMOTIONS = [
  { name: "Steady",      fx: [] },
  { name: "Grinning",    fx: ["teeth"] },
  { name: "Starry-eyed", fx: ["starEyes", "teeth"] },
  { name: "Determined",  fx: ["brows"] },
  { name: "Shocked",     fx: ["openMouth"] },
  { name: "Laughing",    fx: ["squint", "teeth"] },
  { name: "Furious",     fx: ["brows", "frown"] },
  { name: "Moved",       fx: ["tears", "frown"] },
  { name: "Winking",     fx: ["wink", "teeth"] },
  { name: "Blazing",     fx: ["brows", "starEyes", "teeth"] },
];

function applyEmotion(art, idx) {
  const em = EMOTIONS[idx];
  if (!em || em.fx.length === 0) return art;
  const grid = art.grid.map(r => r.split(""));
  const eyes = [], mouth = [];
  grid.forEach((row, y) => row.forEach((ch, x) => {
    if (ch === "E") eyes.push([x, y]);
    if (ch === "M") mouth.push([x, y]);
  }));
  const set = (x, y, ch) => { if (grid[y] && grid[y][x] !== undefined) grid[y][x] = ch; };
  for (const fx of em.fx) {
    if (fx === "teeth") mouth.forEach(([x, y]) => set(x, y, "6"));
    if (fx === "starEyes") eyes.forEach(([x, y]) => set(x, y, "3"));
    if (fx === "squint") eyes.forEach(([x, y]) => set(x, y, "5"));
    if (fx === "brows") eyes.forEach(([x, y]) => set(x, y - 1, "1"));
    if (fx === "tears") eyes.forEach(([x, y]) => set(x, y + 1, "2"));
    if (fx === "wink" && eyes.length) set(eyes[0][0], eyes[0][1], "5");
    if (fx === "openMouth") mouth.forEach(([x, y]) => { set(x, y, "4"); set(x, y + 1, "4"); });
    if (fx === "frown" && mouth.length > 2 && art.colors.F) {
      const xs = mouth.map(m => m[0]);
      const min = Math.min(...xs), max = Math.max(...xs);
      mouth.forEach(([x, y]) => { if (x === min || x === max) set(x, y, "F"); });
    }
  }
  return { colors: { ...art.colors, ...FX_COLORS }, grid: grid.map(r => r.join("")) };
}

export function PixelAvatar({ name, size = 64, emotion, style }) {
  let art = PIXELS[name];
  if (!art) return null;
  if (emotion != null) art = applyEmotion(art, emotion);
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
