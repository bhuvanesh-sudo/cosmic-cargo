import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BackButton from '../components/BackButton.jsx';
import ScoreDisplay from '../components/ScoreDisplay.jsx';

// SVG Fuel Pod component
function FuelPod({ value, onClick, disabled }) {
    const colors = {
        1: { fill: '#2dd4bf', glow: '#2dd4bf' },
        2: { fill: '#60a5fa', glow: '#60a5fa' },
        3: { fill: '#a78bfa', glow: '#a78bfa' },
        4: { fill: '#fbbf24', glow: '#fbbf24' },
        5: { fill: '#f472b6', glow: '#f472b6' },
    };
    const c = colors[value] || colors[1];

    return (
        <motion.button
            onClick={() => !disabled && onClick(value)}
            disabled={disabled}
            aria-label={`Fuel pod with ${value} unit${value > 1 ? 's' : ''}`}
            whileHover={!disabled ? { scale: 1.12 } : {}}
            whileTap={!disabled ? { scale: 0.92 } : {}}
            className="focus:outline-none focus:ring-2 focus:ring-white/30 rounded-full"
            style={{ filter: disabled ? 'grayscale(0.6) opacity(0.5)' : 'none' }}
        >
            <svg width="60" height="72" viewBox="0 0 60 72" fill="none" aria-hidden="true">
                {/* Pod body */}
                <ellipse cx="30" cy="38" rx="24" ry="28" fill={c.fill} opacity="0.15" />
                <ellipse cx="30" cy="38" rx="22" ry="26" fill={c.fill} opacity="0.9" />
                {/* Highlight */}
                <ellipse cx="22" cy="28" rx="7" ry="5" fill="white" opacity="0.25" />
                {/* Nozzle */}
                <rect x="24" y="10" width="12" height="8" rx="3" fill={c.fill} opacity="0.7" />
                <rect x="26" y="6" width="8" height="6" rx="2" fill="#0f1f3d" />
                {/* Value text */}
                <text x="30" y="44" textAnchor="middle" dominantBaseline="middle"
                    fill="white" fontFamily="Orbitron, monospace" fontWeight="bold" fontSize="18">
                    {value}
                </text>
                {/* Glow ring */}
                <ellipse cx="30" cy="38" rx="22" ry="26" fill="none"
                    stroke={c.fill} strokeWidth="2" opacity="0.6" />
            </svg>
        </motion.button>
    );
}

// SVG Spaceship
function Spaceship({ launching }) {
    return (
        <motion.div
            animate={launching ? { x: 300, y: -120, opacity: 0 } : { x: 0, y: 0, opacity: 1 }}
            transition={{ duration: 0.9, ease: 'easeIn' }}
        >
            <svg width="110" height="90" viewBox="0 0 110 90" fill="none" aria-hidden="true">
                {/* Body */}
                <ellipse cx="55" cy="50" rx="32" ry="20" fill="#1d3461" stroke="#60a5fa" strokeWidth="1.5" />
                {/* Nose */}
                <path d="M55 8 C45 30 38 42 55 42 C72 42 65 30 55 8Z"
                    fill="#0f1f3d" stroke="#2dd4bf" strokeWidth="1.5" />
                {/* Engine fins */}
                <path d="M26 60 L12 78 L30 68Z" fill="#162952" stroke="#60a5fa" strokeWidth="1" />
                <path d="M84 60 L98 78 L80 68Z" fill="#162952" stroke="#60a5fa" strokeWidth="1" />
                {/* Engine flame */}
                <ellipse cx="55" cy="70" rx="12" ry="5" fill="#fbbf24" opacity="0.8" />
                <ellipse cx="55" cy="72" rx="8" ry="4" fill="#f472b6" opacity="0.6" />
                {/* Window */}
                <circle cx="55" cy="38" r="9" fill="#0a1628" stroke="#2dd4bf" strokeWidth="1.5" />
                <circle cx="52" cy="35" r="2.5" fill="white" opacity="0.2" />
            </svg>
        </motion.div>
    );
}

// Cargo Scale SVG
function CargoScale({ currentLoad, target }) {
    const pct = Math.min(currentLoad / target, 1);
    const barColor = pct >= 1 ? '#39d353' : pct > 0.7 ? '#fbbf24' : '#60a5fa';

    return (
        <div className="flex flex-col items-center gap-2">
            <svg width="160" height="100" viewBox="0 0 160 100" fill="none" aria-hidden="true">
                {/* Scale base */}
                <rect x="20" y="80" width="120" height="12" rx="6" fill="#162952" stroke="#2a4a7f" strokeWidth="1.5" />
                <rect x="70" y="55" width="20" height="28" rx="3" fill="#162952" stroke="#2a4a7f" strokeWidth="1.5" />
                {/* Scale pan */}
                <ellipse cx="80" cy="54" rx="48" ry="8" fill="#0f1f3d" stroke="#2a4a7f" strokeWidth="1.5" />
                {/* Load bar */}
                <rect x="34" y="47" width={Math.min(92 * pct, 92)} height="14" rx="3"
                    fill={barColor} opacity="0.85" />
                {/* Scale markings */}
                {Array.from({ length: target + 1 }, (_, i) => (
                    <line key={i} x1={34 + (92 / target) * i} y1="46"
                        x2={34 + (92 / target) * i} y2="62"
                        stroke="white" strokeWidth="0.8" opacity="0.3" />
                ))}
            </svg>
            {/* Numeric readout */}
            <div className="glass rounded-xl px-4 py-1.5 text-center" aria-label={`Current load: ${currentLoad}`}>
                <span className="font-orbitron text-2xl font-bold"
                    style={{ color: barColor }}>{currentLoad}</span>
                <span className="text-star-dim text-sm font-inter"> / {target}</span>
            </div>
        </div>
    );
}

export default function WeightStation({ level, onAwardPoints, onBack }) {
    const [target, setTarget] = useState(null);
    const [currentLoad, setCurrentLoad] = useState(0);
    const [loadedPods, setLoadedPods] = useState([]); // history of added pod values
    const [phase, setPhase] = useState('playing'); // 'playing' | 'success' | 'overload'
    const [loading, setLoading] = useState(true);
    const [energyCells, setEnergyCells] = useState(null);

    const POD_VALUES = [1, 2, 3, 4, 5];

    const fetchProblem = useCallback(async () => {
        setLoading(true);
        setCurrentLoad(0);
        setLoadedPods([]);
        setPhase('playing');
        try {
            const res = await fetch(`/api/games/addition?level=${level}`);
            const data = await res.json();
            setTarget(data.target);
        } catch {
            // Fallback: random target between 2 and 10
            const t = Math.floor(Math.random() * (level === 1 ? 4 : level === 2 ? 9 : 14)) + 2;
            setTarget(t);
        } finally {
            setLoading(false);
        }
    }, [level]);

    useEffect(() => { fetchProblem(); }, [fetchProblem]);

    const handlePodClick = useCallback((value) => {
        if (phase !== 'playing') return;
        const newLoad = currentLoad + value;

        if (newLoad === target) {
            // ✅ Correct!
            setCurrentLoad(newLoad);
            setLoadedPods((p) => [...p, value]);
            setPhase('success');
            const award = level * 5;
            onAwardPoints(award).then?.();
            setTimeout(() => fetchProblem(), 2200);
        } else if (newLoad > target) {
            // ⛔ Overload — bounce back, don't update load
            setPhase('overload');
            setTimeout(() => setPhase('playing'), 600);
        } else {
            // Normal addition
            setCurrentLoad(newLoad);
            setLoadedPods((p) => [...p, value]);
        }
    }, [phase, currentLoad, target, level, onAwardPoints, fetchProblem]);

    const handleRemoveLast = useCallback(() => {
        if (loadedPods.length === 0 || phase !== 'playing') return;
        const last = loadedPods[loadedPods.length - 1];
        setCurrentLoad((c) => c - last);
        setLoadedPods((p) => p.slice(0, -1));
    }, [loadedPods, phase]);

    if (loading || target === null) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="font-orbitron text-neon-blue text-glow-blue animate-pulseGlow text-lg">
                    Loading mission...
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col px-4 py-5">
            {/* Top bar */}
            <div className="flex items-center justify-between mb-6">
                <BackButton onBack={onBack} />
                <div className="font-orbitron text-base font-bold text-neon-teal text-glow-blue">
                    WEIGHT STATION
                </div>
                <div className="w-16" /> {/* spacer */}
            </div>

            {/* Mission panel */}
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass rounded-2xl p-4 mb-6 text-center"
            >
                <p className="text-star-dim text-sm font-inter mb-1">Mission Briefing</p>
                <p className="font-orbitron text-star-white text-lg">
                    Load exactly{' '}
                    <span className="text-neon-gold text-glow-gold font-bold text-2xl">{target}</span>
                    {' '}units of fuel onto the ship
                </p>
            </motion.div>

            <div className="flex flex-col lg:flex-row gap-6 items-center justify-center flex-1">
                {/* ── Ship + Scale column ── */}
                <div className="flex flex-col items-center gap-4">
                    <AnimatePresence>
                        {phase === 'success' && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0 }}
                                className="font-orbitron text-2xl text-neon-green text-glow-green font-bold"
                            >
                                🚀 LAUNCH!
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <Spaceship launching={phase === 'success'} />
                    <CargoScale currentLoad={currentLoad} target={target} />

                    {/* Overload warning */}
                    <AnimatePresence>
                        {phase === 'overload' && (
                            <motion.p
                                initial={{ opacity: 0, y: 4 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                className="text-neon-gold font-inter font-semibold text-sm"
                                role="alert"
                            >
                                ⚠️ Too heavy! That pod bounced back.
                            </motion.p>
                        )}
                    </AnimatePresence>

                    {/* Undo last pod */}
                    {loadedPods.length > 0 && phase === 'playing' && (
                        <button
                            onClick={handleRemoveLast}
                            className="text-star-dim hover:text-star-white text-xs font-inter underline transition-colors"
                            aria-label="Remove last fuel pod"
                        >
                            ↩ Remove last pod
                        </button>
                    )}
                </div>

                {/* ── Fuel Dock ── */}
                <div className="flex flex-col items-center gap-4">
                    <p className="text-star-dim text-sm font-inter uppercase tracking-widest">
                        Fuel Dock
                    </p>
                    <div className="glass rounded-2xl p-5">
                        <div className="flex flex-wrap gap-4 justify-center max-w-xs">
                            {POD_VALUES.map((val) => (
                                <motion.div
                                    key={val}
                                    animate={phase === 'overload' ? { x: [0, 30, 0] } : {}}
                                    transition={{ duration: 0.5 }}
                                >
                                    <FuelPod
                                        value={val}
                                        onClick={handlePodClick}
                                        disabled={phase === 'success' || val > target - currentLoad}
                                    />
                                </motion.div>
                            ))}
                        </div>
                        <p className="text-star-dim text-xs font-inter text-center mt-3">
                            Click a pod to load it onto the scale
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
