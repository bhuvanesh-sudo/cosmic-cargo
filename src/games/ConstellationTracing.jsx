import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BackButton from '../components/BackButton.jsx';

// Star dot coordinates for each digit (0-9) on a 5x7 grid (normalized 0-1)
const DIGIT_STARS = {
    0: [[0.5, 0.05], [0.85, 0.2], [0.85, 0.7], [0.5, 0.9], [0.15, 0.7], [0.15, 0.2], [0.5, 0.05]],
    1: [[0.35, 0.1], [0.5, 0.05], [0.5, 0.95]],
    2: [[0.15, 0.2], [0.5, 0.05], [0.85, 0.2], [0.85, 0.45], [0.15, 0.75], [0.15, 0.95], [0.85, 0.95]],
    3: [[0.15, 0.05], [0.85, 0.05], [0.85, 0.48], [0.5, 0.48], [0.85, 0.52], [0.85, 0.95], [0.15, 0.95]],
    4: [[0.15, 0.05], [0.15, 0.5], [0.85, 0.5], [0.85, 0.05], [0.85, 0.95]],
    5: [[0.85, 0.05], [0.15, 0.05], [0.15, 0.48], [0.85, 0.52], [0.85, 0.95], [0.15, 0.95]],
    6: [[0.85, 0.05], [0.15, 0.05], [0.15, 0.5], [0.15, 0.95], [0.85, 0.95], [0.85, 0.5], [0.15, 0.5]],
    7: [[0.15, 0.05], [0.85, 0.05], [0.45, 0.95]],
    8: [[0.5, 0.05], [0.85, 0.2], [0.85, 0.48], [0.5, 0.5], [0.15, 0.52], [0.15, 0.8], [0.5, 0.95], [0.85, 0.8], [0.85, 0.52], [0.5, 0.5], [0.15, 0.48], [0.15, 0.2], [0.5, 0.05]],
    9: [[0.85, 0.95], [0.85, 0.05], [0.5, 0.05], [0.15, 0.2], [0.15, 0.48], [0.5, 0.5], [0.85, 0.48]],
};

const W = 260, H = 320;

export default function ConstellationTracing({ level, onAwardPoints, onBack }) {
    const [digit, setDigit] = useState(null);
    const [visitedStars, setVisitedStars] = useState(new Set());
    const [lines, setLines] = useState([]);
    const [isDragging, setIsDragging] = useState(false);
    const [phase, setPhase] = useState('tracing'); // 'tracing' | 'success'
    const [loading, setLoading] = useState(true);
    const svgRef = useRef(null);

    const fetchProblem = useCallback(async () => {
        setLoading(true);
        setVisitedStars(new Set());
        setLines([]);
        setPhase('tracing');
        setIsDragging(false);
        try {
            const res = await fetch(`/api/games/constellation?level=${level}`);
            const data = await res.json();
            setDigit(data.digit);
        } catch {
            const max = level === 1 ? 5 : 9;
            setDigit(Math.floor(Math.random() * (max + 1)));
        } finally {
            setLoading(false);
        }
    }, [level]);

    useEffect(() => { fetchProblem(); }, [fetchProblem]);

    const stars = digit !== null ? (DIGIT_STARS[digit] || []).map(([nx, ny]) => ({
        x: nx * W, y: ny * H,
    })) : [];

    const getSvgPoint = (clientX, clientY) => {
        const svg = svgRef.current;
        if (!svg) return null;
        const rect = svg.getBoundingClientRect();
        return { x: clientX - rect.left, y: clientY - rect.top };
    };

    const findNearestStar = useCallback((px, py) => {
        let best = null, bestDist = 40;
        stars.forEach((s, i) => {
            const d = Math.hypot(s.x - px, s.y - py);
            if (d < bestDist) { bestDist = d; best = i; }
        });
        return best;
    }, [stars]);

    const handlePointerDown = (e) => {
        e.preventDefault();
        setIsDragging(true);
        setVisitedStars(new Set());
        setLines([]);
        const pt = getSvgPoint(e.clientX ?? e.touches?.[0]?.clientX, e.clientY ?? e.touches?.[0]?.clientY);
        if (pt) {
            const si = findNearestStar(pt.x, pt.y);
            if (si === 0) setVisitedStars(new Set([0]));
        }
    };

    const handlePointerMove = (e) => {
        if (!isDragging) return;
        const cx = e.clientX ?? e.touches?.[0]?.clientX;
        const cy = e.clientY ?? e.touches?.[0]?.clientY;
        const pt = getSvgPoint(cx, cy);
        if (!pt) return;

        const si = findNearestStar(pt.x, pt.y);
        if (si === null) return;

        setVisitedStars((prev) => {
            if (prev.has(si)) return prev;
            const arr = [...prev];
            const last = arr[arr.length - 1];
            if (last !== undefined && si === last + 1) {
                // Draw line from last star to this one
                setLines((l) => [...l, { x1: stars[last].x, y1: stars[last].y, x2: stars[si].x, y2: stars[si].y }]);
                const next = new Set([...prev, si]);
                if (next.size === stars.length) {
                    // All visited!
                    setTimeout(() => {
                        setPhase('success');
                        onAwardPoints(level * 5);
                        setTimeout(() => fetchProblem(), 2500);
                    }, 200);
                }
                return next;
            }
            return prev;
        });
    };

    const handlePointerUp = () => setIsDragging(false);

    if (loading || digit === null) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="font-orbitron text-neon-gold animate-pulseGlow text-glow-gold">
                    Loading constellation...
                </p>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col px-4 py-5">
            <div className="flex items-center justify-between mb-6">
                <BackButton onBack={onBack} />
                <div className="font-orbitron text-base font-bold text-neon-gold text-glow-gold">
                    CONSTELLATION TRACING
                </div>
                <div className="w-16" />
            </div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="glass rounded-2xl p-4 mb-4 text-center">
                <p className="text-star-dim text-sm font-inter">
                    Click and drag to trace the number{' '}
                    <span className="font-orbitron text-neon-gold font-bold text-xl">{digit}</span>
                </p>
                <p className="text-xs text-star-dim/60 mt-1 font-inter">Connect the stars in order ✨</p>
            </motion.div>

            <div className="flex-1 flex flex-col items-center justify-center">
                <svg
                    ref={svgRef}
                    width={W} height={H}
                    className="cursor-crosshair select-none touch-none"
                    onMouseDown={handlePointerDown}
                    onMouseMove={handlePointerMove}
                    onMouseUp={handlePointerUp}
                    onMouseLeave={handlePointerUp}
                    onTouchStart={handlePointerDown}
                    onTouchMove={handlePointerMove}
                    onTouchEnd={handlePointerUp}
                    role="img"
                    aria-label={`Tracing pad for number ${digit}`}
                >
                    {/* Grid background dots */}
                    {Array.from({ length: 8 }, (_, r) =>
                        Array.from({ length: 6 }, (_, c) => (
                            <circle key={`${r}-${c}`} cx={c * 52} cy={r * 46} r="1.5"
                                fill="white" opacity="0.05" />
                        ))
                    )}

                    {/* Traced lines */}
                    {lines.map((l, i) => (
                        <motion.line key={i} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2}
                            stroke={phase === 'success' ? '#fbbf24' : '#60a5fa'}
                            strokeWidth="3" strokeLinecap="round"
                            initial={{ pathLength: 0, opacity: 0 }}
                            animate={{ pathLength: 1, opacity: 1 }}
                            transition={{ duration: 0.15 }}
                        />
                    ))}

                    {/* Stars */}
                    {stars.map((s, i) => {
                        const visited = visitedStars.has(i);
                        return (
                            <g key={i}>
                                <circle cx={s.x} cy={s.y} r={visited ? 14 : 11}
                                    fill={visited ? '#fbbf24' : '#1d3461'}
                                    stroke={visited ? '#fbbf24' : '#60a5fa'}
                                    strokeWidth="2" style={{ transition: 'all 0.2s' }} />
                                <text x={s.x} y={s.y} textAnchor="middle" dominantBaseline="middle"
                                    fill="white" fontFamily="Orbitron, monospace" fontSize="10" fontWeight="bold">
                                    {i + 1}
                                </text>
                            </g>
                        );
                    })}
                </svg>

                <AnimatePresence>
                    {phase === 'success' && (
                        <motion.p initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }}
                            className="font-orbitron text-2xl text-neon-gold text-glow-gold font-bold mt-4 text-center">
                            ✨ Constellation Complete! +{level * 5} ⚡
                        </motion.p>
                    )}
                </AnimatePresence>

                <button onClick={fetchProblem}
                    className="mt-4 text-star-dim hover:text-star-white text-xs font-inter underline transition-colors">
                    ↩ Reset tracing
                </button>
            </div>
        </div>
    );
}
