# Deploy till Vercel

Det här projektet är förberett för deploy på både Cloudflare (Lovables standard)
och Vercel. För Vercel används `vite.config.vercel.ts` + Nitro-adaptern.

## Steg-för-steg

### 1. Pusha till GitHub
Klicka på **GitHub**-knappen uppe till höger i Lovable → **Connect to GitHub** →
skapa ett nytt repo. All kod synkas dit automatiskt.

### 2. Importera projektet i Vercel
1. Gå till https://vercel.com/new
2. Välj ditt GitHub-repo
3. **Framework Preset:** Other (lämna som är — `vercel.json` styr bygget)
4. Tryck inte Deploy än — lägg in env-variabler först (steg 3)

### 3. Lägg in Environment Variables
**Settings → Environment Variables** (välj alla tre miljöer: Production,
Preview, Development för var och en):

| Namn | Värde |
|---|---|
| `VITE_SUPABASE_URL` | `https://rglvjmoltgxrnyuoskac.supabase.co` |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJnbHZqbW9sdGd4cm55dW9za2FjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYzNDEyMzksImV4cCI6MjA5MTkxNzIzOX0.4XC7np7IEMRmEvWTpwT1kUTut-jM4_V8BkNPPWJtTJY` |
| `VITE_FOGIS_API_KEY` | `10ccf478711248949db96516f971a0b8` *(valfri — har fallback)* |

### 4. Deploy
Tryck **Deploy**. Vercel kör `npm install --legacy-peer-deps` följt av
`vite build --config vite.config.vercel.ts`. Efter ~2 min är sajten live på
`<projektnamn>.vercel.app`.

### 5. (Valfritt) Eget domännamn
**Settings → Domains** → lägg till din domän → följ DNS-instruktionerna.

## Hur fungerar det?

- `vercel.json` säger åt Vercel att bygga med Nitro-konfigen istället för
  Cloudflare-konfigen.
- `vite.config.vercel.ts` är en separat config som ersätter Lovables
  Cloudflare-plugin med Nitro, som automatiskt genererar Vercel Functions
  för SSR och server functions.
- Lovables originalfil `vite.config.ts` rörs inte — preview i Lovable
  fortsätter funka som vanligt.

## Auto-deploy
Varje push till `main` (eller default-branch) → ny deploy på Vercel.
Pull requests → preview-deploys.

## Felsökning

**"Cannot find module 'nitro/vite'"**
→ `nitro` är redan i `package.json`. Kör en ny deploy så löser det sig.

**Sajten visar bara vit sida**
→ Kolla att alla `VITE_*`-variabler är satta i Vercel. Annars kraschar
Supabase-klienten direkt vid första render.

**Bygget misslyckas med peer dependency-konflikt**
→ `--legacy-peer-deps` i `installCommand` ska redan lösa det. Om inte,
byt till `bun install` i `vercel.json`.
