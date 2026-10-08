import {useEffect,useRef,useState} from 'react';
import {Renderer,Program,Mesh,Triangle} from 'ogl';
import {VERT,FRAG} from './specular-shaders';
import './SpecularButton.css';
/** One shared OGL context renders the supplied SpecularButton rim shader for CTA links and buttons. */
export default function SpecularButtons(){
 const ref=useRef<HTMLDivElement>(null);const [reduced,setReduced]=useState(false);
 useEffect(()=>{const media=matchMedia('(prefers-reduced-motion:reduce)');setReduced(media.matches);const change=()=>setReduced(media.matches);media.addEventListener('change',change);return()=>media.removeEventListener('change',change)},[]);
 useEffect(()=>{
  if(reduced || !ref.current || !matchMedia('(hover:hover)').matches)return;
  const host=ref.current;let renderer:Renderer;
  try{renderer=new Renderer({alpha:true,antialias:true,premultipliedAlpha:true,dpr:Math.min(devicePixelRatio||1,1.5)});}catch{return;}
  const gl=renderer.gl,dpr=renderer.dpr;gl.clearColor(0,0,0,0);
  const geometry=new Triangle(gl);delete geometry.attributes.uv;
  const program=new Program(gl,{vertex:VERT,fragment:FRAG,transparent:true,depthTest:false,depthWrite:false,uniforms:{uCenter:{value:[0,0]},uHalfSize:{value:[1,1]},uRadius:{value:18},uAngle:{value:2.4},uPx:{value:dpr},uLineColor:{value:[.96,.95,1.]},uBaseColor:{value:[.55,.42,.85]},uIntensity:{value:0},uShineSize:{value:10*Math.PI/180},uShineFade:{value:40*Math.PI/180},uThickness:{value:1*dpr},uBaseWidth:{value:dpr}}});
  const mesh=new Mesh(gl,{geometry,program});host.appendChild(gl.canvas);
  let pointer:{x:number;y:number}|null=null, raf=0, last=performance.now(), disposed=false;
  let buttons:HTMLElement[]=[];const states=new Map<HTMLElement,{angle:number;bright:number}>();
  const collect=()=>{buttons=Array.from(document.querySelectorAll<HTMLElement>('.btn,button,[data-specular]'));for(const key of states.keys())if(!key.isConnected)states.delete(key);};collect();
  const schedule=()=>{if(!raf && !disposed)raf=requestAnimationFrame(draw)};
  const resize=()=>{renderer.setSize(innerWidth,innerHeight);schedule()};resize();
  function draw(now:number){
   raf=0;if(disposed)return;const dt=Math.min((now-last)/1000,.05);last=now;
   gl.disable(gl.SCISSOR_TEST);gl.clear(gl.COLOR_BUFFER_BIT);if(document.hidden)return;
   gl.enable(gl.SCISSOR_TEST);let animate=false;
   for(const button of buttons){
    if(!button.isConnected || button.matches(':disabled') || button.closest('[inert]'))continue;
    const b=button.getBoundingClientRect();if(!b.width||b.bottom<0||b.top>innerHeight||b.right<0||b.left>innerWidth)continue;
    const hit=document.elementFromPoint(Math.max(0,Math.min(innerWidth-1,b.left+b.width/2)),Math.max(0,Math.min(innerHeight-1,b.top+b.height/2)));if(hit && !button.contains(hit))continue;
    const st=states.get(button)||{angle:2.4,bright:0};states.set(button,st);
    let target=0,angle=st.angle;
    if(pointer){const dx=Math.max(b.left-pointer.x,0,pointer.x-b.right),dy=Math.max(b.top-pointer.y,0,pointer.y-b.bottom),distance=Math.hypot(dx,dy),t=Math.max(0,1-distance/250);target=t*t*(3-2*t);
     if(distance===0){const nx=(pointer.x-b.left-b.width/2)/(b.width/2),ny=(b.top+b.height/2-pointer.y)/(b.height/2);angle=Math.atan2(2/b.height,-2/b.width)+nx*.3+ny*.15;}else angle=Math.atan2(b.top+b.height/2-pointer.y,pointer.x-b.left-b.width/2);
    }
    const diff=((angle-st.angle+Math.PI*3)%(Math.PI*2))-Math.PI;st.angle+=diff*(1-Math.exp(-dt*7));st.bright+=(target-st.bright)*(1-Math.exp(-dt*8));
    if(target>0 || st.bright>.003)animate=true;if(st.bright<.003)continue;
    const u=program.uniforms;u.uCenter.value=[(b.left+b.width/2)*dpr,(innerHeight-b.top-b.height/2)*dpr];u.uHalfSize.value=[b.width*dpr/2,b.height*dpr/2];u.uRadius.value=Math.min(parseFloat(getComputedStyle(button).borderTopLeftRadius)||18,b.height/2)*dpr;u.uAngle.value=st.angle;u.uIntensity.value=st.bright*1.15;
    const x=Math.max(0,(b.left-20)*dpr),y=Math.max(0,(innerHeight-b.bottom-20)*dpr);gl.scissor(x,y,(b.width+40)*dpr,(b.height+40)*dpr);renderer.render({scene:mesh,clear:false});
   }
   gl.disable(gl.SCISSOR_TEST);if(animate)schedule();
  }
  const move=(e:PointerEvent)=>{if(e.pointerType!=='mouse')return;pointer={x:e.clientX,y:e.clientY};schedule()};const reset=()=>{pointer=null;schedule()};
  const observer=new MutationObserver(()=>{collect();schedule()});observer.observe(document.getElementById('root')!,{childList:true,subtree:true});
  const scroll=()=>schedule();window.addEventListener('pointermove',move,{passive:true});window.addEventListener('scroll',scroll,true);window.addEventListener('resize',resize);window.addEventListener('blur',reset);document.documentElement.addEventListener('pointerleave',reset);
  return()=>{disposed=true;cancelAnimationFrame(raf);observer.disconnect();window.removeEventListener('pointermove',move);window.removeEventListener('scroll',scroll,true);window.removeEventListener('resize',resize);window.removeEventListener('blur',reset);document.documentElement.removeEventListener('pointerleave',reset);gl.canvas.remove();geometry.remove();gl.deleteProgram(program.program);gl.getExtension('WEBGL_lose_context')?.loseContext()};
 },[reduced]);
 return <div ref={ref} className="specular-screen" aria-hidden="true"/>;
}
