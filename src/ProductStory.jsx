import {useState} from 'react';

const features = [
  {id:'knit',number:'01',title:'Room to breathe.',label:'ENGINEERED KNIT',body:'An open-knit upper brings texture and flexibility to a close-fitting silhouette. Made for the pace of your everyday.',caption:'A CLOSER LOOK / THE UPPER',alt:'Close-up of the textured black knit and red trim on the sneaker upper'},
  {id:'support',number:'02',title:'Structure where it counts.',label:'SCULPTED SUPPORT',body:'A sculpted side cage and wrapped heel give the soft upper its distinctive shape. A balance of structure and freedom.',caption:'A CLOSER LOOK / THE CAGE',alt:'Close-up of the sculpted side cage and heel support'},
  {id:'sole',number:'03',title:'A softer side to the city.',label:'CLOUD SOLE',body:'A substantial sole grounds the profile, while three bold stripes connect the upper to the base. Comfort, with a point of view.',caption:'A CLOSER LOOK / THE SOLE',alt:'Close-up of the black sole and three white diagonal stripes'},
];
export function ProductStory(){
 const [active,setActive]=useState(0);
 return <section id="design-story" className="product-story" aria-labelledby="story-heading">
   <header className="story-heading"><div><p className="story-kicker">THE THINKING BEHIND THE FEEL</p><h2 id="story-heading">LESS NOISE.<br/>MORE <em>MOVE.</em></h2></div><p className="story-intro">Nothing extra. Every detail has a purpose.<br/>Get closer to the elements that make EQT unmistakable.</p></header>
   <div className="story-content">
    <div className="feature-list" aria-label="Explore shoe construction">
     {features.map((feature,i)=><div className={`feature-row ${active===i?'selected':''}`} key={feature.id}>
       <h3><button id={`feature-${feature.id}`} aria-expanded={active===i} aria-controls={`panel-${feature.id}`} onClick={()=>setActive(i)}><span className="feature-number">{feature.number}</span><span>{feature.title}</span><span className="feature-toggle" aria-hidden="true">{active===i?'−':'+'}</span></button></h3>
       <div id={`panel-${feature.id}`} role="region" aria-labelledby={`feature-${feature.id}`} hidden={active!==i}><p className="feature-label">{feature.label}</p><p className="feature-body">{feature.body}</p></div>
     </div>)}
     <p className="feature-note">THREE ELEMENTS. ONE ORIGINAL.</p>
    </div>
    <figure className={`story-image story-image-${features[active].id}`}>
      <span className="detail-index" aria-hidden="true">{features[active].number}</span>
      <div className="detail-crop"><img src="/assets/jordan-shoe.png" alt={features[active].alt} loading="lazy" draggable="false"/></div>
      <figcaption><span>{features[active].caption}</span><span>NIKE</span></figcaption>
    </figure>
   </div>
   <footer className="story-footer"><span>ORIGINAL BY DESIGN.</span><a href="#choose-pair">CHOOSE YOUR PAIR</a></footer>
 </section>;
}

