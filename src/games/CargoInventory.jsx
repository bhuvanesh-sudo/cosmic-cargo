import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BackButton from '../components/BackButton.jsx';

// SVG Crystal (energy crystal for cargo bay)
function Crystal({ index, delay = 0 }) {
    const hues = ['#2dd4bf', '#60a5fa', '#a78bfa', '#fbbf24', '#f472b6', '#22d3ee'];
    const color = hues[index % hues.length];
    return (
        <motion.div
            initial={{ y: -60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay, duration: 0.4, type: 'spring', stiffness: 180 }}
        >
            <svg width="44" height="52" viewBox="0 0 44 52" fill="none" aria-hidden="true">
                <polygon points="22,2 40,14 40,38 22,50 4,38 4,14"
                    fill={color} fillOpacity="0.18" stroke={color} strokeWidth="1.8" />
                <polygon points="22,10 34,18 34,36 22,44 10,36 10,18"
                    fill={color} fillOpacity="0.55" />
                <polygon points="22,10 28,14 28,22 22,26 16,22 16,14"
                    fill="white" opacity="0.28" />
                <line x1="22" y1="2" x2="22" y2="50" stroke={color} strokeWidth="0.8" opacity="0.35" />
            </svg>
        </motion.div>
    );
}

export default function CargoInventory({ level, onAwardPoints, onBack }) {
    const [count, setCount] = useState(null);
    const [selected, setSelected] = useState(null);
    const [phase, setPhase] = useState('counting');
    const [loading, setLoading] = useState(true);
    const [wrongAnim, setWrongAnim] = useState(null);

    const fetchProblem = useCallback(async () => {
        setLoading(true);
        setPhase('counting');
        setSelected(null);
        setWrongAnim(null);
        try {
            const res = await fetch(`/api/games/counting?level=${level}`);
            const data = await res.json();
            setCount(data.count);
        } catch {
            const max = level === 1 ? 5 : 10;
            setCount(Math.floor(Math.random() * max) + 1);
        } finally {
            setLoading(false);
        }
    }, [level]);

    useEffect(() => { fetchProblem(); }, [fetchProblem]);

    const max = level === 1 ? 5 : level === 2 ? 10 : 15;
    const keypadNums = Array.from({ length: max }, (_, i) => i + 1);

    const handleSelect = useCallback((n) => {
        if (phase !== 'counting') return;
        setSelected(n);
        if (n === count) {
            setPhase('success');
            onAwardPoints(level * 5);
            setTimeout(() => fetchProblem(), 2000);
        } else {
            setWrongAnim(n);
            setTimeout(() => { setWrongAnim(null); setSelected(null); }, 600);
        }
    }, [phase, count, level, onAwardPoints, fetchProblem]);

    if (loading || count === null) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="font-orbitron text-neon-cyan animate-pulseGlow text-glow-cyan">
                    Loading cargo...
                </p>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col px-4 py-5">
            <div className="flex items-center justify-between mb-6">
                <BackButton onBack={onBack} />
                <div className="font-orbitron text-base font-bold text-neon-cyan text-glow-cyan">
                    CARGO BAY INVENTORY
                </div>
                <div className="w-16" />
            </div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="glass rounded-2xl p-4 mb-6 text-center">
                <p className="text-star-dim text-sm font-inter">
                    Count the energy crystals in the cargo bay, then select the correct number
                </p>
            </motion.div>

            {/* Cargo Bay */}
            <div className="glass rounded-2xl p-5 mb-6">
                <div className="flex flex-wrap gap-3 justify-center min-h-[100px] items-end">
                    {Array.from({ length: count }, (_, i) => (
                        <Crystal key={i} index={i} delay={i * 0.06} />
                    ))}
                </div>
                {phase === 'success' && (
                    <motion.div initial={{ height: 0 }} animate={{ height: 12 }}
                        className="mt-3 mx-auto w-3/4 rounded-full bg-neon-green/40" />
                )}
            </div>

            {/* Keypad */}
            <div className="flex flex-col items-center gap-3">
                <p className="text-star-dim text-xs font-inter uppercase tracking-widest">
                    How many crystals?
                </p>
                <div className="flex flex-wrap gap-2 justify-center max-w-sm">
                    {keypadNums.map((n) => (
                        <motion.button
                            key={n}
                            onClick={() => handleSelect(n)}
                            animate={wrongAnim === n ? { x: [-5, 5, -4, 4, 0] } : {}}
                            transition={{ duration: 0.4 }}
                            disabled={phase !== 'counting'}
                            className={`
                w-12 h-12 rounded-xl font-orbitron font-bold text-lg
                glass-light border transition-all duration-150
                focus:outline-none focus:ring-2 focus:ring-neon-cyan/40
                ${phase === 'success' && n === count
                                    ? 'border-neon-green/60 text-neon-green'
                                    : wrongAnim === n ? 'border-neon-gold/60 text-neon-gold'
                                        : 'border-neon-cyan/25 text-star-white hover:border-neon-cyan/60 hover:scale-105'}
              `}
                        >
                            {n}
                        </motion.button>
                    ))}
                </div>

                <AnimatePresence>
                    {phase === 'success' && (
                        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                            className="font-orbitron text-xl text-neon-green text-glow-green font-bold">
                            💎 Cargo Secured! +{level * 5} ⚡
                        </motion.p>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
