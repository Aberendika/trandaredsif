import { motion } from "framer-motion";

interface MatchCardProps {
  homeTeam: string;
  homeLogo: string;
  homeScore: number | null;
  awayTeam: string;
  awayLogo: string;
  awayScore: number | null;
  date: string;
  league: string;
  played?: boolean;
  index?: number;
}

export function MatchCard({
  homeTeam,
  homeLogo,
  homeScore,
  awayTeam,
  awayLogo,
  awayScore,
  date,
  league,
  played = false,
  index = 0,
}: MatchCardProps) {
  const isTIF = (name: string) => name.includes("Trandareds");
  const hasScore = played && homeScore !== null && awayScore !== null;
  const scoreLabel = hasScore ? `${homeScore} - ${awayScore}` : "-";
  const tifWon =
    hasScore &&
    ((isTIF(homeTeam) && (homeScore as number) > (awayScore as number)) ||
      (isTIF(awayTeam) && (awayScore as number) > (homeScore as number)));
  const isDraw = hasScore && homeScore === awayScore;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="bg-card border border-border rounded-xl p-5 hover:border-primary/30 transition-colors"
    >
      <div className="flex items-center justify-between gap-4">
        {/* Home */}
        <div className="flex-1 flex flex-col items-center text-center gap-2">
          <img src={homeLogo} alt={homeTeam} className="w-10 h-10 object-contain" />
          <span className={`text-xs font-bold ${isTIF(homeTeam) ? "text-primary" : "text-foreground"}`}>
            {homeTeam}
          </span>
        </div>

        {/* Score */}
        <div className="flex flex-col items-center gap-1">
          <div
            className={`font-display text-3xl font-bold tracking-tight ${
              tifWon ? "text-primary" : isDraw ? "text-muted-foreground" : "text-foreground"
            }`}
          >
            {scoreLabel}
          </div>
        </div>

        {/* Away */}
        <div className="flex-1 flex flex-col items-center text-center gap-2">
          <img src={awayLogo} alt={awayTeam} className="w-10 h-10 object-contain" />
          <span className={`text-xs font-bold ${isTIF(awayTeam) ? "text-primary" : "text-foreground"}`}>
            {awayTeam}
          </span>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-border text-center">
        <p className="text-xs text-muted-foreground">{date}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{league}</p>
      </div>
    </motion.div>
  );
}
