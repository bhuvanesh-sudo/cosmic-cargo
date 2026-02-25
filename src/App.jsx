import { useState, useEffect, useCallback } from 'react';
import Hub from './components/Hub.jsx';
import StarField from './components/StarField.jsx';
import WeightStation from './games/WeightStation.jsx';
import AsteroidPop from './games/AsteroidPop.jsx';
import SatelliteSequencing from './games/SatelliteSequencing.jsx';
import ConstellationTracing from './games/ConstellationTracing.jsx';
import Launchpad from './games/Launchpad.jsx';
import CargoInventory from './games/CargoInventory.jsx';
import OrbitingMoons from './games/OrbitingMoons.jsx';
import RoverExplorer from './games/RoverExplorer.jsx';

const GAME_COMPONENTS = {
    hub: null,
    weight: WeightStation,
    asteroid: AsteroidPop,
    satellite: SatelliteSequencing,
    constellation: ConstellationTracing,
    launchpad: Launchpad,
    cargo: CargoInventory,
    moons: OrbitingMoons,
    rover: RoverExplorer,
};

const API_BASE = '/api';

export default function App() {
    const [currentView, setCurrentView] = useState('hub');
    const [userId, setUserId] = useState(() => localStorage.getItem('cc_userId') || null);
    const [energyCells, setEnergyCells] = useState(0);
    const [level, setLevel] = useState(1);
    const [dbOnline, setDbOnline] = useState(true);

    // Create or restore user session
    useEffect(() => {
        const init = async () => {
            try {
                if (userId) {
                    // Try to fetch existing user
                    const res = await fetch(`${API_BASE}/user/${userId}`);
                    if (res.ok) {
                        const data = await res.json();
                        setEnergyCells(data.energyCells);
                        setLevel(data.level);
                        return;
                    }
                }
                // Create new user
                const res = await fetch(`${API_BASE}/user`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name: 'Commander' }),
                });
                if (res.ok) {
                    const data = await res.json();
                    setUserId(data._id);
                    localStorage.setItem('cc_userId', data._id);
                    setEnergyCells(data.energyCells);
                    setLevel(data.level);
                }
            } catch {
                // Backend offline — run in offline mode
                setDbOnline(false);
                const localCells = parseInt(localStorage.getItem('cc_energyCells') || '0');
                const localLevel = parseInt(localStorage.getItem('cc_level') || '1');
                setEnergyCells(localCells);
                setLevel(localLevel);
            }
        };
        init();
    }, []);

    const awardPoints = useCallback(async (amount = 5) => {
        const newCells = energyCells + amount;
        const newLevel = newCells >= 100 ? 3 : newCells >= 40 ? 2 : 1;

        setEnergyCells(newCells);
        setLevel(newLevel);

        if (dbOnline && userId) {
            try {
                const res = await fetch(`${API_BASE}/user/${userId}/score`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ award: amount }),
                });
                if (res.ok) {
                    const data = await res.json();
                    setEnergyCells(data.energyCells);
                    setLevel(data.level);
                }
            } catch {
                // Save offline
                localStorage.setItem('cc_energyCells', String(newCells));
                localStorage.setItem('cc_level', String(newLevel));
            }
        } else {
            localStorage.setItem('cc_energyCells', String(newCells));
            localStorage.setItem('cc_level', String(newLevel));
        }
    }, [energyCells, userId, dbOnline]);

    const goToHub = useCallback(() => setCurrentView('hub'), []);
    const goToGame = useCallback((gameKey) => setCurrentView(gameKey), []);

    const GameComponent = GAME_COMPONENTS[currentView];

    return (
        <div className="relative min-h-screen bg-space-900 overflow-hidden">
            <StarField />
            <div className="relative z-10">
                {currentView === 'hub' ? (
                    <Hub
                        energyCells={energyCells}
                        level={level}
                        onGameSelect={goToGame}
                        dbOnline={dbOnline}
                    />
                ) : GameComponent ? (
                    <GameComponent
                        level={level}
                        onAwardPoints={awardPoints}
                        onBack={goToHub}
                    />
                ) : null}
            </div>
        </div>
    );
}
