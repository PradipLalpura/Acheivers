
import { Habit } from './types';

export const FIXED_HABITS: Habit[] = [
  { id: 'wake-up', name: 'Wake up at 4:00 AM' },
  { id: 'read', name: 'Read 10 pages' },
  { id: 'study', name: 'Self-study – 3 hours' },
  { id: 'work', name: 'Part-time work – 1–2 hours' },
  { id: 'youtube', name: 'YouTube channel work – 1 hour' },
  { id: 'noon-sleep', name: 'No sleeping at noon' },
  { id: 'no-m', name: 'No masturbation' },
  { id: 'no-junk', name: 'No junk food' },
  { id: 'gym', name: 'Gym / Workout' },
];

export const V2_QUOTES = {
  morning: [ // Directive
    "Execute the plan. No deviations.",
    "The day is fresh. Do not waste the first hour.",
    "Standard operating procedure: Start now.",
    "Your future self is watching your current inaction.",
    "Discipline begins with the first decision of the day."
  ],
  midday: [ // Corrective
    "The sun is high. Where is the progress?",
    "Adjustment required. You are drifting from the target.",
    "The afternoon is where the average quit. Don't.",
    "Analyze your friction. Eliminate it. Continue.",
    "Time is decaying. Your score is static."
  ],
  night: [ // Confrontational
    "The day is ending. Own the result.",
    "If the score is zero, the day was a waste. No excuses.",
    "Confront the mirror. Did you win or just survive?",
    "Sleep is earned through execution.",
    "The data is permanent. How does it look?"
  ]
};

export const CATEGORIZED_QUOTES = {
  critical: V2_QUOTES.night,
  progressing: V2_QUOTES.midday,
  acknowledged: [
    "Requirement met. Reset and repeat.",
    "The data reflects consistency. Maintain.",
    "Executed. Zero emotion attached to victory.",
    "Don't seek praise for doing what is required.",
    "Standard maintained."
  ]
};

export const BRUTAL_QUOTES = [
  ...V2_QUOTES.morning,
  ...V2_QUOTES.midday,
  ...V2_QUOTES.night
];
