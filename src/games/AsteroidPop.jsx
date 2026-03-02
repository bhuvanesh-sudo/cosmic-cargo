import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BackButton from '../components/BackButton.jsx';

// ── Asteroid shapes (8 unique hulls) ─────────────────────────────────────────
const ASTEROID_PATHS = [
    "M50,10 L80,25 L90,55 L70,80 L35,85 L10,65 L15,30 Z",
    "M55,8 L85,30 L85,65 L60,88 L25,80 L8,50 L20,20 Z",
    "M45,12 L75,18 L92,45 L82,75 L50,90 L18,75 L8,42 L22,18 Z",
    "M60,10 L88,35 L85,70 L58,90 L25,82 L8,55 L12,25 L38,8 Z",
    "M50,8 L80,22 L95,55 L75,85 L42,90 L12,72 L10,38 L28,12 Z",
    "M48,10 L78,20 L92,48 L85,78 L52,92 L20,80 L6,48 L18,18 Z",
    "M40,8 L70,15 L90,40 L88,72 L60,92 L22,85 L5,58 L10,25 Z",
    "M52,6 L82,18 L95,50 L80,82 L48,94 L16,78 L4,45 L20,14 Z",
];

// ── Per-asteroid drift animation (unique to each so they move independently) ─
function getDriftVariants(seed) {
    const amp = 18 + (seed * 7) % 24;       // drift amplitude  px
    const dur = 3.2 + (seed * 0.37) % 2.8;  // full cycle seconds
    const rot = 6 + (seed * 5) % 18;        // max rotation degrees
    const dx = (seed % 2 === 0 ? 1 : -1) * amp;
    const dy = (seed % 3 === 0 ? 1 : -1) * (amp * 0.6);
    return {
        animate: {
            x: [0, dx, -dx * 0.5, 0],
            y: [0, dy * 0.5, dy, 0],
            rotate: [0, rot, -rot * 0.6, 0],
        },
        transition: {
            duration: dur,
            repeat: Infinity,
            ease: 'easeInOut',
        },
    };
}

// ── Single asteroid button ────────────────────────────────────────────────────
function AsteroidSVG({ path, number, state, onClick, seed, isTarget }) {
    const isPopped = state === 'popped';
    const isShaking = state === 'shaking';
    const drift = getDriftVariants(seed);

    const strokeColor = isTarget ? '#fbbf24' : '#a78bfa';
    const glowColor = isTarget ? '#fbbf2440' : '#a78bfa18';

    return (
        <motion.div
            // Drift wrapper — always animating unless popped
            animate={!isPopped ? drift.animate : { scale: 0, opacity: 0 }}
            transition={!isPopped ? drift.transition : { duration: 0.35 }}
            style={{ display: 'inline-block' }}
        >
            <motion.button
                onClick={onClick}
                aria-label={`Asteroid numbered ${number}${isTarget ? ' — TARGET' : ''}`}
                animate={
                    isShaking
                        ? { x: [-8, 8, -6, 6, 0] }
                        : { x: 0 }
                }
                transition={isShaking ? { duration: 0.35 } : {}}
                className="focus:outline-none focus:ring-2 focus:ring-neon-purple/50 rounded-full relative"
                disabled={isPopped}
                style={{ pointerEvents: isPopped ? 'none' : 'auto' }}
            >
                {/* Target ring — pulses for target asteroids */}
                {isTarget && !isPopped && (
                    <motion.span
                        className="absolute inset-0 rounded-full pointer-events-none"
                        animate={{ scale: [1, 1.22, 1], opacity: [0.6, 0, 0.6] }}
                        transition={{ duration: 1.4, repeat: Infinity }}
                        style={{
                            border: '2px solid #fbbf24',
                            borderRadius: '50%',
                        }}
                    />
                )}
                <svg width="88" height="88" viewBox="0 0 100 100" fill="none">
                    {/* Glow aura */}
                    <ellipse cx="50" cy="50" rx="44" ry="44" fill={glowColor} />
                    {/* Body */}
                    <path d={path} fill="#162952" stroke={strokeColor} strokeWidth="2.2" />
                    {/* Craters */}
                    <circle cx="30" cy="40" r="5" fill="#0f1f3d" opacity="0.55" />
                    <circle cx="65" cy="65" r="4" fill="#0f1f3d" opacity="0.45" />
                    <circle cx="55" cy="30" r="3" fill="#0f1f3d" opacity="0.35" />
                    {/* Number */}
                    <text x="50" y="55" textAnchor="middle" dominantBaseline="middle"
                        fill={isTarget ? '#fbbf24' : 'white'}
                        fontFamily="Orbitron, monospace" fontWeight="bold" fontSize="26">
                        {number}
                    </text>
                </svg>
            </motion.button>
        </motion.div>
    );
}

// ── Explosion particle ring ───────────────────────────────────────────────────
function Explosion({ x, y }) {
    return (
        <motion.div
            className="pointer-events-none absolute"
            style={{ left: x, top: y, transform: 'translate(-50%,-50%)' }}
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
        >
            {Array.from({ length: 8 }, (_, i) => {
                const angle = (i / 8) * Math.PI * 2;
                return (
                    <motion.span
                        key={i}
                        className="absolute w-2 h-2 rounded-full bg-neon-gold"
                        style={{ left: '50%', top: '50%' }}
                        animate={{
                            x: Math.cos(angle) * 48,
                            y: Math.sin(angle) * 48,
                            opacity: [1, 0],
                            scale: [1, 0],
                        }}
                        transition={{ duration: 0.55, ease: 'easeOut' }}
                    />
                );
            })}
        </motion.div>
    );
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function buildRound(level, wave) {
    // Number of targets this wave (1 → 2 → 3, capped)
    const numTargets = Math.min(wave, level === 1 ? 2 : level === 2 ? 3 : 3);
    const poolMax = level === 1 ? 9 : level === 2 ? 15 : 20;
    const fieldSize = level === 1 ? 6 : level === 2 ? 8 : 9;

    const pool = Array.from({ length: poolMax }, (_, i) => i + 1);
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    const targets = shuffled.slice(0, numTargets);
    const decoys = shuffled.slice(numTargets);
    const options = [...targets, ...decoys.slice(0, fieldSize - numTargets)]
        .sort(() => Math.random() - 0.5);

    return { targets, options, numTargets };
}

// ── Main component ────────────────────────────────────────────────────────────
export default function AsteroidPop({ level, onAwardPoints, onBack }) {
    const [round, setRound] = useState(null);     // { targets, options, numTargets }
    const [wave, setWave] = useState(1);         // increases each cleared field
    const [remaining, setRemaining] = useState([]);        // target numbers still to destroy
    const [states, setStates] = useState({});        // index → 'idle'|'popped'|'shaking'
    const [phase, setPhase] = useState('playing'); // 'playing'|'wave-clear'|'loading'
    const [explosions, setExplosions] = useState([]);      // [{id,x,y}]
    const fieldRef = useRef(null);
    const expIdRef = useRef(0);

    // ── Build a new round ──────────────────────────────────────────────────
    const startRound = useCallback((w) => {
        setPhase('loading');
        const data = buildRound(level, w);
        setRound(data);
        setRemaining([...data.targets]);
        setStates(Object.fromEntries(data.options.map((_, i) => [i, 'idle'])));
        setExplosions([]);
        setPhase('playing');
    }, [level]);

    useEffect(() => { startRound(1); setWave(1); }, [startRound]);

    // ── Handle asteroid click ──────────────────────────────────────────────
    const handleClick = useCallback((index, number, domX, domY) => {
        if (phase !== 'playing' || states[index] === 'popped') return;

        if (remaining.includes(number)) {
            // Correct hit — pop it
            setStates(s => ({ ...s, [index]: 'popped' }));

            // Spawn explosion at click position
            const id = expIdRef.current++;
            setExplosions(ex => [...ex, { id, x: domX, y: domY }]);
            setTimeout(() => setExplosions(ex => ex.filter(e => e.id !== id)), 700);

            const nextRemaining = remaining.filter(n => n !== number);
            setRemaining(nextRemaining);

            if (nextRemaining.length === 0) {
                // Wave complete
                setPhase('wave-clear');
                onAwardPoints(level * 5 * round.numTargets);
                const nextWave = wave + 1;
                setWave(nextWave);
                setTimeout(() => startRound(nextWave), 2000);
            }
        } else {
            // Wrong asteroid — shake it
            setStates(s => ({ ...s, [index]: 'shaking' }));
            setTimeout(() => setStates(s => ({ ...s, [index]: 'idle' })), 400);
        }
    }, [phase, states, remaining, round, wave, level, onAwardPoints, startRound]);

    const handleButtonClick = useCallback((e, index, number) => {
        const rect = fieldRef.current?.getBoundingClientRect();
        const btnRect = e.currentTarget.getBoundingClientRect();
        const x = btnRect.left + btnRect.width / 2 - (rect?.left ?? 0);
        const y = btnRect.top + btnRect.height / 2 - (rect?.top ?? 0);
        handleClick(index, number, x, y);
    }, [handleClick]);

    if (!round || phase === 'loading') {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="font-orbitron text-neon-purple animate-pulseGlow text-glow-purple">
                    Scanning asteroid field...
                </p>
            </div>
        );
    }

    const cols = round.options.length <= 6 ? 3 : round.options.length <= 8 ? 4 : 3;

    return (
        <div className="min-h-screen flex flex-col px-4 py-5">
            {/* Top bar */}
            <div className="flex items-center justify-between mb-4">
                <BackButton onBack={onBack} />
                <div className="font-orbitron text-base font-bold text-neon-purple text-glow-purple">
                    ASTEROID POP
                </div>
                {/* Wave badge */}
                <div className="glass rounded-xl px-3 py-1 font-orbitron text-xs text-neon-gold">
                    WAVE {wave}
                </div>
            </div>

            {/* Mission brief */}
            <motion.div
                key={wave}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass rounded-2xl p-4 mb-4"
            >
                <p className="text-star-dim text-xs font-inter text-center uppercase tracking-widest mb-2">
                    {remaining.length === 0
                        ? 'Field Cleared!'
                        : `Destroy ${remaining.length} asteroid${remaining.length > 1 ? 's' : ''}`}
                </p>

                {/* Target queue */}
                <div className="flex items-center justify-center gap-3 flex-wrap">
                    {round.targets.map((t, idx) => {
                        const isDestroyed = !remaining.includes(t);
                        return (
                            <motion.div
                                key={`${t}-${idx}`}
                                className={`
                                    w-12 h-12 rounded-xl font-orbitron text-xl font-bold
                                    flex items-center justify-center
                                    border-2 transition-all duration-300
                                    ${isDestroyed
                                        ? 'border-neon-green/60 text-neon-green bg-neon-green/10'
                                        : 'border-neon-gold/70 text-neon-gold bg-neon-gold/10 glow-gold'}
                                `}
                                animate={isDestroyed ? { scale: [1, 1.2, 1] } : {}}
                                transition={{ duration: 0.3 }}
                                aria-label={isDestroyed ? `${t} destroyed` : `Target: ${t}`}
                            >
                                {isDestroyed ? (
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                        <polyline points="5,12 10,17 20,7" stroke="#39d353"
                                            strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                ) : t}
                            </motion.div>
                        );
                    })}
                </div>
            </motion.div>

            {/* Asteroid field */}
            <div className="flex-1 flex flex-col items-center justify-center">
                <div
                    ref={fieldRef}
                    className="relative"
                    style={{ minHeight: '320px' }}
                >
                    <div
                        className="grid gap-2"
                        style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
                    >
                        {round.options.map((num, i) => (
                            <AsteroidSVG
                                key={`${wave}-${i}-${num}`}
                                path={ASTEROID_PATHS[i % ASTEROID_PATHS.length]}
                                number={num}
                                state={states[i] || 'idle'}
                                seed={i + wave * 13}
                                isTarget={remaining.includes(num)}
                                onClick={(e) => handleButtonClick(e, i, num)}
                            />
                        ))}
                    </div>

                    {/* Explosion particles */}
                    {explosions.map(exp => (
                        <Explosion key={exp.id} x={exp.x} y={exp.y} />
                    ))}
                </div>

                {/* Wave clear banner */}
                <AnimatePresence>
                    {phase === 'wave-clear' && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.7, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="mt-6 text-center"
                        >
                            <p className="font-orbitron text-2xl text-neon-green text-glow-green font-bold flex items-center gap-2 justify-center">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                    <circle cx="12" cy="12" r="10" fill="#39d353" opacity="0.15" stroke="#39d353" strokeWidth="1.5" />
                                    <line x1="12" y1="2" x2="12" y2="22" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" />
                                    <line x1="2" y1="12" x2="22" y2="12" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" />
                                    <line x1="5" y1="5" x2="19" y2="19" stroke="#fbbf24" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
                                    <line x1="19" y1="5" x2="5" y2="19" stroke="#fbbf24" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
                                </svg>
                                Field Cleared! +{level * 5 * round.numTargets}
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                    <polygon points="13,2 3,14 12,14 11,22 21,10 12,10" fill="#fbbf24" stroke="#fbbf24" strokeWidth="1.5" strokeLinejoin="round" />
                                </svg>
                            </p>
                            <p className="text-star-dim text-sm font-inter mt-1">
                                Wave {wave} incoming...
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
