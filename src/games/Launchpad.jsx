import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BackButton from '../components/BackButton.jsx';

// SVG Rocket
function Rocket({ id, launching, delay = 0 }) {
    return (
        <motion.div
            key={`rocket-${id}-${launching}`}
            initial={{ y: 0, opacity: 1 }}
            animate={launching ? { y: -280, opacity: 0 } : { y: 0, opacity: 1 }}
            transition={{ duration: 0.9, ease: 'easeIn', delay }}
            className="inline-flex flex-col items-center"
            aria-hidden="true"
        >
            <svg width="40" height="68" viewBox="0 0 40 68" fill="none">
                {/* Body */}
                <ellipse cx="20" cy="38" rx="12" ry="20" fill="#1d3461" stroke="#60a5fa" strokeWidth="1.5" />
                {/* Nose */}
                <path d="M20 4 C14 20 10 32 20 32 C30 32 26 20 20 4Z"
                    fill="#0f1f3d" stroke="#2dd4bf" strokeWidth="1.5" />
                {/* Fins */}
                <path d="M10 52 L2 64 L14 58Z" fill="#162952" stroke="#60a5fa" strokeWidth="1" />
                <path d="M30 52 L38 64 L26 58Z" fill="#162952" stroke="#60a5fa" strokeWidth="1" />
                {/* Window */}
                <circle cx="20" cy="32" r="5" fill="#0a1628" stroke="#2dd4bf" strokeWidth="1.2" />
                <circle cx="18" cy="30" r="1.5" fill="white" opacity="0.2" />
                {/* Flame */}
                <ellipse cx="20" cy="58" rx="6" ry="4" fill="#fbbf24" opacity="0.75" />
                <ellipse cx="20" cy="60" rx="4" ry="3" fill="#f472b6" opacity="0.6" />
            </svg>
        </motion.div>
    );
}

// Number key pad (1–max)
function Keypad({ max, onSelect, disabled }) {
    const nums = Array.from({ length: max + 1 }, (_, i) => i);
    return (
        <div className="flex flex-wrap gap-2 justify-center max-w-xs" role="group"
            aria-label="Answer keypad">
            {nums.map((n) => (
                <motion.button
                    key={n}
                    onClick={() => !disabled && onSelect(n)}
                    disabled={disabled}
                    whileHover={!disabled ? { scale: 1.08 } : {}}
                    whileTap={!disabled ? { scale: 0.93 } : {}}
                    aria-label={`Answer ${n}`}
                    className={`
            w-12 h-12 rounded-xl font-orbitron font-bold text-lg
            glass-light border border-neon-blue/25
            text-star-white transition-all duration-150
            hover:border-neon-blue/60 hover:bg-neon-blue/10
            focus:outline-none focus:ring-2 focus:ring-neon-blue/40
            disabled:opacity-40 disabled:cursor-not-allowed
          `}
                >
                    {n}
                </motion.button>
            ))}
        </div>
    );
}

export default function Launchpad({ level, onAwardPoints, onBack }) {
    const [problem, setProblem] = useState(null);
    const [phase, setPhase] = useState('watching'); // 'watching' | 'answering' | 'correct' | 'wrong'
    const [launched, setLaunched] = useState([]); // indices of rockets that launched
    const [loading, setLoading] = useState(true);
    const [wrongAnim, setWrongAnim] = useState(null); // wrong answer chosen

    const fetchProblem = useCallback(async () => {
        setLoading(true);
        setPhase('watching');
        setLaunched([]);
        setWrongAnim(null);
        try {
            const res = await fetch(`/api/games/subtraction?level=${level}`);
            const data = await res.json();
            setProblem(data);
        } catch {
            // Fallback
            const total = Math.floor(Math.random() * (level === 1 ? 4 : 9)) + 3;
            const subtract = Math.floor(Math.random() * (total - 1)) + 1;
            setProblem({ total, subtract, answer: total - subtract });
        } finally {
            setLoading(false);
        }
    }, [level]);

    useEffect(() => { fetchProblem(); }, [fetchProblem]);

    // Trigger rocket launch animation when phase changes to 'watching'
    useEffect(() => {
        if (!problem || phase !== 'watching') return;
        // Stagger-launch the `subtract` rockets after a 1s delay
        const timer = setTimeout(() => {
            const indices = Array.from({ length: problem.subtract }, (_, i) => i);
            setLaunched(indices);
            // Switch to 'answering' after rockets fly away
            setTimeout(() => setPhase('answering'), 1200);
        }, 900);
        return () => clearTimeout(timer);
    }, [problem, phase]);

    const handleAnswer = useCallback((n) => {
        if (phase !== 'answering') return;
        if (n === problem.answer) {
            setPhase('correct');
            onAwardPoints(level * 5);
            setTimeout(() => fetchProblem(), 2000);
        } else {
            setWrongAnim(n);
            setTimeout(() => setWrongAnim(null), 600);
        }
    }, [phase, problem, level, onAwardPoints, fetchProblem]);

    if (loading || !problem) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="font-orbitron text-neon-blue text-glow-blue animate-pulseGlow">
                    Loading mission...
                </p>
            </div>
        );
    }

    const remainRockets = problem.total - problem.subtract;

    return (
        <div className="min-h-screen flex flex-col px-4 py-5">
            {/* Top bar */}
            <div className="flex items-center justify-between mb-6">
                <BackButton onBack={onBack} />
                <div className="font-orbitron text-base font-bold text-neon-pink text-glow-purple">
                    LAUNCHPAD
                </div>
                <div className="w-16" />
            </div>

            {/* Mission brief */}
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass rounded-2xl p-4 mb-6 text-center"
            >
                <p className="text-star-dim text-sm font-inter mb-1">Mission Briefing</p>
                <p className="font-orbitron text-star-white text-base sm:text-lg">
                    <span className="text-neon-gold font-bold text-2xl">{problem.total}</span>
                    {' '}rockets on the pad.{' '}
                    <span className="text-neon-pink font-bold text-2xl">{problem.subtract}</span>
                    {' '}are launching. How many remain?
                </p>
            </motion.div>

            {/* Launchpad grid */}
            <div className="glass rounded-2xl p-5 mb-6">
                <p className="text-star-dim text-xs font-inter text-center mb-4 uppercase tracking-widest">
                    {phase === 'watching' ? '🔥 Rockets Launching...' : phase === 'answering' ? '🤔 How many are left?' : phase === 'correct' ? '✅ Correct!' : ''}
                </p>
                <div className="flex flex-wrap gap-3 justify-center items-end min-h-[100px]">
                    {Array.from({ length: problem.total }, (_, i) => {
                        const isLaunching = launched.includes(i);
                        return (
                            <div key={i} className="relative">
                                <Rocket
                                    id={i}
                                    launching={isLaunching}
                                    delay={i * 0.12}
                                />
                                {/* Scorch mark after launch */}
                                {isLaunching && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.9 }}
                                        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-1.5 rounded-full bg-neon-gold/20"
                                    />
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Remaining count hint */}
                {phase === 'answering' && (
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center text-star-dim text-sm font-inter mt-4"
                    >
                        {remainRockets} rocket{remainRockets !== 1 ? 's' : ''} still on the pad
                    </motion.p>
                )}
            </div>

            {/* Keypad */}
            <AnimatePresence>
                {phase === 'answering' && (
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col items-center gap-3"
                    >
                        <p className="font-orbitron text-star-white text-sm">
                            Select the answer:
                        </p>
                        <Keypad max={problem.total} onSelect={handleAnswer} disabled={false} />
                        {wrongAnim !== null && (
                            <motion.p
                                key={wrongAnim}
                                initial={{ opacity: 1, y: 0 }}
                                animate={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.6 }}
                                className="text-neon-gold font-inter text-sm"
                                role="alert"
                            >
                                Not quite — try again! 🌟
                            </motion.p>
                        )}
                    </motion.div>
                )}

                {phase === 'correct' && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center"
                    >
                        <p className="font-orbitron text-3xl text-neon-green text-glow-green font-bold">
                            ⚡ +{level * 5} Energy Cells!
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
