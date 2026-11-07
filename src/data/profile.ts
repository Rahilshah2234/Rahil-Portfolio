// Every fact on the site lives here. Edit this file to update content.
// Project details come from each repository's README (checked 2026-11-06).

export const profile = {
  name: 'Rahil Shah',
  firstName: 'Rahil',
  initials: 'RS',
  role: 'AI & Data Science student',
  summary:
    'AI & Data Science student with an interest in data science, web development, and technology, eager to apply technical skills and gain real-world experience.',
  college: 'KKWIEER, Nashik',
  degree: 'B.Tech in Artificial Intelligence & Data Science',
  batch: '2023 – 2027',
  email: 'shahrahil67790@gmail.com',
  github: { label: 'github.com/Rahilshah2234', href: 'https://github.com/Rahilshah2234' },
  linkedin: { label: 'linkedin.com/in/rahil-shah-8a8a1526a', href: 'https://www.linkedin.com/in/rahil-shah-8a8a1526a' },
  timezone: 'Asia/Kolkata',
  city: 'Nashik',
}

export type Project = {
  slug: string
  index: string
  name: string
  short: string
  overview: string
  problem: string
  // Shown under the header when the project is not finished.
  status?: string
  features: string[]
  featuresHeading?: string
  date: string
  year: string
  kind: string
  category: string
  role: string
  tech: string[]
  techHeading?: string
  repo: string
  hue: string
}

export const projects: Project[] = [
  {
    slug: 'carbonomics',
    index: '01',
    name: 'Carbonomics AI',
    short: 'An AI decision-support system for institutional carbon emissions.',
    overview:
      'An AI-powered decision-support system to measure, analyze, predict and optimize carbon emissions for institutions such as colleges, hospitals and industries. It combines carbon accounting, emissions prediction, scenario simulation and optimization.',
    problem:
      'Most carbon management tools focus on reporting and compliance. Institutions need help predicting emissions and testing which reduction options would work.',
    status:
      'Live at carbonomics.app. The public demo uses made-up numbers for an imaginary campus, labelled FAKE throughout. Uploading your own data, history and reports requires an account.',
    features: [
      'Scope 1, 2 and 3 emissions accounting',
      'Activity × Factor emission calculation',
      'Time-based validation of activity records',
      'Emissions forecasting',
      'What-if scenarios and a budget-aware reduction plan',
      'Plain-language PDF reports',
    ],
    date: 'Final year project',
    year: '2027',
    kind: 'Final Year Project',
    category: 'AI / Machine Learning',
    role: 'Team Member',
    // Not listed: the live site does not name its stack, and the repo README stack is not confirmed.
    tech: [],
    repo: 'https://github.com/Rahilshah2234/carbonomics-ai',
    hue: '#7FB8A4',
  },
  {
    slug: 'hostelhub',
    index: '02',
    name: 'HostelHub',
    short: 'A role-based web system for running college hostel operations.',
    overview:
      'A full-stack, role-based hostel management system that digitizes room allocation, fees, maintenance complaints, visitor logs and announcements. It replaces paper registers and spreadsheets.',
    problem:
      'Hostel operations such as room allocation, fee collection and complaint tracking are often kept in paper registers or spreadsheets.',
    features: [
      'Room allocation with safeguards against overbooking',
      'Fee management with receipts (online payment is simulated)',
      'Maintenance complaints filed and tracked by category',
      'Visitor logging at the gate and visitor history',
      'Block announcements and printable reports',
      'Separate dashboards for administrators, wardens and students',
      'Security: bcrypt password hashing, CSRF tokens and prepared statements',
    ],
    date: 'Web development project',
    year: '2025',
    kind: 'Full Stack Web Development',
    category: 'Full Stack Web Development',
    role: 'Team Leader',
    tech: ['PHP', 'MySQL', 'HTML5', 'CSS3', 'JavaScript', 'Bootstrap 5'],
    repo: 'https://github.com/Rahilshah2234/hostelhub',
    hue: '#E8B85C',
  },
  {
    slug: 'prodexa',
    index: '03',
    name: 'Prodexa',
    short: 'An AI product-readiness platform for startups and hackathon teams.',
    overview:
      'An AI-powered platform that analyzes a project’s website, GitHub repository and pitch material, then produces a launch-readiness report with prioritized recommendations.',
    problem:
      'Early-stage teams often lack a structured review of their product before launch, across UX, performance, accessibility and business positioning.',
    features: [
      'Website, GitHub repository and product analysis',
      'UX, performance and accessibility review',
      'Business and pitch analysis',
      'AI-generated launch roadmap',
      'Product readiness score with improvement tracking',
    ],
    date: 'InnovaHack 2026',
    year: '2026',
    kind: 'Team Project',
    category: 'AI / Full Stack Development',
    role: 'Team Member',
    tech: ['Next.js 15', 'React', 'TypeScript', 'Tailwind CSS', 'Firebase', 'Gemini API', 'Lighthouse'],
    repo: 'https://github.com/Rahilshah2234/Prodexa',
    hue: '#8FA8FF',
  },
]

// Technologies used in the projects, shown as pill tags and in the marquee.
export const projectTech = [
  'PHP',
  'MySQL',
  'Bootstrap',
  'Next.js',
  'TypeScript',
  'Firebase',
  'Gemini API',
  'Kotlin',
  'Jetpack Compose',
  'Tailwind CSS',
]

export const skillGroups = [
  {
    label: 'Programming',
    items: ['C', 'C++', 'Python', 'JavaScript', 'TypeScript', 'SQL'],
  },
  {
    label: 'Core Computer Science',
    items: [
      'Data Structures & Algorithms',
      'Object-Oriented Programming',
      'DBMS',
      'Operating Systems',
      'Computer Networks',
    ],
  },
  {
    label: 'Databases',
    items: ['MySQL', 'MongoDB', 'Firebase', 'Supabase'],
  },
  {
    label: 'Web Development',
    items: ['HTML5', 'CSS3', 'React.js', 'Next.js', 'Tailwind CSS', 'Bootstrap', 'REST APIs'],
  },
  {
    label: 'Tools & Development',
    items: ['Git', 'GitHub', 'VS Code', 'Android Studio', 'Postman', 'npm / pnpm', 'Power BI'],
  },
]

export type StoryEntry = {
  index: string
  year: string
  date: string
  title: string
  place: string
  detail: string[]
}

export const story: StoryEntry[] = [
  {
    index: '01',
    year: '2023',
    date: '2023–24',
    title: 'Beginning of Engineering',
    place: 'B.E. · AI & Data Science',
    detail: [
      'Started B.E. in Artificial Intelligence & Data Science at K.K. Wagh Institute of Engineering Education & Research, Nashik.',
      'Built a foundation in programming, computer science, and problem-solving.',
      'Started exploring programming languages like Python, C, and C++.',
    ],
  },
  {
    index: '02',
    year: '2024',
    date: '2024–25',
    title: 'Exploring Technology',
    place: 'Data · Databases · Software',
    detail: [
      'Developed an interest in Data Analytics, databases, and software development.',
      'Explored SQL, MySQL, and MongoDB.',
      'Started understanding how technology can solve practical problems through academic work.',
    ],
  },
  {
    index: '03',
    year: '2025',
    date: '2025–26',
    title: 'Building Projects',
    place: 'IoT · Android · Web',
    detail: [
      'Worked on projects involving IoT, Android development, and web technologies.',
      'Developed MoodWave, an offline mood-based music application.',
      'Gained hands-on experience with Kotlin, Jetpack Compose, and database integration.',
    ],
  },
  {
    index: '04',
    year: '2025',
    date: '2025–26',
    title: 'Expanding Development Skills',
    place: 'Backend · Databases · Git',
    detail: [
      'Worked on HostelHub, a Hostel Management System.',
      'Explored backend development, database management, and web technologies.',
      'Started contributing to open-source development using Git and GitHub.',
    ],
  },
  {
    index: '05',
    year: '2026',
    date: '2026–27',
    title: 'Building Real-World Solutions',
    place: 'Carbonomics AI · Prodexa · Open source',
    detail: [
      'Developing Carbonomics AI as a final-year project focused on carbon accounting, emission analysis, and forecasting.',
      'Participated in InnovaHack 2026 with Prodexa, an AI-powered product readiness platform.',
      'Became a maintainer of HostelHub in Nexus Spring of Code Winter Edition, coordinating contributors and reviewing pull requests.',
    ],
  },
  {
    index: '06',
    year: '2026',
    date: 'PRESENT',
    title: "Ready for What's Next",
    place: 'Final year · AI & Data Science',
    detail: [
      'Pursuing the final year of B.E. in Artificial Intelligence & Data Science.',
      'Exploring AI, Machine Learning, Software Development, and Data Analytics.',
      'Focused on building practical solutions, improving technical skills, and preparing for professional opportunities.',
    ],
  },
]

export const certifications = [
  { title: 'Data Analyst Roadmap Certification', issuer: '', topic: 'Data analysis basics' },
  { title: 'AI for Beginners', issuer: 'HP', topic: 'AI fundamentals' },
  { title: 'Introduction to Cyber Security', issuer: 'HP', topic: 'Cybersecurity basics' },
  { title: 'Data Analytics Job Simulation', issuer: 'Deloitte', topic: 'Data analysis & Power BI' },
]

export const interests = [
  {
    title: 'Automotive Enthusiast',
    description:
      'Passionate about cars, automotive engineering, iconic automobiles, and everything related to the automotive world.',
    icon: 'car',
  },
  {
    title: 'Gaming',
    description: 'Enjoy gaming, competitive gameplay, and exploring immersive digital experiences.',
    icon: 'gamepad',
  },
  {
    title: 'Technology Explorer',
    description:
      'Always curious about new technologies, AI tools, and emerging innovations shaping the future.',
    icon: 'laptop',
  },
] as const

export const nav = [
  { label: 'Work', href: '#work' },
  { label: 'Toolkit', href: '#toolkit' },
  { label: 'My story', href: '#story' },
  { label: 'Certifications', href: '#certifications' },
]

export const githubProfileUrl = 'https://github.com/Rahilshah2234'
