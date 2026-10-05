import {useEffect,useRef,useState} from 'react';
import * as THREE from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';

export function ShoeViewer({motion}) {
 const host=useRef(null),[status,setStatus]=useState('loading');
 useEffect(()=>{
  const container=host.current;let renderer;
  try{renderer=new THREE.WebGLRenderer({alpha:true,antialias:true});}catch{setStatus('fallback');return;}
  renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.setClearColor(0,0);renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=.95;container.appendChild(renderer.domElement);
  const scene=new THREE.Scene(),camera=new THREE.OrthographicCamera(-2,2,1,-1,.01,100);camera.position.set(0,1.15,6);camera.lookAt(0,0,0);
  scene.add(new THREE.HemisphereLight(0xffffff,0x303746,1.5));
  for(const [x,y,z,power] of [[-3,5,5,3.2],[4,3,-4,2.4],[-4,0,-3,.7]]){const light=new THREE.DirectionalLight(0xffffff,power);light.position.set(x,y,z);scene.add(light);}
  const pivot=new THREE.Group();scene.add(pivot);let model,accents=[],frame,last=0,yaw=-.32,tilt=-.06,targetYaw=-.32,targetTilt=-.06,alive=true,visible=true;
  const redAccent=new THREE.Color('#bd2535'),greenAccent=new THREE.Color('#389665');
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const dispose=object=>object.traverse(o=>{o.geometry?.dispose();if(o.material)for(const m of Array.isArray(o.material)?o.material:[o.material]){for(const value of Object.values(m))if(value?.isTexture)value.dispose();m.dispose();}});
  new GLTFLoader().load('/assets/higgsfield-sneaker.glb',gltf=>{if(!alive){dispose(gltf.scene);return;}model=gltf.scene;const extras=[];model.traverse(o=>{if(o.isLight||o.isCamera)extras.push(o);if(o.isMesh){o.frustumCulled=false;for(const m of Array.isArray(o.material)?o.material:[o.material]){const name=m.name.toLowerCase(); if(name.includes('accent'))accents.push(m); if(name.includes('support')){m.color.set('#30383d');m.roughness=.72;} if(name.includes('rubber')){m.color.set('#202528');m.roughness=.88;} if(name.includes('white')){m.color.set('#e8e5da');m.roughness=.68;} if(m.map)m.map.anisotropy=renderer.capabilities.getMaxAnisotropy();}}});extras.forEach(o=>o.removeFromParent());
  model.updateMatrixWorld(true);
  const cages=[];model.traverse(o=>{if(o.isMesh&&o.name.toLowerCase().includes('support_cage'))cages.push(o);if(o.isMesh&&o.name.toLowerCase().includes('support cage'))cages.push(o);if(o.name==='Lace_bow'||o.name==='Lace bow')o.visible=false;});
  const ray=new THREE.Raycaster(),point=new THREE.Vector3();
  model.traverse(o=>{if(!o.isMesh||!o.name.toLowerCase().includes('white'))return;const positions=o.geometry.attributes.position;for(let i=0;i<positions.count;i++){point.fromBufferAttribute(positions,i);o.localToWorld(point);const side=Math.sign(point.z)||1;ray.set(new THREE.Vector3(point.x,point.y,side),new THREE.Vector3(0,0,-side));const hit=ray.intersectObjects(cages,false)[0];if(hit){point.z=hit.point.z+side*.0007;o.worldToLocal(point);positions.setXYZ(i,point.x,point.y,point.z);}}positions.needsUpdate=true;o.geometry.computeVertexNormals();});
  const box=new THREE.Box3().setFromObject(model),size=box.getSize(new THREE.Vector3()),center=box.getCenter(new THREE.Vector3());const scale=3.2/Math.max(size.x,size.y,size.z);model.position.copy(center).multiplyScalar(-scale);model.scale.setScalar(scale);pivot.add(model);setStatus('ready');},undefined,()=>{if(alive)setStatus('fallback');});
  function resize(){const w=container.clientWidth,h=container.clientHeight;if(!w||!h)return;renderer.setSize(w,h);const aspect=w/h,height=Math.max(1.8,3.7/aspect);camera.left=-height*aspect/2;camera.right=height*aspect/2;camera.top=height/2;camera.bottom=-height/2;camera.updateProjectionMatrix();}
  const observer=new ResizeObserver(resize);observer.observe(container);resize();
  const intersection=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;});intersection.observe(container);
  const move=e=>{const r=container.getBoundingClientRect();targetYaw=-.32+((e.clientX-r.left)/r.width-.5)*1.8;targetTilt=((e.clientY-r.top)/r.height-.5)*.55;};
  const leave=()=>{targetYaw=-.32;targetTilt=-.06;};
  const down=e=>{if(e.pointerType!=='mouse'){container.setPointerCapture(e.pointerId);move(e);}};
  const key=e=>{if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home'].includes(e.key))return;e.preventDefault();if(e.key==='ArrowLeft')targetYaw-=.3;if(e.key==='ArrowRight')targetYaw+=.3;if(e.key==='ArrowUp')targetTilt=Math.max(-.65,targetTilt-.12);if(e.key==='ArrowDown')targetTilt=Math.min(.65,targetTilt+.12);if(e.key==='Home')leave();};
  container.addEventListener('pointermove',move);container.addEventListener('pointerleave',leave);container.addEventListener('pointerdown',down);container.addEventListener('pointercancel',leave);container.addEventListener('keydown',key);
  function render(now){const dt=last?Math.min((now-last)/1000,.05):0;last=now;if(visible){const easing=reduced.matches?1:1-Math.exp(-dt*6);{yaw+=(targetYaw-yaw)*easing;tilt+=(targetTilt-tilt)*easing;}pivot.rotation.set(tilt,yaw,-.08);for(const m of accents)m.color.copy(redAccent).lerp(greenAccent,motion.current.mix||0);renderer.render(scene,camera);}frame=requestAnimationFrame(render);}frame=requestAnimationFrame(render);
  return()=>{alive=false;cancelAnimationFrame(frame);observer.disconnect();intersection.disconnect();container.removeEventListener('pointermove',move);container.removeEventListener('pointerleave',leave);container.removeEventListener('pointerdown',down);container.removeEventListener('pointercancel',leave);container.removeEventListener('keydown',key);dispose(scene);renderer.dispose();renderer.domElement.remove();};
 },[motion]);
 return <div className={`model-viewer model-${status}`} ref={host} tabIndex={0} role="group" aria-label="3D shoe. Hover to rotate. On touch screens drag, or use arrow keys. Home resets the view.">{status!=='ready'&&<img className="model-fallback" src="/assets/shoe.png" alt="Black sneaker with red accents"/>}{status==='loading'&&<span className="model-status" role="status">Loading 3D view</span>}{status==='fallback'&&<span className="model-status" role="status">Image preview · 3D unavailable</span>}</div>;
}
