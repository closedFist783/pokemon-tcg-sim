# Pokémon TCG Simulator

A Pokémon Trading Card Game simulator powered by Claude AI, featuring chess.com-style post-game analysis.

## Features

- 🤖 **Claude AI Game Engine** — Full rules enforcement, card effects, and strategic AI opponent
- ♟️ **Chess.com-style Review** — Post-game analysis with eval bars, move ratings (Brilliant to Blunder), and accuracy scores
- ⚡ **Live Eval Bar** — Real-time advantage tracking throughout the game
- 🎴 **Full Board State** — Active Pokémon, bench, hand, energy, damage, and special conditions tracked
- 📊 **Move History** — Complete turn-by-turn log with eval changes
- 🌑 **OLED Dark Theme** — Deep black chess.com-inspired UI

## Tech Stack

- **Next.js 16** (App Router) + TypeScript
- **shadcn/ui** (Base UI components)
- **Tailwind CSS v4**
- **Anthropic SDK** (Claude claude-opus-4-5)
- **Recharts** (Eval graph)
- **lucide-react** (Icons)

## Setup

```bash
npm install
```

Create `.env.local`:
```
ANTHROPIC_API_KEY=your_anthropic_api_key_here
```

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Game Flow

1. **Home** (`/`) — Landing page with "New Game" CTA
2. **Game** (`/game`) — Full board with active Pokémon, bench, hand, eval bar, and chat narration
3. **Review** (`/review`) — Post-game analysis with eval graph, move ratings, and accuracy scores

## How to Play

1. Click **New Game** — Claude generates both decks and sets up the board
2. Use the action panel to make moves (attack, attach energy, play trainers, end turn)
3. Type custom actions in the text input for anything not shown
4. After the game ends, view your chess.com-style review

## Architecture

- `/src/types/game.ts` — Core TypeScript types
- `/src/lib/gamePrompts.ts` — Claude system prompts for game engine and review
- `/src/app/api/game/` — API routes (start, action, review)
- `/src/components/game/` — Game UI components
- `/src/app/game/` — Active game page with state management
- `/src/app/review/` — Post-game review page
