import {useState,useRef} from 'react';

export function ShoppingSection({bag,setBag,dialogRef}){
 const [color,setColor]=useState('red'),[size,setSize]=useState(null),[error,setError]=useState(''),[review,setReview]=useState(false);
 const sizeRef=useRef(null);
 function add(){if(!size){setError('Choose a size to add your pair.');sizeRef.current?.focus();return;}setError('');setBag({color,size});setReview(false);dialogRef.current.showModal();}
 const questions=[
  ['How do I choose my size?', 'Choose your usual UK size to explore the demo. A verified size chart and fit guidance will be available before the store accepts orders.'],
  ['Can I see both colors?', 'Yes. Select Signal Red or Field Green above to preview the accent color on your pair. You can change your selection before adding it to your bag.'],
  ['What about delivery and returns?', 'Delivery options, shipping costs and the return policy have not been set for this concept store. These details must be confirmed before purchases are enabled.'],
  ['Can I place a real order?', 'This is an interactive storefront demo. Your bag stays in this page session. No order is submitted and no payment is collected.'],
 ];
 return <>
  <section className="shop-section" id="choose-pair" aria-labelledby="shop-title">
   <div className={`shop-visual ${color}`}><span className="shop-visual-label">YOUR NEXT ORIGINAL.</span><span className="shop-big-type" aria-hidden="true">EQT</span><img src="/assets/jordan-shoe.png" alt={`EQT GPR sneaker in ${color==='red'?'Signal Red':'Field Green'}`} loading="lazy"/><div className="shop-visual-bottom"><span>01 / NIKE</span><span>{color==='red'?'SIGNAL RED':'FIELD GREEN'}</span></div></div>
   <div className="shop-options"><p className="section-eyebrow">MAKE IT YOURS</p><h2 id="shop-title">YOUR COLOR.<br/>YOUR MOVE.</h2><div className="shop-product"><h3>NIKE Shoes</h3><span>$120</span></div><p className="shop-description">A bold silhouette. A considered construction.<br/>Choose the pair that feels like you.</p>
   <fieldset className="color-picker"><legend>Color <span>{color==='red'?'Signal Red':'Field Green'}</span></legend>{['red','green'].map(c=><label key={c} className={color===c?'chosen':''}><input type="radio" name="product-color" value={c} checked={color===c} onChange={()=>setColor(c)}/><span className={`color-dot ${c}`}/>{c==='red'?'Signal Red':'Field Green'}</label>)}</fieldset>
   <fieldset className="size-picker" aria-describedby={error?'size-error':undefined}><legend>Select size <span>UK</span></legend><div className="size-grid">{[6,7,8,9,10,11,12].map((s,i)=><button ref={i===0?sizeRef:null} key={s} aria-pressed={size===s} onClick={()=>{setSize(s);setError('');}}>{s}</button>)}</div></fieldset>
   <p className="size-error" id="size-error" role="status">{error}</p><button className="add-button" onClick={add}>ADD TO BAG <span>$120</span></button><p className="demo-note">Concept store. Orders and payments are not enabled.</p>
   <div className="purchase-notes"><span>Two colorways</span><span>UK sizes 6–12</span><span>Original design</span></div>
   </div>
  </section>
  <section className="faq-section" id="questions" aria-labelledby="faq-title"><div><p className="section-eyebrow">A LITTLE MORE CLARITY</p><h2 id="faq-title">GOOD<br/>TO KNOW.</h2><p>The details before your next move.</p></div><div className="faq-list">{questions.map(([q,a],i)=><details key={q}><summary><span>{q}</span><span className="faq-plus" aria-hidden="true">+</span></summary><p>{a}</p></details>)}</div></section>
  <footer className="site-footer"><a className="footer-brand" href="#top">eqt<span>ORIGINALS</span></a><p>FORM. FUNCTION. FREEDOM.</p><a href="#choose-pair">FIND YOUR PAIR</a><small>Independent concept storefront · Not an official adidas store</small></footer>
  <dialog className="bag-dialog" ref={dialogRef} onClose={()=>setReview(false)} aria-labelledby="bag-title"><div className="bag-top"><h2 id="bag-title">{review?'Your selection':'Your bag'}</h2><form method="dialog"><button aria-label="Close bag">Close</button></form></div>{bag?<><p className="bag-confirmation">{review?'Demo review — no order has been placed.':'Your pair is in the bag.'}</p><div className="bag-item"><img style={{filter:bag.color==='green'?'hue-rotate(125deg)':'none'}} src="/assets/jordan-shoe.png" alt="Your selected sneaker"/><div><h3>NIKE Shoes</h3><p>{bag.color==='red'?'Signal Red':'Field Green'} / UK {bag.size}</p><strong>$120</strong><button className="remove-item" onClick={()=>{setBag(null);setReview(false);}}>Remove</button></div></div><div className="bag-total"><span>Subtotal · 1 pair</span><strong>$120</strong></div><p className="bag-disclaimer">Shipping and taxes are not calculated. This demo does not process payments or reserve inventory.</p>{!review?<button className="add-button" onClick={()=>setReview(true)}>REVIEW SELECTION</button>:<p className="review-notice" role="status">You’re all set to explore. Checkout will be available when this store launches.</p>}<form method="dialog"><button className="continue-button">CONTINUE EXPLORING</button></form></>:<><p className="empty-bag">Your next original is waiting.</p><form method="dialog"><button className="add-button" onClick={()=>{location.hash='choose-pair';}}>CHOOSE YOUR PAIR</button></form></>}</dialog>
 </>;
}
