import React from 'react';
import { Globe, Cpu, ShieldCheck } from 'lucide-react';

/**
 * CrackTimeCard Component
 * Displays estimated crack times across 3 distinct attack scenarios.
 *
 * @param {Object} props
 * @param {Object} props.crackTime - Output crackTime object from analyzePassword()
 */
export default function CrackTimeCard({ crackTime }) {
  const { onlineThrottled, offlineFastHash, offlineSlowHash } = crackTime;

  const scenarios = [
    {
      id: 'online',
      title: 'Online Throttled',
      rate: '100 guesses / sec',
      estimate: onlineThrottled.formatted,
      color: 'text-neon-cyan',
      borderColor: 'border-neon-cyan/20',
      icon: <Globe className="w-3.5 h-3.5 text-neon-cyan" />,
      desc: 'Typical web login with rate limits & lockout defense.',
    },
    {
      id: 'fast-gpu',
      title: 'Offline Fast Hash',
      rate: '10B guesses / sec',
      estimate: offlineFastHash.formatted,
      color: 'text-neon-violet',
      borderColor: 'border-neon-violet/20',
      icon: <Cpu className="w-3.5 h-3.5 text-neon-violet" />,
      desc: 'Multi-GPU cluster cracking MD5 / SHA-256 leaks.',
    },
    {
      id: 'slow-bcrypt',
      title: 'Offline Slow Hash',
      rate: '10,000 guesses / sec',
      estimate: offlineSlowHash.formatted,
      color: 'text-emerald-400',
      borderColor: 'border-emerald-500/20',
      icon: <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />,
      desc: 'Adaptive salted Bcrypt with work factor 10.',
    },
  ];

  return (
    <div className="space-y-2.5 w-full">
      <div className="flex items-center justify-between text-xs font-mono text-slate-400">
        <span>TIME-TO-CRACK PROJECTION</span>
        <span>BRUTE-FORCE RESISTANCE</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {scenarios.map((s) => (
          <div
            key={s.id}
            className={`p-3.5 rounded-2xl bg-[#0B0F1E]/60 border ${s.borderColor} backdrop-blur-md flex flex-col justify-between space-y-2 transition-all hover:border-white/20`}
          >
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-xs font-heading font-semibold text-slate-200">
                {s.icon}
                {s.title}
              </span>
              <span className="text-[10px] font-mono text-slate-400">{s.rate}</span>
            </div>

            <div>
              <div className="text-[10px] font-mono text-slate-400">ESTIMATED TIME</div>
              <div className={`text-base font-mono font-bold tracking-tight ${s.color}`}>
                {s.estimate}
              </div>
            </div>

            <p className="text-[10px] text-slate-400 leading-tight border-t border-white/5 pt-1.5">
              {s.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
