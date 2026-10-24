import './ServiceVisual.css';

interface ServiceVisualProps {
  serviceId: string;
  size?: 'small' | 'large';
}

/**
 * Bespoke, high-fidelity illustrative visuals for each of the six disciplines.
 * Each visual features realistic interface mockups, layered depth, subtle glows,
 * and semantic animation classes within the studio's dark purple brand palette.
 */
export default function ServiceVisual({ serviceId, size = 'large' }: ServiceVisualProps) {
  const sizeClass = size === 'small' ? 'visual-small' : 'visual-large';
  
  return (
    <div className={`service-visual ${sizeClass}`}>
      {getVisual(serviceId)}
    </div>
  );
}

function getVisual(id: string) {
  switch (id) {
    case 'website-development':
      return <WebsiteVisual />;
    case 'ui-ux-design':
      return <DesignVisual />;
    case 'seo-digital-marketing':
      return <SEOVisual />;
    case 'ai-automation':
      return <AIVisual />;
    case 'crm-workflow-automation':
      return <CRMVisual />;
    case 'business-analytics':
      return <AnalyticsVisual />;
    default:
      return <WebsiteVisual />;
  }
}

/* 1. WEBSITE DEVELOPMENT: Modern IDE + Live Production Browser Preview */
function WebsiteVisual() {
  return (
    <svg viewBox="0 0 320 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="visual-svg">
      <defs>
        <linearGradient id="webBgGrad" x1="0" y1="0" x2="320" y2="200" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#160B2B" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#0D0718" stopOpacity="0.95" />
        </linearGradient>
        <linearGradient id="webCardGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#29134D" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#160B2B" stopOpacity="0.3" />
        </linearGradient>
        <linearGradient id="webBtnGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#638CFF" />
          <stop offset="100%" stopColor="#55D9F2" />
        </linearGradient>
      </defs>

      {/* Main Window Frame */}
      <rect x="16" y="12" width="288" height="176" rx="10" fill="url(#webBgGrad)" stroke="#A78BFA" strokeWidth="1" strokeOpacity="0.25" />
      
      {/* Chrome Header */}
      <rect x="16" y="12" width="288" height="26" rx="10" fill="#29134D" fillOpacity="0.35" />
      <path d="M16 38 H304" stroke="#A78BFA" strokeWidth="0.8" strokeOpacity="0.15" />
      
      {/* Traffic Dots with refined muted tones */}
      <circle cx="32" cy="25" r="3.5" fill="#8D83FF" fillOpacity="0.75" className="vis-dot-1" />
      <circle cx="44" cy="25" r="3.5" fill="#638CFF" fillOpacity="0.65" className="vis-dot-2" />
      <circle cx="56" cy="25" r="3.5" fill="#B99AFF" fillOpacity="0.65" className="vis-dot-3" />

      {/* URL / Status Bar with subtle Cyan SSL & Hostname */}
      <rect x="74" y="19" width="140" height="12" rx="6" fill="#0D0718" stroke="#A78BFA" strokeWidth="0.6" strokeOpacity="0.3" />
      <circle cx="84" cy="25" r="2" fill="#55D9F2" />
      <text x="92" y="27.5" fill="#55D9F2" fillOpacity="0.85" fontSize="5.2" fontWeight="600" fontFamily="monospace">https://resolveops.studio</text>

      {/* Deploy Badge — soft cyan: active status */}
      <rect x="226" y="19" width="66" height="12" rx="6" fill="#0D0718" stroke="#55D9F2" strokeWidth="0.6" strokeOpacity="0.45" />
      <circle cx="234" cy="25" r="2" fill="#55D9F2" className="vis-pulse-dot" />
      <text x="240" y="28" fill="#55D9F2" fontSize="7" fontWeight="600" fontFamily="sans-serif">PROD: LIVE</text>

      {/* Left Sidebar: File Tree & Tech Stacks */}
      <rect x="16" y="38" width="56" height="150" fill="#160B2B" fillOpacity="0.4" />
      <path d="M72 38 V188" stroke="#A78BFA" strokeWidth="0.6" strokeOpacity="0.12" />
      
      <rect x="24" y="48" width="38" height="5" rx="2.5" fill="#A78BFA" fillOpacity="0.3" />
      <rect x="28" y="58" width="30" height="4" rx="2" fill="#A78BFA" fillOpacity="0.2" />
      {/* Active Selected File in Electric Blue */}
      <rect x="24" y="64" width="42" height="8" rx="2" fill="#638CFF" fillOpacity="0.15" />
      <circle cx="28" cy="68" r="1.5" fill="#638CFF" />
      <rect x="33" y="66" width="28" height="4" rx="2" fill="#638CFF" fillOpacity="0.8" />
      <rect x="28" y="76" width="26" height="4" rx="2" fill="#A78BFA" fillOpacity="0.2" />

      <rect x="24" y="90" width="38" height="5" rx="2.5" fill="#A78BFA" fillOpacity="0.3" />
      <rect x="28" y="100" width="32" height="4" rx="2" fill="#A78BFA" fillOpacity="0.2" />
      <rect x="28" y="108" width="28" height="4" rx="2" fill="#A78BFA" fillOpacity="0.2" />

      {/* Tech Stack Pills in Sidebar with subtle blue/cyan accents */}
      <rect x="24" y="130" width="40" height="11" rx="4" fill="#0D0718" stroke="#638CFF" strokeWidth="0.5" strokeOpacity="0.45" />
      <text x="28" y="138" fill="#638CFF" fontSize="6" fontWeight="600" fontFamily="sans-serif">React 19</text>
      <rect x="24" y="146" width="40" height="11" rx="4" fill="#0D0718" stroke="#55D9F2" strokeWidth="0.5" strokeOpacity="0.4" />
      <text x="28" y="154" fill="#55D9F2" fontSize="6" fontWeight="600" fontFamily="sans-serif">Next.js</text>

      {/* Main Viewport: Hero UI Preview */}
      <g transform="translate(82, 46)">
        {/* Mockup Canvas */}
        <rect x="0" y="0" width="212" height="132" rx="6" fill="#160B2B" fillOpacity="0.6" stroke="#A78BFA" strokeWidth="0.6" strokeOpacity="0.18" />
        
        {/* Hero Banner with Code Overlay */}
        <rect x="10" y="10" width="192" height="48" rx="5" fill="url(#webCardGrad)" stroke="#A78BFA" strokeWidth="0.6" strokeOpacity="0.2" />
        <rect x="20" y="18" width="100" height="8" rx="3" fill="#FFFFFF" fillOpacity="0.85" className="vis-web-hero" />
        <rect x="20" y="30" width="76" height="5" rx="2" fill="#B99AFF" fillOpacity="0.6" />
        {/* Electric Blue -> Cyan Accent Button */}
        <rect x="20" y="40" width="48" height="10" rx="5" fill="url(#webBtnGrad)" className="vis-web-btn vis-interactive" />
        <text x="24.5" y="47" fill="#0D0718" fontSize="5.5" fontWeight="700" fontFamily="sans-serif">GET STARTED</text>

        {/* Speed Metric Callout Card — electric blue A+ */}
        <g transform="translate(132, 16)" className="vis-metric-badge vis-interactive">
          <rect width="60" height="34" rx="4" fill="#0D0718" stroke="#638CFF" strokeWidth="0.8" strokeOpacity="0.55" />
          <text x="6" y="12" fill="#A78BFA" fontSize="6" fontWeight="600" fontFamily="sans-serif">PERFORMANCE</text>
          <text x="6" y="27" fill="#638CFF" fontSize="13" fontWeight="700" fontFamily="sans-serif">100</text>
          <rect x="34" y="17" width="20" height="11" rx="3" fill="#638CFF" fillOpacity="0.15" stroke="#638CFF" strokeWidth="0.5" />
          <text x="39" y="25" fill="#638CFF" fontSize="6.5" fontWeight="700" fontFamily="sans-serif">A+</text>
        </g>

        {/* Component Grid */}
        <g transform="translate(10, 66)">
          <rect x="0" y="0" width="60" height="58" rx="4" fill="#160B2B" stroke="#A78BFA" strokeWidth="0.5" strokeOpacity="0.25" className="vis-card-1 vis-interactive" />
          <circle cx="14" cy="14" r="5" fill="#0D0718" stroke="#55D9F2" strokeWidth="0.8" />
          <circle cx="14" cy="14" r="2" fill="#55D9F2" />
          <rect x="10" y="26" width="40" height="5" rx="2" fill="#E2D9F3" fillOpacity="0.7" />
          <rect x="10" y="35" width="32" height="4" rx="2" fill="#A78BFA" fillOpacity="0.3" />
          <rect x="10" y="43" width="26" height="4" rx="2" fill="#55D9F2" fillOpacity="0.6" />

          <rect x="66" y="0" width="60" height="58" rx="4" fill="#160B2B" stroke="#A78BFA" strokeWidth="0.5" strokeOpacity="0.25" className="vis-card-2 vis-interactive" />
          <circle cx="80" cy="14" r="5" fill="#0D0718" stroke="#638CFF" strokeWidth="0.8" />
          <circle cx="80" cy="14" r="2" fill="#638CFF" />
          <rect x="76" y="26" width="38" height="5" rx="2" fill="#E2D9F3" fillOpacity="0.7" />
          <rect x="76" y="35" width="42" height="4" rx="2" fill="#A78BFA" fillOpacity="0.3" />
          <rect x="76" y="43" width="32" height="4" rx="2" fill="#638CFF" fillOpacity="0.6" />

          {/* Realistic Code Terminal with Syntax Accents */}
          <rect x="132" y="0" width="60" height="58" rx="4" fill="#0A0514" stroke="#638CFF" strokeWidth="0.6" strokeOpacity="0.3" className="vis-card-3 vis-interactive" />
          <rect x="138" y="8" width="30" height="3" rx="1.5" fill="#A78BFA" fillOpacity="0.4" />
          <text x="138" y="20" fill="#55D9F2" fontSize="5" fontFamily="monospace">&lt;Studio /&gt;</text>
          <text x="138" y="28" fill="#B99AFF" fontSize="5" fontFamily="monospace">craft: 'clean'</text>
          <text x="138" y="36" fill="#638CFF" fontSize="5" fontFamily="monospace">fast: true</text>
          <text x="138" y="46" fill="#B99AFF" fontSize="5" fontFamily="monospace">export ops;</text>
          <rect x="175" y="42" width="2" height="5" fill="#55D9F2" className="vis-blink-caret" />
        </g>
      </g>
    </svg>
  );
}

/* 2. UI/UX DESIGN & CONVERSION: Editorial Prototyping Canvas + Bezier Handles */
function DesignVisual() {
  return (
    <svg viewBox="0 0 320 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="visual-svg">
      <defs>
        <pattern id="designGrid" width="16" height="16" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="0.6" fill="#A78BFA" fillOpacity="0.2" />
        </pattern>
        <linearGradient id="designCanvasGrad" x1="0" y1="0" x2="320" y2="200" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#160B2B" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#0D0718" stopOpacity="0.95" />
        </linearGradient>
        <linearGradient id="designCoralGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#8D83FF" />
          <stop offset="100%" stopColor="#638CFF" />
        </linearGradient>
      </defs>

      {/* Artboard Frame with Dot Grid */}
      <rect x="16" y="12" width="288" height="176" rx="10" fill="url(#designCanvasGrad)" stroke="#A78BFA" strokeWidth="1" strokeOpacity="0.25" />
      <rect x="16" y="12" width="288" height="176" rx="10" fill="url(#designGrid)" />

      {/* Top Toolbar */}
      <rect x="16" y="12" width="288" height="24" rx="10" fill="#29134D" fillOpacity="0.3" />
      <path d="M16 36 H304" stroke="#A78BFA" strokeWidth="0.6" strokeOpacity="0.15" />
      
      {/* Tool Icons with Cyan active tool and subtle lavender */}
      <rect x="30" y="18" width="12" height="12" rx="2" fill="#55D9F2" fillOpacity="0.2" stroke="#55D9F2" strokeWidth="0.8" />
      <path d="M 33 21 L 38 25 L 35.5 25.5 L 37 28.5 L 35.5 29 L 34 26 L 33 27.5 Z" fill="#55D9F2" />
      <rect x="48" y="18" width="12" height="12" rx="2" fill="#B99AFF" fillOpacity="0.12" stroke="#B99AFF" strokeWidth="0.5" strokeOpacity="0.4" />
      <rect x="66" y="18" width="12" height="12" rx="2" fill="#A78BFA" fillOpacity="0.1" />
      <rect x="84" y="18" width="12" height="12" rx="2" fill="#A78BFA" fillOpacity="0.1" />

      {/* Zoom / Frame Title */}
      <text x="136" y="28" fill="#E2D9F3" fontSize="8" fontWeight="600" fontFamily="sans-serif">Checkout Flow · 100%</text>

      {/* Artboard Canvas 1: Mobile UI Prototype */}
      <g transform="translate(36, 46)">
        <rect width="108" height="132" rx="8" fill="#160B2B" stroke="#A78BFA" strokeWidth="0.8" strokeOpacity="0.4" />
        {/* Device Notch */}
        <rect x="36" y="5" width="36" height="4" rx="2" fill="#29134D" />
        
        {/* Card Header & Avatar with Coral Status */}
        <circle cx="22" cy="24" r="8" fill="#29134D" stroke="#B99AFF" strokeWidth="0.7" />
        <circle cx="27" cy="28" r="2" fill="#8D83FF" />
        <rect x="36" y="18" width="50" height="5" rx="2" fill="#FFFFFF" fillOpacity="0.8" />
        <rect x="36" y="26" width="32" height="3" rx="1.5" fill="#A78BFA" fillOpacity="0.4" />

        {/* Feature Hero Card with Soft Coral CTA Accent */}
        <rect x="10" y="38" width="88" height="42" rx="6" fill="#29134D" fillOpacity="0.5" stroke="#A78BFA" strokeWidth="0.6" strokeOpacity="0.3" />
        <rect x="18" y="46" width="54" height="6" rx="2" fill="#FFFFFF" fillOpacity="0.9" />
        <rect x="18" y="55" width="40" height="4" rx="1.5" fill="#B99AFF" fillOpacity="0.6" />
        <rect x="18" y="64" width="34" height="8" rx="4" fill="url(#designCoralGrad)" className="vis-design-btn vis-interactive" />
        <text x="23" y="70" fill="#0D0718" fontSize="5" fontWeight="700" fontFamily="sans-serif">BUY NOW</text>

        {/* Conversion Tag in Soft Cyan */}
        <rect x="10" y="86" width="88" height="16" rx="4" fill="#0D0718" stroke="#55D9F2" strokeWidth="0.6" strokeOpacity="0.4" />
        <text x="16" y="97" fill="#55D9F2" fontSize="6" fontWeight="600" fontFamily="sans-serif">CR: +28.4% Lift</text>
        <circle cx="86" cy="94" r="2.5" fill="#55D9F2" className="vis-pulse-dot" />

        {/* Two Mini Cards with Cyan and Coral Accents */}
        <rect x="10" y="107" width="41" height="18" rx="4" fill="#29134D" fillOpacity="0.3" stroke="#A78BFA" strokeWidth="0.5" strokeOpacity="0.2" className="vis-interactive" />
        <rect x="14" y="116" width="18" height="3" rx="1.5" fill="#55D9F2" fillOpacity="0.6" />
        <rect x="57" y="107" width="41" height="18" rx="4" fill="#29134D" fillOpacity="0.3" stroke="#A78BFA" strokeWidth="0.5" strokeOpacity="0.2" className="vis-interactive" />
        <rect x="61" y="116" width="18" height="3" rx="1.5" fill="#8D83FF" fillOpacity="0.6" />
      </g>

      {/* Artboard Canvas 2: Conversion Funnel & Bezier Vector Anchor Points */}
      <g transform="translate(160, 46)">
        <rect width="128" height="132" rx="8" fill="#160B2B" fillOpacity="0.7" stroke="#A78BFA" strokeWidth="0.8" strokeOpacity="0.3" />
        
        {/* Dimension Label */}
        <rect x="10" y="8" width="58" height="12" rx="3" fill="#29134D" stroke="#A78BFA" strokeWidth="0.5" strokeOpacity="0.4" />
        <text x="14" y="16" fill="#B99AFF" fontSize="6" fontFamily="monospace">W: 380 · H: 540</text>

        {/* Bezier Curves with Soft Cyan & Lavender Accents */}
        <path d="M 16 90 C 44 90, 56 46, 110 46" stroke="#55D9F2" strokeWidth="2" strokeDasharray="3 3" fill="none" className="vis-bezier-path" />
        <path d="M 16 90 C 44 90, 56 46, 110 46" stroke="#B99AFF" strokeWidth="1.2" fill="none" />

        {/* Vector Nodes with Handles: Cyan & Soft Coral */}
        <circle cx="16" cy="90" r="3.5" fill="#0D0718" stroke="#55D9F2" strokeWidth="1.4" className="vis-design-handle" />
        <line x1="16" y1="90" x2="16" y2="108" stroke="#55D9F2" strokeWidth="0.8" opacity="0.6" />
        <circle cx="16" cy="108" r="2" fill="#55D9F2" />

        <circle cx="110" cy="46" r="3.5" fill="#0D0718" stroke="#8D83FF" strokeWidth="1.4" className="vis-design-handle" />
        <line x1="110" y1="46" x2="110" y2="28" stroke="#8D83FF" strokeWidth="0.8" opacity="0.6" />
        <circle cx="110" cy="28" r="2" fill="#8D83FF" />

        {/* Selection Bounding Box with Cyan corner nodes */}
        <rect x="42" y="60" width="56" height="38" rx="4" fill="#29134D" fillOpacity="0.35" stroke="#B99AFF" strokeWidth="1" strokeDasharray="4 2" className="vis-design-box" />
        <circle cx="42" cy="60" r="2.5" fill="#FFFFFF" stroke="#55D9F2" strokeWidth="0.8" />
        <circle cx="98" cy="60" r="2.5" fill="#FFFFFF" stroke="#55D9F2" strokeWidth="0.8" />
        <circle cx="42" cy="98" r="2.5" fill="#FFFFFF" stroke="#55D9F2" strokeWidth="0.8" />
        <circle cx="98" cy="98" r="2.5" fill="#FFFFFF" stroke="#55D9F2" strokeWidth="0.8" />
        <text x="48" y="80" fill="#FFFFFF" fontSize="7" fontWeight="600" fontFamily="sans-serif">CTA Frame</text>

        {/* Design System Color Swatches */}
        <g transform="translate(10, 114)">
          <circle cx="6" cy="6" r="4.5" fill="#160B2B" stroke="#A78BFA" strokeWidth="0.5" className="vis-palette-chip vis-interactive" />
          <circle cx="18" cy="6" r="4.5" fill="#A78BFA" stroke="#FFFFFF" strokeWidth="0.5" className="vis-palette-chip vis-interactive" />
          <circle cx="30" cy="6" r="4.5" fill="#B99AFF" stroke="#FFFFFF" strokeWidth="0.5" className="vis-palette-chip vis-interactive" />
          <circle cx="42" cy="6" r="4.5" fill="#55D9F2" stroke="#FFFFFF" strokeWidth="0.5" className="vis-palette-chip vis-interactive" />
          <circle cx="54" cy="6" r="4.5" fill="#8D83FF" stroke="#FFFFFF" strokeWidth="0.5" className="vis-palette-chip vis-interactive" />
        </g>
      </g>

      {/* Floating UX Designer Cursor with Soft Coral & Lavender */}
      <g transform="translate(178, 102)" className="vis-design-cursor">
        <path d="M 0 0 L 10 14 L 6 14 L 9 20 L 6 21 L 3 15 L 0 17 Z" fill="#B99AFF" stroke="#0D0718" strokeWidth="1" />
        <rect x="12" y="10" width="64" height="14" rx="4" fill="#29134D" stroke="#B99AFF" strokeWidth="0.8" />
        <circle cx="19" cy="17" r="2" fill="#8D83FF" />
        <text x="25" y="20" fill="#FFFFFF" fontSize="6.5" fontWeight="600" fontFamily="sans-serif">ResolveOPS · UI</text>
      </g>
    </svg>
  );
}

/* 3. SEO & DIGITAL MARKETING: SERP Console + Growth Trajectory Chart */
function SEOVisual() {
  return (
    <svg viewBox="0 0 320 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="visual-svg">
      <defs>
        <linearGradient id="seoChartFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#55D9F2" stopOpacity="0.4" />
          <stop offset="60%" stopColor="#A78BFA" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#29134D" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Frame */}
      <rect x="16" y="12" width="288" height="176" rx="10" fill="#160B2B" fillOpacity="0.9" stroke="#A78BFA" strokeWidth="1" strokeOpacity="0.25" />
      
      {/* Search Header Bar */}
      <rect x="28" y="22" width="264" height="26" rx="13" fill="#29134D" fillOpacity="0.45" stroke="#A78BFA" strokeWidth="0.8" strokeOpacity="0.4" className="vis-seo-bar" />
      
      {/* Magnifying Glass */}
      <circle cx="44" cy="35" r="5" stroke="#55D9F2" strokeWidth="1.2" />
      <line x1="48" y1="39" x2="53" y2="44" stroke="#55D9F2" strokeWidth="1.5" strokeLinecap="round" />
      
      {/* Search Query Text */}
      <text x="60" y="38" fill="#FFFFFF" fontSize="8.5" fontWeight="600" fontFamily="sans-serif">site:growth "ResolveOPS Studio"</text>
      
      {/* Top 1 Badge with Mint Green Accent */}
      <rect x="228" y="26" width="56" height="18" rx="9" fill="#0D0718" stroke="#B99AFF" strokeWidth="0.8" />
      <text x="234" y="38" fill="#B99AFF" fontSize="7" fontWeight="700" fontFamily="sans-serif">★ RANK #1</text>

      {/* Main Split: Left SERP Snippet, Right Analytics Graph */}
      <g transform="translate(28, 58)">
        {/* Left: Featured Google Result Card */}
        <rect width="144" height="118" rx="6" fill="#0D0718" fillOpacity="0.75" stroke="#A78BFA" strokeWidth="0.8" strokeOpacity="0.3" className="vis-seo-card" />
        
        {/* Breadcrumb URL */}
        <text x="12" y="18" fill="#55D9F2" fontSize="6.5" fontFamily="sans-serif">resolveops.studio › services › growth</text>
        
        {/* Title */}
        <text x="12" y="32" fill="#FFFFFF" fontSize="9" fontWeight="700" fontFamily="sans-serif" className="vis-seo-title">Scale Business with Full-Funnel SEO</text>
        
        {/* Review Stars in Soft Cyan */}
        <g transform="translate(12, 38)">
          <text x="0" y="8" fill="#55D9F2" fontSize="7" fontFamily="sans-serif">★★★★★</text>
          <text x="38" y="8" fill="#A78BFA" fontSize="6.5" fontFamily="sans-serif">5.0 (52 reviews)</text>
        </g>

        {/* Snippet Description */}
        <rect x="12" y="52" width="120" height="4" rx="2" fill="#E2D9F3" fillOpacity="0.7" />
        <rect x="12" y="59" width="108" height="4" rx="2" fill="#A78BFA" fillOpacity="0.4" />
        <rect x="12" y="66" width="94" height="4" rx="2" fill="#A78BFA" fillOpacity="0.3" />

        {/* Sitelinks Box */}
        <g transform="translate(12, 78)">
          <rect width="56" height="16" rx="3" fill="#29134D" fillOpacity="0.5" stroke="#A78BFA" strokeWidth="0.5" strokeOpacity="0.4" className="vis-interactive" />
          <text x="6" y="10" fill="#B99AFF" fontSize="6" fontWeight="600" fontFamily="sans-serif">Core Services</text>
          
          <rect x="62" width="56" height="16" rx="3" fill="#29134D" fillOpacity="0.5" stroke="#A78BFA" strokeWidth="0.5" strokeOpacity="0.4" className="vis-interactive" />
          <text x="68" y="10" fill="#B99AFF" fontSize="6" fontWeight="600" fontFamily="sans-serif">Case Studies</text>
        </g>

        {/* Impressions Milestone in Mint Green */}
        <g transform="translate(12, 98)">
          <text x="0" y="10" fill="#B99AFF" fontSize="6" fontWeight="700" fontFamily="sans-serif">▲ +380% Organic Impressions</text>
        </g>
      </g>

      {/* Right: Growth Trajectory Curve */}
      <g transform="translate(182, 58)">
        <rect width="110" height="118" rx="6" fill="#0D0718" fillOpacity="0.65" stroke="#A78BFA" strokeWidth="0.8" strokeOpacity="0.3" />
        
        {/* Metric Header */}
        <text x="10" y="16" fill="#A78BFA" fontSize="6.5" fontWeight="600" fontFamily="sans-serif">ORGANIC VISIBILITY</text>
        <text x="10" y="30" fill="#FFFFFF" fontSize="12" fontWeight="700" fontFamily="sans-serif">+340%</text>

        {/* Graph Axes */}
        <line x1="12" y1="104" x2="98" y2="104" stroke="#A78BFA" strokeWidth="0.6" strokeOpacity="0.2" />
        <line x1="12" y1="46" x2="12" y2="104" stroke="#A78BFA" strokeWidth="0.6" strokeOpacity="0.2" />

        {/* Growth Curve */}
        <path d="M 14 96 Q 40 92, 60 70 T 96 48 L 96 104 L 14 104 Z" fill="url(#seoChartFill)" />
        <path d="M 14 96 Q 40 92, 60 70 T 96 48" stroke="#55D9F2" strokeWidth="2" fill="none" className="vis-seo-curve" />

        {/* Peak Dot & Callout in Mint Green */}
        <circle cx="96" cy="48" r="3.5" fill="#FFFFFF" stroke="#B99AFF" strokeWidth="1.5" className="vis-pulse-dot" />
        <rect x="64" y="34" width="34" height="10" rx="3" fill="#B99AFF" className="vis-interactive" />
        <text x="67" y="41" fill="#0D0718" fontSize="5.5" fontWeight="700" fontFamily="sans-serif">PAGE 1</text>
      </g>
    </svg>
  );
}

/* 4. AI AUTOMATION: Neural Node Architecture + Autonomous Agent Execution */
function AIVisual() {
  return (
    <svg viewBox="0 0 320 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="visual-svg">
      <defs>
        <radialGradient id="aiCoreGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#55D9F2" stopOpacity="0.75" />
          <stop offset="45%" stopColor="#B99AFF" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#29134D" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Frame */}
      <rect x="16" y="12" width="288" height="176" rx="10" fill="#160B2B" fillOpacity="0.9" stroke="#A78BFA" strokeWidth="1" strokeOpacity="0.25" />

      {/* Top Telemetry Bar */}
      <rect x="16" y="12" width="288" height="24" rx="10" fill="#29134D" fillOpacity="0.35" />
      <path d="M16 36 H304" stroke="#A78BFA" strokeWidth="0.6" strokeOpacity="0.15" />
      <circle cx="32" cy="24" r="3" fill="#55D9F2" className="vis-pulse-dot" />
      <text x="40" y="27" fill="#FFFFFF" fontSize="7.5" fontWeight="600" fontFamily="sans-serif">Autonomous Agent Fleet · Latency: 12ms</text>
      {/* Mint Green Active Status */}
      <rect x="228" y="18" width="64" height="12" rx="6" fill="#0D0718" stroke="#B99AFF" strokeWidth="0.6" strokeOpacity="0.5" />
      <text x="234" y="26" fill="#B99AFF" fontSize="6" fontWeight="700" fontFamily="sans-serif">STATUS: ACTIVE</text>

      {/* Left: Input Trigger & Agent Dialogue */}
      <g transform="translate(28, 48)">
        <rect width="90" height="34" rx="6" fill="#29134D" fillOpacity="0.4" stroke="#A78BFA" strokeWidth="0.6" strokeOpacity="0.3" className="vis-ai-bubble-1" />
        <rect x="10" y="8" width="46" height="4" rx="2" fill="#638CFF" />
        <rect x="10" y="16" width="68" height="4" rx="2" fill="#E2D9F3" fillOpacity="0.6" />
        <rect x="10" y="24" width="34" height="3" rx="1.5" fill="#A78BFA" fillOpacity="0.4" />

        <rect y="44" width="84" height="32" rx="6" fill="#0D0718" fillOpacity="0.6" stroke="#55D9F2" strokeWidth="0.6" strokeOpacity="0.35" className="vis-ai-bubble-2" />
        <text x="8" y="56" fill="#55D9F2" fontSize="5.5" fontWeight="600" fontFamily="sans-serif">Agent: Qualify Lead</text>
        <rect x="8" y="62" width="60" height="3" rx="1.5" fill="#FFFFFF" fillOpacity="0.7" />

        <rect y="86" width="92" height="42" rx="6" fill="#29134D" fillOpacity="0.5" stroke="#B99AFF" strokeWidth="0.8" strokeOpacity="0.4" className="vis-ai-bubble-3" />
        <text x="8" y="98" fill="#FFFFFF" fontSize="6.5" fontWeight="700" fontFamily="sans-serif">Embeddings Vector Match</text>
        <text x="8" y="108" fill="#B99AFF" fontSize="5.5" fontFamily="monospace">Cosine: 0.984 Sim</text>
        <rect x="8" y="114" width="76" height="4" rx="2" fill="#A78BFA" fillOpacity="0.3" />
        <rect x="8" y="114" width="62" height="4" rx="2" fill="#55D9F2" />
      </g>

      {/* Center: Glowing Quantum Neural Core */}
      <g transform="translate(160, 112)">
        {/* Concentric Orbital Rings */}
        <circle cx="0" cy="0" r="42" stroke="#638CFF" strokeWidth="0.8" strokeDasharray="5 3" opacity="0.3" className="vis-ai-ring-outer" />
        <circle cx="0" cy="0" r="30" stroke="#55D9F2" strokeWidth="1" strokeDasharray="4 2" opacity="0.5" className="vis-ai-ring" />
        <circle cx="0" cy="0" r="18" stroke="#FFFFFF" strokeWidth="1.2" opacity="0.4" />

        {/* Ambient Glow */}
        <circle cx="0" cy="0" r="26" fill="url(#aiCoreGlow)" className="vis-ai-glow" />
        
        {/* Core Node */}
        <circle cx="0" cy="0" r="9" fill="#55D9F2" className="vis-ai-core" />
        <circle cx="0" cy="0" r="4" fill="#FFFFFF" />

        {/* Sparkles in Electric Blue & Cyan */}
        <circle cx="-28" cy="-22" r="2" fill="#55D9F2" className="vis-ai-sparkle-1" />
        <circle cx="28" cy="22" r="2" fill="#638CFF" className="vis-ai-sparkle-2" />
        <circle cx="24" cy="-24" r="1.5" fill="#FFFFFF" />
      </g>

      {/* Neural Synapse Connector Lines */}
      <path d="M 118 64 C 136 64, 140 100, 151 108" stroke="#55D9F2" strokeWidth="1.2" strokeDasharray="3 2" fill="none" className="vis-synapse-1" />
      <path d="M 112 110 C 128 110, 136 112, 151 112" stroke="#A78BFA" strokeWidth="1.2" strokeDasharray="3 2" fill="none" className="vis-synapse-2" />
      <path d="M 169 112 C 182 112, 190 74, 204 74" stroke="#638CFF" strokeWidth="1.2" strokeDasharray="3 2" fill="none" className="vis-synapse-3" />
      <path d="M 169 116 C 182 116, 192 142, 204 142" stroke="#A78BFA" strokeWidth="1.2" strokeDasharray="3 2" fill="none" className="vis-synapse-4" />

      {/* Right: Automated Output Actions */}
      <g transform="translate(204, 52)">
        <rect width="90" height="34" rx="6" fill="#0D0718" stroke="#638CFF" strokeWidth="0.8" strokeOpacity="0.45" className="vis-interactive" />
        <circle cx="12" cy="17" r="4" fill="#29134D" stroke="#638CFF" strokeWidth="0.8" />
        <text x="22" y="14" fill="#FFFFFF" fontSize="6.5" fontWeight="600" fontFamily="sans-serif">CRM Auto-Sync</text>
        <text x="22" y="24" fill="#638CFF" fontSize="5.5" fontFamily="monospace">HubSpot / Salesforce</text>

        <rect y="44" width="90" height="34" rx="6" fill="#0D0718" stroke="#A78BFA" strokeWidth="0.6" strokeOpacity="0.3" className="vis-interactive" />
        <circle cx="12" cy="61" r="4" fill="#29134D" stroke="#A78BFA" strokeWidth="0.8" />
        <text x="22" y="58" fill="#FFFFFF" fontSize="6.5" fontWeight="600" fontFamily="sans-serif">Slack Dispatch</text>
        <text x="22" y="68" fill="#55D9F2" fontSize="5.5" fontFamily="monospace">#growth-alerts</text>

        <rect y="88" width="90" height="34" rx="6" fill="#29134D" fillOpacity="0.4" stroke="#B99AFF" strokeWidth="0.8" strokeOpacity="0.5" className="vis-interactive" />
        <circle cx="12" cy="105" r="4" fill="#B99AFF" />
        <text x="22" y="102" fill="#FFFFFF" fontSize="6.5" fontWeight="700" fontFamily="sans-serif">Workflow Trigger</text>
        <text x="22" y="112" fill="#B99AFF" fontSize="5.5" fontFamily="monospace">0.14s Execution</text>
      </g>
    </svg>
  );
}

/* 5. CRM & WORKFLOW AUTOMATION: Multi-Stage Kanban Pipeline & Smart Actions */
function CRMVisual() {
  return (
    <svg viewBox="0 0 320 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="visual-svg">
      {/* Frame */}
      <rect x="16" y="12" width="288" height="176" rx="10" fill="#160B2B" fillOpacity="0.9" stroke="#A78BFA" strokeWidth="1" strokeOpacity="0.25" />

      {/* Top Header */}
      <rect x="16" y="12" width="288" height="24" rx="10" fill="#29134D" fillOpacity="0.35" />
      <path d="M16 36 H304" stroke="#A78BFA" strokeWidth="0.6" strokeOpacity="0.15" />
      <text x="28" y="27" fill="#FFFFFF" fontSize="7.5" fontWeight="600" fontFamily="sans-serif">Enterprise Pipeline Engine</text>
      <rect x="214" y="18" width="78" height="12" rx="6" fill="#0D0718" stroke="#55D9F2" strokeWidth="0.6" />
      <text x="220" y="26" fill="#55D9F2" fontSize="6" fontWeight="700" fontFamily="sans-serif">AUTOMATION: 99.8%</text>

      {/* 4 Kanban Pipeline Columns */}
      <g transform="translate(24, 44)">
        {/* Column 1: Captured */}
        <rect x="0" y="0" width="62" height="134" rx="6" fill="#0D0718" fillOpacity="0.65" stroke="#A78BFA" strokeWidth="0.6" strokeOpacity="0.2" />
        <text x="8" y="14" fill="#A78BFA" fontSize="6.5" fontWeight="700" fontFamily="sans-serif">INQUIRY (4)</text>
        
        {/* Deal Card 1 */}
        <rect x="6" y="22" width="50" height="32" rx="4" fill="#29134D" fillOpacity="0.4" stroke="#A78BFA" strokeWidth="0.6" strokeOpacity="0.3" className="vis-interactive" />
        <rect x="10" y="28" width="26" height="4" rx="1.5" fill="#FFFFFF" fillOpacity="0.8" />
        <text x="10" y="44" fill="#B99AFF" fontSize="6.5" fontWeight="700" fontFamily="sans-serif">$24,000</text>
        
        {/* Deal Card 2 */}
        <rect x="6" y="58" width="50" height="32" rx="4" fill="#160B2B" stroke="#A78BFA" strokeWidth="0.5" strokeOpacity="0.2" className="vis-interactive" />
        <rect x="10" y="64" width="30" height="4" rx="1.5" fill="#E2D9F3" fillOpacity="0.6" />
        <text x="10" y="80" fill="#A78BFA" fontSize="6.5" fontWeight="600" fontFamily="sans-serif">$12,500</text>

        {/* Column 2: Discovery */}
        <rect x="68" y="0" width="62" height="134" rx="6" fill="#0D0718" fillOpacity="0.65" stroke="#A78BFA" strokeWidth="0.6" strokeOpacity="0.2" />
        <text x="76" y="14" fill="#A78BFA" fontSize="6.5" fontWeight="700" fontFamily="sans-serif">QUALIFIED (2)</text>
        
        <rect x="74" y="22" width="50" height="32" rx="4" fill="#29134D" fillOpacity="0.4" stroke="#A78BFA" strokeWidth="0.6" strokeOpacity="0.3" className="vis-interactive" />
        <rect x="78" y="28" width="32" height="4" rx="1.5" fill="#FFFFFF" fillOpacity="0.8" />
        <text x="78" y="44" fill="#B99AFF" fontSize="6.5" fontWeight="700" fontFamily="sans-serif">$48,000</text>

        {/* Column 3: Proposal with Electric Blue Active Highlight */}
        <rect x="136" y="0" width="62" height="134" rx="6" fill="#0D0718" fillOpacity="0.65" stroke="#A78BFA" strokeWidth="0.6" strokeOpacity="0.2" />
        <text x="144" y="14" fill="#638CFF" fontSize="6.5" fontWeight="700" fontFamily="sans-serif">PROPOSAL (3)</text>
        
        <rect x="142" y="22" width="50" height="34" rx="4" fill="#29134D" fillOpacity="0.7" stroke="#638CFF" strokeWidth="1" strokeOpacity="0.8" className="vis-crm-lead vis-interactive" />
        <rect x="146" y="28" width="28" height="4" rx="1.5" fill="#FFFFFF" />
        <text x="146" y="44" fill="#FFFFFF" fontSize="7" fontWeight="700" fontFamily="sans-serif">$75,000</text>
        <circle cx="184" cy="42" r="2.5" fill="#55D9F2" className="vis-pulse-dot" />

        {/* Column 4: Closed Won in Mint Green */}
        <rect x="204" y="0" width="64" height="134" rx="6" fill="#0D0718" fillOpacity="0.8" stroke="#B99AFF" strokeWidth="0.8" strokeOpacity="0.4" />
        <text x="210" y="14" fill="#B99AFF" fontSize="6.5" fontWeight="700" fontFamily="sans-serif">WON &amp; SYNC</text>
        
        <rect x="210" y="22" width="52" height="34" rx="4" fill="#160B2B" stroke="#B99AFF" strokeWidth="0.8" className="vis-interactive" />
        <rect x="214" y="28" width="34" height="4" rx="1.5" fill="#FFFFFF" />
        <text x="214" y="44" fill="#B99AFF" fontSize="7" fontWeight="700" fontFamily="sans-serif">$120,000</text>
        <path d="M 252 40 L 255 43 L 260 37" stroke="#B99AFF" strokeWidth="1.5" strokeLinecap="round" />

        <rect x="210" y="62" width="52" height="32" rx="4" fill="#160B2B" stroke="#A78BFA" strokeWidth="0.5" strokeOpacity="0.3" className="vis-interactive" />
        <rect x="214" y="68" width="28" height="4" rx="1.5" fill="#E2D9F3" fillOpacity="0.7" />
        <text x="214" y="84" fill="#B99AFF" fontSize="6.5" fontWeight="700" fontFamily="sans-serif">$64,000</text>

        {/* Workflow Connector & Flow Arrows */}
        <path d="M 58 38 L 74 38" stroke="#B99AFF" strokeWidth="1" strokeDasharray="2 2" className="vis-crm-arrow-1" />
        <path d="M 126 38 L 142 38" stroke="#638CFF" strokeWidth="1" strokeDasharray="2 2" className="vis-crm-arrow-2" />
        <path d="M 194 38 L 210 38" stroke="#B99AFF" strokeWidth="1.2" className="vis-crm-arrow-3" />
      </g>
    </svg>
  );
}

/* 6. BUSINESS ANALYTICS: Executive BI Dashboard, Area Chart & Donut Mix */
function AnalyticsVisual() {
  return (
    <svg viewBox="0 0 320 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="visual-svg">
      <defs>
        <linearGradient id="analyticsAreaGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#55D9F2" stopOpacity="0.4" />
          <stop offset="45%" stopColor="#B99AFF" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#160B2B" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="analyticsLineGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#B99AFF" />
          <stop offset="50%" stopColor="#55D9F2" />
          <stop offset="100%" stopColor="#B99AFF" />
        </linearGradient>
        <linearGradient id="barGradCyan" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#55D9F2" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#55D9F2" stopOpacity="0.2" />
        </linearGradient>
        <linearGradient id="barGradMint" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#B99AFF" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#B99AFF" stopOpacity="0.25" />
        </linearGradient>
      </defs>

      {/* Frame */}
      <rect x="16" y="12" width="288" height="176" rx="10" fill="#160B2B" fillOpacity="0.9" stroke="#A78BFA" strokeWidth="1" strokeOpacity="0.25" />

      {/* Top Header */}
      <rect x="16" y="12" width="288" height="24" rx="10" fill="#29134D" fillOpacity="0.35" />
      <path d="M16 36 H304" stroke="#A78BFA" strokeWidth="0.6" strokeOpacity="0.15" />
      <text x="28" y="27" fill="#FFFFFF" fontSize="7.5" fontWeight="600" fontFamily="sans-serif">Executive Intelligence Console</text>
      <circle cx="270" cy="24" r="2.5" fill="#B99AFF" className="vis-pulse-dot" />
      <text x="276" y="26" fill="#B99AFF" fontSize="6" fontWeight="700" fontFamily="sans-serif">LIVE</text>

      {/* 3 Top Metric KPI Cards with Mint, Cyan, and Blue Accents */}
      <g transform="translate(26, 44)">
        <rect width="84" height="32" rx="5" fill="#0D0718" stroke="#A78BFA" strokeWidth="0.6" strokeOpacity="0.3" className="vis-interactive" />
        <text x="8" y="12" fill="#A78BFA" fontSize="6" fontWeight="600" fontFamily="sans-serif">ARR REVENUE</text>
        <text x="8" y="25" fill="#FFFFFF" fontSize="11" fontWeight="700" fontFamily="sans-serif">$184.2K</text>
        <rect x="52" y="16" width="28" height="11" rx="3" fill="#55D9F2" fillOpacity="0.14" stroke="#55D9F2" strokeWidth="0.5" />
        <text x="55" y="24" fill="#55D9F2" fontSize="6" fontWeight="700" fontFamily="sans-serif">▲ +32%</text>

        <rect x="90" width="84" height="32" rx="5" fill="#0D0718" stroke="#A78BFA" strokeWidth="0.6" strokeOpacity="0.3" className="vis-interactive" />
        <text x="98" y="12" fill="#A78BFA" fontSize="6" fontWeight="600" fontFamily="sans-serif">CONVERSION</text>
        <text x="98" y="25" fill="#FFFFFF" fontSize="11" fontWeight="700" fontFamily="sans-serif">4.82%</text>
        <rect x="140" y="16" width="30" height="11" rx="3" fill="#638CFF" fillOpacity="0.14" stroke="#638CFF" strokeWidth="0.5" />
        <text x="143" y="24" fill="#638CFF" fontSize="6" fontWeight="700" fontFamily="sans-serif">▲ +1.4%</text>

        <rect x="180" width="88" height="32" rx="5" fill="#0D0718" stroke="#B99AFF" strokeWidth="0.8" strokeOpacity="0.4" className="vis-interactive" />
        <text x="188" y="12" fill="#B99AFF" fontSize="6" fontWeight="600" fontFamily="sans-serif">LTV / CAC</text>
        <text x="188" y="25" fill="#FFFFFF" fontSize="11" fontWeight="700" fontFamily="sans-serif">5.4x</text>
        <rect x="232" y="16" width="28" height="11" rx="3" fill="#8D83FF" fillOpacity="0.14" stroke="#8D83FF" strokeWidth="0.5" />
        <text x="236" y="24" fill="#8D83FF" fontSize="6" fontWeight="700" fontFamily="sans-serif">HIGH</text>
      </g>

      {/* Main Split: Left Revenue Area Graph, Right Channel Attribution Donut */}
      <g transform="translate(26, 84)">
        {/* Left Chart Area */}
        <rect width="176" height="94" rx="6" fill="#0D0718" fillOpacity="0.75" stroke="#A78BFA" strokeWidth="0.6" strokeOpacity="0.25" />
        
        {/* Volume Bars — purple baseline transitioning to periwinkle, blue, cyan at peak */}
        <g transform="translate(14, 22)">
          <rect x="0" y="44" width="10" height="22" rx="2" fill="#A78BFA" fillOpacity="0.25" className="vis-bar vis-bar-1 vis-interactive" />
          <rect x="18" y="36" width="10" height="30" rx="2" fill="#A78BFA" fillOpacity="0.3" className="vis-bar vis-bar-2 vis-interactive" />
          <rect x="36" y="28" width="10" height="38" rx="2" fill="#A78BFA" fillOpacity="0.35" className="vis-bar vis-bar-3 vis-interactive" />
          <rect x="54" y="32" width="10" height="34" rx="2" fill="#8D83FF" fillOpacity="0.45" className="vis-bar vis-bar-4 vis-interactive" />
          <rect x="72" y="18" width="10" height="48" rx="2" fill="#638CFF" fillOpacity="0.55" className="vis-bar vis-bar-5 vis-interactive" />
          <rect x="90" y="22" width="10" height="44" rx="2" fill="url(#barGradCyan)" className="vis-bar vis-bar-6 vis-interactive" />
          <rect x="108" y="12" width="10" height="54" rx="2" fill="url(#barGradMint)" className="vis-bar vis-bar-7 vis-interactive" />
          <rect x="126" y="8" width="10" height="58" rx="2" fill="#B99AFF" fillOpacity="0.88" className="vis-bar vis-bar-8 vis-interactive" />
        </g>

        {/* Gradient Area Curve Overlay & Mint Peak */}
        <path d="M 14 74 Q 40 68, 68 56 T 120 40 T 154 28 L 154 88 L 14 88 Z" fill="url(#analyticsAreaGrad)" />
        <path d="M 14 74 Q 40 68, 68 56 T 120 40 T 154 28" stroke="url(#analyticsLineGrad)" strokeWidth="2" fill="none" className="vis-analytics-line" />
        
        {/* Peak Badge in Mint Green */}
        <circle cx="154" cy="28" r="3.5" fill="#FFFFFF" stroke="#B99AFF" strokeWidth="1.6" className="vis-pulse-dot" />
        <rect x="108" y="14" width="42" height="10" rx="3" fill="#B99AFF" className="vis-interactive" />
        <text x="112" y="21" fill="#0D0718" fontSize="6" fontWeight="700" fontFamily="sans-serif">$184.2K</text>

        {/* Right Donut Mix with Mint & Cyan Channels */}
        <g transform="translate(186, 0)">
          <rect width="82" height="94" rx="6" fill="#0D0718" fillOpacity="0.75" stroke="#A78BFA" strokeWidth="0.6" strokeOpacity="0.25" />
          <text x="10" y="14" fill="#A78BFA" fontSize="7" fontWeight="700" fontFamily="sans-serif">CHANNELS</text>
          
          {/* Multi-accent Donut Chart — lavender / cyan / periwinkle */}
          <g transform="translate(41, 52)">
            <circle cx="0" cy="0" r="22" stroke="#29134D" strokeWidth="6" fill="none" />
            <circle cx="0" cy="0" r="22" stroke="#B99AFF" strokeWidth="6" strokeDasharray="65 140" strokeDashoffset="-15" fill="none" className="vis-pie-segment" />
            <circle cx="0" cy="0" r="22" stroke="#55D9F2" strokeWidth="6" strokeDasharray="40 140" strokeDashoffset="-85" fill="none" />
            <circle cx="0" cy="0" r="22" stroke="#8D83FF" strokeWidth="6" strokeDasharray="25 140" strokeDashoffset="-130" fill="none" />
            <text x="0" y="3" fill="#FFFFFF" fontSize="7" fontWeight="700" textAnchor="middle" fontFamily="sans-serif">100%</text>
          </g>

          <g transform="translate(14, 82)">
            <circle cx="2" cy="3.5" r="2" fill="#B99AFF" />
            <text x="7" y="6" fill="#E2D9F3" fontSize="5.5" fontWeight="600" fontFamily="sans-serif">48% Direct / SEO</text>
          </g>
        </g>
      </g>
    </svg>
  );
}
