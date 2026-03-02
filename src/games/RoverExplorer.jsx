import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BackButton from '../components/BackButton.jsx';

// SVG Rover
// Parts are drawn centred on (0,0) with negative-Y coords so the wheels
// sit at y=0 and the body/mast extend upward. The group is then translated
// to (px, TRACK_Y) so the rover rides exactly on the track line.
const TRACK_Y = 75; // matches the track line y in the SVG

function Rover({ x, lineWidth, totalTicks }) {
    const pct = x / (totalTicks - 1);
    const px = 32 + pct * (lineWidth - 64);

    return (
        <motion.g
            initial={{ x: px, y: TRACK_Y }}
            animate={{ x: px, y: TRACK_Y }}
            transition={{ duration: 0.6, ease: 'easeInOut' }}
        >
            {/* Wheels — sit at y=0 (which maps to TRACK_Y in world space) */}
            <circle cx="-14" cy="0" r="8" fill="#0f1f3d" stroke="#60a5fa" strokeWidth="1.5" />
            <circle cx="14" cy="0" r="8" fill="#0f1f3d" stroke="#60a5fa" strokeWidth="1.5" />
            <circle cx="-14" cy="0" r="3" fill="#2dd4bf" opacity="0.7" />
            <circle cx="14" cy="0" r="3" fill="#2dd4bf" opacity="0.7" />
            {/* Rover body */}
            <rect x="-20" y="-26" width="40" height="22" rx="5"
                fill="#1d3461" stroke="#60a5fa" strokeWidth="1.5" />
            {/* Solar panels */}
            <rect x="-34" y="-23" width="14" height="13" rx="2"
                fill="#162952" stroke="#60a5fa" strokeWidth="1" />
            <rect x="20" y="-23" width="14" height="13" rx="2"
                fill="#162952" stroke="#60a5fa" strokeWidth="1" />
            {/* Window */}
            <rect x="-9" y="-23" width="18" height="11" rx="3"
                fill="#0a1628" stroke="#2dd4bf" strokeWidth="1" />
            <circle cx="-3" cy="-18" r="2" fill="white" opacity="0.18" />
            {/* Camera mast */}
            <rect x="-2" y="-42" width="4" height="16" rx="1" fill="#2a4a7f" />
            <circle cx="0" cy="-44" r="4" fill="#2dd4bf" />
        </motion.g>
    );
}

const SVG_W = 700;

export default function RoverExplorer({ level, onAwardPoints, onBack }) {
    const [problem, setProblem] = useState(null);
    const [roverPos, setRoverPos] = useState(0);
    const [phase, setPhase] = useState('playing'); // 'playing' | 'success' | 'wrong'
    const [loading, setLoading] = useState(true);
    const [wrongNum, setWrongNum] = useState(null);
    const containerRef = useRef(null);

    const fetchProblem = useCallback(async () => {
        setLoading(true);
        setPhase('playing');
        setWrongNum(null);
        try {
            const res = await fetch(`/api/games/rover?level=${level}`);
            const data = await res.json();
            setProblem(data);
            setRoverPos(data.start);
        } catch {
            const lineMax = level === 1 ? 10 : 20;
            let start, steps, direction, answer;
            do {
                start = Math.floor(Math.random() * (lineMax - 4)) + 2;
                steps = Math.floor(Math.random() * 3) + 1;
                direction = Math.random() > 0.5 ? 'forward' : 'backward';
                answer = direction === 'forward' ? start + steps : start - steps;
            } while (answer < 0 || answer > lineMax);
            setProblem({ start, direction, steps, answer, lineMax });
            setRoverPos(start);
        } finally {
            setLoading(false);
        }
    }, [level]);

    useEffect(() => { fetchProblem(); }, [fetchProblem]);

    const handleTickClick = useCallback((num) => {
        if (phase !== 'playing') return;
        if (num === problem.answer) {
            setRoverPos(num);
            setPhase('success');
            onAwardPoints(level * 5);
            setTimeout(() => fetchProblem(), 2400);
        } else {
            setWrongNum(num);
            setTimeout(() => setWrongNum(null), 600);
        }
    }, [phase, problem, level, onAwardPoints, fetchProblem]);

    if (loading || !problem) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="font-orbitron text-neon-green animate-pulseGlow text-glow-green">
                    Plotting course...
                </p>
            </div>
        );
    }

    const ticks = Array.from({ length: problem.lineMax + 1 }, (_, i) => i);
    const lineWidth = SVG_W - 64;

    return (
        <div className="min-h-screen flex flex-col px-4 py-5">
            <div className="flex items-center justify-between mb-6">
                <BackButton onBack={onBack} />
                <div className="font-orbitron text-base font-bold text-neon-green text-glow-green">
                    ROVER EXPLORER
                </div>
                <div className="w-16" />
            </div>

            {/* Mission directive */}
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                className="glass rounded-2xl p-4 mb-6 text-center">
                <p className="text-star-dim text-sm font-inter mb-1">Mission Directive</p>
                <p className="font-orbitron text-star-white text-base sm:text-lg">
                    Rover is at{' '}
                    <span className="text-neon-gold font-bold text-2xl">{problem.start}</span>.
                    {' '}Move{' '}
                    <span className="text-neon-green font-bold text-xl">{problem.direction}</span>
                    {' '}{problem.steps} space{problem.steps !== 1 ? 's' : ''}.
                </p>
                <p className="text-star-dim text-sm font-inter mt-2">
                    Click the destination on the number line below.
                </p>
            </motion.div>

            {/* Number line — scrollable on small screens */}
            <div className="glass rounded-2xl p-4 mb-6 overflow-x-auto" ref={containerRef}>
                <svg width={SVG_W} height="130" viewBox={`0 0 ${SVG_W} 130`}
                    className="min-w-full" aria-label="Number line">

                    {/* Track */}
                    <line x1="32" y1="75" x2={SVG_W - 32} y2="75"
                        stroke="#2a4a7f" strokeWidth="3" strokeLinecap="round" />

                    {/* Direction arrow */}
                    <path d={problem.direction === 'forward'
                        ? `M ${SVG_W - 50} 70 L ${SVG_W - 32} 75 L ${SVG_W - 50} 80`
                        : `M 50 70 L 32 75 L 50 80`}
                        fill="#60a5fa" opacity="0.5" />

                    {/* Ticks + labels */}
                    {ticks.map((n) => {
                        const px = 32 + (n / problem.lineMax) * lineWidth;
                        const isAnswer = n === problem.answer;
                        const isStart = n === problem.start;
                        const isWrong = n === wrongNum;
                        const isSuccess = phase === 'success' && n === problem.answer;

                        return (
                            <g key={n} onClick={() => handleTickClick(n)} style={{ cursor: 'pointer' }}>
                                {/* Clickable area */}
                                <rect x={px - 14} y="70" width="28" height="48" rx="4"
                                    fill="transparent" />
                                {/* Tick mark */}
                                <line x1={px} y1="69" x2={px} y2="83"
                                    stroke={isAnswer && phase === 'success' ? '#39d353' : isStart ? '#fbbf24' : '#2a4a7f'}
                                    strokeWidth={isStart || isAnswer ? 3 : 1.5} />
                                {/* Highlight ring on answer tick */}
                                {isAnswer && phase === 'success' && (
                                    <circle cx={px} cy="75" r="12" fill="none" stroke="#39d353" strokeWidth="2" opacity="0.6" />
                                )}
                                {/* Wrong flash */}
                                {isWrong && (
                                    <circle cx={px} cy="75" r="10" fill="#fbbf24" opacity="0.25" />
                                )}
                                {/* Number label */}
                                <text x={px} y="118" textAnchor="middle"
                                    fill={isSuccess ? '#39d353' : isStart ? '#fbbf24' : '#a8c4d4'}
                                    fontFamily="Orbitron, monospace" fontSize={n % 5 === 0 ? '12' : '9'}
                                    fontWeight={isStart || isSuccess ? 'bold' : 'normal'}>
                                    {n}
                                </text>
                            </g>
                        );
                    })}

                    {/* Rover */}
                    <Rover x={roverPos} lineWidth={lineWidth} totalTicks={ticks.length} />

                    {/* Start marker */}
                    <text x={32 + (problem.start / problem.lineMax) * lineWidth}
                        y="58" textAnchor="middle"
                        fill="#fbbf24" fontFamily="Inter, sans-serif" fontSize="9" opacity="0.8">
                        START
                    </text>
                </svg>
            </div>

            <AnimatePresence>
                {phase === 'success' && (
                    <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                        className="text-center">
                        <p className="font-orbitron text-2xl text-neon-green text-glow-green font-bold flex items-center gap-2 justify-center">
                            <svg width="26" height="26" viewBox="0 0 44 44" fill="none" aria-hidden="true">
                                <rect x="8" y="14" width="28" height="16" rx="4" fill="#1d3461" stroke="#39d353" strokeWidth="1.5" />
                                <rect x="20" y="8" width="4" height="8" rx="1" fill="#2a4a7f" />
                                <circle cx="22" cy="7" r="3" fill="#2dd4bf" />
                                <rect x="2" y="16" width="6" height="10" rx="1.5" fill="#162952" stroke="#39d353" strokeWidth="1" />
                                <rect x="36" y="16" width="6" height="10" rx="1.5" fill="#162952" stroke="#39d353" strokeWidth="1" />
                                <rect x="14" y="17" width="16" height="9" rx="2.5" fill="#0a1628" stroke="#2dd4bf" strokeWidth="1" />
                                <circle cx="14" cy="32" r="5" fill="#0f1f3d" stroke="#39d353" strokeWidth="1.5" />
                                <circle cx="30" cy="32" r="5" fill="#0f1f3d" stroke="#39d353" strokeWidth="1.5" />
                                <circle cx="14" cy="32" r="2" fill="#2dd4bf" opacity="0.7" />
                                <circle cx="30" cy="32" r="2" fill="#2dd4bf" opacity="0.7" />
                            </svg>
                            Destination Reached! +{level * 5}
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                <polygon points="13,2 3,14 12,14 11,22 21,10 12,10" fill="#fbbf24" stroke="#fbbf24" strokeWidth="1.5" strokeLinejoin="round" />
                            </svg>
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
