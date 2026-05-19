import Link from 'next/link';
import { Sword, BarChart2, Bot, Zap, Shield, Star } from 'lucide-react';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Hero */}
      <div className="relative overflow-hidden">
        {/* Background grid */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'linear-gradient(rgba(239,68,68,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(239,68,68,0.3) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
        
        <div className="relative max-w-5xl mx-auto px-6 pt-24 pb-20 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-red-900/60 bg-red-950/30 text-red-400 text-xs font-medium mb-8">
            <Bot size={12} />
            Powered by Claude AI
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
            <span className="text-white">Pokémon TCG</span>
            <br />
            <span className="text-red-500">Simulator</span>
          </h1>

          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Play against a Claude-powered AI opponent. Get post-game analysis with
            chess.com-style move ratings, eval bars, and accuracy scores.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/game"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-red-600 hover:bg-red-500 text-white rounded-xl font-bold text-lg transition-all duration-150 cursor-pointer hover:shadow-lg hover:shadow-red-900/40"
            >
              <Sword size={20} />
              New Game
            </Link>
            <Link
              href="/review"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-gray-800 hover:bg-gray-700 text-gray-200 rounded-xl font-bold text-lg transition-all duration-150 cursor-pointer border border-gray-700 hover:border-gray-600"
            >
              <BarChart2 size={20} />
              Last Review
            </Link>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="max-w-5xl mx-auto px-6 pb-24">
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              icon: <Bot className="text-red-400" size={24} />,
              title: 'AI Game Engine',
              desc: 'Claude acts as both opponent and rules judge — managing complete game state, card effects, and strategic play.',
            },
            {
              icon: <BarChart2 className="text-blue-400" size={24} />,
              title: 'Post-Game Review',
              desc: 'Get chess.com-style analysis after every game: eval graphs, move ratings (Brilliant to Blunder), and accuracy scores.',
            },
            {
              icon: <Zap className="text-yellow-400" size={24} />,
              title: 'Real Card Rules',
              desc: 'Exact printed card details, proper type interactions, special conditions, and once-per-game effect tracking.',
            },
            {
              icon: <Shield className="text-emerald-400" size={24} />,
              title: 'Live Eval Bar',
              desc: 'See who\'s winning at a glance. The eval bar updates each turn based on prizes, board position, and energy advantage.',
            },
            {
              icon: <Star className="text-purple-400" size={24} />,
              title: 'Mixed Eras',
              desc: 'Play with classic Base Set cards alongside modern VMAX and GX cards. All eras are supported.',
            },
            {
              icon: <Sword className="text-orange-400" size={24} />,
              title: 'Full Board State',
              desc: 'Active Pokémon, benches, hand, deck, discard, prizes, energy, damage counters, and special conditions — all tracked.',
            },
          ].map((feature, i) => (
            <div
              key={i}
              className="rounded-xl border border-gray-800 bg-gray-900/30 p-6 hover:border-gray-700 transition-colors"
            >
              <div className="mb-3">{feature.icon}</div>
              <h3 className="text-white font-bold mb-2">{feature.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>

        {/* How it works */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold text-white mb-8">How It Works</h2>
          <div className="flex flex-col md:flex-row gap-4 items-start justify-center max-w-3xl mx-auto">
            {[
              { step: '01', title: 'Start a Game', desc: 'Claude generates both decks, shuffles, deals hands, and sets up the board.' },
              { step: '02', title: 'Play Turns', desc: 'Type actions or use the quick buttons. Claude enforces all rules and plays as your opponent.' },
              { step: '03', title: 'Get Reviewed', desc: 'After the game, review your moves with ratings, eval graph, and strategic insights.' },
            ].map((step, i) => (
              <div key={i} className="flex-1 text-center">
                <div className="text-4xl font-mono font-bold text-gray-800 mb-2">{step.step}</div>
                <div className="text-white font-bold mb-1">{step.title}</div>
                <div className="text-gray-500 text-sm">{step.desc}</div>
                {i < 2 && (
                  <div className="hidden md:block text-gray-700 mt-4 text-2xl">→</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
