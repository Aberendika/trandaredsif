import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Filter } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MatchCard } from "@/components/MatchCard";
import { fetchMatches, type NormalizedMatch } from "@/lib/fogis";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Route = createFileRoute("/matches")({
  head: () => ({
    meta: [
      { title: "Matcher — Trandareds IF" },
      {
        name: "description",
        content: "Se alla matcher och resultat för Trandareds IF i Futsal Div 2 Västra Götaland.",
      },
      { property: "og:title", content: "Matcher — Trandareds IF" },
      {
        property: "og:description",
        content: "Matchresultat och kommande matcher för Trandareds IF.",
      },
    ],
  }),
  component: MatchesPage,
});

const getSeason = (match: NormalizedMatch) => {
  const season = match.league.match(/\b((?:19|20)\d{2})\s*\/\s*((?:19|20)\d{2})\b/);
  return season ? `${season[1]}/${season[2]}` : null;
};

const getDivision = (match: NormalizedMatch) => {
  const division = match.league.match(/\b(?:div(?:ision)?\.?)\s*(\d+)\b/i);
  if (!division) return match.league;

  const category = match.league.match(/\b(herrar|damer|pojkar|flickor)\b/i)?.[1];
  return category
    ? `${category.charAt(0).toUpperCase()}${category.slice(1).toLowerCase()} Div ${division[1]}`
    : `Div ${division[1]}`;
};

function MatchesPage() {
  const [played, setPlayed] = useState<NormalizedMatch[]>([]);
  const [upcoming, setUpcoming] = useState<NormalizedMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(4);
  const [upcomingVisibleCount, setUpcomingVisibleCount] = useState(4);
  const [selectedSeason, setSelectedSeason] = useState("all");
  const [selectedDivision, setSelectedDivision] = useState("all");
  const [draftSeason, setDraftSeason] = useState("all");
  const [draftDivision, setDraftDivision] = useState("all");
  const [filterOpen, setFilterOpen] = useState(false);

  useEffect(() => {
    fetchMatches()
      .then(({ played, upcoming }) => {
        setPlayed(played);
        setUpcoming(upcoming);
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Okänt fel"))
      .finally(() => setLoading(false));
  }, []);

  const allMatches = [...played, ...upcoming];
  const seasons = [
    ...new Set(allMatches.map(getSeason).filter((season): season is string => season !== null)),
  ].sort((a, b) => Number(b.slice(0, 4)) - Number(a.slice(0, 4)) || b.localeCompare(a));
  const getDivisionsForSeason = (season: string) =>
    [
      ...new Set(
        allMatches
          .filter((match) => season === "all" || getSeason(match) === season)
          .map(getDivision),
      ),
    ].sort((a, b) => a.localeCompare(b, "sv", { numeric: true }));
  const draftDivisions = getDivisionsForSeason(draftSeason);
  const matchesForFilters = (matches: NormalizedMatch[]) =>
    matches.filter((match) => {
      return (
        (selectedSeason === "all" || getSeason(match) === selectedSeason) &&
        (selectedDivision === "all" || getDivision(match) === selectedDivision)
      );
    });

  const filteredPlayed = matchesForFilters(played);
  const filteredUpcoming = matchesForFilters(upcoming);
  const visiblePlayed = filteredPlayed.slice(0, visibleCount);
  const visibleUpcoming = filteredUpcoming.slice(0, upcomingVisibleCount);
  const resetVisibleCounts = () => {
    setVisibleCount(4);
    setUpcomingVisibleCount(4);
  };
  const activeFilterCount = Number(selectedSeason !== "all") + Number(selectedDivision !== "all");
  const applyFilters = () => {
    setSelectedSeason(draftSeason);
    setSelectedDivision(draftDivision);
    resetVisibleCounts();
    setFilterOpen(false);
  };

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

          {loading && <p className="text-center text-muted-foreground py-12">Laddar matcher…</p>}

          {error && (
            <p className="text-center text-destructive py-12">Kunde inte ladda matcher: {error}</p>
          )}

          {!loading && !error && (
            <Tabs defaultValue="upcoming" className="w-full">
              <div className="mb-8 flex items-center gap-3">
                <TabsList
                  aria-label="Matchvy"
                  className="h-auto flex-1 justify-start gap-1 rounded-xl border border-border bg-card p-1"
                >
                  <TabsTrigger
                    value="upcoming"
                    className="min-h-10 flex-1 rounded-lg px-3 font-display text-xs font-bold uppercase tracking-wider data-[state=active]:bg-primary data-[state=active]:text-primary-foreground sm:text-sm"
                  >
                    Kommande matcher
                  </TabsTrigger>
                  <TabsTrigger
                    value="results"
                    className="min-h-10 flex-1 rounded-lg px-3 font-display text-xs font-bold uppercase tracking-wider data-[state=active]:bg-primary data-[state=active]:text-primary-foreground sm:text-sm"
                  >
                    Resultat
                  </TabsTrigger>
                </TabsList>

                <Dialog
                  open={filterOpen}
                  onOpenChange={(open) => {
                    if (open) {
                      setDraftSeason(selectedSeason);
                      setDraftDivision(selectedDivision);
                    }
                    setFilterOpen(open);
                  }}
                >
                  <DialogTrigger asChild>
                    <button
                      type="button"
                      aria-label="Filtrera matcher"
                      title="Filtrera matcher"
                      className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-border bg-card text-foreground transition-colors hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    >
                      <Filter size={18} />
                      {activeFilterCount > 0 && (
                        <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
                          {activeFilterCount}
                        </span>
                      )}
                    </button>
                  </DialogTrigger>
                  <DialogContent className="border-border bg-card text-foreground">
                    <DialogHeader>
                      <DialogTitle className="font-display text-xl font-bold">
                        Filtrera matcher
                      </DialogTitle>
                      <DialogDescription>
                        Välj säsong och division. Filtren gäller både kommande matcher och resultat.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-5 py-3">
                      <div>
                        <label
                          htmlFor="match-season"
                          className="mb-2 block text-xs font-bold uppercase tracking-widest text-muted-foreground"
                        >
                          Säsong
                        </label>
                        <select
                          id="match-season"
                          value={draftSeason}
                          onChange={(event) => {
                            const season = event.target.value;
                            setDraftSeason(season);
                            if (
                              draftDivision !== "all" &&
                              !getDivisionsForSeason(season).includes(draftDivision)
                            ) {
                              setDraftDivision("all");
                            }
                          }}
                          className="w-full rounded-lg border border-border bg-input px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                        >
                          <option value="all">Alla säsonger</option>
                          {seasons.map((season) => (
                            <option key={season} value={season}>
                              {season}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label
                          htmlFor="match-division"
                          className="mb-2 block text-xs font-bold uppercase tracking-widest text-muted-foreground"
                        >
                          Division
                        </label>
                        <select
                          id="match-division"
                          value={draftDivision}
                          onChange={(event) => setDraftDivision(event.target.value)}
                          className="w-full rounded-lg border border-border bg-input px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                        >
                          <option value="all">Alla divisioner</option>
                          {draftDivisions.map((division) => (
                            <option key={division} value={division}>
                              {division}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <DialogFooter className="gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setDraftSeason("all");
                          setDraftDivision("all");
                        }}
                        className="rounded-lg border border-border px-4 py-2 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
                      >
                        Rensa
                      </button>
                      <button
                        type="button"
                        onClick={applyFilters}
                        className="rounded-lg bg-primary px-4 py-2 text-sm font-bold text-primary-foreground transition-opacity hover:opacity-90"
                      >
                        Visa matcher
                      </button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>

              <TabsContent value="upcoming" className="mt-0">
                {visibleUpcoming.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    {upcoming.length === 0
                      ? "Inga kommande matcher i nuläget."
                      : "Inga kommande matcher matchar filtren."}
                  </p>
                ) : (
                  <>
                    <div className="grid sm:grid-cols-2 gap-4">
                      {visibleUpcoming.map((m, i) => (
                        <MatchCard key={m.gameId} {...m} index={i} />
                      ))}
                    </div>

                    {upcomingVisibleCount < filteredUpcoming.length && (
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
              </TabsContent>

              <TabsContent value="results" className="mt-0">
                {visiblePlayed.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    {played.length === 0
                      ? "Inga spelade matcher att visa."
                      : "Inga spelade matcher matchar filtren."}
                  </p>
                ) : (
                  <>
                    <div className="grid sm:grid-cols-2 gap-4">
                      {visiblePlayed.map((m, i) => (
                        <MatchCard key={m.gameId} {...m} index={i} />
                      ))}
                    </div>

                    {visibleCount < filteredPlayed.length && (
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
              </TabsContent>
            </Tabs>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
