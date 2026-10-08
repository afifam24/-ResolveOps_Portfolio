import { brand, services, projects, processSteps } from './content';
export { brand, services, projects, processSteps };
export const suggestions = [
  'What services do you offer?', 'How much does a website cost?',
  'Can you build an AI chatbot?', 'Show me your projects.',
  'How long does a website take?', 'Do you work with small businesses?',
  'Can you automate my business?', 'What makes ResolveOPS different?', 'How do I start a project?',
];
export const knowledge = {
  pricing: 'Pricing depends on the scope, pages, functionality, integrations and level of customization. The budget choices in our enquiry form are preferences, not fixed package prices. Share your requirements for a scope-based discussion.',
  timeline: 'There is no fixed delivery timeline published here. Timing depends on scope, content and integrations. Share your requirements so the studio can discuss milestones with you.',
  fallback: "I don't have that information yet. I can help with ResolveOPS services, projects, process or starting a project.",
  technology: 'Our service information includes Figma for interface design and Power BI for dashboards. The right tools for a project depend on its requirements; contact the studio to discuss your stack.',
};
export const serviceKeywords: Record<string, string[]> = {
  'website-development': ['website', 'web development', 'landing page', 'web app'],
  'ui-ux-design': ['ui', 'ux', 'design', 'redesign', 'conversion', 'figma'],
  'seo-digital-marketing': ['seo', 'marketing', 'leads', 'search', 'social media'],
  'ai-automation': ['ai', 'chatbot', 'agent', 'document', 'email automation'],
  'crm-workflow-automation': ['crm', 'workflow', 'pipeline', 'follow up', 'follow-up', 'automate'],
  'business-analytics': ['analytics', 'dashboard', 'power bi', 'report', 'data'],
};
