import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BackButton from '../components/BackButton.jsx';

// SVG Planet with orbiting moons
function Planet({ count, color, label }) {
    const moons = Array.from({ length: count }, (_, i) => {
        const angle = (i / count) * Math.PI * 2;
        const rx = 52, ry = 22;
        const x = 70 + rx * Math.cos(angle);
        const y = 70 + ry * Math.sin(angle);
        return { x, y };
    });

    return (
        <div className="flex flex-col items-center gap-3">
            <p className="text-star-dim text-xs font-inter uppercase tracking-widest">{label}</p>
            <svg width="140" height="140" viewBox="0 0 140 140" fill="none" aria-label={`Planet with ${count} moons`}>
                {/* Orbit ring */}
                <ellipse cx="70" cy="70" rx="52" ry="22" stroke={color} strokeWidth="1"
                    strokeDasharray="4 3" opacity="0.35" />
                {/* Planet body */}
                <circle cx="70" cy="70" r="28" fill="#0f1f3d" stroke={color} strokeWidth="2" />
                <circle cx="70" cy="70" r="24" fill="#162952" />
                {/* Planet surface lines */}
                <ellipse cx="70" cy="64" rx="16" ry="5" fill="none" stroke={color} strokeWidth="0.8" opacity="0.4" />
                <ellipse cx="70" cy="74" rx="12" ry="4" fill="none" stroke={color} strokeWidth="0.8" opacity="0.3" />
                {/* Planet icon / count */}
                <text x="70" y="75" textAnchor="middle" dominantBaseline="middle"
                    fill="white" fontFamily="Orbitron, monospace" fontWeight="bold" fontSize="20">
                    {count}
                </text>
                {/* Moons */}
                {moons.map((m, i) => (
                    <circle key={i} cx={m.x} cy={m.y} r="7"
                        fill="#0a1628" stroke={color} strokeWidth="1.5" />
                ))}
            </svg>
        </div>
    );
}

// Comparison symbol button
function SymbolButton({ symbol, onClick, selected, correct }) {
    const colorMap = {
        '>': 'neon-blue',
        '<': 'neon-purple',
        '=': 'neon-teal',
    };
    const base = colorMap[symbol] || 'neon-blue';
    return (
        <motion.button
            onClick={() => onClick(symbol)}
            whileHover={{ scale: 1.12 }}
            whileTap={{ scale: 0.92 }}
            aria-label={`Select ${symbol === '>' ? 'greater than' : symbol === '<' ? 'less than' : 'equal to'}`}
            className={`
        w-16 h-16 rounded-2xl font-orbitron text-3xl font-bold
        glass-light border transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-neon-blue/40
        ${selected && correct
                    ? 'border-neon-green/60 text-neon-green glow-green'
                    : selected && !correct
                        ? 'border-neon-gold/60 text-neon-gold'
                        : `border-${base}/30 text-${base} hover:border-${base}/70 hover:scale-105`}
      `}
        >
            {symbol}
        </motion.button>
    );
}

export default function OrbitingMoons({ level, onAwardPoints, onBack }) {
    const [problem, setProblem] = useState(null);
    const [selected, setSelected] = useState(null);
    const [phase, setPhase] = useState('playing');
    const [loading, setLoading] = useState(true);

    const fetchProblem = useCallback(async () => {
        setLoading(true);
        setPhase('playing');
        setSelected(null);
        try {
            const res = await fetch(`/api/games/comparison?level=${level}`);
            setProblem(await res.json());
        } catch {
            const max = level === 1 ? 5 : 10;
            const left = Math.floor(Math.random() * max) + 1;
            const right = Math.floor(Math.random() * max) + 1;
            const answer = left > right ? '>' : left < right ? '<' : '=';
            setProblem({ left, right, answer });
        } finally {
            setLoading(false);
        }
    }, [level]);

    useEffect(() => { fetchProblem(); }, [fetchProblem]);

    const handleSymbol = useCallback((sym) => {
        if (phase !== 'playing') return;
        setSelected(sym);
        if (sym === problem.answer) {
            setPhase('success');
            onAwardPoints(level * 5);
            setTimeout(() => fetchProblem(), 2000);
        } else {
            setPhase('wrong');
            setTimeout(() => { setSelected(null); setPhase('playing'); }, 700);
        }
    }, [phase, problem, level, onAwardPoints, fetchProblem]);

    if (loading || !problem) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="font-orbitron text-neon-purple animate-pulseGlow text-glow-purple">
                    Scanning planets...
                </p>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col px-4 py-5">
            <div className="flex items-center justify-between mb-6">
                <BackButton onBack={onBack} />
                <div className="font-orbitron text-base font-bold text-neon-purple text-glow-purple">
                    ORBITING MOONS
                </div>
                <div className="w-16" />
            </div>

            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                className="glass rounded-2xl p-4 mb-6 text-center">
                <p className="text-star-dim text-sm font-inter">
                    Which planet has more orbiting moons? Place the correct symbol in the centre.
                </p>
            </motion.div>

            <div className="flex-1 flex flex-col items-center justify-center gap-8">
                {/* Planets row */}
                <div className="flex items-center justify-center gap-6 sm:gap-12 flex-wrap">
                    <Planet count={problem.left} color="#60a5fa" label="Planet A" />

                    {/* Centre symbol slot */}
                    <div className="flex flex-col items-center gap-2">
                        <div className={`
              w-16 h-16 rounded-2xl glass-light border-2 flex items-center justify-center
              font-orbitron text-3xl font-bold transition-all duration-300
              ${phase === 'success' ? 'border-neon-green text-neon-green glow-green'
                                : phase === 'wrong' ? 'border-neon-gold text-neon-gold'
                                    : 'border-space-400 text-star-dim'}
            `}
                            role="status"
                            aria-label={selected ? `Selected: ${selected}` : 'Empty comparison slot'}
                        >
                            {selected ?? '?'}
                        </div>
                        <p className="text-star-dim text-[10px] font-inter uppercase tracking-widest">
                            {phase === 'success' ? (
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                    <polyline points="5,12 10,17 20,7" stroke="#39d353" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            ) : null}
                            {phase === 'success' ? 'Correct' : phase === 'wrong' ? 'Try again' : 'Drop here'}
                        </p>
                    </div>

                    <Planet count={problem.right} color="#a78bfa" label="Planet B" />
                </div>

                {/* Symbol buttons */}
                <div className="flex gap-4 justify-center" role="group" aria-label="Comparison symbols">
                    {['<', '=', '>'].map((sym) => (
                        <SymbolButton
                            key={sym}
                            symbol={sym}
                            onClick={handleSymbol}
                            selected={selected === sym}
                            correct={phase === 'success'}
                        />
                    ))}
                </div>

                <AnimatePresence>
                    {phase === 'success' && (
                        <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                            className="font-orbitron text-xl text-neon-green text-glow-green font-bold flex items-center gap-2 justify-center">
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                <path d="M21 12.79A9 9 0 1111.21 3a7 7 0 009.79 9.79z" fill="#a78bfa" fillOpacity="0.35" stroke="#a78bfa" strokeWidth="1.8" strokeLinejoin="round" />
                            </svg>
                            Correct! +{level * 5}
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                <polygon points="13,2 3,14 12,14 11,22 21,10 12,10" fill="#fbbf24" stroke="#fbbf24" strokeWidth="1.5" strokeLinejoin="round" />
                            </svg>
                        </motion.p>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
