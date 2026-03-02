import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BackButton from '../components/BackButton.jsx';

function SatelliteSVG({ value, isBlank, isSelected }) {
    return (
        <div className="flex flex-col items-center gap-1">
            <svg width="56" height="64" viewBox="0 0 56 64" fill="none" aria-hidden="true">
                {/* Solar panel left */}
                <rect x="2" y="22" width="14" height="22" rx="2"
                    fill={isBlank ? '#162952' : '#1d3461'} stroke="#60a5fa" strokeWidth="1" />
                {/* Solar panel right */}
                <rect x="40" y="22" width="14" height="22" rx="2"
                    fill={isBlank ? '#162952' : '#1d3461'} stroke="#60a5fa" strokeWidth="1" />
                {/* Body */}
                <rect x="16" y="18" width="24" height="30" rx="5"
                    fill={isSelected ? '#1d3461' : isBlank ? '#0a1628' : '#0f1f3d'}
                    stroke={isSelected ? '#39d353' : isBlank ? '#a78bfa' : '#60a5fa'}
                    strokeWidth="1.8" />
                {/* Antenna */}
                <line x1="28" y1="18" x2="28" y2="6" stroke="#60a5fa" strokeWidth="1.2" />
                <circle cx="28" cy="5" r="3" fill="#2dd4bf" />
                {/* Value or blank */}
                {isBlank ? (
                    <text x="28" y="37" textAnchor="middle" dominantBaseline="middle"
                        fill="#a78bfa" fontFamily="Orbitron, monospace" fontWeight="bold" fontSize="14">?</text>
                ) : (
                    <text x="28" y="37" textAnchor="middle" dominantBaseline="middle"
                        fill="white" fontFamily="Orbitron, monospace" fontWeight="bold" fontSize="14">
                        {value}
                    </text>
                )}
            </svg>
        </div>
    );
}

export default function SatelliteSequencing({ level, onAwardPoints, onBack }) {
    const [problem, setProblem] = useState(null);
    const [selected, setSelected] = useState(null);
    const [phase, setPhase] = useState('playing');
    const [loading, setLoading] = useState(true);
    const [wrongChoice, setWrongChoice] = useState(null);

    const fetchProblem = useCallback(async () => {
        setLoading(true);
        setPhase('playing');
        setSelected(null);
        setWrongChoice(null);
        try {
            const res = await fetch(`/api/games/sequence?level=${level}`);
            setProblem(await res.json());
        } catch {
            const step = [1, 2, 5][Math.floor(Math.random() * 3)];
            const start = Math.floor(Math.random() * 5) + 1;
            const seq = Array.from({ length: 5 }, (_, i) => start + i * step);
            const blankIdx = 2;
            const answer = seq[blankIdx];
            const choices = [answer, answer + step, answer - step].sort(() => Math.random() - 0.5);
            setProblem({ sequence: seq, blankIndex: blankIdx, answer, choices, step });
        } finally {
            setLoading(false);
        }
    }, [level]);

    useEffect(() => { fetchProblem(); }, [fetchProblem]);

    const handleChoice = useCallback((val) => {
        if (phase !== 'playing') return;
        setSelected(val);
        if (val === problem.answer) {
            setPhase('success');
            onAwardPoints(level * 5);
            setTimeout(() => fetchProblem(), 2200);
        } else {
            setWrongChoice(val);
            setTimeout(() => { setWrongChoice(null); setSelected(null); }, 600);
        }
    }, [phase, problem, level, onAwardPoints, fetchProblem]);

    if (loading || !problem) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="font-orbitron text-neon-blue animate-pulseGlow text-glow-blue">
                    Scanning satellites...
                </p>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col px-4 py-5">
            <div className="flex items-center justify-between mb-6">
                <BackButton onBack={onBack} />
                <div className="font-orbitron text-base font-bold text-neon-blue text-glow-blue">
                    SATELLITE SEQUENCING
                </div>
                <div className="w-16" />
            </div>

            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                className="glass rounded-2xl p-4 mb-6 text-center">
                <p className="text-star-dim text-sm font-inter">Find the missing number in the sequence</p>
                <p className="text-xs text-neon-blue/60 font-inter mt-1">
                    Pattern: counting by {problem.step}s
                </p>
            </motion.div>

            {/* Satellite row */}
            <div className="flex-1 flex flex-col items-center justify-center gap-8">
                <div className="flex items-center gap-2 sm:gap-4 flex-wrap justify-center">
                    {problem.sequence.map((val, i) => {
                        const isBlank = i === problem.blankIndex;
                        const isSelected = isBlank && selected === problem.answer && phase === 'success';
                        return (
                            <div key={i} className="flex items-center gap-2">
                                <SatelliteSVG value={val} isBlank={isBlank} isSelected={isSelected} />
                                {/* Connecting laser */}
                                {i < problem.sequence.length - 1 && (
                                    <motion.div
                                        className="h-0.5 w-8 rounded-full"
                                        style={{
                                            background: phase === 'success'
                                                ? 'linear-gradient(90deg, #39d353, #60a5fa)'
                                                : 'rgba(96,165,250,0.25)',
                                        }}
                                        animate={phase === 'success' ? { opacity: [0.4, 1, 0.4] } : {}}
                                        transition={{ duration: 1.2, repeat: Infinity }}
                                    />
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Choices */}
                <div className="flex gap-4 justify-center">
                    {problem.choices.map((c) => (
                        <motion.button
                            key={c}
                            onClick={() => handleChoice(c)}
                            animate={wrongChoice === c ? { x: [-5, 5, -4, 4, 0] } : {}}
                            transition={{ duration: 0.4 }}
                            disabled={phase !== 'playing'}
                            className={`
                w-16 h-16 rounded-2xl font-orbitron text-2xl font-bold
                glass-light border  transition-all duration-200
                focus:outline-none focus:ring-2 focus:ring-neon-blue/40
                ${phase === 'success' && c === problem.answer
                                    ? 'border-neon-green/60 text-neon-green glow-green'
                                    : wrongChoice === c
                                        ? 'border-neon-gold/60 text-neon-gold'
                                        : 'border-neon-blue/25 text-star-white hover:border-neon-blue/60 hover:scale-105'}
              `}
                        >
                            {c}
                        </motion.button>
                    ))}
                </div>

                <AnimatePresence>
                    {phase === 'success' && (
                        <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                            className="font-orbitron text-xl text-neon-green text-glow-green font-bold flex items-center gap-2 justify-center">
                            <svg width="22" height="22" viewBox="0 0 56 64" fill="none" aria-hidden="true">
                                <rect x="2" y="22" width="14" height="22" rx="2" fill="#1d3461" stroke="#39d353" strokeWidth="1" />
                                <rect x="40" y="22" width="14" height="22" rx="2" fill="#1d3461" stroke="#39d353" strokeWidth="1" />
                                <rect x="16" y="18" width="24" height="30" rx="5" fill="#0f1f3d" stroke="#39d353" strokeWidth="1.8" />
                                <line x1="28" y1="18" x2="28" y2="6" stroke="#60a5fa" strokeWidth="1.2" />
                                <circle cx="28" cy="5" r="3" fill="#2dd4bf" />
                                <text x="28" y="37" textAnchor="middle" dominantBaseline="middle" fill="white" fontFamily="Orbitron, monospace" fontWeight="bold" fontSize="14">OK</text>
                            </svg>
                            Sequence Locked! +{level * 5}
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
