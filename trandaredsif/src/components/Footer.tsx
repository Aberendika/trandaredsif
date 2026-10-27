import { Link } from "@tanstack/react-router";
import { Mail } from "lucide-react";
import logo from "@/assets/logo.webp";
import instagramIcon from "@/assets/instagram.png";
import tiktokIcon from "@/assets/tiktok.png";
import intersport from "@/assets/intersport.webp";
import plusmargret from "@/assets/plusmargret.png";
import craft from "@/assets/craft-neg.png";
import fbcargo from "@/assets/fbcargo.png";
import bakerLogistics from "@/assets/baker-logistics-neg.png";
import allegio from "@/assets/allegioo.png";
import moccadeli from "@/assets/moccadeli.png";

const sponsors = [
  { name: "Intersport", url: "https://www.intersport.se/", logo: intersport },
  { name: "+MARGRET", url: "https://margret.se/", logo: plusmargret },
  { name: "Craft of Scandinavia", url: "https://www.craftofscandinavia.se/", logo: craft },
  { name: "FB Cargo", url: "https://www.fb-cargo.se/", logo: fbcargo },
  { name: "Baker Logistics", url: "https://bakerlogistics.se/", logo: bakerLogistics },
  { name: "Allegio", url: "https://allegio.se/ort/boras/", logo: allegio },
  { name: "Mocca Deli", url: "https://moccadeli.se/mocca-deli-boras/", logo: moccadeli },
];

export function Footer() {
  return (
    <footer className="bg-surface border-t border-border">
      {/* Sponsors */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <h3 className="font-display text-sm font-bold tracking-widest text-muted-foreground text-center mb-8 uppercase">
          Med stöd av
        </h3>
        <div className="flex flex-wrap items-center justify-center gap-8">
          {sponsors.map((s) => (
            <a
              key={s.name}
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              className="opacity-60 hover:opacity-100 transition-opacity"
              title={s.name}
            >
              <img src={s.logo} alt={s.name} className="h-10 w-auto object-contain" />
            </a>
          ))}
        </div>
      </div>

      <div className="border-t border-border">
        <div className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {/* Brand */}
          <div className="flex flex-col justify-start h-full">
            <div className="flex items-center gap-3 mb-3">
              <img
                src={logo}
                alt="Trandareds IF"
                className="h-10 w-10 rounded-full"
              />
              <span className="font-display text-lg font-bold tracking-wider">TRANDAREDS IF</span>
            </div>
            <p className="text-sm text-muted-foreground">Engagemang, gemenskap och framtid</p>
            <p className="text-sm text-muted-foreground mt-1">Borås, Sverige</p>
          </div>

          {/* Links */}
          <div className="flex flex-col h-full">
            <h4 className="font-display text-sm font-bold tracking-widest text-muted-foreground mb-4 min-h-[1.5rem]">GENVÄGAR</h4>
            <nav className="flex flex-col gap-2">
              <Link to="/" className="text-sm text-foreground hover:text-primary transition-colors">Hem</Link>
              <Link to="/matches" className="text-sm text-foreground hover:text-primary transition-colors">Matcher</Link>
              <Link to="/contact" className="text-sm text-foreground hover:text-primary transition-colors">Kontakt</Link>
            </nav>
          </div>

          {/* Contact */}
          <div className="flex flex-col h-full">
            <h4 className="font-display text-sm font-bold tracking-widest text-muted-foreground mb-4 min-h-[1.5rem]">KONTAKTA OSS</h4>
            <div className="flex flex-col gap-3">
              <a
                href="mailto:Trandaredsif@outlook.com"
                className="flex items-center gap-2 text-sm text-foreground hover:text-primary transition-colors"
              >
                <Mail size={16} /><span>Trandaredsif@outlook.com</span>
              </a>
            </div>
          </div>

          {/* Socials */}
          <div className="md:col-span-3 text-center mt-2">
            <h4 className="font-display text-sm font-bold tracking-widest text-muted-foreground mb-4 min-h-[1.5rem]">
              FÖLJ OSS PÅ SOCIALA MEDIER
            </h4>
            <div className="flex items-center justify-center gap-6">
              <a
                href="https://www.instagram.com/trandaredsif"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center text-foreground hover:text-primary transition-colors"
                aria-label="Instagram"
              >
                <img src={instagramIcon} alt="Instagram" className="h-7 w-7 md:h-8 md:w-8" />
              </a>
              <a
                href="https://www.tiktok.com/@trandaredsif"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center text-foreground hover:text-primary transition-colors"
                aria-label="TikTok"
              >
                <img src={tiktokIcon} alt="TikTok" className="h-7 w-7 md:h-8 md:w-8" />
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-border text-center py-4 px-6">
        <p className="text-xs text-muted-foreground">
          © 2025 Trandareds IF. Alla rättigheter förbehållna.
        </p>
      </div>
    </footer>
  );
}
