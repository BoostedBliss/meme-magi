import { MemeTemplate } from '../types';

// Helper to convert SVG markup into a clean data URI for reliable offline/instant canvas rendering
function svgToDataUri(svg: string): string {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg.trim())}`;
}

export const MEME_TEMPLATES: MemeTemplate[] = [
  {
    id: 'drake-hotline',
    name: 'Drake Hotline Bling',
    category: 'trending',
    imageUrl: svgToDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" width="600" height="600">
        <rect width="600" height="600" fill="#f8fafc"/>
        <line x1="300" y1="0" x2="300" y2="600" stroke="#cbd5e1" stroke-width="4"/>
        <line x1="0" y1="300" x2="600" y2="300" stroke="#cbd5e1" stroke-width="4"/>
        
        <!-- Top Left: Reject Drake -->
        <rect x="0" y="0" width="300" height="300" fill="#fef2f2"/>
        <g transform="translate(150, 150)">
          <!-- Body -->
          <circle cx="0" cy="0" r="80" fill="#fca5a5"/>
          <path d="M -50 80 C -50 40, 50 40, 50 80 Z" fill="#b91c1c"/>
          <!-- Head looking away -->
          <circle cx="-15" cy="-20" r="45" fill="#fbcfe8"/>
          <!-- Hand pushing away -->
          <rect x="-70" y="-10" width="30" height="60" rx="15" transform="rotate(-35 -55 20)" fill="#f43f5e"/>
          <!-- Beard / Hair -->
          <path d="M -45 -55 Q -10 -75 20 -55 Q 30 -30 20 -5 Q -10 15 -40 -10 Z" fill="#451a03"/>
          <text x="0" y="95" font-family="sans-serif" font-size="28" font-weight="900" fill="#991b1b" text-anchor="middle">❌ NOPE</text>
        </g>
        
        <!-- Top Right: Placeholder zone 1 -->
        <rect x="300" y="0" width="300" height="300" fill="#ffffff"/>
        <text x="450" y="150" font-family="Impact, sans-serif" font-size="24" fill="#94a3b8" text-anchor="middle">OPTION A (REJECT)</text>
        
        <!-- Bottom Left: Approve Drake -->
        <rect x="0" y="300" width="300" height="300" fill="#f0fdf4"/>
        <g transform="translate(150, 450)">
          <!-- Body -->
          <circle cx="0" cy="0" r="80" fill="#86efac"/>
          <path d="M -50 80 C -50 40, 50 40, 50 80 Z" fill="#15803d"/>
          <!-- Head pointing & smiling -->
          <circle cx="10" cy="-20" r="45" fill="#fbcfe8"/>
          <!-- Finger gun -->
          <rect x="35" y="-15" width="55" height="18" rx="8" fill="#22c55e"/>
          <path d="M -20 -55 Q 15 -75 45 -55 Q 55 -30 45 -5 Q 15 15 -15 -10 Z" fill="#451a03"/>
          <text x="0" y="95" font-family="sans-serif" font-size="28" font-weight="900" fill="#166534" text-anchor="middle">👉 THAT'S IT</text>
        </g>
        
        <!-- Bottom Right: Placeholder zone 2 -->
        <rect x="300" y="300" width="300" height="300" fill="#f8fafc"/>
        <text x="450" y="450" font-family="Impact, sans-serif" font-size="24" fill="#64748b" text-anchor="middle">OPTION B (APPROVE)</text>
      </svg>
    `),
    defaultTopText: 'WRITING 100 LINES OF BOILERPLATE',
    defaultBottomText: 'USING 1 GEMINI MAGIC PROMPT',
  },
  {
    id: 'distracted-boyfriend',
    name: 'Distracted Boyfriend',
    category: 'trending',
    imageUrl: svgToDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 700 450" width="700" height="450">
        <defs>
          <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#334155"/>
            <stop offset="100%" stop-color="#0f172a"/>
          </linearGradient>
        </defs>
        <rect width="700" height="450" fill="url(#bg)"/>
        
        <!-- Street Floor -->
        <polygon points="0,450 700,450 700,320 0,340" fill="#1e293b"/>
        
        <!-- Walking away Girl in Red (The temptation) -->
        <g transform="translate(160, 220)">
          <path d="M -30 180 L -10 60 L 20 60 L 35 180 Z" fill="#ef4444"/>
          <circle cx="5" cy="20" r="32" fill="#fed7aa"/>
          <path d="M -25 20 Q 5 -30 35 15 Q 35 45 10 40 Z" fill="#b45309"/>
          <rect x="-60" y="-40" width="130" height="32" rx="16" fill="#dc2626" opacity="0.9"/>
          <text x="5" y="-19" font-family="sans-serif" font-size="14" font-weight="bold" fill="#ffffff" text-anchor="middle">NEW DISTRACTION</text>
        </g>
        
        <!-- The Guy turning back -->
        <g transform="translate(370, 200)">
          <path d="M -35 200 L -15 70 L 25 70 L 45 200 Z" fill="#3b82f6"/>
          <circle cx="-10" cy="25" r="34" fill="#fed7aa"/>
          <!-- Looking back left -->
          <circle cx="-22" cy="22" r="5" fill="#0f172a"/>
          <path d="M -40 10 Q -10 -25 25 10 Z" fill="#334155"/>
          <rect x="-60" y="-40" width="100" height="32" rx="16" fill="#2563eb" opacity="0.9"/>
          <text x="-10" y="-19" font-family="sans-serif" font-size="14" font-weight="bold" fill="#ffffff" text-anchor="middle">ME</text>
        </g>
        
        <!-- Girlfriend staring in horror -->
        <g transform="translate(560, 220)">
          <path d="M -30 180 L -10 60 L 25 60 L 35 180 Z" fill="#ec4899"/>
          <circle cx="0" cy="20" r="32" fill="#fed7aa"/>
          <!-- Shocked expression -->
          <circle cx="-12" cy="18" r="6" fill="#0f172a"/>
          <ellipse cx="-8" cy="32" rx="8" ry="12" fill="#0f172a"/>
          <rect x="-70" y="-40" width="140" height="32" rx="16" fill="#db2777" opacity="0.9"/>
          <text x="0" y="-19" font-family="sans-serif" font-size="14" font-weight="bold" fill="#ffffff" text-anchor="middle">CURRENT TASKS</text>
        </g>
      </svg>
    `),
    defaultTopText: 'STARTING A NEW SIDE PROJECT',
    defaultBottomText: 'MY 5 UNFINISHED APPS WATCHING ME',
  },
  {
    id: 'two-buttons',
    name: 'Two Buttons Sweat',
    category: 'classic',
    imageUrl: svgToDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 500" width="600" height="500">
        <rect width="600" height="500" fill="#1e1b4b"/>
        
        <!-- Control Panel with 2 Red Buttons -->
        <polygon points="40,220 560,180 580,360 20,400" fill="#334155" stroke="#64748b" stroke-width="4"/>
        
        <!-- Left Button -->
        <ellipse cx="180" cy="270" rx="75" ry="40" fill="#ef4444" stroke="#991b1b" stroke-width="6"/>
        <text x="180" y="276" font-family="Impact, sans-serif" font-size="20" fill="#ffffff" text-anchor="middle">OPTION 1</text>
        
        <!-- Right Button -->
        <ellipse cx="420" cy="250" rx="75" ry="40" fill="#ef4444" stroke="#991b1b" stroke-width="6"/>
        <text x="420" y="256" font-family="Impact, sans-serif" font-size="20" fill="#ffffff" text-anchor="middle">OPTION 2</text>
        
        <!-- Guy sweating profusely -->
        <g transform="translate(300, 100)">
          <circle cx="0" cy="0" r="60" fill="#ffedd5"/>
          <circle cx="-20" cy="-5" r="10" fill="#ffffff"/>
          <circle cx="-18" cy="-5" r="5" fill="#0f172a"/>
          <circle cx="20" cy="-5" r="10" fill="#ffffff"/>
          <circle cx="18" cy="-5" r="5" fill="#0f172a"/>
          <!-- Sweat drops -->
          <path d="M 45 -25 Q 55 -15 50 -5 Q 40 5 35 -5 Z" fill="#38bdf8"/>
          <path d="M -45 -20 Q -55 -10 -50 0 Q -40 10 -35 0 Z" fill="#38bdf8"/>
          <!-- Trembling mouth -->
          <path d="M -25 25 Q 0 15 25 25" stroke="#7c2d12" stroke-width="4" fill="none"/>
        </g>
        
        <!-- Hand poised to push -->
        <path d="M 280 340 L 320 280 L 340 310 Z" fill="#fed7aa"/>
      </svg>
    `),
    defaultTopText: 'FIX ONE TINY BUG',
    defaultBottomText: 'REWRITE THE ENTIRE BACKEND IN RUST',
  },
  {
    id: 'this-is-fine',
    name: 'This is Fine Dog',
    category: 'reaction',
    imageUrl: svgToDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 450" width="600" height="450">
        <!-- Room in flames -->
        <rect width="600" height="450" fill="#ea580c"/>
        
        <!-- Wall Flames -->
        <path d="M 0 450 L 0 180 Q 50 100 80 200 Q 120 50 170 170 Q 220 80 280 220 Q 350 40 400 180 Q 480 90 530 200 Q 570 110 600 170 L 600 450 Z" fill="#f97316"/>
        <path d="M 0 450 L 0 260 Q 60 180 120 270 Q 200 160 260 280 Q 360 170 420 270 Q 500 190 600 280 L 600 450 Z" fill="#facc15"/>
        
        <!-- Table & Coffee -->
        <rect x="150" y="280" width="300" height="25" fill="#78350f"/>
        <rect x="180" y="305" width="20" height="145" fill="#78350f"/>
        <rect x="400" y="305" width="20" height="145" fill="#78350f"/>
        <rect x="340" y="245" width="35" height="35" rx="4" fill="#ffffff"/>
        <path d="M 375 255 Q 390 262 375 270" stroke="#ffffff" stroke-width="4" fill="none"/>
        
        <!-- Dog wearing hat -->
        <g transform="translate(250, 240)">
          <!-- Body -->
          <ellipse cx="0" cy="20" rx="45" ry="35" fill="#d97706"/>
          <!-- Head -->
          <circle cx="0" cy="-30" r="40" fill="#d97706"/>
          <!-- Dog ears -->
          <ellipse cx="-40" cy="-25" rx="14" ry="24" fill="#92400e"/>
          <ellipse cx="40" cy="-25" rx="14" ry="24" fill="#92400e"/>
          <!-- Hat -->
          <path d="M -30 -60 L 30 -60 L 20 -95 L -20 -95 Z" fill="#1e293b"/>
          <rect x="-40" y="-62" width="80" height="10" rx="4" fill="#0f172a"/>
          <!-- Calm Eyes -->
          <circle cx="-15" cy="-35" r="10" fill="#ffffff"/>
          <circle cx="-15" cy="-35" r="4" fill="#000000"/>
          <circle cx="15" cy="-35" r="10" fill="#ffffff"/>
          <circle cx="15" cy="-35" r="4" fill="#000000"/>
          <!-- Smile -->
          <path d="M -15 -15 Q 0 -5 15 -15" stroke="#000000" stroke-width="3" fill="none"/>
        </g>
        
        <!-- Speech Bubble -->
        <rect x="60" y="50" width="260" height="70" rx="35" fill="#ffffff" stroke="#000000" stroke-width="4"/>
        <polygon points="170,120 185,150 205,120" fill="#ffffff"/>
        <text x="190" y="93" font-family="Comic Sans MS, Impact, sans-serif" font-size="24" font-weight="bold" fill="#000000" text-anchor="middle">THIS IS FINE.</text>
      </svg>
    `),
    defaultTopText: 'PROD SERVER LOGGING 500 ERRORS',
    defaultBottomText: 'ME GOING ON MY 1 HOUR LUNCH BREAK',
  },
  {
    id: 'roll-safe-think',
    name: 'Roll Safe (Smart Guy)',
    category: 'reaction',
    imageUrl: svgToDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 450" width="600" height="450">
        <defs>
          <linearGradient id="coolbg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#1e1b4b"/>
            <stop offset="100%" stop-color="#312e81"/>
          </linearGradient>
        </defs>
        <rect width="600" height="450" fill="url(#coolbg)"/>
        
        <g transform="translate(300, 230)">
          <!-- Body / Leather jacket -->
          <path d="M -120 220 L -60 70 L 60 70 L 120 220 Z" fill="#18181b"/>
          <circle cx="0" cy="10" r="70" fill="#78350f"/>
          <!-- Hairline -->
          <path d="M -60 -20 Q 0 -85 60 -20 Q 70 30 50 40 Q 0 -30 -60 10 Z" fill="#09090b"/>
          <!-- Big smirk -->
          <path d="M -10 35 Q 25 45 40 25" stroke="#451a03" stroke-width="5" fill="none"/>
          <!-- Eye looking at camera knowingly -->
          <circle cx="20" cy="5" r="10" fill="#ffffff"/>
          <circle cx="25" cy="5" r="6" fill="#000000"/>
          <!-- Finger tapping temple -->
          <path d="M 65 30 L 85 -20 L 70 -35 L 45 -10 Z" fill="#78350f"/>
          <!-- Sparkle of pure genius -->
          <text x="65" y="-35" font-size="34">✨</text>
        </g>
      </svg>
    `),
    defaultTopText: "YOU CAN'T FAIL THE PRODUCTION DEPLOY",
    defaultBottomText: "IF YOU NEVER WRITE ANY CODE",
  },
  {
    id: 'expanding-brain',
    name: 'Expanding Brain (4 Stages)',
    category: 'classic',
    imageUrl: svgToDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 700" width="600" height="700">
        <rect width="600" height="700" fill="#090d16"/>
        <line x1="0" y1="175" x2="600" y2="175" stroke="#334155" stroke-width="3"/>
        <line x1="0" y1="350" x2="600" y2="350" stroke="#334155" stroke-width="3"/>
        <line x1="0" y1="525" x2="600" y2="525" stroke="#334155" stroke-width="3"/>
        <line x1="320" y1="0" x2="320" y2="700" stroke="#334155" stroke-width="3"/>
        
        <!-- Stage 1: Small brain -->
        <text x="160" y="95" font-family="sans-serif" font-size="18" fill="#94a3b8" text-anchor="middle">Stage 1</text>
        <circle cx="460" cy="88" r="30" fill="#f43f5e" opacity="0.4"/>
        <text x="460" y="96" font-size="28" text-anchor="middle">🧠</text>
        
        <!-- Stage 2: Glowing brain -->
        <text x="160" y="270" font-family="sans-serif" font-size="18" fill="#94a3b8" text-anchor="middle">Stage 2</text>
        <circle cx="460" cy="262" r="45" fill="#3b82f6" opacity="0.5"/>
        <text x="460" y="272" font-size="38" text-anchor="middle">⚡🧠</text>
        
        <!-- Stage 3: Cosmic brain -->
        <text x="160" y="445" font-family="sans-serif" font-size="18" fill="#94a3b8" text-anchor="middle">Stage 3</text>
        <circle cx="460" cy="437" r="55" fill="#a855f7" opacity="0.6"/>
        <text x="460" y="450" font-size="48" text-anchor="middle">🌌🧠✨</text>
        
        <!-- Stage 4: Transcendent Multiverse -->
        <text x="160" y="620" font-family="sans-serif" font-size="18" fill="#94a3b8" text-anchor="middle">Stage 4 (God Mode)</text>
        <circle cx="460" cy="612" r="70" fill="#eab308" opacity="0.8"/>
        <text x="460" y="626" font-size="56" text-anchor="middle">💥👑🌟</text>
      </svg>
    `),
    defaultTopText: 'REGULAR CODING → COPY PASTING',
    defaultBottomText: '→ LETTING GEMINI GENERATE THE MEMES',
  },
  {
    id: 'doge-much-wow',
    name: 'Doge (Much Wow)',
    category: 'animals',
    imageUrl: svgToDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 500" width="600" height="500">
        <rect width="600" height="500" fill="#fef08a"/>
        <!-- Shiba Inu Face -->
        <g transform="translate(300, 260)">
          <!-- Big Fluffy Head -->
          <ellipse cx="0" cy="0" rx="160" ry="140" fill="#eab308"/>
          <ellipse cx="0" cy="40" rx="120" ry="90" fill="#fef9c3"/>
          <!-- Ears -->
          <polygon points="-110,-100 -60,-170 -20,-90" fill="#ca8a04"/>
          <polygon points="110,-100 60,-170 20,-90" fill="#ca8a04"/>
          <polygon points="-90,-100 -60,-150 -35,-90" fill="#fef08a"/>
          <polygon points="90,-100 60,-150 35,-90" fill="#fef08a"/>
          <!-- Snout & Nose -->
          <ellipse cx="0" cy="20" rx="35" ry="25" fill="#000000"/>
          <circle cx="-10" cy="14" r="5" fill="#ffffff"/>
          <!-- Cute questioning eyes with lifted brow -->
          <ellipse cx="-60" cy="-30" rx="20" ry="22" fill="#451a03"/>
          <circle cx="-55" cy="-32" r="7" fill="#ffffff"/>
          <ellipse cx="60" cy="-30" rx="20" ry="22" fill="#451a03"/>
          <circle cx="65" cy="-32" r="7" fill="#ffffff"/>
          <!-- Cheek fluff -->
          <circle cx="-140" cy="20" r="40" fill="#eab308"/>
          <circle cx="140" cy="20" r="40" fill="#eab308"/>
        </g>
        <!-- Classic colorful floating comic sans words -->
        <text x="60" y="90" font-family="Comic Sans MS, cursive" font-size="28" font-weight="bold" fill="#ec4899">much code</text>
        <text x="420" y="110" font-family="Comic Sans MS, cursive" font-size="32" font-weight="bold" fill="#06b6d4">very ai</text>
        <text x="70" y="420" font-family="Comic Sans MS, cursive" font-size="30" font-weight="bold" fill="#84cc16">so intelligence</text>
        <text x="420" y="440" font-family="Comic Sans MS, cursive" font-size="34" font-weight="bold" fill="#a855f7">wow</text>
      </svg>
    `),
    defaultTopText: 'SUCH PROMPT',
    defaultBottomText: 'MANY MEMES. VERY AI. WOW.',
  },
  {
    id: 'woman-yelling-cat',
    name: 'Woman Yelling at Cat',
    category: 'reaction',
    imageUrl: svgToDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 700 400" width="700" height="400">
        <rect width="700" height="400" fill="#0f172a"/>
        <line x1="350" y1="0" x2="350" y2="400" stroke="#334155" stroke-width="4"/>
        
        <!-- Left: Crying yelling woman -->
        <rect x="0" y="0" width="350" height="400" fill="#1e1b4b"/>
        <g transform="translate(170, 200)">
          <!-- Woman crying & pointing -->
          <circle cx="0" cy="-20" r="55" fill="#fed7aa"/>
          <!-- Blonde hair -->
          <path d="M -65 -30 Q 0 -95 65 -30 Q 80 50 40 80 Q 0 -10 -60 60 Z" fill="#facc15"/>
          <!-- Open yelling mouth -->
          <ellipse cx="15" cy="0" rx="18" ry="24" fill="#991b1b"/>
          <!-- Tears -->
          <path d="M -20 -15 Q -10 10 -15 25" stroke="#38bdf8" stroke-width="4" fill="none"/>
          <path d="M 25 -15 Q 35 10 30 25" stroke="#38bdf8" stroke-width="4" fill="none"/>
          <!-- Dramatic pointing hand -->
          <rect x="70" y="10" width="75" height="22" rx="10" fill="#fed7aa" transform="rotate(-15 70 10)"/>
        </g>
        
        <!-- Right: Confused white cat at dinner table with salad -->
        <rect x="350" y="0" width="350" height="400" fill="#1c1917"/>
        <!-- Table with salad plate -->
        <ellipse cx="525" cy="330" rx="110" ry="35" fill="#e2e8f0"/>
        <circle cx="510" cy="325" r="15" fill="#22c55e"/>
        <circle cx="535" cy="328" r="18" fill="#16a34a"/>
        <g transform="translate(525, 200)">
          <!-- Cat head -->
          <circle cx="0" cy="0" r="60" fill="#ffffff"/>
          <!-- Cat ears -->
          <polygon points="-50,-40 -55,-100 -10,-55" fill="#ffffff"/>
          <polygon points="-45,-45 -48,-85 -15,-55" fill="#fbcfe8"/>
          <polygon points="50,-40 55,-100 10,-55" fill="#ffffff"/>
          <polygon points="45,-45 48,-85 15,-55" fill="#fbcfe8"/>
          <!-- Confused facial expression -->
          <ellipse cx="-25" cy="-10" rx="8" ry="12" fill="#0f172a"/>
          <ellipse cx="25" cy="-10" rx="8" ry="12" fill="#0f172a"/>
          <polygon points="0,10 -8,2 -8,18" fill="#f43f5e"/>
          <!-- Whiskers -->
          <line x1="-35" y1="12" x2="-80" y2="8" stroke="#cbd5e1" stroke-width="3"/>
          <line x1="-35" y1="20" x2="-80" y2="25" stroke="#cbd5e1" stroke-width="3"/>
          <line x1="35" y1="12" x2="80" y2="8" stroke="#cbd5e1" stroke-width="3"/>
          <line x1="35" y1="20" x2="80" y2="25" stroke="#cbd5e1" stroke-width="3"/>
        </g>
      </svg>
    `),
    defaultTopText: 'YOU CANNOT JUST VIBE-CODE EVERYTHING!!',
    defaultBottomText: 'ME: WATCH THIS MAGIC CAPTION BUTTON',
  },
  {
    id: 'change-my-mind',
    name: 'Change My Mind (Sign at Table)',
    category: 'classic',
    imageUrl: svgToDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 450" width="600" height="450">
        <!-- Campus lawn -->
        <rect width="600" height="450" fill="#15803d"/>
        <rect y="0" width="600" height="180" fill="#60a5fa"/>
        
        <!-- Table with Sign -->
        <polygon points="120,240 480,240 540,410 60,410" fill="#e2e8f0" stroke="#000000" stroke-width="4"/>
        <rect x="140" y="270" width="320" height="120" rx="8" fill="#ffffff" stroke="#000000" stroke-width="4"/>
        <text x="300" y="325" font-family="Impact, sans-serif" font-size="26" fill="#000000" text-anchor="middle">CHANGE MY MIND</text>
        <line x1="170" y1="345" x2="430" y2="345" stroke="#cbd5e1" stroke-width="2"/>
        <text x="300" y="375" font-family="sans-serif" font-size="16" font-weight="bold" fill="#64748b" text-anchor="middle">PROVE ME WRONG</text>
        
        <!-- Coffee Mug on table -->
        <rect x="420" y="215" width="25" height="30" rx="3" fill="#ffffff" stroke="#000000" stroke-width="2"/>
        <path d="M 445 222 Q 455 230 445 238" stroke="#000000" stroke-width="3" fill="none"/>
        
        <!-- Guy sitting calmly behind table -->
        <g transform="translate(300, 160)">
          <path d="M -50 100 L -20 30 L 20 30 L 50 100 Z" fill="#0284c7"/>
          <circle cx="0" cy="-10" r="38" fill="#fed7aa"/>
          <path d="M -35 -25 Q 0 -55 35 -25 Z" fill="#713f12"/>
          <circle cx="-12" cy="-12" r="5" fill="#0f172a"/>
          <circle cx="12" cy="-12" r="5" fill="#0f172a"/>
          <path d="M -10 10 Q 0 16 10 10" stroke="#000000" stroke-width="3" fill="none"/>
        </g>
      </svg>
    `),
    defaultTopText: 'AI MEMES ARE 10X FUNNIER',
    defaultBottomText: 'CHANGE MY MIND.',
  },
];
