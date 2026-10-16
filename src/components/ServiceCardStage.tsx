import { useMemo, useState } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowLeft } from '@phosphor-icons/react';
import { services } from '../data/content';
import ServiceVisual from './ServiceVisual';
import CircularGallery from './CircularGallery';
import SpecularButton from './SpecularButton';
import './ServiceCardStage.css';
function serviceImage(id:string, index:number) {
 const markup=renderToStaticMarkup(<ServiceVisual serviceId={id}/>);
 const svg=markup.slice(markup.indexOf('<svg'),markup.indexOf('</svg>')+6)
   .replaceAll('var(--accent)','#F5F3FF')
   .replaceAll('var(--text-primary)','#FFFFFF')
   .replaceAll('var(--bg-primary)','#0F0A24')
   .replace(/opacity="([0-9.]+)"/g,(_,v)=>`opacity="${Math.min(1,Number(v)*2.5)}"`)
   .replace(/fill-opacity="([0-9.]+)"/g,(_,v)=>`fill-opacity="${Math.min(1,Number(v)*2)}"`)
   .replace('<svg ','<svg x="30" y="180" width="640" height="420" ');
 const titles=['WEB DEVELOPMENT','UI / UX DESIGN','SEO & MARKETING','AI AUTOMATION','CRM & WORKFLOWS','BUSINESS ANALYTICS'];
 const image=`<svg xmlns="http://www.w3.org/2000/svg" width="700" height="900" viewBox="0 0 700 900"><defs><linearGradient id="cardGrad${index}" x1="0" y1="0" x2="0.8" y2="1"><stop offset="0%" stop-color="#1A1033" stop-opacity="0.96"/><stop offset="55%" stop-color="#130B29" stop-opacity="0.98"/><stop offset="100%" stop-color="#0D071D" stop-opacity="1"/></linearGradient><radialGradient id="cardGlow${index}" cx="50%" cy="12%" r="75%"><stop offset="0%" stop-color="#8B5CF6" stop-opacity="0.12"/><stop offset="50%" stop-color="#1A1033" stop-opacity="0.04"/><stop offset="100%" stop-color="#100923" stop-opacity="0"/></radialGradient><linearGradient id="cardBorder${index}" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="rgba(233, 229, 255, 0.45)"/><stop offset="30%" stop-color="rgba(167, 139, 250, 0.28)"/><stop offset="70%" stop-color="rgba(139, 92, 246, 0.20)"/><stop offset="100%" stop-color="rgba(167, 139, 250, 0.15)"/></linearGradient><linearGradient id="lineGrad${index}" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="#8B5CF6" stop-opacity="0.08"/><stop offset="50%" stop-color="#A78BFA" stop-opacity="0.25"/><stop offset="100%" stop-color="#8B5CF6" stop-opacity="0.08"/></linearGradient><filter id="cardOuterGlow${index}" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="12" result="blur"/></filter></defs><rect x="18" y="18" width="664" height="864" rx="36" fill="none" stroke="#8B5CF6" stroke-width="4" stroke-opacity="0.16" filter="url(#cardOuterGlow${index})"/><rect width="700" height="900" rx="40" fill="url(#cardGrad${index})"/><rect width="700" height="900" rx="40" fill="url(#cardGlow${index})"/><rect x="1" y="1" width="698" height="898" rx="39" fill="none" stroke="url(#cardBorder${index})" stroke-width="1.6"/><path d="M 50 2 L 650 2" stroke="#FFFFFF" stroke-opacity="0.25" stroke-width="1" stroke-linecap="round"/><text x="50" y="90" fill="#F5F3FF" font-family="sans-serif" font-size="30" font-weight="600" letter-spacing="0.05em">RESOLVEOPS / DISCIPLINE 0${index+1}</text>${svg}<path d="M50 710H650" stroke="url(#lineGrad${index})" stroke-width="1"/><text x="50" y="790" fill="#FFFFFF" font-family="sans-serif" font-size="38" font-weight="700" letter-spacing="-0.01em">${titles[index].replace(/&/g,'&amp;')}</text><circle cx="630" cy="90" r="5" fill="#A78BFA"/></svg>`;
 return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(image)}`;
}
export default function ServiceCardStage() {
 const [selected,setSelected]=useState(0);
 const items=useMemo(()=>services.map((s,i)=>({image:serviceImage(s.id,i),text:s.title})),[]);
 const service=services[selected];
 return <section className="service-stage section" aria-labelledby="gallery-heading">
  <div className="service-atmosphere" aria-hidden="true">
   <div className="trail trail-1" />
   <div className="trail trail-2" />
   <div className="trail trail-3" />
   <div className="ambient-mesh" />
  </div>
  <div className="container" style={{position:'relative',zIndex:1}}>
   <div className="stage-header"><div><span className="stack-eyebrow">Six disciplines. One studio.</span><h2 id="gallery-heading">What we do</h2></div><Link to="/services" className="btn btn-ghost">Explore our services <ArrowRight/></Link></div>
   <div className="gallery-scene">
    <div key={service.id} className="gallery-watermark" aria-hidden="true">{['Web Development','UI/UX Design','SEO & Marketing','AI Automation','CRM & Workflows','Business Analytics'][selected]}</div>
    <CircularGallery items={items} selected={selected} onSelect={setSelected} bend={3}/>
   </div>
   <div className="gallery-toolbar"><span>Drag to explore · {String(selected+1).padStart(2,'0')} / 06</span><div><SpecularButton size="sm" radius={50} aria-label="Previous service" onClick={()=>setSelected((selected+5)%6)}><ArrowLeft/></SpecularButton><SpecularButton size="sm" radius={50} aria-label="Next service" onClick={()=>setSelected((selected+1)%6)}><ArrowRight/></SpecularButton></div></div>
   <div className="gallery-selectors" role="group" aria-label="Choose a service">{services.map((s,i)=><button key={s.id} aria-pressed={selected===i} onClick={()=>setSelected(i)}>{s.number} {s.title}</button>)}</div>
   <article className="gallery-detail" aria-live="polite"><div><span className="stack-eyebrow">Your next advantage</span><h3>{service.title}</h3><p>{service.shortDescription}</p><Link className="btn btn-secondary" to={`/contact?service=${service.id}`}>Discuss this service <ArrowRight/></Link></div><div><ul className="stack-capabilities">{service.capabilities.map(item=><li key={item}>{item}</li>)}</ul><p className="gallery-outcome">{service.outcome}</p></div></article>
  </div>
 </section>;
}
