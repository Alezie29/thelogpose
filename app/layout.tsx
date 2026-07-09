import {
  Instrument_Serif, Geist_Mono,
  Bangers, Shojumaru, Satisfy, Fredericka_the_Great, Parisienne, Fredoka,
  IM_Fell_English, Audiowide, Pirata_One, Yuji_Syuku, Cinzel, Rye,
  Grenze_Gotisch, Kaushan_Script, Playfair_Display, Great_Vibes,
} from "next/font/google";

const serif = Instrument_Serif({ weight: "400", style: ["normal", "italic"], subsets: ["latin"], variable: "--font-serif" });
const mono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono" });

// One display font per character, matched to their personality.
const luffy = Bangers({ weight: "400", subsets: ["latin"], variable: "--font-luffy" });
const zoro = Shojumaru({ weight: "400", subsets: ["latin"], variable: "--font-zoro" });
const nami = Satisfy({ weight: "400", subsets: ["latin"], variable: "--font-nami" });
const usopp = Fredericka_the_Great({ weight: "400", subsets: ["latin"], variable: "--font-usopp" });
const sanji = Parisienne({ weight: "400", subsets: ["latin"], variable: "--font-sanji" });
const chopper = Fredoka({ subsets: ["latin"], variable: "--font-chopper" });
const robin = IM_Fell_English({ weight: "400", subsets: ["latin"], variable: "--font-robin" });
const franky = Audiowide({ weight: "400", subsets: ["latin"], variable: "--font-franky" });
const brook = Pirata_One({ weight: "400", subsets: ["latin"], variable: "--font-brook" });
const jinbe = Yuji_Syuku({ weight: "400", subsets: ["latin"], variable: "--font-jinbe" });
const whitebeard = Cinzel({ subsets: ["latin"], variable: "--font-whitebeard" });
const ace = Rye({ weight: "400", subsets: ["latin"], variable: "--font-ace" });
const law = Grenze_Gotisch({ subsets: ["latin"], variable: "--font-law" });
const shanks = Kaushan_Script({ weight: "400", subsets: ["latin"], variable: "--font-shanks" });
const sabo = Playfair_Display({ subsets: ["latin"], variable: "--font-sabo" });
const hancock = Great_Vibes({ weight: "400", subsets: ["latin"], variable: "--font-hancock" });

const fontVars = [
  serif, mono, luffy, zoro, nami, usopp, sanji, chopper, robin, franky,
  brook, jinbe, whitebeard, ace, law, shanks, sabo, hancock,
].map(f => f.variable).join(" ");

export const metadata = {
  title: "The Log Pose",
  description: "A One Piece episode log",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={fontVars} suppressHydrationWarning>
      <body style={{ margin: 0, padding: 0 }} suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
