// Consistent Back-to-Hub button used across all game screens
export default function BackButton({ onBack }) {
    return (
        <button
            onClick={onBack}
            aria-label="Return to Hub"
            className="
        flex items-center gap-2 px-4 py-2 rounded-xl
        glass text-star-dim hover:text-star-white
        hover:border-neon-blue/40 transition-all duration-200
        font-inter text-sm font-medium
        focus:outline-none focus:ring-2 focus:ring-neon-blue/50
      "
        >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 18l-6-6 6-6" />
            </svg>
            Hub
        </button>
    );
}
