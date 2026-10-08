import { useId, useState } from 'react';
import { ArrowRight, ArrowUpRight, Check, Compass, NotePencil, PenNib, Rocket, ChartLineUp } from '@phosphor-icons/react';
import type { ProcessStep } from '../data/content';
import SpecularButton from './SpecularButton';
import './WorkflowJourney.css';

const icons = [Compass, NotePencil, PenNib, Rocket, ChartLineUp];
const outputs = [
  ['Your goals and audience', 'The problem to solve', 'A clear starting point'],
  ['Scope and priorities', 'A shared project direction', 'The next milestones'],
  ['Design and development', 'Collaborative review', 'Refined details'],
  ['Checks across devices', 'Issues resolved', 'Launch readiness'],
  ['Performance review', 'Feedback and insights', 'Practical improvements']
];

export default function WorkflowJourney({ steps }: { steps: ProcessStep[] }) {
  const [selected, setSelected] = useState(0);
  const id = useId();
  const step = steps[selected];
  const Icon = icons[selected] || Compass;

  return (
    <div className="workflow-journey">
      {/* Left Column: Process Steps */}
      <div className="workflow-nav">
        <span className="workflow-label">From the first conversation</span>
        <ol className="workflow-list">
          {steps.map((s, i) => (
            <li key={s.number}>
              <button
                className={`workflow-choice${selected === i ? ' is-current' : ''}`}
                aria-pressed={selected === i}
                aria-controls={id}
                onClick={() => setSelected(i)}
              >
                <span className="workflow-index">{s.number}</span>
                <span className="workflow-title">{s.title}</span>
                <ArrowUpRight aria-hidden="true" className="workflow-arrow" />
              </button>
            </li>
          ))}
        </ol>
        <span className="workflow-label workflow-end">To a better way forward</span>
      </div>

      {/* Right Column: Active Process Detail Card */}
      <article className="workflow-panel" id={id} aria-live="polite" aria-labelledby={`${id}-title`}>
        <span className="workflow-ghost" aria-hidden="true">{step.number}</span>
        
        <div className="workflow-panel-top">
          <span className="workflow-label">Phase {step.number} / 05</span>
          <Icon size={32} weight="duotone" aria-hidden="true" className="workflow-panel-icon" />
        </div>

        <div key={step.number} className="workflow-copy">
          <h3 id={`${id}-title`}>{step.title}</h3>
          <p>{step.description}</p>
          
          <div className="workflow-focus-area">
            <span className="workflow-label">What we focus on</span>
            <ul className="workflow-focus-list">
              {(outputs[selected] || []).map((item) => (
                <li key={item}>
                  <Check size={16} weight="bold" aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="workflow-panel-bottom">
          <div className="workflow-progress" aria-label={`Step ${selected + 1} of ${steps.length}`}>
            {steps.map((s, i) => (
              <span key={s.number} className={i <= selected ? 'done' : ''} />
            ))}
          </div>
          <SpecularButton size="sm" onClick={() => setSelected((selected + 1) % steps.length)}>
            {selected === steps.length - 1 ? 'Back to discover' : 'Next phase'}
            <ArrowRight size={14} weight="bold" />
          </SpecularButton>
        </div>
      </article>
    </div>
  );
}
