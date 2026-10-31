/* ==========================================================================
   SKILL BOOK — chapter 04's spiral journal.
   Each page is a tab in the book; each skill is one slot on that page.
   `projects` are slugs from src/content/projects/ (the book links to them and
   reads their place and year); `from` adds anything that isn't a project,
   such as a course or a role. Leave a page's list short — empty slots show
   as "still learning".
   Icons: `brand` is a Simple Icons slug, `icon` is a Lucide icon name.
   ========================================================================== */

export type Skill = {
  id: string;
  name: string;
  brand?: string;
  icon?: string;
  note: string;
  projects: string[];
  from?: string[];
};

export type SkillPage = { id: string; title: string; icon: string; skills: Skill[] };

export const skillBook: SkillPage[] = [
  {
    id: 'languages', title: 'Languages', icon: 'code',
    skills: [
      { id: 'python', name: 'Python', brand: 'python', note: 'My default for backends, ML and anything that needs to work by tonight.', projects: ['botview', 'placerocket', 'vision-sentinel', 'ai-pc-readiness'] },
      { id: 'typescript', name: 'TypeScript', brand: 'typescript', note: 'Types on every front end I build.', projects: ['taskverse', 'thindi-angadi', 'kings-club', 'ncc-sjbit-portal'] },
      { id: 'sql', name: 'SQL', icon: 'database', note: 'Schemas, migrations and the queries behind every report.', projects: ['taskverse', 'placerocket', 'dsa-masterclass-funnel', 'ncc-sjbit-portal'] },
      { id: 'javascript', name: 'JavaScript', brand: 'javascript', note: 'Node services and plain, fast web pages.', projects: ['dsa-masterclass-funnel'] },
      { id: 'c', name: 'C', brand: 'c', note: 'Where I learned how a computer actually runs code.', projects: [], from: ['Coursework at SJBIT'] },
    ],
  },
  {
    id: 'frameworks', title: 'Frameworks', icon: 'layers',
    skills: [
      { id: 'fastapi', name: 'FastAPI', brand: 'fastapi', note: 'Async Python APIs, from interview loops to dispatch engines.', projects: ['botview', 'placerocket', 'vision-sentinel', 'ai-pc-readiness'] },
      { id: 'react', name: 'React', brand: 'react', note: 'Dashboards, driver apps and tournament desks.', projects: ['botview', 'placerocket', 'vision-sentinel', 'kings-club', 'ncc-sjbit-portal'] },
      { id: 'angular', name: 'Angular', brand: 'angular', note: 'A large, role-based assessment app.', projects: ['taskverse'] },
      { id: 'dotnet', name: '.NET', brand: 'dotnet', note: 'Microservices behind Taskverse.', projects: ['taskverse'] },
      { id: 'nextjs', name: 'Next.js', brand: 'nextdotjs', note: 'A storefront that had to feel like a brand.', projects: ['thindi-angadi'] },
      { id: 'node', name: 'Node.js', brand: 'nodedotjs', note: 'A payment funnel with webhooks done right.', projects: ['dsa-masterclass-funnel'] },
      { id: 'flask', name: 'Flask', brand: 'flask', note: 'Small Python services and prototypes.', projects: [], from: ['Side projects'] },
    ],
  },
  {
    id: 'ai', title: 'AI & ML', icon: 'brain-circuit',
    skills: [
      { id: 'agents', name: 'Agentic AI', icon: 'bot', note: 'Agents that ask only what is missing and act through real APIs.', projects: ['ugrid', 'botview'] },
      { id: 'genai', name: 'Generative AI', brand: 'googlegemini', note: 'LLMs as interviewers, assistants and scorers.', projects: ['botview', 'ugrid'] },
      { id: 'rag', name: 'RAG', icon: 'search', note: 'Semantic search over a question bank with pgvector.', projects: ['botview'] },
      { id: 'cv', name: 'Computer vision', brand: 'ultralytics', note: 'YOLO detection and tracking on live camera feeds.', projects: ['vision-sentinel'], from: ['NPTEL Computer Vision, IIT Kharagpur'] },
      { id: 'xai', name: 'Explainable AI', icon: 'sparkles', note: 'Grad-CAM heatmaps, and tests that check them.', projects: ['vision-sentinel'] },
      { id: 'stt', name: 'Speech-to-text', icon: 'mic', note: 'Streaming voice that holds up over long answers.', projects: ['botview'] },
      { id: 'prompting', name: 'Prompt engineering', icon: 'message-circle', note: 'Prompts with rules, fallbacks and failure handling.', projects: ['botview', 'ugrid'] },
    ],
  },
  {
    id: 'cloud', title: 'Cloud & Data', icon: 'cloud',
    skills: [
      { id: 'postgres', name: 'PostgreSQL', brand: 'postgresql', note: 'The database under most of what I build.', projects: ['taskverse', 'placerocket', 'dsa-masterclass-funnel'] },
      { id: 'aws', name: 'AWS', icon: 'cloud', note: 'Elastic Beanstalk, Amplify, EC2 and CodeDeploy.', projects: ['taskverse', 'botview', 'dsa-masterclass-funnel'] },
      { id: 'supabase', name: 'Supabase', brand: 'supabase', note: 'Auth, row-level security and pgvector.', projects: ['botview', 'ncc-sjbit-portal'] },
      { id: 'docker', name: 'Docker', brand: 'docker', note: 'Whole stacks that start with one command.', projects: ['placerocket', 'vision-sentinel'] },
      { id: 'vm', name: 'VM automation', icon: 'server', note: 'Builds triggered straight into Morpheus through its API.', projects: ['ugrid'] },
      { id: 'mongodb', name: 'MongoDB', brand: 'mongodb', note: 'Interview sessions and scores.', projects: ['botview'] },
      { id: 'redis', name: 'Redis', brand: 'redis', note: 'Geo search for the nearest driver, OTPs and rate limits.', projects: ['placerocket'] },
      { id: 'nginx', name: 'Nginx', brand: 'nginx', note: 'Reverse proxy and rate limits in production.', projects: ['dsa-masterclass-funnel', 'botview'] },
    ],
  },
  {
    id: 'craft', title: 'Craft & Lead', icon: 'pen-tool',
    skills: [
      { id: 'leadership', name: 'Leadership', icon: 'users', note: 'Leading teams under pressure, from parade grounds to hackathons.', projects: ['ai-pc-readiness'], from: ['Junior Under Officer, NCC'] },
      { id: 'design', name: 'UI design', brand: 'figma', note: 'Interfaces designed before a line of code.', projects: ['thindi-angadi', 'dsa-masterclass-funnel', 'kings-club'] },
      { id: 'payments', name: 'Payments', brand: 'razorpay', note: 'Checkout, signature checks and idempotent webhooks.', projects: ['dsa-masterclass-funnel', 'thindi-angadi'] },
      { id: 'testing', name: 'Testing', icon: 'clipboard-check', note: 'Load tests, audits and the bugs only real load finds.', projects: ['placerocket', 'taskverse', 'vision-sentinel'] },
      { id: 'git', name: 'Git & GitHub', brand: 'github', note: 'Every project, every branch.', projects: ['botview', 'taskverse', 'placerocket', 'vision-sentinel'] },
      { id: 'automation', name: 'Automation', brand: 'n8n', note: 'Workflows that remove manual steps.', projects: ['ugrid', 'thindi-angadi'] },
    ],
  },
];
