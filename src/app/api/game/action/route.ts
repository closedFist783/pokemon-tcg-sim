import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { GAME_ENGINE_SYSTEM_PROMPT } from '@/lib/gamePrompts';
import { nanoid } from 'nanoid';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, gameState, conversationHistory } = body;

    // Build messages array from conversation history
    const messages = conversationHistory || [];
    
    // Add the player's action
    messages.push({
      role: 'user',
      content: `Player action: ${action}\n\nCurrent SKIP state:\n${gameState.skipData || 'Game just started'}`,
    });

    const response = await client.messages.create({
      model: 'claude-opus-4-5',
      max_tokens: 4096,
      system: GAME_ENGINE_SYSTEM_PROMPT,
      messages,
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

    return NextResponse.json({
      narrative: parsed.narrative,
      boardState: parsed.boardState,
      awaitingChoice: parsed.awaitingChoice || null,
      evalScore: parsed.evalScore || 0,
      gameOver: parsed.gameOver || false,
      winner: parsed.winner || null,
      skipData: parsed.skipData || '',
      moveDescription: parsed.moveDescription || action,
      assistantMessage: content.text,
    });
  } catch (error) {
    console.error('Game action error:', error);
    return NextResponse.json(
      { error: 'Failed to process action', details: String(error) },
      { status: 500 }
    );
  }
}
