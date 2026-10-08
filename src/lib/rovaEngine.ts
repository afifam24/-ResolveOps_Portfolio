import { brand, services, projects, processSteps, knowledge, serviceKeywords } from '../data/rovaKnowledge';
export interface RovaContext { serviceId?: string; topic?: string }
export interface RovaAction { label: string; href: string }
export interface RovaReply { text: string; actions?: RovaAction[]; context: RovaContext }
const has = (text: string, words: string[]) => words.some(word => new RegExp(`\\b${word}\\b`, 'i').test(text));
// Local, deterministic response boundary. No network requests or persistent storage.
export function getRovaReply(input: string, previous: RovaContext = {}): RovaReply {
  const q = input.toLowerCase().replace(/[’]/g, "'");
  const matched = services.find(service => has(q, serviceKeywords[service.id]));
  const context = { ...previous, ...(matched ? { serviceId: matched.id } : {}) };
  const service = matched || services.find(item => item.id === context.serviceId);
  const contact = { label: 'Start a Project', href: `/contact${context.serviceId ? `?service=${context.serviceId}` : ''}` };
  const reply = (text: string, topic: string, actions: RovaAction[] = [contact]): RovaReply => ({ text, actions, context: { ...context, topic } });
  if (has(q, ['price', 'pricing', 'cost', 'budget', 'charge', 'charges', 'quote', 'how much'])) return reply(knowledge.pricing, 'pricing');
  if (has(q, ['how long', 'timeline', 'duration', 'deadline', 'weeks', 'days'])) return reply(knowledge.timeline, 'timeline');
  if (has(q, ['testimonials', 'revenue', 'certifications', 'partnerships', 'team size', 'guarantee', 'discount'])) return reply(knowledge.fallback, 'unknown');
  if (has(q, ['projects', 'portfolio', 'show me', 'your work', 'examples'])) return reply(`Our featured work: ${projects.map(p => p.title).join(' and ')}. Explore the actual project websites below.`, 'projects', projects.map(p => ({ label: p.title, href: p.url })));
  if (has(q, ['process', 'how you work', 'how do you work'])) return reply(processSteps.map(step => `${step.number} ${step.title}: ${step.description}`).join('\n\n'), 'process');
  if (has(q, ['technology', 'technologies', 'tech stack', 'tools'])) return reply(knowledge.technology, 'technology');
  if (has(q, ['services', 'what do you do', 'capabilities']) && !matched) return reply(`ResolveOPS helps businesses with ${services.map(s => s.title).join(', ')}. Which area would you like to explore?`, 'services', [{ label: 'Explore services', href: '/services' }, contact]);
  if (has(q, ['start', 'hire', 'contact', 'get in touch', 'help my business'])) return reply('Tell us what you are trying to build or improve. Start a project to share your goals with the studio. Nothing is submitted automatically.', 'contact');
  if (matched || (service && has(q, ['that', 'it', 'more', 'included', 'capabilities']))) return reply(`${service!.title}\n\n${service!.shortDescription}\n\nCapabilities: ${service!.capabilities.join(', ')}.\n\n${service!.outcome}`, 'service', [{ label: 'Explore this service', href: `/services#${service!.id}` }, contact]);
  if (has(q, ['small businesses', 'different', 'resolveops', 'about', 'who are you'])) return reply(`${brand.description}\n\n${brand.footerDescription}`, 'studio');
  if (has(q, ['hello', 'hi', 'hey'])) return reply('Hey — what are you trying to build or improve? Ask me about our services, work or process.', 'greeting');
  return reply(knowledge.fallback, 'unknown');
}
