import { useEffect, useState, type FormEvent, type KeyboardEvent } from 'react';
import {
  EnvelopeSimple,
  PaperPlaneTilt,
  Copy,
  Check,
  Globe,
  PaintBrush,
  Cpu,
  GitBranch,
  TrendUp,
  ChartBar,
  Sparkle,
} from '@phosphor-icons/react';
import { useSearchParams } from 'react-router-dom';
import { brand, services } from '../data/content';
import Reveal from '../components/Reveal';
import './Contact.css';

/**
 * Extensible Contact Channels Architecture
 * WhatsApp and phone are strictly omitted from the UI per current requirements,
 * but cleanly architected so additional channels can be re-enabled seamlessly in the future.
 */
export interface DirectContactChannel {
  id: 'email' | 'whatsapp' | 'phone';
  title: string;
  value: string;
  href: string;
  enabled: boolean;
}

export const DIRECT_CHANNELS: DirectContactChannel[] = [
  {
    id: 'email',
    title: 'Official Email',
    value: brand.email,
    href: `mailto:${brand.email}`,
    enabled: true,
  },
  // Future channels (e.g. WhatsApp) can be cleanly toggled here when ready:
  // {
  //   id: 'whatsapp',
  //   title: 'Direct WhatsApp',
  //   value: '+91',
  //   href: 'https://wa.me/message/...',
  //   enabled: false,
  // },
];

export const BUDGET_OPTIONS = [
  'Under ₹5000',
  '₹6000 – ₹8000',
  'Above ₹10000',
  'Not sure yet',
] as const;

export interface ProjectTypeOption {
  id: string;
  label: string;
  icon: typeof Globe;
}

export const PROJECT_TYPES: ProjectTypeOption[] = [
  { id: 'website', label: 'Website', icon: Globe },
  { id: 'ui-ux', label: 'UI/UX Design', icon: PaintBrush },
  { id: 'ai-automation', label: 'AI Automation', icon: Cpu },
  { id: 'crm-workflow', label: 'CRM / Workflow Automation', icon: GitBranch },
  { id: 'seo-marketing', label: 'SEO & Digital Marketing', icon: TrendUp },
  { id: 'business-analytics', label: 'Business Analytics', icon: ChartBar },
  { id: 'other', label: 'Other', icon: Sparkle },
];

export const SERVICE_OPTIONS = [
  'Website Development',
  'UI/UX & Conversion Optimization',
  'SEO & Digital Marketing',
  'AI Automation',
  'CRM & Workflow Automation',
  'Business Analytics',
  'Other',
] as const;

export interface FormData {
  name: string;
  company: string;
  email: string;
  budget: string;
  projectType: string;
  services: string[];
  details: string;
  // Architectural extensibility for future channels:
  whatsapp?: string;
}

export default function Contact() {
  const [searchParams] = useSearchParams();
  const serviceId = searchParams.get('service');
  const [copied, setCopied] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    company: '',
    email: '',
    budget: '',
    projectType: '',
    services: [],
    details: '',
  });

  useEffect(() => {
    const service = services.find(item => item.id === serviceId);
    if (service) setFormData(previous => ({ ...previous, services: [service.title] }));
  }, [serviceId]);
  const intents = [
    ['I need a website', 'website-development'], ['I want AI automation', 'ai-automation'],
    ['I need more leads', 'seo-digital-marketing'], ['I need analytics', 'business-analytics'],
    ['Improve my existing website', 'ui-ux-design'], ["I'm not sure yet", ''],
  ];

  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const toggleBudget = (option: string) => {
    setFormData((prev) => ({
      ...prev,
      budget: prev.budget === option ? '' : option,
    }));
  };

  const toggleProjectType = (typeLabel: string) => {
    setFormData((prev) => ({
      ...prev,
      projectType: prev.projectType === typeLabel ? '' : typeLabel,
    }));
  };

  const toggleService = (service: string) => {
    setFormData((prev) => {
      const exists = prev.services.includes(service);
      return {
        ...prev,
        services: exists
          ? prev.services.filter((s) => s !== service)
          : [...prev.services, service],
      };
    });
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Please enter your name.';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Please enter your email address.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address.';
    }
    if (!formData.details.trim()) {
      newErrors.details = 'Please describe your project or requirements.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const buildMailtoBody = (): string => {
    let body = `Name: ${formData.name.trim()}\n`;
    if (formData.company.trim()) {
      body += `Business / Brand: ${formData.company.trim()}\n`;
    }
    body += `Email: ${formData.email.trim()}\n`;
    if (formData.budget) {
      body += `Estimated Budget: ${formData.budget}\n`;
    }
    if (formData.projectType) {
      body += `Project Type: ${formData.projectType}\n`;
    }
    if (formData.services.length > 0) {
      body += `Services Required: ${formData.services.join(', ')}\n`;
    }
    body += `\nProject Description & Requirements:\n${formData.details.trim()}\n`;
    return body;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const subject = encodeURIComponent('New Project Enquiry — ResolveOPS');
    const body = encodeURIComponent(buildMailtoBody());
    window.location.href = `mailto:${brand.email}?subject=${subject}&body=${body}`;
  };

  const copyEnquiry = () => {
    if (!validate()) return;
    const text = `To: ${brand.email}\nSubject: New Project Enquiry — ResolveOPS\n\n${buildMailtoBody()}`;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  // Keyboard helper for accessible interactive cards
  const handleKeyToggle = (
    e: KeyboardEvent<HTMLButtonElement>,
    action: () => void
  ) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      action();
    }
  };

  return (
    <>
      <section className="contact-page-section" aria-label="Contact ResolveOPS">
        <div className="container">
          <header className="contact-hero-header">
            <Reveal>
              <h1 className="contact-hero-title">Start a Project with ResolveOPS</h1>
            </Reveal>
            <Reveal delay={80}>
              <p className="contact-hero-subtitle">
                Tell us what you're looking to build or improve. Whether you have detailed specifications or just an initial idea, we're ready to collaborate.
              </p>
            </Reveal>
          </header>

          <div className="contact-intents" role="group" aria-label="What would you like to do?">
            {intents.map(([label, id]) => <button key={label} type="button" aria-pressed={Boolean(id && formData.services.includes(services.find(s => s.id === id)!.title))}
              onClick={() => {
                const service = services.find(item => item.id === id);
                setFormData(previous => ({ ...previous, services: service ? [service.title] : [] }));
                document.getElementById('name')?.focus();
              }}>{label}</button>)}
          </div>
          <div className="contact-layout">

            {/* Left Column — Direct Contact & Studio Commitment */}
            <Reveal delay={120}>
              <aside className="contact-sidebar" aria-label="Official contact information">
                {/* Official Email Contact Card — only direct contact method */}
                <div className="contact-card">
                  <div className="contact-card-icon" aria-hidden="true">
                    <EnvelopeSimple size={24} weight="regular" />
                  </div>
                  <div className="contact-card-info">
                    <span className="contact-card-title">Official Email</span>
                    <a
                      href={`mailto:${brand.email}`}
                      className="contact-card-value"
                      aria-label={`Send email to ${brand.email}`}
                    >
                      {brand.email}
                    </a>
                  </div>
                </div>

                {/* Studio Engagement Principles */}
                <div className="contact-sidebar-note">
                  <h2 className="contact-note-heading">Direct & Transparent Collaboration</h2>
                  <ul className="contact-note-list">
                    <li>
                      <span className="note-bullet" aria-hidden="true" />
                      <span>Direct collaboration with experienced engineers and designers — no middle management layers.</span>
                    </li>
                    <li>
                      <span className="note-bullet" aria-hidden="true" />
                      <span>Clear scopes, predictable milestones, and honest recommendations suited for your budget.</span>
                    </li>
                    <li>
                      <span className="note-bullet" aria-hidden="true" />
                      <span>Zero high-pressure sales calls. Submit what you need, and we'll reply directly with actionable steps.</span>
                    </li>
                  </ul>
                </div>
              </aside>
            </Reveal>

            {/* Right Column — Structured Premium Project Enquiry Form */}
            <Reveal delay={160} direction="right">
              <div className="contact-form-container">
                <form className="contact-form" onSubmit={handleSubmit} noValidate>

                  {/* ROW 1: Your Name & Business / Brand Name */}
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="name" className="form-label">
                        YOUR NAME <span className="required" aria-hidden="true">*</span>
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className={`form-input ${errors.name ? 'error' : ''}`}
                        placeholder="e.g. Alex Rivera"
                        autoComplete="name"
                        required
                        aria-required="true"
                        aria-invalid={Boolean(errors.name)}
                        aria-describedby={errors.name ? 'name-error' : undefined}
                      />
                      {errors.name && (
                        <span id="name-error" className="form-error" role="alert">
                          {errors.name}
                        </span>
                      )}
                    </div>

                    <div className="form-group">
                      <label htmlFor="company" className="form-label">
                        BUSINESS / BRAND NAME <span className="optional">(OPTIONAL)</span>
                      </label>
                      <input
                        type="text"
                        id="company"
                        name="company"
                        value={formData.company}
                        onChange={handleInputChange}
                        className="form-input"
                        placeholder="e.g. Apex Solutions"
                        autoComplete="organization"
                      />
                    </div>
                  </div>

                  {/* ROW 2: Email Address */}
                  <div className="form-group">
                    <label htmlFor="email" className="form-label">
                      EMAIL ADDRESS <span className="required" aria-hidden="true">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`form-input ${errors.email ? 'error' : ''}`}
                      placeholder="e.g. alex@company.com"
                      autoComplete="email"
                      required
                      aria-required="true"
                      aria-invalid={Boolean(errors.email)}
                      aria-describedby={errors.email ? 'email-error' : undefined}
                    />
                    {errors.email && (
                      <span id="email-error" className="form-error" role="alert">
                        {errors.email}
                      </span>
                    )}
                  </div>

                  {/* ROW 3: Estimated Project Budget (Optional) */}
                  <div className="form-group">
                    <div className="form-label-row">
                      <span className="form-label">
                        ESTIMATED PROJECT BUDGET <span className="optional">(OPTIONAL)</span>
                      </span>
                      {formData.budget && (
                        <button
                          type="button"
                          className="form-clear-btn"
                          onClick={() => setFormData((prev) => ({ ...prev, budget: '' }))}
                        >
                          Clear
                        </button>
                      )}
                    </div>
                    <div className="budget-pill-group" role="group" aria-label="Estimated budget options">
                      {BUDGET_OPTIONS.map((range) => {
                        const isSelected = formData.budget === range;
                        return (
                          <button
                            key={range}
                            type="button"
                            className={`budget-pill ${isSelected ? 'selected' : ''}`}
                            onClick={() => toggleBudget(range)}
                            onKeyDown={(e) => handleKeyToggle(e, () => toggleBudget(range))}
                            aria-pressed={isSelected}
                          >
                            {isSelected && <Check size={14} weight="bold" className="pill-check-icon" />}
                            <span>{range}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* ROW 4: Project Type (Selectable Cards) */}
                  <div className="form-group">
                    <div className="form-label-row">
                      <span className="form-label">
                        PROJECT TYPE <span className="optional">(OPTIONAL)</span>
                      </span>
                      {formData.projectType && (
                        <button
                          type="button"
                          className="form-clear-btn"
                          onClick={() => setFormData((prev) => ({ ...prev, projectType: '' }))}
                        >
                          Clear
                        </button>
                      )}
                    </div>
                    <div className="project-type-grid" role="group" aria-label="Project type options">
                      {PROJECT_TYPES.map((type) => {
                        const Icon = type.icon;
                        const isSelected = formData.projectType === type.label;
                        return (
                          <button
                            key={type.id}
                            type="button"
                            className={`project-type-card ${isSelected ? 'selected' : ''}`}
                            onClick={() => toggleProjectType(type.label)}
                            onKeyDown={(e) => handleKeyToggle(e, () => toggleProjectType(type.label))}
                            aria-pressed={isSelected}
                          >
                            <div className="project-type-icon-wrapper" aria-hidden="true">
                              <Icon size={20} weight={isSelected ? 'bold' : 'regular'} />
                            </div>
                            <span className="project-type-label">{type.label}</span>
                            <div className={`project-type-indicator ${isSelected ? 'active' : ''}`} aria-hidden="true">
                              {isSelected && <Check size={12} weight="bold" />}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* ROW 5: Services Required (Multi-Select Chips) */}
                  <div className="form-group">
                    <div className="form-label-row">
                      <span className="form-label">
                        SERVICES REQUIRED <span className="optional">(SELECT ALL THAT APPLY)</span>
                      </span>
                      {formData.services.length > 0 && (
                        <button
                          type="button"
                          className="form-clear-btn"
                          onClick={() => setFormData((prev) => ({ ...prev, services: [] }))}
                        >
                          Clear ({formData.services.length})
                        </button>
                      )}
                    </div>
                    <div className="services-chips-group" role="group" aria-label="Services required multi-select">
                      {SERVICE_OPTIONS.map((service) => {
                        const isSelected = formData.services.includes(service);
                        return (
                          <button
                            key={service}
                            type="button"
                            className={`service-chip ${isSelected ? 'selected' : ''}`}
                            onClick={() => toggleService(service)}
                            onKeyDown={(e) => handleKeyToggle(e, () => toggleService(service))}
                            role="checkbox"
                            aria-checked={isSelected}
                          >
                            <span className="service-chip-indicator" aria-hidden="true">
                              {isSelected ? <Check size={12} weight="bold" /> : '+'}
                            </span>
                            <span>{service}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* ROW 6: Project Description & Requirements */}
                  <div className="form-group">
                    <label htmlFor="details" className="form-label">
                      PROJECT DESCRIPTION & REQUIREMENTS <span className="required" aria-hidden="true">*</span>
                    </label>
                    <textarea
                      id="details"
                      name="details"
                      value={formData.details}
                      onChange={handleInputChange}
                      className={`form-input form-textarea ${errors.details ? 'error' : ''}`}
                      placeholder="Tell us about your project, goals, requirements, timeline, or any reference websites you have in mind..."
                      rows={6}
                      required
                      aria-required="true"
                      aria-invalid={Boolean(errors.details)}
                      aria-describedby={errors.details ? 'details-error' : undefined}
                    />
                    {errors.details && (
                      <span id="details-error" className="form-error" role="alert">
                        {errors.details}
                      </span>
                    )}
                  </div>

                  {/* ROW 7: Primary CTA & Action Helpers */}
                  <div className="form-actions-wrapper">
                    <button type="submit" className="btn btn-primary btn-lg form-submit">
                      <PaperPlaneTilt size={18} weight="bold" />
                      Start a conversation
                    </button>

                    <button
                      type="button"
                      className="form-copy"
                      onClick={copyEnquiry}
                      title="Copy complete enquiry text to clipboard"
                    >
                      {copied ? (
                        <>
                          <Check size={16} weight="bold" />
                          <span>Copied to clipboard</span>
                        </>
                      ) : (
                        <>
                          <Copy size={16} weight="bold" />
                          <span>Copy message instead</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Explanatory note below CTA */}
                  <p className="form-disclaimer">
                    This opens your email app with your enquiry pre-filled. You can review and send it directly from there. No data is stored on our servers.
                  </p>
                </form>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
