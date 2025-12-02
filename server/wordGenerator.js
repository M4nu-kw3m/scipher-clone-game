// Word list for Scipher
const WORD_POOL = [
  { word: "PROFESSOR", difficulty: 1 },
  { word: "BELT", difficulty: 1 },
  { word: "BUS", difficulty: 1 },
  { word: "WHITE", difficulty: 1 },
  { word: "PARTY", difficulty: 1 },
  { word: "SEEDS", difficulty: 1 },
  { word: "STAR", difficulty: 2 },
  { word: "DISSOLVE", difficulty: 2 },
  { word: "MANGO", difficulty: 2 },
  { word: "BAGS", difficulty: 2 },
  { word: "PORK", difficulty: 2 },
  { word: "SOLO", difficulty: 2 },
  { word: "DAILY", difficulty: 2 },
  { word: "JET", difficulty: 2 },
  { word: "SPONSOR", difficulty: 2 },
  { word: "NEW YORK", difficulty: 2 },
  { word: "PROSTATE", difficulty: 3 },
  { word: "AMIABLE", difficulty: 3 },
  { word: "STIGMA", difficulty: 3 },
  { word: "NEGLIGENCE", difficulty: 3 },
  { word: "TENNIS BALL", difficulty: 1 },
  { word: "APPLE", difficulty: 1 },
  { word: "BANANA", difficulty: 1 },
  { word: "CHERRY", difficulty: 1 },
  { word: "DATE", difficulty: 1 },
  { word: "ELDERBERRY", difficulty: 3 },
  { word: "FIG", difficulty: 1 },
  { word: "GRAPE", difficulty: 1 },
  { word: "HONEYDEW", difficulty: 2 },
  { word: "IGLOO", difficulty: 2 },
  { word: "JUNGLE", difficulty: 2 },
  { word: "KANGAROO", difficulty: 2 },
  { word: "LEMON", difficulty: 1 },
  { word: "MOUNTAIN", difficulty: 2 },
  { word: "NOTEBOOK", difficulty: 2 },
  { word: "OCEAN", difficulty: 1 },
  { word: "PENGUIN", difficulty: 2 },
  { word: "QUANTUM", difficulty: 3 },
  { word: "RAINBOW", difficulty: 2 },
  { word: "SUNSHINE", difficulty: 1 },
  { word: "TIGER", difficulty: 1 },
  { word: "UMBRELLA", difficulty: 2 },
  { word: "VIOLIN", difficulty: 2 },
  { word: "WATERMELON", difficulty: 2 },
  { word: "XYLOPHONE", difficulty: 3 },
  { word: "YACHT", difficulty: 3 },
  { word: "ZEBRA", difficulty: 2 }
];

export function generateWords(count = 25) {
  // Shuffle array
  const shuffled = [...WORD_POOL].sort(() => 0.5 - Math.random());
  
  // Select first 'count' items
  const selected = shuffled.slice(0, count);
  
  // Assign points based on difficulty + some randomness
  return selected.map(item => {
    let pts = 5;
    if (item.difficulty === 2) pts = Math.floor(Math.random() * 10) + 10; // 10-19
    if (item.difficulty === 3) pts = Math.floor(Math.random() * 15) + 20; // 20-34
    
    return {
      word: item.word,
      pts: pts,
      guessed: false
    };
  });
}
