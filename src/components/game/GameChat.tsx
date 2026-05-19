'use client';

import { GameMessage } from '@/types/game';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useEffect, useRef } from 'react';
import { Bot, User, Info } from 'lucide-react';

interface GameChatProps {
  messages: GameMessage[];
  isLoading?: boolean;
}

export function GameChat({ messages, isLoading }: GameChatProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  return (
    <div className="flex flex-col h-full">
      <div className="text-[10px] text-gray-500 uppercase tracking-wider font-mono px-3 py-1.5 border-b border-gray-800">
        Game Narration
      </div>
      <ScrollArea className="flex-1">
        <div className="p-3 space-y-3">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex gap-2 ${msg.role === 'player' ? 'flex-row-reverse' : ''}`}>
              <div className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center
                ${msg.role === 'ai' ? 'bg-red-900/50 border border-red-800' : 
                  msg.role === 'player' ? 'bg-emerald-900/50 border border-emerald-800' : 
                  'bg-gray-800 border border-gray-700'}`}>
                {msg.role === 'ai' ? <Bot size={12} className="text-red-400" /> : 
                 msg.role === 'player' ? <User size={12} className="text-emerald-400" /> :
                 <Info size={12} className="text-gray-400" />}
              </div>
              <div className={`flex-1 rounded-lg p-2.5 text-sm leading-relaxed max-w-[85%]
                ${msg.role === 'ai' ? 'bg-gray-900/80 border border-gray-800 text-gray-200' :
                  msg.role === 'player' ? 'bg-emerald-950/50 border border-emerald-900/50 text-gray-200' :
                  'bg-blue-950/30 border border-blue-900/30 text-blue-200'}`}>
                {msg.content}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-2">
              <div className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center bg-red-900/50 border border-red-800">
                <Bot size={12} className="text-red-400" />
              </div>
              <div className="bg-gray-900/80 border border-gray-800 rounded-lg p-2.5">
                <div className="flex gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      </ScrollArea>
    </div>
  );
}
