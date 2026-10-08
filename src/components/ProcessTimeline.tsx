import type {ProcessStep} from '../data/content';
import WorkflowJourney from './WorkflowJourney';
export default function ProcessTimeline({steps}:{steps:ProcessStep[]}){return <WorkflowJourney steps={steps}/>;}
