// ─────────────────────────────────────────────────
// ResolveOPS — Central Content Data
// Single source of truth for all site content
// ─────────────────────────────────────────────────

export interface Service {
  id: string;
  number: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  capabilities: string[];
  includes: string[];
  whoItsFor: string;
  outcome: string;
}

export interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  url: string;
  urlLabel: string;
  image: string;
  alt: string;
}

export interface ProcessStep {
  number: string;
  title: string;
  description: string;
}

// ── Brand ──────────────────────────────────────────

export const brand = {
  name: 'ResolveOPS',
  subtitle: 'Growth studio',
  tagline: 'We Design. We Develop. We Grow.',
  email: 'resolveops.growthstudio@gmail.com',
  instagram: 'https://www.instagram.com/resolveops.growthstudio/',
  description:
    'A freelance community providing websites, design, digital marketing, automation, and analytics for businesses.',
  heroSubtext:
    'We build websites, automate everyday workflows, and turn business data into clear dashboards—helping businesses attract enquiries and run more efficiently.',
  footerDescription:
    'We bring design, development, marketing, automation, and analytics together — built around your business goals.',
  ctaEyebrow: 'HAVE A PROJECT IN MIND?',
  ctaHeading: "Let's build something that helps your business grow.",
  contactHeading: "Tell us what you're building.",
  contactSubtext:
    "Describe your business and the project you have in mind. We'll get back to you to discuss how we can help.",
} as const;

// ── Navigation ────────────────────────────────────

export const navigation = [
  { label: 'Home', path: '/' },
  { label: 'Services', path: '/services' },
  { label: 'Work', path: '/work' },
  { label: 'About', path: '/about' },
  { label: 'Contact', path: '/contact' },
] as const;

// ── Services ──────────────────────────────────────

export const services: Service[] = [
  {
    id: 'website-development',
    number: '01',
    title: 'Website Development',
    shortDescription:
      'Modern, responsive websites and landing pages built to represent your business clearly and perform across every device.',
    fullDescription:
      'We build websites that load fast, look sharp, and guide visitors toward the actions that matter to your business. Every project starts with your goals — whether that means a clean business website, a high-converting landing page, or a full web application.',
    capabilities: ['Business websites', 'Landing pages', 'Responsive design', 'Web applications'],
    includes: [
      'Custom responsive design',
      'Mobile-first development',
      'Performance optimization',
      'SEO-ready structure',
      'Content management setup',
    ],
    whoItsFor:
      'Businesses launching a new website, replacing an outdated one, or building a focused landing page for a campaign.',
    outcome:
      'A fast, professional website that represents your business clearly and helps visitors take the next step.',
  },
  {
    id: 'ui-ux-design',
    number: '02',
    title: 'UI/UX & Conversion Optimization',
    shortDescription:
      'User interface design, UX audits, and conversion-focused improvements that make your website easier to use and more effective.',
    fullDescription:
      'Great design is invisible — visitors find what they need, understand what you offer, and take action without friction. We design interfaces in Figma, audit existing experiences, and rebuild pages with conversion in mind.',
    capabilities: ['Figma design', 'Redesign', 'UX audits', 'Conversion-focused pages'],
    includes: [
      'Interface design in Figma',
      'UX audit and recommendations',
      'Conversion rate analysis',
      'Landing page optimization',
      'Design system creation',
    ],
    whoItsFor:
      "Businesses with an existing website that isn't converting, or teams launching a new product that needs a polished user experience.",
    outcome:
      'A clearer, more intuitive experience that makes it easier for visitors to understand your offer and reach out.',
  },
  {
    id: 'seo-digital-marketing',
    number: '03',
    title: 'SEO & Digital Marketing',
    shortDescription:
      'Search engine optimization, local SEO, content strategy, and social media support to help your business get found online.',
    fullDescription:
      'Visibility matters. We help businesses appear in search results, strengthen their local presence, and build a consistent content strategy that attracts the right audience over time.',
    capabilities: ['SEO', 'Local SEO', 'Content strategy', 'Social media support'],
    includes: [
      'Technical SEO audit',
      'Keyword research and strategy',
      'Local business listing optimization',
      'Content planning and guidelines',
      'Social media setup and guidance',
    ],
    whoItsFor:
      'Service businesses and local companies that want to be found when potential customers search for what they offer.',
    outcome:
      'Improved search visibility and a content foundation that helps your business attract and engage the right audience.',
  },
  {
    id: 'ai-automation',
    number: '04',
    title: 'AI Automation',
    shortDescription:
      'AI chatbots, email automation, and document workflows that save time and handle repetitive tasks so your team can focus on growth.',
    fullDescription:
      'We build AI-powered tools that handle routine communication and document processing — from chatbots that answer common questions to automated email sequences and document workflows that reduce manual effort.',
    capabilities: ['AI chatbots', 'AI agents', 'Email automation', 'Document automation'],
    includes: [
      'Custom AI chatbot setup',
      'Automated email sequences',
      'Document processing workflows',
      'Integration with existing tools',
      'Testing and deployment',
    ],
    whoItsFor:
      'Businesses spending too much time on repetitive communication, document handling, or manual follow-ups.',
    outcome:
      'Automated workflows that handle routine tasks, freeing your team to focus on work that requires a human touch.',
  },
  {
    id: 'crm-workflow-automation',
    number: '05',
    title: 'CRM & Workflow Automation',
    shortDescription:
      'Lead management, CRM workflows, and automated follow-ups that keep your sales pipeline organized and responsive.',
    fullDescription:
      'We set up CRM systems and workflow automations that track leads, trigger follow-ups, and keep your sales process moving — across email, WhatsApp, and the tools your team already uses.',
    capabilities: ['Lead management', 'CRM workflows', 'WhatsApp/email follow-ups', 'Sales automation'],
    includes: [
      'CRM setup and configuration',
      'Lead tracking pipeline',
      'Automated follow-up sequences',
      'WhatsApp and email integration',
      'Sales process documentation',
    ],
    whoItsFor:
      'Growing businesses that need to organize their leads, automate follow-ups, and build a repeatable sales process.',
    outcome:
      'A structured pipeline that captures leads, follows up consistently, and helps your team close more business.',
  },
  {
    id: 'business-analytics',
    number: '06',
    title: 'Business Analytics',
    shortDescription:
      'Power BI dashboards, KPI reporting, and automated insights that help you make informed decisions with clear, visual data.',
    fullDescription:
      "We build dashboards and reporting systems that turn your business data into clear, actionable insights. From KPI tracking to automated reports, we help you see what's working and where to focus next.",
    capabilities: ['Power BI dashboards', 'KPI reporting', 'Automated reports', 'Business insights'],
    includes: [
      'Custom dashboard design',
      'KPI tracking setup',
      'Automated report generation',
      'Data visualization',
      'Performance monitoring',
    ],
    whoItsFor:
      'Business owners and teams who need clear visibility into performance metrics without manually building spreadsheets.',
    outcome:
      'Visual dashboards and automated reports that give you a clear picture of business performance and guide better decisions.',
  },
];

// ── Projects ──────────────────────────────────────

export const projects: Project[] = [
  {
    id: 'ymta-dental',
    title: 'YMTA Dental Clinic',
    category: 'Website Development',
    description:
      '**Status:** Project showcase\n**Objective:** Present treatments and clinic information clearly to prospective patients.\n**Constraints:** Required a fast, mobile-friendly design reflecting a professional healthcare environment.\n**Contribution:** Full design and development.\n**Features:** Interactive treatment sections, responsive layouts, and direct appointment enquiry pathways.\n**Outcome:** A professional web presence built for patient conversion.',
    url: 'https://ymta-dental-clinic-demo.vercel.app/',
    urlLabel: 'View project showcase',
    image: '/projects/ymta-real.png',
    alt: 'YMTA Dental Clinic live website homepage showing dental treatments and appointment booking in Coimbatore',
  },
  {
    id: 'sindhus-dental',
    title: "Sindhu's Multispeciality Dental Clinic",
    category: 'Website Development',
    description:
      '**Status:** Delivered\n**Objective:** Create a comprehensive digital presence for a multispeciality clinic.\n**Constraints:** Needed to organize multiple specialized treatments into an intuitive navigation structure.\n**Contribution:** Full design and development.\n**Features:** Detailed service pages, clinic gallery, and integrated contact options.\n**Outcome:** A clean, accessible website that effectively communicates clinic expertise.',
    url: 'https://sindhus-multispeciality-dental-clin.vercel.app/',
    urlLabel: 'View live website',
    image: '/projects/sindhu-real.png',
    alt: "Sindhu's Multispeciality Dental Clinic live website showing treatments and clinic information in Tiruppur",
  },
];

// ── Process ───────────────────────────────────────

export const processSteps: ProcessStep[] = [
  {
    number: '01',
    title: 'Discover',
    description:
      'We learn about your business, your audience, and what success looks like for this project.',
  },
  {
    number: '02',
    title: 'Define',
    description:
      'We outline the scope, structure, and priorities — so every decision moves toward your goals.',
  },
  {
    number: '03',
    title: 'Design & Build',
    description:
      'We design the experience and build it — iterating with you until the details feel right.',
  },
  {
    number: '04',
    title: 'Test & Launch',
    description:
      'We test across devices, fix issues, and launch when everything works as intended.',
  },
  {
    number: '05',
    title: 'Improve',
    description:
      'We review performance, gather feedback, and make informed improvements over time.',
  },
];

// ── Budget options ────────────────────────────────

export const budgetOptions = [
  'Under ₹10,000',
  '₹10,000 – ₹25,000',
  '₹25,000 – ₹50,000',
  '₹50,000 – ₹1,00,000',
  'Above ₹1,00,000',
  'Not sure yet',
] as const;
