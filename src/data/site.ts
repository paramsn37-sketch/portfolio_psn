/* ==========================================================================
   SITE CONTENT — edit this file to make the archive yours.
   Everything marked `// DEMO` is placeholder copy written so the layout can be
   judged at full density. Replace it with your own words before launch.
   Images: leave `image` undefined to show a labelled placeholder slot, or set it
   to an imported asset / public path (see CONTENT.md).
   Projects live in src/content/projects/*.md.
   ========================================================================== */

export type Img = { src?: string; alt: string; ratio?: string };

export const profile = {
  name: 'Param S N',
  firstName: 'Param',
  est: '2007', // from your mockups — the year the archive "begins"
  location: 'Bengaluru, India',
  coords: '12.97° N, 77.59° E',
  greeting: "Hi, I'm",
  tagline: 'I build, explore, learn and collect a little bit of everything.', // DEMO
  intro:
    'This is my personal archive — a space to explore my projects, journeys, interests and the things that shape me.', // DEMO
  role: 'AI/ML engineer in the making', // DEMO
  portrait: { alt: 'Portrait of Param S N', ratio: '4 / 5' } as Img,
  heroPhoto: { alt: 'Param on a mountain trail', ratio: '4 / 5' } as Img,
  about:
    "I'm a builder at heart — curious about technology, people and the world around me. I love turning ideas into real things, learning from the process and exploring what's next.", // DEMO
  traits: ['Builder', 'Learner', 'Explorer', 'Creative'], // DEMO
  facts: [
    { icon: 'map-pin', label: 'Location', value: 'Bengaluru, India' },
    { icon: 'graduation-cap', label: 'Education', value: 'BE AI & ML (SJBIT)' },
    { icon: 'languages', label: 'Languages', value: 'English, Hindi, Kannada' },
    { icon: 'compass', label: 'Interests', value: 'Travel, Tech, Design, Music' },
  ], // from your mockups — confirm
  hats: [
    { label: 'Builder', note: 'Turning ideas into working products.' }, // DEMO
    { label: 'Engineer', note: 'AI/ML, full-stack and the cloud underneath.' }, // DEMO
    { label: 'Founder', note: 'Starting things before they are obvious.' }, // DEMO
    { label: 'Leader', note: 'Learning to lead people, not just code.' }, // DEMO
  ],
  longStory: [
    'DEMO — This drawer holds the longer version of your story: where you grew up, what first pulled you toward technology, and the moment you realised you wanted to build things for a living.',
    'DEMO — Use a second paragraph for how you think: the way you approach a new problem, the kind of teams you do your best work in, and what you are unwilling to compromise on.',
    'DEMO — Close with what you are chasing now. Keep it honest and specific; one concrete sentence beats three adjectives.',
  ],
  quote: 'Build a life you’re excited to wake up to.', // DEMO (from mockup)
};

export const links = {
  email: 'hello@example.com', // DEMO — replace with your real address
  github: 'https://github.com/paramsn37-sketch',
  linkedin: '#', // DEMO
  x: '#', // DEMO
  instagram: '#', // DEMO
  spotify: '#', // DEMO
  resume: '#', // DEMO — link a PDF in /public when ready
};

export const chapters = [
  { id: 'enter', num: '00', label: 'Home', title: 'Enter the archive', icon: 'house' },
  { id: 'about', num: '01', label: 'About', title: 'About me', icon: 'user' },
  { id: 'story', num: '02', label: 'Story', title: 'My story', icon: 'book-open' },
  { id: 'projects', num: '03', label: 'Projects', title: 'Projects', icon: 'folder' },
  { id: 'mind', num: '04', label: 'Mind', title: 'Working mind', icon: 'settings' },
  { id: 'life', num: '05', label: 'Life', title: 'Life & interests', icon: 'heart' },
  { id: 'contact', num: '06', label: 'Contact', title: "What's next", icon: 'mail' },
] as const;

export type ChapterId = (typeof chapters)[number]['id'];

/* ---------- 02 · My story ---------- */
export const timeline = [
  {
    year: '2007', title: 'Early days', kind: 'Beginnings',
    body: 'Started my journey — curious and full of questions.', // DEMO (mockup)
    lesson: 'DEMO — the habit from childhood that still shows up in how you work.',
    place: 'Bengaluru',
    image: { alt: 'Childhood photo', ratio: '1 / 1' } as Img,
  },
  {
    year: '2018', title: 'High school', kind: 'Education',
    body: 'Discovered my interest in technology and problem solving.', // DEMO (mockup)
    lesson: 'DEMO — the first thing you built, and what broke.',
    image: { alt: 'High school photo', ratio: '1 / 1' } as Img,
  },
  {
    year: '2023', title: 'Joined SJBIT', kind: 'Education', turning: true,
    body: 'Started a BE in AI & ML and began building small projects.', // DEMO (mockup)
    lesson: 'DEMO — why AI/ML, and what you expected versus what you found.',
    image: { alt: 'College campus', ratio: '1 / 1' } as Img,
  },
  {
    year: '2024', title: 'Started building projects', kind: 'Experiments',
    body: 'Moved from tutorials to shipping things other people could use.', // DEMO
    lesson: 'DEMO — the project that taught you the most by failing.',
    image: { alt: 'Early project screenshot', ratio: '1 / 1' } as Img,
  },
  {
    year: '2025', title: 'First steps in the industry', kind: 'Work', turning: true,
    body: 'Internships and exploration — hands-on experience with real-world problems.', // DEMO (mockup)
    lesson: 'DEMO — what changed when your code met real users and real teams.',
    image: { alt: 'Office or team photo', ratio: '1 / 1' } as Img,
  },
  {
    year: '2026', title: "What's next?", kind: 'Now',
    body: 'Building, learning and exploring new opportunities.', // DEMO (mockup)
    lesson: 'DEMO — the question you are trying to answer this year.',
    image: { alt: 'Mountain view', ratio: '1 / 1' } as Img,
  },
];

/* ---------- 04 · Working mind ---------- */
export const toolbox = [
  {
    id: 'languages', label: 'Languages', icon: 'folder',
    items: [
      { name: 'Python', note: 'DEMO — what you reach for it for.' },
      { name: 'TypeScript', note: 'DEMO' },
      { name: 'C#', note: 'DEMO' },
      { name: 'SQL', note: 'DEMO' },
    ],
  },
  {
    id: 'frameworks', label: 'Frameworks', icon: 'folder',
    items: [
      { name: 'React', note: 'DEMO' },
      { name: 'Angular', note: 'DEMO' },
      { name: '.NET', note: 'DEMO' },
      { name: 'FastAPI', note: 'DEMO' },
    ],
  },
  {
    id: 'ai', label: 'AI & ML', icon: 'folder',
    items: [
      { name: 'LLM features', note: 'DEMO' },
      { name: 'Agents & tools', note: 'DEMO' },
      { name: 'NLP', note: 'DEMO' },
      { name: 'PyTorch', note: 'DEMO' },
    ],
  },
  {
    id: 'cloud', label: 'Cloud & Ops', icon: 'folder',
    items: [
      { name: 'AWS', note: 'DEMO' },
      { name: 'Docker', note: 'DEMO' },
      { name: 'CI/CD', note: 'DEMO' },
      { name: 'Auth (JWT, SSO)', note: 'DEMO' },
    ],
  },
  {
    id: 'tools', label: 'Daily tools', icon: 'folder',
    items: [
      { name: 'VS Code', note: 'DEMO' },
      { name: 'Git & GitHub', note: 'DEMO' },
      { name: 'Figma', note: 'DEMO' },
      { name: 'Notion', note: 'DEMO' },
    ],
  },
];

export const process = [
  { step: 'Notice', note: 'A small annoyance worth fixing.' }, // DEMO
  { step: 'Sketch', note: 'Paper first. Boxes and arrows.' }, // DEMO
  { step: 'Build', note: 'The smallest thing that works.' }, // DEMO
  { step: 'Break', note: 'Real users, real edge cases.' }, // DEMO
  { step: 'Ship', note: 'Then make it good.' }, // DEMO
];

export const experiments = [
  { title: 'Experiment one', status: 'Running', note: 'DEMO — a one-line hypothesis you are testing.' },
  { title: 'Experiment two', status: 'Shelved', note: 'DEMO — something you tried and parked, and why.' },
  { title: 'Experiment three', status: 'Idea', note: 'DEMO — a question you want to answer next.' },
];

export const learning = ['DEMO — topic one', 'DEMO — topic two', 'DEMO — topic three'];

/* ---------- 05 · Life ---------- */
export const vibes = ['Read', 'Build', 'Explore', 'Create', 'Be present']; // from mockup

export const topics = [
  { id: 'travel', label: 'Travel', icon: 'mountain', blurb: 'Mountains, cities, roads & new perspectives.', items: ['DEMO — a trip', 'DEMO — a road', 'DEMO — a place you want to go'] },
  { id: 'music', label: 'Music', icon: 'music', blurb: 'Sounds, playlists, concerts & late nights.', items: ['DEMO — an album on repeat', 'DEMO — a gig', 'DEMO — a playlist'] },
  { id: 'photography', label: 'Photography', icon: 'camera', blurb: 'Moments, people, places & everyday beauty.', items: ['DEMO — a favourite shot', 'DEMO — what you shoot on', 'DEMO — a series'] },
  { id: 'books', label: 'Books', icon: 'book', blurb: 'Stories, ideas, thoughts & recommendations.', items: ['DEMO — reading now', 'DEMO — re-read every year', 'DEMO — recommend to everyone'] },
  { id: 'food', label: 'Food', icon: 'utensils', blurb: 'Local flavours, new tastes & guilty pleasures.', items: ['DEMO — a place', 'DEMO — a dish', 'DEMO — a recipe'] },
  { id: 'hobbies', label: 'Hobbies', icon: 'gamepad-2', blurb: 'Build, create, tinker, repeat.', items: ['DEMO', 'DEMO', 'DEMO'] },
  { id: 'communities', label: 'Communities', icon: 'users', blurb: 'People, groups, shared passions.', items: ['DEMO — a community', 'DEMO — a role you held', 'DEMO'] },
  { id: 'experiments', label: 'Side quests', icon: 'flask-conical', blurb: 'Side projects, learning & random ideas.', items: ['DEMO', 'DEMO', 'DEMO'] },
]; // topic list from your mockup — keep only the ones that are true for you

export const moments = [
  { caption: 'Somewhere in the hills', date: '12 Aug 2026', image: { alt: 'Hills', ratio: '1 / 1' } as Img }, // DEMO
  { caption: 'Good music, better people', date: '03 Aug 2026', image: { alt: 'Concert', ratio: '1 / 1' } as Img }, // DEMO
  { caption: 'Small steps, big dreams', date: '21 Jul 2026', image: { alt: 'Notebook', ratio: '1 / 1' } as Img }, // DEMO
];

export const journal = [
  {
    slug: 'mountains-reset', date: '12 Aug 2026', title: 'The mountains always have a way of resetting you.', place: 'Himachal', tags: ['Travel', 'Reflections'],
    highlights: ['DEMO — highlight one', 'DEMO — highlight two', 'DEMO — highlight three'],
    body: [
      'DEMO — The first paragraph of a journal entry. Write the way you talk: where you were, who you were with, what the air felt like.',
      'DEMO — The second paragraph is the turn: the small moment that made the trip worth writing about.',
    ],
    image: { alt: 'Mountain valley', ratio: '4 / 3' } as Img,
  },
  {
    slug: 'good-music', date: '03 Aug 2026', title: 'A night of good music and great company.', place: 'Bengaluru', tags: ['Music', 'Friends'],
    highlights: ['DEMO', 'DEMO'],
    body: ['DEMO — journal entry body.', 'DEMO — a second paragraph.'],
    image: { alt: 'Live music', ratio: '4 / 3' } as Img,
  },
  {
    slug: 'small-steps', date: '21 Jul 2026', title: 'Small steps, big dreams.', place: 'Home', tags: ['Life', 'Growth'],
    highlights: ['DEMO', 'DEMO'],
    body: ['DEMO — journal entry body.', 'DEMO — a second paragraph.'],
    image: { alt: 'Open notebook', ratio: '4 / 3' } as Img,
  },
  {
    slug: 'new-recipe', date: '10 Jul 2026', title: 'A new recipe, same happiness.', place: 'Kitchen', tags: ['Food', 'Experiments'],
    highlights: ['DEMO', 'DEMO'],
    body: ['DEMO — journal entry body.', 'DEMO — a second paragraph.'],
    image: { alt: 'A plate of food', ratio: '4 / 3' } as Img,
  },
]; // titles from your mockup — DEMO

export const playlist = [
  { title: 'Track one', artist: 'Artist' }, // DEMO
  { title: 'Track two', artist: 'Artist' }, // DEMO
  { title: 'Track three', artist: 'Artist' }, // DEMO
  { title: 'Track four', artist: 'Artist' }, // DEMO
];

/* ---------- 06 · What comes next ---------- */
export const next = {
  exploring: [
    'DEMO — what you are exploring right now',
    'DEMO — a technical area you are going deep on',
    'DEMO — a question you would love to work on with others',
  ],
  openTo: ['Full-time roles', 'Internships', 'Collaborations', 'Freelance builds'], // DEMO
  intents: [
    { id: 'hire', label: 'Hire', subject: 'An opportunity for you', body: "Hi Param,\n\nI came across your archive and I'd like to talk about a role:\n\n" },
    { id: 'build', label: 'Build', subject: "Let's build something", body: "Hi Param,\n\nI have an idea I'd like to build with you:\n\n" },
    { id: 'hello', label: 'Say hi', subject: 'Hello from your archive', body: 'Hi Param,\n\n' },
  ],
};
