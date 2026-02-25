const express = require('express');
const router = express.Router();

// Helpers
const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

/**
 * Get the number range based on difficulty level:
 * Level 1: 1-5  |  Level 2: 1-10  |  Level 3: 1-20
 */
const getRange = (level) => {
    if (level === 3) return [1, 20];
    if (level === 2) return [1, 10];
    return [1, 5];
};

// ─── GET /api/games/addition ──────────────────────────────────────────────────
// Returns: { target }
router.get('/addition', (req, res) => {
    const level = parseInt(req.query.level) || 1;
    const [, max] = getRange(level);
    const target = rand(2, max);
    res.json({ target, level });
});

// ─── GET /api/games/subtraction ──────────────────────────────────────────────
// Returns: { total, subtract, answer }
router.get('/subtraction', (req, res) => {
    const level = parseInt(req.query.level) || 1;
    const [, max] = getRange(level);
    const total = rand(2, max);
    const subtract = rand(1, total - 1);
    const answer = total - subtract;
    res.json({ total, subtract, answer, level });
});

// ─── GET /api/games/number-id ─────────────────────────────────────────────────
// Returns: { target, options: number[] } (6 unique options, target is one of them)
router.get('/number-id', (req, res) => {
    const level = parseInt(req.query.level) || 1;
    const [min, max] = getRange(level);
    const poolSize = max - min + 1;
    const needed = Math.min(6, poolSize);

    const pool = Array.from({ length: poolSize }, (_, i) => i + min);
    // Shuffle pool
    for (let i = pool.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    const options = pool.slice(0, needed);
    const target = options[rand(0, needed - 1)];

    res.json({ target, options, level });
});

// ─── GET /api/games/sequence ──────────────────────────────────────────────────
// Returns: { sequence: number[], blankIndex: number, answer: number, choices: number[] }
router.get('/sequence', (req, res) => {
    const level = parseInt(req.query.level) || 1;
    const steps = level === 1 ? [1, 2] : level === 2 ? [1, 2, 5] : [2, 5, 10];
    const step = steps[rand(0, steps.length - 1)];

    const start = rand(0, level === 1 ? 5 : level === 2 ? 10 : 15);
    const sequence = Array.from({ length: 5 }, (_, i) => start + i * step);
    const blankIndex = rand(1, 3); // never blank first/last
    const answer = sequence[blankIndex];

    // Build 3 unique answer choices, one of which is correct
    const choicesSet = new Set([answer]);
    while (choicesSet.size < 3) {
        const wrong = answer + (rand(0, 1) ? 1 : -1) * step * rand(1, 2);
        if (wrong > 0) choicesSet.add(wrong);
    }
    const choices = [...choicesSet].sort(() => Math.random() - 0.5);

    res.json({ sequence, blankIndex, answer, choices, step, level });
});

// ─── GET /api/games/counting ─────────────────────────────────────────────────
// Returns: { count }
router.get('/counting', (req, res) => {
    const level = parseInt(req.query.level) || 1;
    const [min, max] = getRange(level);
    const count = rand(Math.max(min, 1), max);
    res.json({ count, level });
});

// ─── GET /api/games/comparison ───────────────────────────────────────────────
// Returns: { left, right, answer }
router.get('/comparison', (req, res) => {
    const level = parseInt(req.query.level) || 1;
    const [min, max] = getRange(level);
    const left = rand(min, max);
    const right = rand(min, max);
    const answer = left > right ? '>' : left < right ? '<' : '=';
    res.json({ left, right, answer, level });
});

// ─── GET /api/games/rover ─────────────────────────────────────────────────────
// Returns: { start, direction, steps, answer }
router.get('/rover', (req, res) => {
    const level = parseInt(req.query.level) || 1;
    const lineMax = level === 1 ? 10 : 20;
    const maxSteps = level === 1 ? 3 : level === 2 ? 5 : 8;

    let start, steps, direction, answer;
    // Ensure answer is within [0, lineMax]
    do {
        start = rand(2, lineMax - 2);
        steps = rand(1, maxSteps);
        direction = Math.random() > 0.5 ? 'forward' : 'backward';
        answer = direction === 'forward' ? start + steps : start - steps;
    } while (answer < 0 || answer > lineMax);

    res.json({ start, direction, steps, answer, lineMax, level });
});

// ─── GET /api/games/constellation ────────────────────────────────────────────
// Returns: { digit } (0-9 for tracing)
router.get('/constellation', (req, res) => {
    const level = parseInt(req.query.level) || 1;
    const maxDigit = level === 1 ? 5 : 9;
    const digit = rand(0, maxDigit);
    res.json({ digit, level });
});

module.exports = router;
