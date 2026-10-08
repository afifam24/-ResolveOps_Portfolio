'use client';

import { Camera, Mesh, Plane, Program, Renderer, Texture, Transform } from 'ogl';
import { useEffect, useRef, useState } from 'react';

import './CircularGallery.css';

function lerp(p1, p2, t) {
  return p1 + (p2 - p1) * t;
}

class Media {
  constructor({
    geometry,
    gl,
    image,
    index,
    length,
    renderer,
    scene,
    screen,
    text,
    viewport,
    bend,
    textColor,
    borderRadius = 0,
    font
  }) {
    this.extra = 0;
    this.geometry = geometry;
    this.gl = gl;
    this.image = image;
    this.index = index;
    this.length = length;
    this.renderer = renderer;
    this.scene = scene;
    this.screen = screen;
    this.text = text;
    this.viewport = viewport;
    this.bend = bend;
    this.textColor = textColor;
    this.borderRadius = borderRadius;
    this.font = font;
    this.createShader();
    this.createMesh();
    // Labels are semantic HTML in the service selector below.
    this.onResize();
  }
  createShader() {
    const texture = new Texture(this.gl, {
      generateMipmaps: true
    });
    this.program = new Program(this.gl, {
      depthTest: false,
      depthWrite: false,
      vertex: `
        precision highp float;
        attribute vec3 position;
        attribute vec2 uv;
        uniform mat4 modelViewMatrix;
        uniform mat4 projectionMatrix;
        uniform float uTime;
        uniform float uSpeed;
        varying vec2 vUv;
        void main() {
          vUv = uv;
          vec3 p = position;
          p.z = (sin(p.x * 4.0 + uTime) * 1.5 + cos(p.y * 2.0 + uTime) * 1.5) * (uSpeed * 0.25);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
        }
      `,
      fragment: `
        precision highp float;
        uniform vec2 uImageSizes;
        uniform vec2 uPlaneSizes;
        uniform sampler2D tMap;
        uniform float uBorderRadius;
        varying vec2 vUv;
        
        float roundedBoxSDF(vec2 p, vec2 b, float r) {
          vec2 d = abs(p) - b;
          return length(max(d, vec2(0.0))) + min(max(d.x, d.y), 0.0) - r;
        }
        
        void main() {
          vec2 ratio = vec2(
            min((uPlaneSizes.x / uPlaneSizes.y) / (uImageSizes.x / uImageSizes.y), 1.0),
            min((uPlaneSizes.y / uPlaneSizes.x) / (uImageSizes.y / uImageSizes.x), 1.0)
          );
          vec2 uv = vec2(
            vUv.x * ratio.x + (1.0 - ratio.x) * 0.5,
            vUv.y * ratio.y + (1.0 - ratio.y) * 0.5
          );
          vec4 color = texture2D(tMap, uv);
          
          float d = roundedBoxSDF(vUv - 0.5, vec2(0.5 - uBorderRadius), uBorderRadius);
          
          // Smooth antialiasing for edges
          float edgeSmooth = 0.002;
          float alpha = 1.0 - smoothstep(-edgeSmooth, edgeSmooth, d);
          
          gl_FragColor = vec4(color.rgb, alpha);
        }
      `,
      uniforms: {
        tMap: { value: texture },
        uPlaneSizes: { value: [0, 0] },
        uImageSizes: { value: [0, 0] },
        uSpeed: { value: 0 },
        uTime: { value: 100 * Math.random() },
        uBorderRadius: { value: this.borderRadius }
      },
      transparent: true
    });
    const img = new Image();
    img.crossOrigin = 'anonymous';
    this.imageElement = img;
    img.onload = () => {
      if(this.disposed) return;
      texture.image = img;
      this.program.uniforms.uImageSizes.value = [img.naturalWidth, img.naturalHeight];
    };
    img.src = this.image;
  }
  createMesh() {
    this.plane = new Mesh(this.gl, {
      geometry: this.geometry,
      program: this.program
    });
    this.plane.setParent(this.scene);
  }
  update(scroll, direction) {
    this.plane.position.x = this.x - scroll.current - this.extra;

    const x = this.plane.position.x;
    const H = this.viewport.width / 2;

    if (this.bend === 0) {
      this.plane.position.y = 0;
      this.plane.rotation.z = 0;
    } else {
      const B_abs = Math.abs(this.bend) * (this.screen.width < 600 ? .55 : 1);
      const R = (H * H + B_abs * B_abs) / (2 * B_abs);
      const effectiveX = Math.min(Math.abs(x), H);

      const arc = R - Math.sqrt(R * R - effectiveX * effectiveX);
      if (this.bend > 0) {
        this.plane.position.y = -arc;
        this.plane.rotation.z = -Math.sign(x) * Math.asin(effectiveX / R);
      } else {
        this.plane.position.y = arc;
        this.plane.rotation.z = Math.sign(x) * Math.asin(effectiveX / R);
      }
    }

    this.speed = scroll.current - scroll.last;
    this.program.uniforms.uTime.value += 0.04;
    this.program.uniforms.uSpeed.value = this.speed;

    const planeOffset = this.plane.scale.x / 2;
    const viewportOffset = this.viewport.width / 2;
    this.isBefore = this.plane.position.x + planeOffset < -viewportOffset;
    this.isAfter = this.plane.position.x - planeOffset > viewportOffset;
    if (direction === 'right' && this.isBefore) {
      this.extra -= this.widthTotal;
      this.isBefore = this.isAfter = false;
    }
    if (direction === 'left' && this.isAfter) {
      this.extra += this.widthTotal;
      this.isBefore = this.isAfter = false;
    }
  }
  onResize({ screen, viewport } = {}) {
    if (screen) this.screen = screen;
    if (viewport) {
      this.viewport = viewport;
      if (this.plane.program.uniforms.uViewportSizes) {
        this.plane.program.uniforms.uViewportSizes.value = [this.viewport.width, this.viewport.height];
      }
    }
    this.scale = this.screen.height / (this.screen.width < 600 ? 1350 : 1250);
    this.plane.scale.y = (this.viewport.height * (900 * this.scale)) / this.screen.height;
    this.plane.scale.x = (this.viewport.width * (700 * this.scale)) / this.screen.width;
    this.plane.program.uniforms.uPlaneSizes.value = [this.plane.scale.x, this.plane.scale.y];
    this.padding = 2;
    this.width = this.plane.scale.x + this.padding;
    this.widthTotal = this.width * this.length;
    this.x = this.width * this.index;
  }
}

class App {
  constructor(
    container,
    {
      items,
      bend,
      textColor = '#ffffff',
      borderRadius = 0,
      font = 'bold 30px Manrope',
      scrollSpeed = 2,
      scrollEase = 0.05
    } = {}
  ) {
    document.documentElement.classList.remove('no-js');
    this.container = container;
    this.scrollSpeed = scrollSpeed;
    this.scroll = { ease: scrollEase, current: 0, target: 0, last: 0 };
    this.onCheckDebounce = () => { clearTimeout(this.checkTimer); this.checkTimer = setTimeout(() => this.onCheck(), 150); };
    this.createRenderer();
    this.createCamera();
    this.createScene();
    this.onResize();
    this.createGeometry();
    this.createMedias(items, bend, textColor, borderRadius, font);
    this.update();
    this.addEventListeners();
  }
  createRenderer() {
    this.renderer = new Renderer({
      alpha: true,
      antialias: true,
      dpr: Math.min(window.devicePixelRatio || 1, 2)
    });
    this.gl = this.renderer.gl;
    this.gl.clearColor(0, 0, 0, 0);
    this.container.appendChild(this.gl.canvas);
  }
  createCamera() {
    this.camera = new Camera(this.gl);
    this.camera.fov = 45;
    this.camera.position.z = 20;
  }
  createScene() {
    this.scene = new Transform();
  }
  createGeometry() {
    this.planeGeometry = new Plane(this.gl, {
      heightSegments: 50,
      widthSegments: 100
    });
  }
  createMedias(items, bend = 1, textColor, borderRadius, font) {
    const galleryItems = items;
    this.mediasImages = galleryItems.concat(galleryItems);
    this.medias = this.mediasImages.map((data, index) => {
      return new Media({
        geometry: this.planeGeometry,
        gl: this.gl,
        image: data.image,
        index,
        length: this.mediasImages.length,
        renderer: this.renderer,
        scene: this.scene,
        screen: this.screen,
        text: data.text,
        viewport: this.viewport,
        bend,
        textColor,
        borderRadius,
        font
      });
    });
  }
  onTouchDown(e) {
    if(e.button && e.button !== 0) return;
    this.container.setPointerCapture(e.pointerId);
    this.isDown = true;
    this.scroll.position = this.scroll.current;
    this.start = e.touches ? e.touches[0].clientX : e.clientX;
  }
  onTouchMove(e) {
    if (!this.isDown) return;
    const x = e.touches ? e.touches[0].clientX : e.clientX;
    const distance = (this.start - x) * (this.scrollSpeed * 0.025);
    this.scroll.target = this.scroll.position + distance;
  }
  onTouchUp() {
    this.isDown = false;
    this.onCheck();
  }
  onWheel(e) {
    if(Math.abs(e.deltaX) <= Math.abs(e.deltaY) && !e.shiftKey) return;
    e.preventDefault();
    this.scroll.target += (e.deltaX || e.deltaY) * .025;
    this.onCheckDebounce();
  }
  onKeyDown(e) {
    switch (e.key) {
      case 'ArrowRight':
        e.preventDefault();
        this.scroll.target += this.medias[0].width;
        this.onCheckDebounce();
        break;

      case 'ArrowLeft':
        e.preventDefault();
        this.scroll.target -= this.medias[0].width;
        this.onCheckDebounce();
        break;

      case 'Home':
        e.preventDefault();
        this.scroll.target = 0;
        this.onCheckDebounce();
        break;

      default:
        break;
    }
  }

  onCheck() {
    if (!this.medias || !this.medias[0]) return;
    const width = this.medias[0].width;
    const itemIndex = Math.round(Math.abs(this.scroll.target) / width);
    const item = width * itemIndex;
    this.scroll.target = this.scroll.target < 0 ? -item : item;
    const index = ((Math.round(this.scroll.target / width) % this.itemCount) + this.itemCount) % this.itemCount;
    this.onSelect?.(index);
  }
  select(index) {
    const width=this.medias[0].width;
    const count=this.itemCount;
    const currentIndex=Math.round(this.scroll.target/width);
    let delta=index-((currentIndex%count+count)%count);
    if(delta>count/2)delta-=count;if(delta<-count/2)delta+=count;
    this.scroll.target=(currentIndex+delta)*width;
  }
  onResize() {
    const oldWidth=this.medias?.[0]?.width;
    this.screen = {
      width: this.container.clientWidth,
      height: this.container.clientHeight
    };
    this.renderer.setSize(this.screen.width, this.screen.height);
    this.camera.perspective({
      aspect: this.screen.width / this.screen.height
    });
    const fov = (this.camera.fov * Math.PI) / 180;
    const height = 2 * Math.tan(fov / 2) * this.camera.position.z;
    const width = height * this.camera.aspect;
    this.viewport = { width, height };
    if (this.medias) {
      this.medias.forEach(media => {
        const oldTotal=media.widthTotal;
        media.onResize({ screen: this.screen, viewport: this.viewport });
        if(oldTotal) media.extra *= media.widthTotal/oldTotal;
      });
      if(oldWidth){const ratio=this.medias[0].width/oldWidth;
        for(const key of ['current','target','last','position'])if(typeof this.scroll[key]==='number')this.scroll[key]*=ratio;
      }
    }
  }
  update() {
    if(this.destroyed) return;
    if(document.hidden || this.visible === false) { this.raf=requestAnimationFrame(()=>this.update()); return; }
    this.scroll.current = lerp(this.scroll.current, this.scroll.target, this.scroll.ease);
    const direction = this.scroll.current > this.scroll.last ? 'right' : 'left';
    if (this.medias) {
      this.medias.forEach(media => media.update(this.scroll, direction));
    }
    this.renderer.render({ scene: this.scene, camera: this.camera });
    this.scroll.last = this.scroll.current;
    this.raf = window.requestAnimationFrame(this.update.bind(this));
  }
  addEventListeners() {
    this.handlers = { pointerdown:this.onTouchDown.bind(this), pointermove:this.onTouchMove.bind(this), pointerup:this.onTouchUp.bind(this), pointercancel:this.onTouchUp.bind(this), wheel:this.onWheel.bind(this), keydown:this.onKeyDown.bind(this) };
    Object.entries(this.handlers).forEach(([name,fn])=>this.container.addEventListener(name,fn,{passive:name!=='wheel' && name!=='keydown'}));
    this.resizeObserver=new ResizeObserver(()=>this.onResize()); this.resizeObserver.observe(this.container);
    this.observer=new IntersectionObserver(([entry])=>{this.visible=entry.isIntersecting;}); this.observer.observe(this.container);
  }
  destroy() {
    this.destroyed=true; cancelAnimationFrame(this.raf); clearTimeout(this.checkTimer);
    Object.entries(this.handlers || {}).forEach(([name,fn])=>this.container.removeEventListener(name,fn));
    this.resizeObserver?.disconnect(); this.observer?.disconnect();
    this.medias?.forEach(m=>{m.disposed=true;m.imageElement.onload=null;m.program.uniforms.tMap.value.image=null;});
    this.gl.getExtension('WEBGL_lose_context')?.loseContext();
    this.gl.canvas.remove();
  }
}

export default function CircularGallery({items, selected=0, onSelect, bend=3, textColor='#FFFFFF', borderRadius=.05, font='bold 30px Manrope', scrollSpeed=2, scrollEase=.05}) {
 const containerRef=useRef(null), appRef=useRef(null), callback=useRef(onSelect), selection=useRef(selected);
 const [fallback,setFallback]=useState(false); callback.current=onSelect; selection.current=selected;
 useEffect(()=>{
  const motion=matchMedia('(prefers-reduced-motion: reduce)'); let app, disposed=false;
  const start=async()=>{
   app?.destroy(); app=null; appRef.current=null;
   if(motion.matches){setFallback(true);return;}
   await document.fonts.ready; if(disposed)return;
   try {
    setFallback(false);
    app=new App(containerRef.current,{items,bend,textColor,borderRadius,font,scrollSpeed,scrollEase});
    app.itemCount=items.length;app.onSelect=i=>callback.current?.(i);appRef.current=app;app.select(selection.current);
   } catch { containerRef.current?.replaceChildren();setFallback(true); }
  };
  start();motion.addEventListener('change',start);
  return()=>{disposed=true;motion.removeEventListener('change',start);app?.destroy();appRef.current=null;};
 },[items,bend,textColor,borderRadius,font,scrollSpeed,scrollEase]);
 useEffect(()=>{appRef.current?.select(selected);},[selected]);
 return <div className="gallery-viewport">
  <div style={{visibility:fallback?'hidden':'visible'}} aria-hidden={fallback} className="circular-gallery" ref={containerRef} tabIndex={fallback?-1:0} role="region" aria-label="Service carousel. Drag horizontally or use left and right arrow keys." />
  {fallback && <div className="gallery-fallback"><img src={items[selected].image} alt="" /></div>}
 </div>;
}
