// Core game types for Pokémon TCG Simulator

export type CardType =
  | 'Fire' | 'Water' | 'Grass' | 'Lightning' | 'Psychic'
  | 'Fighting' | 'Darkness' | 'Metal' | 'Dragon' | 'Fairy'
  | 'Colorless' | 'Normal';

export type CardStage = 'Basic' | 'Stage 1' | 'Stage 2' | 'EX' | 'GX' | 'V' | 'VMAX' | 'VSTAR';

export type SpecialCondition = 'Poisoned' | 'Burned' | 'Asleep' | 'Confused' | 'Paralyzed';

export interface Attack {
  name: string;
  cost: CardType[];
  damage: string;
  text?: string;
}

export interface Ability {
  name: string;
  text: string;
}

export interface Pokemon {
  id: string;
  name: string;
  hp: number;
  currentHp: number;
  type: CardType;
  stage: CardStage;
  evolvesFrom?: string;
  attacks: Attack[];
  ability?: Ability;
  weakness?: { type: CardType; multiplier: string };
  resistance?: { type: CardType; modifier: string };
  retreatCost: number;
  energyAttached: CardType[];
  damage: number; // damage counters
  specialConditions: SpecialCondition[];
  isEX?: boolean;
}

export interface TrainerCard {
  id: string;
  name: string;
  cardType: 'Item' | 'Supporter' | 'Stadium' | 'Tool';
  text: string;
}

export interface EnergyCard {
  id: string;
  name: string;
  type: CardType;
  isSpecial: boolean;
}

export type Card = Pokemon | TrainerCard | EnergyCard;

export interface ChoiceRequest {
  type: 'active_choice' | 'bench_choice' | 'attack_choice' | 'retreat_choice' | 'evolve_choice' | 'discard_choice' | 'prize_choice' | 'general';
  prompt: string;
  options: Array<{ id: string; label: string; description?: string }>;
  required: boolean;
}

export interface Move {
  turnNumber: number;
  player: 'player' | 'opponent';
  action: string;
  evalBefore: number;
  evalAfter: number;
  rating?: MoveRating;
  ratingLabel?: string;
}

export type MoveRating = 'brilliant' | 'best' | 'excellent' | 'good' | 'inaccuracy' | 'mistake' | 'blunder' | 'missed_win';

export interface GameMessage {
  id: string;
  role: 'system' | 'ai' | 'player';
  content: string;
  timestamp: number;
}

export interface BoardState {
  playerHand: Card[];
  playerActive: Pokemon | null;
  playerBench: Pokemon[];
  playerPrizes: number;
  playerDeckSize: number;
  playerDiscardSize: number;
  opponentActive: Pokemon | null;
  opponentBench: Pokemon[];
  opponentPrizes: number;
  opponentDeckSize: number;
  opponentDiscardSize: number;
  currentTurn: 'player' | 'opponent';
  turnNumber: number;
  activeStadium?: string;
}

export interface GameState {
  gameId: string;
  phase: 'setup' | 'playing' | 'ended';
  turnNumber: number;
  board: BoardState;
  currentEval: number; // -100 to +100
  evalHistory: number[];
  moveLog: Move[];
  messages: GameMessage[];
  awaitingChoice: ChoiceRequest | null;
  winner: 'player' | 'opponent' | null;
  skipData: string; // AI memory section
  playerDeckName: string;
  opponentDeckName: string;
}

export interface ReviewData {
  gameId: string;
  playerAccuracy: number;
  opponentAccuracy: number;
  evalHistory: number[];
  moves: ReviewMove[];
  turningPoint?: { turn: number; description: string };
  bestMove?: { turn: number; action: string; description: string };
  worstMove?: { turn: number; action: string; description: string };
  summary: string;
  winner: 'player' | 'opponent';
}

export interface ReviewMove {
  turnNumber: number;
  player: 'player' | 'opponent';
  action: string;
  rating: MoveRating;
  evalBefore: number;
  evalAfter: number;
  comment?: string;
}

// API response types
export interface StartGameResponse {
  gameId: string;
  initialState: GameState;
  narrative: string;
}

export interface ActionResponse {
  narrative: string;
  boardState: BoardState;
  awaitingChoice: ChoiceRequest | null;
  evalScore: number;
  gameOver: boolean;
  winner: 'player' | 'opponent' | null;
  skipData: string;
  moveDescription: string;
}
