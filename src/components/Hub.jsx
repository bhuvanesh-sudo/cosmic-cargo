import { motion } from 'framer-motion';
import ScoreDisplay from './ScoreDisplay.jsx';

// ── Animated SVG icons for each hangar ──────────────────────────────────────

function IconScale() {
    return (
        <svg width="44" height="44" viewBox="0 0 44 44" fill="none" aria-hidden="true">
            {/* Balance beam */}
            <line x1="22" y1="8" x2="22" y2="36" stroke="#2dd4bf" strokeWidth="2" strokeLinecap="round" />
            <line x1="6" y1="16" x2="38" y2="16" stroke="#2dd4bf" strokeWidth="2" strokeLinecap="round" />
            {/* Left pan */}
            <ellipse cx="9" cy="28" rx="6" ry="3" fill="none" stroke="#2dd4bf" strokeWidth="1.5" />
            <line x1="9" y1="16" x2="9" y2="25" stroke="#2dd4bf" strokeWidth="1.2" strokeDasharray="2 2" />
            {/* Right pan */}
            <ellipse cx="35" cy="28" rx="6" ry="3" fill="none" stroke="#2dd4bf" strokeWidth="1.5" />
            <line x1="35" y1="16" x2="35" y2="25" stroke="#2dd4bf" strokeWidth="1.2" strokeDasharray="2 2" />
            {/* Base */}
            <rect x="18" y="36" width="8" height="3" rx="1.5" fill="#2dd4bf" opacity="0.7" />
        </svg>
    );
}

function IconAsteroid() {
    return (
        <svg width="44" height="44" viewBox="0 0 44 44" fill="none" aria-hidden="true">
            {/* Asteroid body */}
            <path d="M22 5 L36 13 L38 26 L30 37 L16 38 L6 28 L8 14 Z"
                fill="#a78bfa" fillOpacity="0.2" stroke="#a78bfa" strokeWidth="1.8" />
            {/* Craters */}
            <circle cx="18" cy="20" r="3" fill="none" stroke="#a78bfa" strokeWidth="1" opacity="0.6" />
            <circle cx="27" cy="28" r="2" fill="none" stroke="#a78bfa" strokeWidth="1" opacity="0.5" />
            {/* Speed lines */}
            <line x1="4" y1="10" x2="10" y2="8" stroke="#a78bfa" strokeWidth="1" opacity="0.5" strokeLinecap="round" />
            <line x1="2" y1="16" x2="8" y2="15" stroke="#a78bfa" strokeWidth="0.8" opacity="0.4" strokeLinecap="round" />
        </svg>
    );
}

function IconSatellite() {
    return (
        <svg width="44" height="44" viewBox="0 0 44 44" fill="none" aria-hidden="true">
            {/* Body */}
            <rect x="16" y="16" width="12" height="14" rx="3" fill="#0f1f3d" stroke="#60a5fa" strokeWidth="1.5" />
            {/* Solar panel left */}
            <rect x="4" y="18" width="10" height="10" rx="2" fill="#1d3461" stroke="#60a5fa" strokeWidth="1" />
            {/* Solar panel right */}
            <rect x="30" y="18" width="10" height="10" rx="2" fill="#1d3461" stroke="#60a5fa" strokeWidth="1" />
            {/* Connector arms */}
            <line x1="14" y1="23" x2="16" y2="23" stroke="#60a5fa" strokeWidth="1.5" />
            <line x1="28" y1="23" x2="30" y2="23" stroke="#60a5fa" strokeWidth="1.5" />
            {/* Antenna */}
            <line x1="22" y1="16" x2="22" y2="7" stroke="#60a5fa" strokeWidth="1.2" />
            <circle cx="22" cy="6" r="2.5" fill="#2dd4bf" />
            {/* Signal rings */}
            <circle cx="22" cy="6" r="5" fill="none" stroke="#2dd4bf" strokeWidth="0.7" opacity="0.4" />
            <circle cx="22" cy="6" r="8" fill="none" stroke="#2dd4bf" strokeWidth="0.5" opacity="0.25" />
        </svg>
    );
}

function IconStar() {
    return (
        <svg width="44" height="44" viewBox="0 0 44 44" fill="none" aria-hidden="true">
            {/* Central star */}
            <polygon points="22,4 25,16 38,16 28,24 31,37 22,29 13,37 16,24 6,16 19,16"
                fill="#fbbf24" fillOpacity="0.25" stroke="#fbbf24" strokeWidth="1.5" strokeLinejoin="round" />
            {/* Small stars */}
            <circle cx="8" cy="8" r="2" fill="#fbbf24" opacity="0.6" />
            <circle cx="36" cy="10" r="1.5" fill="#fbbf24" opacity="0.5" />
            <circle cx="34" cy="36" r="1.5" fill="#fbbf24" opacity="0.4" />
            <circle cx="10" cy="32" r="1" fill="#fbbf24" opacity="0.4" />
        </svg>
    );
}

function IconRocket() {
    return (
        <svg width="44" height="44" viewBox="0 0 44 44" fill="none" aria-hidden="true">
            {/* Body */}
            <ellipse cx="22" cy="22" rx="9" ry="14" fill="#0f1f3d" stroke="#f472b6" strokeWidth="1.5" />
            {/* Nose */}
            <path d="M22 4 C17 12 14 18 22 18 C30 18 27 12 22 4Z"
                fill="#1d3461" stroke="#f472b6" strokeWidth="1.5" />
            {/* Fins */}
            <path d="M14 30 L8 40 L18 36Z" fill="#162952" stroke="#f472b6" strokeWidth="1" />
            <path d="M30 30 L36 40 L26 36Z" fill="#162952" stroke="#f472b6" strokeWidth="1" />
            {/* Window */}
            <circle cx="22" cy="22" r="4" fill="#0a1628" stroke="#2dd4bf" strokeWidth="1.2" />
            {/* Flame */}
            <ellipse cx="22" cy="38" rx="5" ry="3" fill="#fbbf24" opacity="0.8" />
            <ellipse cx="22" cy="40" rx="3" ry="2" fill="#f472b6" opacity="0.6" />
        </svg>
    );
}

function IconCrystal() {
    return (
        <svg width="44" height="44" viewBox="0 0 44 44" fill="none" aria-hidden="true">
            <polygon points="22,3 40,14 40,32 22,42 4,32 4,14"
                fill="#22d3ee" fillOpacity="0.15" stroke="#22d3ee" strokeWidth="1.8" />
            <polygon points="22,10 33,17 33,30 22,37 11,30 11,17"
                fill="#22d3ee" fillOpacity="0.45" />
            {/* Shine */}
            <polygon points="22,10 28,14 28,20 22,24 16,20 16,14"
                fill="white" opacity="0.22" />
            <line x1="22" y1="3" x2="22" y2="42" stroke="#22d3ee" strokeWidth="0.7" opacity="0.3" />
        </svg>
    );
}

function IconMoon() {
    return (
        <svg width="44" height="44" viewBox="0 0 44 44" fill="none" aria-hidden="true">
            {/* Planet */}
            <circle cx="22" cy="22" r="12" fill="#0f1f3d" stroke="#a78bfa" strokeWidth="1.8" />
            {/* Planet rings */}
            <ellipse cx="22" cy="22" rx="18" ry="6" fill="none" stroke="#a78bfa" strokeWidth="1" strokeDasharray="3 2" opacity="0.5" />
            {/* Moon */}
            <circle cx="38" cy="14" r="5" fill="#1d3461" stroke="#a78bfa" strokeWidth="1.5" />
            <circle cx="37" cy="13" r="1.5" fill="white" opacity="0.18" />
        </svg>
    );
}

function IconRover() {
    return (
        <svg width="44" height="44" viewBox="0 0 44 44" fill="none" aria-hidden="true">
            {/* Body */}
            <rect x="8" y="14" width="28" height="16" rx="4" fill="#1d3461" stroke="#39d353" strokeWidth="1.5" />
            {/* Camera mast */}
            <rect x="20" y="8" width="4" height="8" rx="1" fill="#2a4a7f" />
            <circle cx="22" cy="7" r="3" fill="#2dd4bf" />
            {/* Solar panels */}
            <rect x="2" y="16" width="6" height="10" rx="1.5" fill="#162952" stroke="#39d353" strokeWidth="1" />
            <rect x="36" y="16" width="6" height="10" rx="1.5" fill="#162952" stroke="#39d353" strokeWidth="1" />
            {/* Window */}
            <rect x="14" y="17" width="16" height="9" rx="2.5" fill="#0a1628" stroke="#2dd4bf" strokeWidth="1" />
            {/* Wheels */}
            <circle cx="14" cy="32" r="5" fill="#0f1f3d" stroke="#39d353" strokeWidth="1.5" />
            <circle cx="30" cy="32" r="5" fill="#0f1f3d" stroke="#39d353" strokeWidth="1.5" />
            <circle cx="14" cy="32" r="2" fill="#2dd4bf" opacity="0.7" />
            <circle cx="30" cy="32" r="2" fill="#2dd4bf" opacity="0.7" />
        </svg>
    );
}

// ── Animated SVG for lightning bolt (energy) ──────────────────────────────
function IconLightning({ size = 16, color = '#fbbf24' }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <polygon points="13,2 3,14 12,14 11,22 21,10 12,10"
                fill={color} stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
        </svg>
    );
}

const HANGARS = [
    {
        id: 'weight',
        num: 1,
        name: 'Weight Station',
        sub: 'Addition',
        Icon: IconScale,
        color: 'from-neon-teal/20 to-space-700',
        border: 'border-neon-teal/30',
        glow: 'hover:glow-blue',
    },
    {
        id: 'asteroid',
        num: 2,
        name: 'Asteroid Pop',
        sub: 'Number ID',
        Icon: IconAsteroid,
        color: 'from-neon-purple/20 to-space-700',
        border: 'border-neon-purple/30',
        glow: 'hover:glow-purple',
    },
    {
        id: 'satellite',
        num: 3,
        name: 'Satellite Seq.',
        sub: 'Patterns',
        Icon: IconSatellite,
        color: 'from-neon-blue/20 to-space-700',
        border: 'border-neon-blue/30',
        glow: 'hover:glow-blue',
    },
    {
        id: 'constellation',
        num: 4,
        name: 'Constellation',
        sub: 'Motor Skills',
        Icon: IconStar,
        color: 'from-neon-gold/20 to-space-700',
        border: 'border-neon-gold/30',
        glow: 'hover:glow-gold',
    },
    {
        id: 'launchpad',
        num: 5,
        name: 'Launchpad',
        sub: 'Subtraction',
        Icon: IconRocket,
        color: 'from-neon-pink/20 to-space-700',
        border: 'border-neon-pink/30',
        glow: 'hover:shadow-pink-500/30',
    },
    {
        id: 'cargo',
        num: 6,
        name: 'Cargo Bay',
        sub: 'Counting',
        Icon: IconCrystal,
        color: 'from-neon-cyan/20 to-space-700',
        border: 'border-neon-cyan/30',
        glow: 'hover:glow-blue',
    },
    {
        id: 'moons',
        num: 7,
        name: 'Orbiting Moons',
        sub: '< > = Compare',
        Icon: IconMoon,
        color: 'from-neon-purple/20 to-space-700',
        border: 'border-neon-purple/30',
        glow: 'hover:glow-purple',
    },
    {
        id: 'rover',
        num: 8,
        name: 'Rover Explorer',
        sub: 'Number Line',
        Icon: IconRover,
        color: 'from-neon-green/20 to-space-700',
        border: 'border-neon-green/30',
        glow: 'hover:glow-green',
    },
];

const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.07 } },
};
const cardVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};

export default function Hub({ energyCells, level, onGameSelect, dbOnline }) {
    return (
        <div className="min-h-screen flex flex-col px-4 py-6 sm:px-8">
            {/* ── Header ── */}
            <header className="flex items-start justify-between mb-8">
                <div>
                    <h1 className="font-orbitron text-2xl sm:text-3xl font-bold text-star-white text-glow-blue leading-tight">
                        COSMIC CARGO CO.
                    </h1>
                    <p className="text-star-dim text-sm mt-1 font-inter">
                        Space Station Logistics Hub
                        {!dbOnline && (
                            <span className="ml-2 text-xs text-neon-gold/70 italic">— offline mode</span>
                        )}
                    </p>
                </div>
                <ScoreDisplay energyCells={energyCells} level={level} />
            </header>

            {/* ── Commander Banner ── */}
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="glass rounded-2xl p-5 mb-8 flex items-center gap-5"
            >
                {/* Commander SVG avatar */}
                <div className="flex-shrink-0">
                    <svg width="64" height="64" viewBox="0 0 64 64" fill="none" aria-hidden="true">
                        {/* Helmet */}
                        <circle cx="32" cy="24" r="18" fill="#1d3461" stroke="#60a5fa" strokeWidth="2" />
                        {/* Visor */}
                        <ellipse cx="32" cy="26" rx="11" ry="8" fill="#0f1f3d" stroke="#2dd4bf" strokeWidth="1.5" />
                        {/* Visor glow reflection */}
                        <ellipse cx="28" cy="23" rx="3.5" ry="2" fill="white" opacity="0.15" />
                        {/* Suit body */}
                        <rect x="18" y="40" width="28" height="18" rx="6" fill="#0f1f3d" stroke="#60a5fa" strokeWidth="1.5" />
                        {/* Chest panel */}
                        <rect x="27" y="44" width="10" height="6" rx="2" fill="#162952" />
                        <circle cx="30" cy="47" r="1.2" fill="#39d353" />
                        <circle cx="34" cy="47" r="1.2" fill="#fbbf24" />
                    </svg>
                </div>
                <div>
                    <p className="text-star-dim text-xs font-inter uppercase tracking-widest mb-1">
                        Logistics Commander
                    </p>
                    <h2 className="font-orbitron text-lg font-bold text-star-white">
                        Select a Hangar
                    </h2>
                    <p className="text-star-dim text-sm font-inter mt-0.5 flex items-center gap-1.5">
                        Complete missions to earn
                        <IconLightning size={14} color="#fbbf24" />
                        <span className="text-neon-gold font-semibold">Energy Cells</span>
                    </p>
                </div>
            </motion.div>

            {/* ── Hangar Grid ── */}
            <motion.div
                className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 flex-1"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                role="list"
            >
                {HANGARS.map((hangar) => (
                    <motion.button
                        key={hangar.id}
                        variants={cardVariants}
                        onClick={() => onGameSelect(hangar.id)}
                        aria-label={`Hangar ${hangar.num}: ${hangar.name} — ${hangar.sub}`}
                        role="listitem"
                        className={`
              relative flex flex-col items-center justify-center gap-3
              p-5 rounded-2xl text-center cursor-pointer
              glass-light bg-gradient-to-br ${hangar.color}
              border ${hangar.border}
              transition-all duration-200
              hover:scale-[1.04] hover:brightness-110 active:scale-[0.98]
              focus:outline-none focus:ring-2 focus:ring-neon-blue/50
            `}
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.97 }}
                    >
                        {/* Hangar number badge */}
                        <span className="absolute top-2.5 left-3 font-orbitron text-[10px] text-star-dim/60">
                            #{String(hangar.num).padStart(2, '0')}
                        </span>

                        {/* Icon — float at rest, wobble on hover */}
                        <motion.div
                            whileHover={{ rotate: [0, -8, 8, 0], transition: { duration: 0.4 } }}
                            className="flex items-center justify-center animate-float-icon"
                            aria-hidden="true"
                        >
                            <hangar.Icon />
                        </motion.div>

                        {/* Name */}
                        <div>
                            <p className="font-orbitron text-xs font-bold text-star-white leading-tight">
                                {hangar.name}
                            </p>
                            <p className="text-star-dim text-[11px] font-inter mt-0.5">
                                {hangar.sub}
                            </p>
                        </div>
                    </motion.button>
                ))}
            </motion.div>

            {/* ── Footer ── */}
            <p className="text-center text-space-300 text-[11px] font-inter mt-6 opacity-50">
                Cosmic Cargo Co. · Accessibility-first math adventures
            </p>
        </div>
    );
}
