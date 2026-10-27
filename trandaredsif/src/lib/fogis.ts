// Svensk Fotboll – Förening API
// API key is read from environment (set VITE_FOGIS_API_KEY in your .env / Vercel project settings)
const FOGIS_API_KEY = import.meta.env.VITE_FOGIS_API_KEY ?? "10ccf478711248949db96516f971a0b8";
const BASE_URL = "https://forening-api.svenskfotboll.se";

export interface FogisGame {
  gameId: number;
  homeTeamName: string;
  awayTeamName: string;
  goalsScoredHomeTeam: number | null;
  goalsScoredAwayTeam: number | null;
  time: string;
  competitionName: string;
  result: string | null;
  homeTeamImageUrl: string;
  awayTeamImageUrl: string;
}

export interface NormalizedMatch {
  gameId: number;
  homeTeam: string;
  homeLogo: string;
  homeScore: number | null;
  awayTeam: string;
  awayLogo: string;
  awayScore: number | null;
  date: string;
  rawDate: string;
  league: string;
  played: boolean;
}

const formatDate = (iso: string) => {
  try {
    const d = new Date(iso);
    return d.toLocaleString("sv-SE", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
};

const normalize = (g: FogisGame): NormalizedMatch => ({
  gameId: g.gameId,
  homeTeam: g.homeTeamName,
  homeLogo: g.homeTeamImageUrl,
  homeScore: g.goalsScoredHomeTeam,
  awayTeam: g.awayTeamName,
  awayLogo: g.awayTeamImageUrl,
  awayScore: g.goalsScoredAwayTeam,
  date: formatDate(g.time),
  rawDate: g.time,
  league: g.competitionName,
  played: new Date(g.time) < new Date(),
});

export async function fetchMatches(): Promise<{
  played: NormalizedMatch[];
  upcoming: NormalizedMatch[];
}> {
  const from = "2024-01-01";
  const to = "2030-12-31";
  const url = `${BASE_URL}/club/upcoming-games?from=${from}&to=${to}&w=3&take=1000&includeCanceled=true`;

  const res = await fetch(url, {
    method: "GET",
    headers: { ApiKey: FOGIS_API_KEY },
  });

  if (!res.ok) throw new Error(`Kunde inte hämta matcher (${res.status})`);

  const data = await res.json();
  const games: FogisGame[] = data.games ?? [];
  const all = games.map(normalize);

  const played = all
    .filter((m) => m.played)
    .sort((a, b) => new Date(b.rawDate).getTime() - new Date(a.rawDate).getTime());

  const upcoming = all
    .filter((m) => !m.played)
    .sort((a, b) => new Date(a.rawDate).getTime() - new Date(b.rawDate).getTime());

  return { played, upcoming };
}
