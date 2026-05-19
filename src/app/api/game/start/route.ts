import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { GAME_ENGINE_SYSTEM_PROMPT, START_GAME_PROMPT } from '@/lib/gamePrompts';
import { GameState } from '@/types/game';
import { nanoid } from 'nanoid';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const response = await client.messages.create({
      model: 'claude-opus-4-5',
      max_tokens: 4096,
      system: GAME_ENGINE_SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: START_GAME_PROMPT,
        },
      ],
    });

    const content = response.content[0];
    if (content.type !== 'text') {
      throw new Error('Unexpected response type');
    }

    // Extract JSON from response
    const jsonMatch = content.text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON found in response');
    }

    const parsed = JSON.parse(jsonMatch[0]);
    const gameId = nanoid();

    const initialState: GameState = {
      gameId,
      phase: 'playing',
      turnNumber: 1,
      board: parsed.boardState || {
        playerHand: [],
        playerActive: null,
        playerBench: [],
        playerPrizes: 6,
        playerDeckSize: 53,
        playerDiscardSize: 0,
        opponentActive: null,
        opponentBench: [],
        opponentPrizes: 6,
        opponentDeckSize: 53,
        opponentDiscardSize: 0,
        currentTurn: 'player',
        turnNumber: 1,
        activeStadium: undefined,
      },
      currentEval: parsed.evalScore || 0,
      evalHistory: [parsed.evalScore || 0],
      moveLog: [],
      messages: [
        {
          id: nanoid(),
          role: 'ai',
          content: parsed.narrative || 'Game started!',
          timestamp: Date.now(),
        },
      ],
      awaitingChoice: parsed.awaitingChoice || null,
      winner: null,
      skipData: parsed.skipData || '',
      playerDeckName: parsed.playerDeckName || 'Player Deck',
      opponentDeckName: parsed.opponentDeckName || 'AI Deck',
    };

    return NextResponse.json({
      gameId,
      initialState,
      narrative: parsed.narrative,
    });
  } catch (error) {
    console.error('Start game error:', error);
    return NextResponse.json(
      { error: 'Failed to start game', details: String(error) },
      { status: 500 }
    );
  }
}
