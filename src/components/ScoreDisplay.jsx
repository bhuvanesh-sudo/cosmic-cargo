import { motion, AnimatePresence } from 'framer-motion';

// Displays the Commander's Energy Cells and Level badge
export default function ScoreDisplay({ energyCells, level }) {
    return (
        <div className="flex items-center gap-3" role="status" aria-live="polite"
            aria-label={`${energyCells} energy cells, level ${level}`}>
            {/* Energy Cells */}
            <div className="flex items-center gap-2 glass rounded-2xl px-4 py-2 glow-gold">
                {/* Lightning bolt / cell icon */}
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <polygon points="13,2 3,14 12,14 11,22 21,10 12,10"
                        fill="#fbbf24" stroke="#fbbf24" strokeWidth="1.5"
                        strokeLinejoin="round" />
                </svg>
                <AnimatePresence mode="popLayout">
                    <motion.span
                        key={energyCells}
                        initial={{ y: -10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 10, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="font-orbitron text-lg font-bold text-neon-gold text-glow-gold"
                    >
                        {energyCells}
                    </motion.span>
                </AnimatePresence>
                <span className="text-star-dim text-xs font-inter font-medium hidden sm:inline">
                    CELLS
                </span>
            </div>

            {/* Level badge */}
            <div className={`flex items-center gap-1.5 rounded-2xl px-3 py-2 glass
        ${level === 3 ? 'glow-purple' : level === 2 ? 'glow-blue' : ''}`}>
                <span className="text-star-dim text-xs font-inter">LVL</span>
                <span className={`font-orbitron font-bold text-sm
          ${level === 3 ? 'text-neon-purple text-glow-purple'
                        : level === 2 ? 'text-neon-blue text-glow-blue'
                            : 'text-neon-teal'}`}>
                    {level}
                </span>
            </div>
        </div>
    );
}
