/* ==========================================================================
   SKILL BOOK — chapter 04's spiral journal.
   Each page is a tab in the book; each skill is one slot on that page.
   `projects` are slugs from src/content/projects/ (the book links to them and
   reads their place and year); `from` adds anything that isn't a project,
   such as a course or a role. Leave a page's list short — empty slots show
   as "still learning".
   Icons: `brand` is a Simple Icons slug, `icon` is a Lucide icon name.
   `quip` is the skill's protest when a visitor drags it to the bin twice.
   ========================================================================== */

export type Skill = {
  id: string;
  name: string;
  brand?: string;
  icon?: string;
  note: string;
  /** What the skill says when someone tries to bin it a second time */
  quip: string;
  /** Icon colour for Lucide icons; brand icons use their own colour */
  color?: string;
  projects: string[];
  from?: string[];
};

export type SkillPage = { id: string; title: string; icon: string; skills: Skill[] };

export const skillBook: SkillPage[] = [
  {
    id: 'languages', title: 'Languages', icon: 'code',
    skills: [
      { id: 'python', name: 'Python', brand: 'python', quip: 'why do you hate me? I carried four projects on my back :(', note: 'My default for backends, ML and anything that needs to work by tonight.', projects: ['botview', 'placerocket', 'vision-sentinel', 'ai-pc-readiness'] },
      { id: 'typescript', name: 'TypeScript', brand: 'typescript', quip: "remove me?? enjoy 'undefined is not a function' at 2 AM then", note: 'Types on every front end I build.', projects: ['taskverse', 'thindi-angadi', 'kings-club', 'ncc-sjbit-portal'] },
      { id: 'sql', name: 'SQL', icon: 'database', color: '#336791', quip: "DROP TABLE skills; ...see? that's exactly how you sound right now", note: 'Schemas, migrations and the queries behind every report.', projects: ['taskverse', 'placerocket', 'dsa-masterclass-funnel', 'ncc-sjbit-portal'] },
      { id: 'javascript', name: 'JavaScript', brand: 'javascript', quip: 'the whole internet runs on me and you want me in the bin. ok. cool.', note: 'Node services and plain, fast web pages.', projects: ['dsa-masterclass-funnel'] },
      { id: 'c', name: 'C', brand: 'c', color: '#4f6fa8', quip: 'I taught him pointers. POINTERS. some respect please', note: 'Where I learned how a computer actually runs code.', projects: [], from: ['Coursework at SJBIT'] },
    ],
  },
  {
    id: 'frameworks', title: 'Frameworks', icon: 'layers',
    skills: [
      { id: 'fastapi', name: 'FastAPI', brand: 'fastapi', quip: 'fast, async, typed... and you want to await my deletion?', note: 'Async Python APIs, from interview loops to dispatch engines.', projects: ['botview', 'placerocket', 'vision-sentinel', 'ai-pc-readiness'] },
      { id: 'react', name: 'React', brand: 'react', quip: 'without me those dashboards are just very sad divs', note: 'Dashboards, driver apps and tournament desks.', projects: ['botview', 'placerocket', 'vision-sentinel', 'kings-club', 'ncc-sjbit-portal'] },
      { id: 'angular', name: 'Angular', brand: 'angular', color: '#dd0031', quip: '600 students log in through me. you go explain it to them', note: 'A large, role-based assessment app.', projects: ['taskverse'] },
      { id: 'dotnet', name: '.NET', brand: 'dotnet', quip: 'every single microservice stops if I go. every. single. one.', note: 'Microservices behind Taskverse.', projects: ['taskverse'] },
      { id: 'nextjs', name: 'Next.js', brand: 'nextdotjs', quip: 'the snack shop goes offline and all of Karnataka cries', note: 'A storefront that had to feel like a brand.', projects: ['thindi-angadi'] },
      { id: 'node', name: 'Node.js', brand: 'nodedotjs', quip: 'the ₹99 masterclass payments go through me. think of the revenue bro', note: 'A payment funnel with webhooks done right.', projects: ['dsa-masterclass-funnel'] },
      { id: 'flask', name: 'Flask', brand: 'flask', quip: "I'm small but I'm loyal. that was mean.", note: 'Small Python services and prototypes.', projects: [], from: ['Side projects'] },
    ],
  },
  {
    id: 'ai', title: 'AI & ML', icon: 'brain-circuit',
    skills: [
      { id: 'agents', name: 'Agentic AI', icon: 'bot', quip: "I'm an agent. I only ask what's missing. and you're asking for THIS?", color: '#7b5ea7', note: 'Agents that ask only what is missing and act through real APIs.', projects: ['ugrid', 'botview'] },
      { id: 'genai', name: 'Generative AI', brand: 'googlegemini', quip: 'I generate answers, not tears. please stop.', note: 'LLMs as interviewers, assistants and scorers.', projects: ['botview', 'ugrid'] },
      { id: 'rag', name: 'RAG', icon: 'search', quip: 'retrieving reasons to stay... 1 result found: he needs me', color: '#2f8f83', note: 'Semantic search over a question bank with pgvector.', projects: ['botview'] },
      { id: 'cv', name: 'Computer vision', brand: 'ultralytics', quip: 'I can see you dragging me, you know.', note: 'YOLO detection and tracking on live camera feeds.', projects: ['vision-sentinel'], from: ['NPTEL Computer Vision, IIT Kharagpur'] },
      { id: 'xai', name: 'Explainable AI', icon: 'sparkles', quip: 'let me explain why this is a bad idea. with a heatmap.', color: '#d99a00', note: 'Grad-CAM heatmaps, and tests that check them.', projects: ['vision-sentinel'] },
      { id: 'stt', name: 'Speech-to-text', icon: 'mic', quip: 'I heard that. I hear everything.', color: '#d9534f', note: 'Streaming voice that holds up over long answers.', projects: ['botview'] },
      { id: 'prompting', name: 'Prompt engineering', icon: 'message-circle', quip: "bad prompt. try again with 'please keep this skill'", color: '#3d7cc9', note: 'Prompts with rules, fallbacks and failure handling.', projects: ['botview', 'ugrid'] },
    ],
  },
  {
    id: 'cloud', title: 'Cloud & Data', icon: 'cloud',
    skills: [
      { id: 'postgres', name: 'PostgreSQL', brand: 'postgresql', quip: 'ACID compliant. this deletion? not compliant.', note: 'The database under most of what I build.', projects: ['taskverse', 'placerocket', 'dsa-masterclass-funnel'] },
      { id: 'aws', name: 'AWS', icon: 'cloud', quip: "your cloud bill is already scary, don't make it emotional too", color: '#e8890c', note: 'Elastic Beanstalk, Amplify, EC2 and CodeDeploy.', projects: ['taskverse', 'botview', 'dsa-masterclass-funnel'] },
      { id: 'supabase', name: 'Supabase', brand: 'supabase', quip: 'row-level security says: access denied :)', note: 'Auth, row-level security and pgvector.', projects: ['botview', 'ncc-sjbit-portal'] },
      { id: 'docker', name: 'Docker', brand: 'docker', quip: "it works on his machine. it'll stop working on yours.", note: 'Whole stacks that start with one command.', projects: ['placerocket', 'vision-sentinel'] },
      { id: 'vm', name: 'VM automation', icon: 'server', quip: "I provision a whole VM in one click. you can't delete me in two.", color: '#5b7a99', note: 'Builds triggered straight into Morpheus through its API.', projects: ['ugrid'] },
      { id: 'mongodb', name: 'MongoDB', brand: 'mongodb', quip: 'no schema, no problem, no deletion.', note: 'Interview sessions and scores.', projects: ['botview'] },
      { id: 'redis', name: 'Redis', brand: 'redis', quip: "I'm cached. you can't get rid of me that fast.", note: 'Geo search for the nearest driver, OTPs and rate limits.', projects: ['placerocket'] },
      { id: 'nginx', name: 'Nginx', brand: 'nginx', quip: '403 Forbidden. try again never.', note: 'Reverse proxy and rate limits in production.', projects: ['dsa-masterclass-funnel', 'botview'] },
    ],
  },
  {
    id: 'craft', title: 'Craft & Lead', icon: 'pen-tool',
    skills: [
      { id: 'leadership', name: 'Leadership', icon: 'users', quip: 'without this skill my manager is gonna belt me', color: '#c0392b', note: 'Leading teams under pressure, from parade grounds to hackathons.', projects: ['ai-pc-readiness'], from: ['Junior Under Officer, NCC'] },
      { id: 'design', name: 'UI design', brand: 'figma', quip: "you don't want me to design beautiful pages? :(", note: 'Interfaces designed before a line of code.', projects: ['thindi-angadi', 'dsa-masterclass-funnel', 'kings-club'] },
      { id: 'payments', name: 'Payments', brand: 'razorpay', quip: 'no payments skill = no salary. you thought about that?', note: 'Checkout, signature checks and idempotent webhooks.', projects: ['dsa-masterclass-funnel', 'thindi-angadi'] },
      { id: 'testing', name: 'Testing', icon: 'clipboard-check', quip: 'I tested this decision. it fails.', color: '#3c8d4f', note: 'Load tests, audits and the bugs only real load finds.', projects: ['placerocket', 'taskverse', 'vision-sentinel'] },
      { id: 'git', name: 'Git & GitHub', brand: 'github', quip: "fine. I'll just git revert whatever you're doing.", note: 'Every project, every branch.', projects: ['botview', 'taskverse', 'placerocket', 'vision-sentinel'] },
      { id: 'automation', name: 'Automation', brand: 'n8n', quip: 'too late, I already automated putting myself back.', note: 'Workflows that remove manual steps.', projects: ['ugrid', 'thindi-angadi'] },
    ],
  },
];
