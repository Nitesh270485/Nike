import { useEffect, useRef, useState } from 'react';
import { ProductStory } from './ProductStory.jsx';
import { ShoppingSection } from './ShoppingSection.jsx';


export function App() {
  const hero = useRef(null);
  const [bag,setBag] = useState(null);
  const dialogRef = useRef(null);
  const motion = useRef({ mode: 'auto', paused: false, x: 0, y: 0 });
  const [mode, setMode] = useState('auto');
  const [paused, setPaused] = useState(false);
  const [detail, setDetail] = useState(null);
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const query = matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => { setReduced(query.matches); setPaused(query.matches); motion.current.paused = query.matches; };
    update(); query.addEventListener('change', update);
    let frame, last = 0, elapsed = 0, mix = 0, rx = 0, ry = 0;
    function animate(now) {
      const dt = last ? Math.min((now - last) / 1000, .05) : 0;
      last = now;
      const state = motion.current;
      if (!state.paused) elapsed += dt;
      const wave = (1 - Math.cos(elapsed * Math.PI / 6)) / 2;
      const target = state.mode === 'auto' ? wave : state.mode === 'green' ? 1 : 0;
      const smoothing = query.matches ? 1 : 1 - Math.exp(-dt * 3.5);
      mix += (target - mix) * smoothing; motion.current.mix = mix;
      rx += (state.x - rx) * (1 - Math.exp(-dt * 5));
      ry += (state.y - ry) * (1 - Math.exp(-dt * 5));
      const angle = query.matches ? 0 : Math.sin(elapsed * Math.PI / 6);
      const element = hero.current;
      if (element) {
        const blend = (a,b) => 'rgb('+a.map((v,i)=>Math.round(v+(b[i]-v)*mix)).join(',')+')';
        element.style.setProperty('--bg-light',blend([215,44,53],[32,116,68]));
        element.style.setProperty('--bg-mid',blend([180,24,34],[18,84,48]));
        element.style.setProperty('--bg-dark',blend([135,14,29],[9,56,34]));
        element.style.setProperty('--hue', `${mix * 137}`);
        element.style.setProperty('--shoe-hue', `${mix * 125}deg`);
        element.style.setProperty('--rotation', `${angle * 15 + (query.matches ? 0 : rx * 12)}deg`);
        element.style.setProperty('--roll', `${angle * 5}deg`);
        element.style.setProperty('--pitch', `${query.matches ? 0 : -ry * 6}deg`);
        element.style.setProperty('--float', `${angle * -13}px`);
        element.style.setProperty('--shift', `${angle * 24}px`);
        element.style.setProperty('--shadow-scale', `${1 - Math.abs(angle) * .12}`);
        element.style.setProperty('--progress', `${mix * 100}%`);
      }
      frame = requestAnimationFrame(animate);
    }
    frame = requestAnimationFrame(animate);
    return () => { cancelAnimationFrame(frame); query.removeEventListener('change', update); };
  }, []);
  function select(value) { setMode(value); motion.current.mode = value; }
  function toggleMotion() { setPaused(!paused); motion.current.paused = !paused; }
  function move(event) {
    const box = event.currentTarget.getBoundingClientRect();
    motion.current.x = ((event.clientX - box.left) / box.width - .5) * 2;
    motion.current.y = ((event.clientY - box.top) / box.height - .5) * 2;
  }
  const details = {
    knit: ['ENGINEERED KNIT', 'Lightweight mesh. A close, breathable fit that moves with you.'],
    sole: ['CLOUD SOLE', 'Sculpted cushioning for a softer landing, every step.'],
    heel: ['SUPPORT SYSTEM', 'A structured heel and supportive cage keep you comfortably in place.'],
  };
  return <><nav className="site-nav" aria-label="Main navigation"><a className="nav-brand" href="#top">eqt<span>ORIGINALS</span></a><div className="nav-links"><a href="#design-story">The details</a><a href="#questions">Good to know</a></div><div className="nav-actions"><button className="bag-button" onClick={()=>dialogRef.current.showModal()}>Bag <span>{bag?1:0}</span></button><a className="nav-shop" href="#choose-pair">FIND YOUR PAIR</a></div></nav><main className="canvas">
    <section id="top" className="hero" ref={hero} aria-label="EQT GPR interactive shoe showcase" onPointerMove={move} onPointerLeave={() => { motion.current.x = 0; motion.current.y = 0; }}>
      <header className="header">
        <a className="brand" href="#" aria-label="EQT Originals home">eqt<span>ORIGINALS</span></a>
        <span className="collection">ORIGINALS / COLLECTION 01</span>
        <span className="edition">BUILT TO MOVE.</span>
      </header>
      <div className="product-copy"><p>MEN’S ORIGINALS</p><h1>MAKE YOUR<br />NEXT MOVE.</h1><p className="hero-description">NIKE. An original silhouette.<br />A new perspective on everyday movement.</p><div className="hero-purchase"><a className="hero-shop" href="#choose-pair">CHOOSE YOUR PAIR <span aria-hidden="true">↗</span></a><span className="price">$120</span></div><a className="hero-details-link" href="#design-story">Explore the design <span aria-hidden="true">↓</span></a></div>
      <div className="index"><span>01</span><i /><span>02</span></div>
      <div className="shoe-stage">
        <div className="shoe-motion"><img className="shoe" src="/assets/jordan-shoe.png" alt="Red and black high-top sneaker with a white swoosh" draggable="false" /></div>
        <div className="ground-shadow" />
      </div>
      <button className="hotspot heel" aria-label="Explore support system" aria-expanded={detail === 'heel'} onClick={() => setDetail(detail === 'heel' ? null : 'heel')}><span>SUPPORT SYSTEM</span><b>+</b></button>
      <button className="hotspot knit" aria-label="Explore engineered knit" aria-expanded={detail === 'knit'} onClick={() => setDetail(detail === 'knit' ? null : 'knit')}><b>+</b><span>ENGINEERED KNIT</span></button>
      <button className="hotspot sole" aria-label="Explore cloud sole" aria-expanded={detail === 'sole'} onClick={() => setDetail(detail === 'sole' ? null : 'sole')}><b>+</b><span>CLOUD SOLE</span></button>
      {detail && <aside className="detail" aria-live="polite"><button className="close" aria-label="Close product detail" onClick={() => setDetail(null)}>Close</button><h2>{details[detail][0]}</h2><p>{details[detail][1]}</p></aside>}
      <aside className="rail"><span className="rail-label">MAKE YOUR MOVE</span><span className="rail-line"/><span className="rail-number">EQT / 01</span></aside>
      <footer className="footer">
        <div className="color-info"><span className="eyebrow">CHOOSE YOUR ENERGY</span><div className="color-switch" role="group" aria-label="Shoe and background color"><button className="swatch red" aria-label="Red color" aria-pressed={mode === 'red'} onClick={() => select('red')} /><button className="swatch green" aria-label="Green color" aria-pressed={mode === 'green'} onClick={() => select('green')} /><button className="auto" aria-pressed={mode === 'auto'} onClick={() => select('auto')}>AUTO</button></div></div>
        <div className="motion-control"><button className="pause" aria-pressed={paused} onClick={toggleMotion}>{paused ? 'RESUME COLORS' : 'PAUSE COLORS'}</button><span>{reduced ? 'REDUCED MOTION ENABLED' : 'MOVE YOUR CURSOR TO EXPLORE'}</span></div>
        <div className="color-track"><span>RED</span><div><i /></div><span>GREEN</span></div>
      </footer>
    </section>
    <div className="caption"><span>FORM. FUNCTION. FREEDOM.</span><a href="#design-story">EXPLORE THE DETAILS</a></div>
    <ProductStory /><ShoppingSection bag={bag} setBag={setBag} dialogRef={dialogRef}/>
    </main></>;
}





