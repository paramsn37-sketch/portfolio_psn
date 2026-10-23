/* ==========================================================================
   SITE CONTENT — edit this file to make the archive yours.
   Everything marked `// DEMO` is placeholder copy written so the layout can be
   judged at full density. Replace it with your own words before launch.
   Images: leave `image` undefined to show a labelled placeholder slot, or set it
   to an imported asset / public path (see CONTENT.md).
   Projects live in src/content/projects/*.md.
   ========================================================================== */

export type Img = { src?: string; alt: string; ratio?: string };

/**
 * While true, each chapter shows a small yellow "demo content" note so nobody mistakes
 * placeholder copy for real facts. Set to false once you've replaced the DEMO lines.
 */
export const showDemoNotes = true;

export const profile = {
  name: 'Param S N',
  firstName: 'Param',
  est: '2005',
  location: 'Bengaluru, India',
  coords: '12.97° N, 77.59° E',
  greeting: "Hi, I'm",
  tagline: 'I build AI products end to end, from the first idea to a working product.',
  intro:
    'This is my personal archive — a space to explore my projects, journeys, interests and the things that shape me.',
  role: 'AI/ML engineer & full-stack developer',
  portrait: { alt: 'Portrait of Param S N', ratio: '4 / 5' } as Img,
  heroPhoto: { alt: 'Param on a mountain trail', ratio: '4 / 5' } as Img,
  about:
    "I'm an AI & ML undergraduate at SJBIT and a full-stack developer, interning in software and product development at PlaceValue. I work across the stack, from Angular and React front ends to .NET and FastAPI services, with hands-on work in generative AI, RAG and LLM integration. When I take something on, I see it through to a finished, working product.",
  traits: ['Builder', 'Founder', 'Engineer', 'Cadet'],
  facts: [
    { icon: 'map-pin', label: 'Location', value: 'Bengaluru, India' },
    { icon: 'graduation-cap', label: 'Education', value: 'BE AI & ML, SJBIT (2027)' },
    { icon: 'languages', label: 'Languages', value: 'English, Kannada, Hindi, Tamil' },
    { icon: 'compass', label: 'Interests', value: 'AI, Design, NCC, Model building' },
  ],
  hats: [
    { label: 'Founder', note: 'Building BotView, an AI mock-interview platform.' },
    { label: 'Engineer', note: 'Full-stack and AI features at PlaceValue.' },
    { label: 'Leader', note: 'Junior Under Officer in my college NCC unit.' },
    { label: 'Maker', note: 'Models big and small, including a 4-foot ship from reused materials.' },
  ],
  longStory: [
    'I grew up in Bengaluru, finished school at Vidyaniketan Public School in 2021, and joined SJB Institute of Technology in 2023 to study Artificial Intelligence and Machine Learning. Alongside my degree I joined the National Cadet Corps, where I now serve as a Junior Under Officer and earned a Grade A in the B Certificate exam with the top marks in my unit.',
    'I learn by building. I started BotView, an AI mock-interview platform, and built a volunteer portal for my NCC unit, a computer-vision system for industrial safety and storefronts for real clients. I take ownership of a task and see it through to a finished, working product.',
    'Today I intern in software and product development at PlaceValue, where I helped build Taskverse, an assessment platform now used by around 600 students. I am chasing the place where AI meets real products people use every day.',
  ],
  quote: 'Build a life you’re excited to wake up to.',
};

/** Image slots that aren't tied to a timeline entry, topic or journal entry. Add `src` to fill one. */
export const photos = {
  idPhoto: { alt: 'ID photo of Param', ratio: '1 / 1' } as Img,           // lanyard pass (01) + desk badge
  aboutLandscape: { alt: 'A landscape you love', ratio: '4 / 3' } as Img, // behind the portrait (01)
  storyDrawer: { alt: 'A photo that says something about you', ratio: '16 / 10' } as Img, // "Read my story" drawer
  lifeBanner: { alt: 'A favourite place outdoors', ratio: '1 / 1' } as Img, // Life banner polaroid (05)
  menuQuote: { alt: 'A favourite landscape', ratio: '1 / 1' } as Img,     // mobile menu quote card
  deskPhotos: [
    { alt: 'Photo on the desk', ratio: '1 / 1' },
    { alt: 'Photo on the desk', ratio: '1 / 1' },
    { alt: 'Photo on the desk', ratio: '1 / 1' },
  ] as Img[],
};

export const links = {
  email: 'paramsn37@gmail.com',
  github: 'https://github.com/paramsn37-sketch',
  linkedin: 'https://www.linkedin.com/in/param-s-n/',
  x: '#', // '#' hides the link
  instagram: '#',
  spotify: '#',
  resume: '#', // link a PDF in /public when ready
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
    year: '2005', title: 'Early days', kind: 'Beginnings',
    body: 'Started my journey — curious and full of questions.',
    lesson: 'DEMO: the habit from childhood that still shows up in how you work.',
    place: 'Bengaluru',
    image: { alt: 'Childhood photo', ratio: '1 / 1' } as Img,
  },
  {
    year: '2021', title: 'Finished school', kind: 'Education',
    body: 'Completed CBSE Class 10 at Vidyaniketan Public School, Bengaluru.',
    lesson: 'DEMO: the first thing you built, and what broke.',
    place: 'Bengaluru',
    image: { alt: 'School photo', ratio: '1 / 1' } as Img,
  },
  {
    year: '2023', title: 'Joined SJBIT and the NCC', kind: 'Education', turning: true,
    body: 'Started a BE in AI & ML at SJB Institute of Technology and joined the National Cadet Corps.',
    lesson: 'DEMO: why AI/ML, and what you expected versus what you found.',
    image: { alt: 'College campus', ratio: '1 / 1' } as Img,
  },
  {
    year: '2024', title: 'Founded BotView', kind: 'Experiments',
    body: 'Started BotView, an AI mock-interview platform, and moved from tutorials to shipping real products.',
    lesson: 'DEMO: the project that taught you the most by failing.',
    image: { alt: 'Early BotView screenshot', ratio: '1 / 1' } as Img,
  },
  {
    year: '2025', title: 'Computer vision', kind: 'Experiments',
    body: 'Built Vision-Sentinel, a real-time PPE detection system, and completed NPTEL Computer Vision from IIT Kharagpur.',
    lesson: 'DEMO: what you learned taking a model from notebook to live camera.',
    image: { alt: 'Vision-Sentinel detection screenshot', ratio: '1 / 1' } as Img,
  },
  {
    year: '2026', title: 'Interning at PlaceValue', kind: 'Work', turning: true,
    body: 'Joined PlaceValue as a software and product development intern and shipped Taskverse to around 600 students.',
    lesson: 'DEMO: what changed when your code met real users and real teams.',
    image: { alt: 'Office or team photo', ratio: '1 / 1' } as Img,
  },
  {
    year: '2027', title: "What's next?", kind: 'Now',
    body: 'Graduating with a BE in AI & ML, and building what comes after.',
    lesson: 'DEMO: the question you are trying to answer this year.',
    image: { alt: 'Mountain view', ratio: '1 / 1' } as Img,
  },
];

/* ---------- 04 · Working mind ---------- */
export const toolbox = [
  {
    id: 'languages', label: 'Languages', icon: 'folder',
    items: [
      { name: 'Python', note: 'FastAPI backends and ML, from BotView to Vision-Sentinel.' },
      { name: 'TypeScript', note: 'Angular and React front ends.' },
      { name: 'JavaScript', note: 'Node.js services and plain web pages.' },
      { name: 'SQL', note: 'PostgreSQL, Supabase and Oracle SQL.' },
      { name: 'C', note: 'Where I learned to program.' },
    ],
  },
  {
    id: 'frameworks', label: 'Frameworks', icon: 'folder',
    items: [
      { name: 'Angular', note: 'The Taskverse front end.' },
      { name: 'React', note: 'Dashboards, driver apps and storefronts.' },
      { name: '.NET', note: 'Taskverse microservices.' },
      { name: 'FastAPI', note: 'BotView and PlaceRocket backends.' },
      { name: 'Flask', note: 'Quick Python services.' },
      { name: 'Node.js', note: 'The DSA Masterclass payment funnel.' },
    ],
  },
  {
    id: 'ai', label: 'AI & ML', icon: 'folder',
    items: [
      { name: 'Generative AI', note: 'Gemini as BotView’s interviewer.' },
      { name: 'RAG', note: 'Semantic question search on Supabase pgvector.' },
      { name: 'LLM integration', note: 'Scoring, prompts and failure handling.' },
      { name: 'Computer vision', note: 'YOLOv11 PPE detection with Grad-CAM.' },
      { name: 'Speech-to-text', note: 'Live voice interviews with Sarvam AI.' },
    ],
  },
  {
    id: 'cloud', label: 'Cloud & Data', icon: 'folder',
    items: [
      { name: 'AWS', note: 'Elastic Beanstalk, Amplify, EC2 and CodeDeploy.' },
      { name: 'Vercel', note: 'Fast front-end deploys.' },
      { name: 'PostgreSQL', note: 'The default database for most of my projects.' },
      { name: 'Supabase', note: 'Auth, row-level security and pgvector.' },
      { name: 'MongoDB', note: 'BotView’s session store.' },
    ],
  },
  {
    id: 'tools', label: 'Daily tools', icon: 'folder',
    items: [
      { name: 'Git & GitHub', note: 'Every project lives here.' },
      { name: 'Figma', note: 'Designs before code.' },
      { name: 'Jitter', note: 'Motion and animated mockups.' },
      { name: 'n8n', note: 'Workflow automation.' },
      { name: 'Razorpay & Brevo', note: 'Payments and email for paid funnels.' },
      { name: 'Power BI', note: 'Data dashboards.' },
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
  { title: 'Vision-Sentinel', status: 'Running', note: 'Real-time PPE detection with YOLOv11, polygon geofencing and Grad-CAM explanations.' },
  { title: 'Lake detox robot', status: 'Shelved', note: 'A smart lake-cleaning robot I co-designed for the Karnataka & Goa NCC innovation competition.' },
  { title: 'Unisys Innovation Program', status: 'Running', note: 'Reached Phase 4 of the program.' },
];

export const learning = ['Russian', 'Public speaking (Indian Academy of Public Speaking, Level 1)', 'AI tools for productivity (BE 10X)'];

/* ---------- 05 · Life ---------- */
export const vibes = ['Read', 'Build', 'Explore', 'Create', 'Be present']; // from mockup

export const topics = [
  { id: 'travel', label: 'Travel', icon: 'mountain', blurb: 'Mountains, cities, roads & new perspectives.', items: ['DEMO: a trip', 'DEMO: a road', 'DEMO: a place you want to go'], cover: { alt: 'Travel photo', ratio: '4 / 3' } as Img, photos: [] as Img[] },
  { id: 'music', label: 'Music', icon: 'music', blurb: 'Sounds, playlists, concerts & late nights.', items: ['DEMO: an album on repeat', 'DEMO: a gig', 'DEMO: a playlist'], cover: { alt: 'Music photo', ratio: '4 / 3' } as Img, photos: [] as Img[] },
  { id: 'photography', label: 'Photography', icon: 'camera', blurb: 'Moments, people, places & everyday beauty.', items: ['DEMO: a favourite shot', 'DEMO: what you shoot on', 'DEMO: a series'], cover: { alt: 'Photography photo', ratio: '4 / 3' } as Img, photos: [] as Img[] },
  { id: 'books', label: 'Books', icon: 'book', blurb: 'Stories, ideas, thoughts & recommendations.', items: ['DEMO: reading now', 'DEMO: re-read every year', 'DEMO: recommend to everyone'], cover: { alt: 'Books photo', ratio: '4 / 3' } as Img, photos: [] as Img[] },
  { id: 'food', label: 'Food', icon: 'utensils', blurb: 'Local flavours, new tastes & guilty pleasures.', items: ['DEMO: a place', 'DEMO: a dish', 'DEMO: a recipe'], cover: { alt: 'Food photo', ratio: '4 / 3' } as Img, photos: [] as Img[] },
  { id: 'hobbies', label: 'Hobbies', icon: 'gamepad-2', blurb: 'Build, create, tinker, repeat.', items: ['Miniature and large-scale models', 'A 4-foot ship made entirely from reused materials', 'Art (Alabama Art Academy, USA)'], cover: { alt: 'Hobbies photo', ratio: '4 / 3' } as Img, photos: [] as Img[] },
  { id: 'communities', label: 'Communities', icon: 'users', blurb: 'People, groups, shared passions.', items: ['National Cadet Corps, SJBIT unit', 'Junior Under Officer', 'Organised a college coding event end to end'], cover: { alt: 'Communities photo', ratio: '4 / 3' } as Img, photos: [] as Img[] },
  { id: 'experiments', label: 'Side quests', icon: 'flask-conical', blurb: 'Side projects, learning & random ideas.', items: ['Smart lake detox robot', 'Unisys Innovation Program, Phase 4', 'Workflow automation with n8n'], cover: { alt: 'Side quests photo', ratio: '4 / 3' } as Img, photos: [] as Img[] },
]; // topic list from your mockup — keep only the ones that are true for you

export const moments = [
  { caption: 'Somewhere in the hills', date: 'DD Mon YYYY', image: { alt: 'Hills', ratio: '1 / 1' } as Img }, // DEMO
  { caption: 'Good music, better people', date: 'DD Mon YYYY', image: { alt: 'Concert', ratio: '1 / 1' } as Img }, // DEMO
  { caption: 'Small steps, big dreams', date: 'DD Mon YYYY', image: { alt: 'Notebook', ratio: '1 / 1' } as Img }, // DEMO
];

export const journal = [
  {
    slug: 'mountains-reset', date: 'DD Mon YYYY', title: 'The mountains always have a way of resetting you.', place: 'Place', tags: ['Travel', 'Reflections'],
    highlights: ['DEMO: highlight one', 'DEMO: highlight two', 'DEMO: highlight three'],
    body: [
      'DEMO: The first paragraph of a journal entry. Write the way you talk: where you were, who you were with, what the air felt like.',
      'DEMO: The second paragraph is the turn: the small moment that made the trip worth writing about.',
    ],
    image: { alt: 'Mountain valley', ratio: '4 / 3' } as Img,
    image2: { alt: 'Second photo from the trip', ratio: '1 / 1' } as Img,
  },
  {
    slug: 'good-music', date: 'DD Mon YYYY', title: 'A night of good music and great company.', place: 'Place', tags: ['Music', 'Friends'],
    highlights: ['DEMO', 'DEMO'],
    body: ['DEMO: journal entry body.', 'DEMO: a second paragraph.'],
    image: { alt: 'Live music', ratio: '4 / 3' } as Img,
  },
  {
    slug: 'small-steps', date: 'DD Mon YYYY', title: 'Small steps, big dreams.', place: 'Place', tags: ['Life', 'Growth'],
    highlights: ['DEMO', 'DEMO'],
    body: ['DEMO: journal entry body.', 'DEMO: a second paragraph.'],
    image: { alt: 'Open notebook', ratio: '4 / 3' } as Img,
  },
  {
    slug: 'new-recipe', date: 'DD Mon YYYY', title: 'A new recipe, same happiness.', place: 'Place', tags: ['Food', 'Experiments'],
    highlights: ['DEMO', 'DEMO'],
    body: ['DEMO: journal entry body.', 'DEMO: a second paragraph.'],
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
    'Voice-based AI agents that hold up in real conversations',
    'Computer vision for safety on live camera feeds',
    'RAG and LLM products that real people use every day',
  ],
  openTo: ['Full-time roles', 'Internships', 'Collaborations', 'Freelance builds'],
  intents: [
    { id: 'hire', label: 'Hire', subject: 'An opportunity for you', body: "Hi Param,\n\nI came across your archive and I'd like to talk about a role:\n\n" },
    { id: 'build', label: 'Build', subject: "Let's build something", body: "Hi Param,\n\nI have an idea I'd like to build with you:\n\n" },
    { id: 'hello', label: 'Say hi', subject: 'Hello from your archive', body: 'Hi Param,\n\n' },
  ],
};
