import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MatchCard } from "@/components/MatchCard";
import { fetchMatches, type NormalizedMatch } from "@/lib/fogis";

export const Route = createFileRoute("/matches")({
  head: () => ({
    meta: [
      { title: "Matcher — Trandareds IF" },
      { name: "description", content: "Se alla matcher och resultat för Trandareds IF i Futsal Div 2 Västra Götaland." },
      { property: "og:title", content: "Matcher — Trandareds IF" },
      { property: "og:description", content: "Matchresultat och kommande matcher för Trandareds IF." },
    ],
  }),
  component: MatchesPage,
});

function MatchesPage() {
  const [played, setPlayed] = useState<NormalizedMatch[]>([]);
  const [upcoming, setUpcoming] = useState<NormalizedMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(4);
  const [upcomingVisibleCount, setUpcomingVisibleCount] = useState(4);
  const visibleUpcoming = upcoming.slice(0, upcomingVisibleCount);

  useEffect(() => {
    fetchMatches()
      .then(({ played, upcoming }) => {
        setPlayed(played);
        setUpcoming(upcoming);
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Okänt fel"))
      .finally(() => setLoading(false));
  }, []);

  const visiblePlayed = played.slice(0, visibleCount);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="pt-28 pb-24 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gold-gradient">Matcher</h1>
            <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
              Här hittar du alla resultat och kommande matcher för Trandareds IF.
            </p>
          </motion.div>

          {loading && (
            <p className="text-center text-muted-foreground py-12">Laddar matcher…</p>
          )}

          {error && (
            <p className="text-center text-destructive py-12">
              Kunde inte ladda matcher: {error}
            </p>
          )}

          {!loading && !error && (
            <>
              <div className="mb-16">
                <h2 className="font-display text-sm font-bold tracking-widest text-muted-foreground mb-6 uppercase">
                  Kommande matcher
                </h2>
                {visibleUpcoming.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    Inga kommande matcher i nuläget.
                  </p>
                ) : (
                  <>
                    <div className="grid sm:grid-cols-2 gap-4">
                      {visibleUpcoming.map((m, i) => (
                        <MatchCard key={m.gameId} {...m} index={i} />
                      ))}
                    </div>

                    {upcomingVisibleCount < upcoming.length && (
                      <div className="mt-8 text-center">
                        <button
                          onClick={() => setUpcomingVisibleCount((c) => c + 4)}
                          className="border border-primary text-primary font-display text-sm font-bold tracking-widest uppercase px-8 py-3 rounded-lg hover:bg-primary/10 transition-colors"
                        >
                          Ladda fler
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>

              <div className="mb-8">
                <h2 className="font-display text-sm font-bold tracking-widest text-muted-foreground mb-6 uppercase">
                  Spelade matcher
                </h2>
                {played.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    Inga spelade matcher att visa.
                  </p>
                ) : (
                  <>
                    <div className="grid sm:grid-cols-2 gap-4">
                      {visiblePlayed.map((m, i) => (
                        <MatchCard key={m.gameId} {...m} index={i} />
                      ))}
                    </div>

                    {visibleCount < played.length && (
                      <div className="mt-8 text-center">
                        <button
                          onClick={() => setVisibleCount((c) => c + 4)}
                          className="border border-primary text-primary font-display text-sm font-bold tracking-widest uppercase px-8 py-3 rounded-lg hover:bg-primary/10 transition-colors"
                        >
                          Ladda fler
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
