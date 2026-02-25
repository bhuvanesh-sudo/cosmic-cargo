import { motion } from 'framer-motion';
import ScoreDisplay from './ScoreDisplay.jsx';

const HANGARS = [
    {
        id: 'weight',
        num: 1,
        name: 'Weight Station',
        sub: 'Addition',
        icon: '⚖️',
        color: 'from-neon-teal/20 to-space-700',
        border: 'border-neon-teal/30',
        glow: 'hover:glow-blue',
    },
    {
        id: 'asteroid',
        num: 2,
        name: 'Asteroid Pop',
        sub: 'Number ID',
        icon: '☄️',
        color: 'from-neon-purple/20 to-space-700',
        border: 'border-neon-purple/30',
        glow: 'hover:glow-purple',
    },
    {
        id: 'satellite',
        num: 3,
        name: 'Satellite Seq.',
        sub: 'Patterns',
        icon: '🛰️',
        color: 'from-neon-blue/20 to-space-700',
        border: 'border-neon-blue/30',
        glow: 'hover:glow-blue',
    },
    {
        id: 'constellation',
        num: 4,
        name: 'Constellation',
        sub: 'Motor Skills',
        icon: '✨',
        color: 'from-neon-gold/20 to-space-700',
        border: 'border-neon-gold/30',
        glow: 'hover:glow-gold',
    },
    {
        id: 'launchpad',
        num: 5,
        name: 'Launchpad',
        sub: 'Subtraction',
        icon: '🚀',
        color: 'from-neon-pink/20 to-space-700',
        border: 'border-neon-pink/30',
        glow: 'hover:shadow-pink-500/30',
    },
    {
        id: 'cargo',
        num: 6,
        name: 'Cargo Bay',
        sub: 'Counting',
        icon: '💎',
        color: 'from-neon-cyan/20 to-space-700',
        border: 'border-neon-cyan/30',
        glow: 'hover:glow-blue',
    },
    {
        id: 'moons',
        num: 7,
        name: 'Orbiting Moons',
        sub: '< > = Compare',
        icon: '🌙',
        color: 'from-neon-purple/20 to-space-700',
        border: 'border-neon-purple/30',
        glow: 'hover:glow-purple',
    },
    {
        id: 'rover',
        num: 8,
        name: 'Rover Explorer',
        sub: 'Number Line',
        icon: '🤖',
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
                    <p className="text-star-dim text-sm font-inter mt-0.5">
                        Complete missions to earn ⚡ Energy Cells
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

                        {/* Icon */}
                        <span className="text-4xl leading-none" aria-hidden="true">
                            {hangar.icon}
                        </span>

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
