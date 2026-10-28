import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MatchCard } from "@/components/MatchCard";
import { fetchMatches, type NormalizedMatch } from "@/lib/fogis";
import logo from "@/assets/logo.webp";
import teamPhoto from "@/assets/team.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Trandareds IF — Engagemang, gemenskap och framtid" },
      { name: "description", content: "Trandareds IF är en fotbollsförening i hjärtat av Borås. Futsal, gemenskap och samhällsengagemang." },
      { property: "og:title", content: "Trandareds IF — Engagemang, gemenskap och framtid" },
      { property: "og:description", content: "Trandareds IF är en fotbollsförening i hjärtat av Borås." },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const [recent, setRecent] = useState<NormalizedMatch[]>([]);
  const feedRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchMatches()
      .then(({ played }) => setRecent(played.slice(0, 4)))
      .catch(() => {});
  }, []);

  useEffect(() => {
    const existing = document.getElementById("elfsight-script");

    if (!existing) {
      const script = document.createElement("script");
      script.id = "elfsight-script";
      script.src = "https://elfsightcdn.com/platform.js";
      script.async = true;

      script.onload = () => {
        if ((window as any).Elf && feedRef.current) {
          (window as any).Elf.init();
        }
      };

      document.body.appendChild(script);
    } else if ((window as any).Elf && feedRef.current) {
      (window as any).Elf.init();
    }
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden bg-[#0d1117]">
        <div className="relative z-10 text-center px-6 max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <img
              src={logo}
              alt="Trandareds IF"
              className="w-32 h-32 mx-auto mb-6 rounded-full bg-white shadow-[0_0_40px_10px_rgba(255,255,255,0.8)] animate-pulse"            />
            <h1 className="text-5xl md:text-7xl font-bold text-gold-gradient leading-tight">
              Trandareds IF
            </h1>
<p className="mt-4 text-lg md:text-xl text-white font-body">              Engagemang, gemenskap och framtid
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/contact"
                className="bg-gold-gradient font-display text-sm font-bold tracking-widest uppercase px-8 py-3 rounded-lg text-primary-foreground hover:opacity-90 transition-opacity"
              >
                Kontakta oss
              </Link>
              
            </div>
          </motion.div>
        </div>
      </section>

      {/* About */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid md:grid-cols-2 gap-12 items-center"
          >
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gold-gradient mb-6">
                Mer än en förening
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                I hjärtat av Borås blomstrar en förening som inte bara siktar på att utmärka sig
                på planen, utan också strävar efter att vara en positiv kraft i samhället.
              </p>
              <p className="text-muted-foreground leading-relaxed mt-4">
                Trandareds IF är inte bara en idrottsförening, utan en plattform för engagemang,
                gemenskap och lokalt samhällsansvar. Välkommen till Trandareds IF, där vi inte bara spelar
                fotboll — vi förändrar liv.
              </p>
            </div>
            <div className="relative">
              <img
                src={teamPhoto}
                alt="Trandareds IF lag"
                className="rounded-xl w-full aspect-[4/3] object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-primary/20" />
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-24 px-6 bg-surface-gradient">
        <div className="max-w-5xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-gold-gradient text-center mb-4"
          >
            Senaste nytt
          </motion.h2>
          <p className="mb-8 text-center text-muted-foreground max-w-2xl mx-auto">
            Här kan du se senaste nytt som hänt hos Trandareds IF.
          </p>

          <div className="rounded-2xl border border-border bg-card p-3 md:p-5 shadow-[0_0_30px_rgba(0,0,0,0.08)]">
            <div
              ref={feedRef}
              className="elfsight-app-d45e5dfe-5559-476d-bed7-4eeab39353cf"
              style={{ width: "100%", minHeight: "420px", maxHeight: "520px", overflow: "hidden" }}
            />
          </div>
        </div>
      </section>

      {/* Recent Matches */}
      <section className="py-24 px-6 bg-surface-gradient">
        <div className="max-w-5xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-gold-gradient text-center mb-12"
          >
            Senaste matcherna
          </motion.h2>
          {recent.length === 0 ? (
            <p className="text-center text-muted-foreground">Laddar matcher…</p>
          ) : (
            <div className="grid sm:grid-cols-2 gap-4">
              {recent.map((match, i) => (
                <MatchCard key={match.gameId} {...match} index={i} />
              ))}
            </div>
          )}
          <div className="mt-8 text-center">
            <Link
              to="/matches"
              className="inline-block border border-primary text-primary font-display text-sm font-bold tracking-widest uppercase px-8 py-3 rounded-lg hover:bg-primary/10 transition-colors"
            >
              Se alla matcher
            </Link>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
