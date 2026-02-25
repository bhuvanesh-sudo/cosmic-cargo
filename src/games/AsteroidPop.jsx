import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BackButton from '../components/BackButton.jsx';

// SVG Asteroid shapes (6 unique variants)
const ASTEROID_PATHS = [
    "M50,10 L80,25 L90,55 L70,80 L35,85 L10,65 L15,30 Z",
    "M55,8 L85,30 L85,65 L60,88 L25,80 L8,50 L20,20 Z",
    "M45,12 L75,18 L92,45 L82,75 L50,90 L18,75 L8,42 L22,18 Z",
    "M60,10 L88,35 L85,70 L58,90 L25,82 L8,55 L12,25 L38,8 Z",
    "M50,8 L80,22 L95,55 L75,85 L42,90 L12,72 L10,38 L28,12 Z",
    "M48,10 L78,20 L92,48 L85,78 L52,92 L20,80 L6,48 L18,18 Z",
];

function AsteroidSVG({ path, number, state, onClick }) {
    const isPopped = state === 'popped';
    const isShaking = state === 'shaking';

    return (
        <motion.button
            onClick={onClick}
            aria-label={`Asteroid with number ${number}`}
            animate={isShaking ? { x: [-6, 6, -4, 4, 0] } : isPopped ? { scale: [1, 1.5, 0], opacity: [1, 0.8, 0] } : { scale: 1, opacity: 1 }}
            transition={isShaking ? { duration: 0.4 } : isPopped ? { duration: 0.4 } : {}}
            className="focus:outline-none focus:ring-2 focus:ring-neon-blue/40 rounded-full"
            disabled={isPopped}
            style={{ pointerEvents: isPopped ? 'none' : 'auto' }}
        >
            <svg width="90" height="90" viewBox="0 0 100 100" fill="none">
                {/* Glow aura */}
                <ellipse cx="50" cy="50" rx="42" ry="42" fill="#a78bfa" opacity="0.06" />
                {/* Asteroid body */}
                <path d={path} fill="#162952" stroke="#a78bfa" strokeWidth="2" />
                {/* Surface craters */}
                <circle cx="30" cy="40" r="5" fill="#0f1f3d" opacity="0.6" />
                <circle cx="65" cy="65" r="4" fill="#0f1f3d" opacity="0.5" />
                {/* Number */}
                <text x="50" y="55" textAnchor="middle" dominantBaseline="middle"
                    fill="white" fontFamily="Orbitron, monospace" fontWeight="bold" fontSize="26">
                    {number}
                </text>
            </svg>
        </motion.button>
    );
}

export default function AsteroidPop({ level, onAwardPoints, onBack }) {
    const [problem, setProblem] = useState(null);
    const [states, setStates] = useState({}); // { index: 'idle' | 'popped' | 'shaking' }
    const [phase, setPhase] = useState('playing'); // 'playing' | 'success'
    const [loading, setLoading] = useState(true);

    const fetchProblem = useCallback(async () => {
        setLoading(true);
        setPhase('playing');
        try {
            const res = await fetch(`/api/games/number-id?level=${level}`);
            const data = await res.json();
            setProblem(data);
            setStates(Object.fromEntries(data.options.map((_, i) => [i, 'idle'])));
        } catch {
            // Fallback
            const max = level === 1 ? 5 : level === 2 ? 10 : 20;
            const pool = Array.from({ length: max }, (_, i) => i + 1);
            const shuffled = pool.sort(() => Math.random() - 0.5).slice(0, 6);
            const target = shuffled[Math.floor(Math.random() * 6)];
            setProblem({ target, options: shuffled });
            setStates(Object.fromEntries(shuffled.map((_, i) => [i, 'idle'])));
        } finally {
            setLoading(false);
        }
    }, [level]);

    useEffect(() => { fetchProblem(); }, [fetchProblem]);

    const handleAsteroidClick = useCallback((index, number) => {
        if (phase !== 'playing' || states[index] === 'popped') return;

        if (number === problem.target) {
            setStates((s) => ({ ...s, [index]: 'popped' }));
            setPhase('success');
            onAwardPoints(level * 5);
            setTimeout(() => fetchProblem(), 2000);
        } else {
            setStates((s) => ({ ...s, [index]: 'shaking' }));
            setTimeout(() => setStates((s) => ({ ...s, [index]: 'idle' })), 450);
        }
    }, [phase, states, problem, level, onAwardPoints, fetchProblem]);

    if (loading || !problem) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="font-orbitron text-neon-purple animate-pulseGlow text-glow-purple">
                    Scanning asteroid field...
                </p>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col px-4 py-5">
            <div className="flex items-center justify-between mb-6">
                <BackButton onBack={onBack} />
                <div className="font-orbitron text-base font-bold text-neon-purple text-glow-purple">
                    ASTEROID POP
                </div>
                <div className="w-16" />
            </div>

            {/* Target */}
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass rounded-2xl p-4 mb-6 text-center"
            >
                <p className="text-star-dim text-sm font-inter mb-1">Destroy the asteroid numbered</p>
                <motion.p
                    key={problem.target}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="font-orbitron text-5xl font-bold text-neon-purple text-glow-purple"
                    aria-live="polite"
                >
                    {problem.target}
                </motion.p>
            </motion.div>

            {/* Asteroid field */}
            <div className="flex-1 flex flex-col items-center justify-center">
                <div className="grid grid-cols-3 gap-4">
                    {problem.options.map((num, i) => (
                        <AsteroidSVG
                            key={`${num}-${i}`}
                            path={ASTEROID_PATHS[i % ASTEROID_PATHS.length]}
                            number={num}
                            state={states[i] || 'idle'}
                            onClick={() => handleAsteroidClick(i, num)}
                        />
                    ))}
                </div>

                <AnimatePresence>
                    {phase === 'success' && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.7 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="mt-6 text-center"
                        >
                            <p className="font-orbitron text-2xl text-neon-green text-glow-green font-bold">
                                💥 Field Cleared! +{level * 5} ⚡
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
