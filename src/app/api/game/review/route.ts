import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { REVIEW_SYSTEM_PROMPT } from '@/lib/gamePrompts';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { gameState } = body;

    const moveLogText = gameState.moveLog
      .map((m: { turnNumber: number; player: string; action: string; evalBefore: number; evalAfter: number }) => 
        `Turn ${m.turnNumber} [${m.player}]: ${m.action} (eval: ${m.evalBefore} → ${m.evalAfter})`
      )
      .join('\n');

    const prompt = `Review this completed Pokémon TCG game.

Winner: ${gameState.winner}
Total turns: ${gameState.turnNumber}

Move log:
${moveLogText}

Final SKIP state:
${gameState.skipData}

Eval history: ${gameState.evalHistory.join(', ')}

Please provide a comprehensive chess.com-style analysis of this game.`;

    const response = await client.messages.create({
      model: 'claude-opus-4-5',
      max_tokens: 4096,
      system: REVIEW_SYSTEM_PROMPT,
      messages: [{ role: 'user', content: prompt }],
    });

    const content = response.content[0];
    if (content.type !== 'text') {
      throw new Error('Unexpected response type');
    }

    const jsonMatch = content.text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON found in response');
    }

    const parsed = JSON.parse(jsonMatch[0]);

    return NextResponse.json({
      ...parsed,
      gameId: gameState.gameId,
      winner: gameState.winner,
      evalHistory: gameState.evalHistory,
    });
  } catch (error) {
    console.error('Review error:', error);
    return NextResponse.json(
      { error: 'Failed to generate review', details: String(error) },
      { status: 500 }
    );
  }
}
