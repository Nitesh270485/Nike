import * as THREE from 'three';

// Dimensions are in metres, with X running from heel to toe.
export function createSneaker() {
  const shoe = new THREE.Group(); shoe.name = 'EQT inspired concept sneaker';
  const materials = {
    knit: new THREE.MeshStandardMaterial({color:0x171b20,roughness:.96}),
    rubber: new THREE.MeshStandardMaterial({color:0x17191c,roughness:.84}),
    cage: new THREE.MeshStandardMaterial({color:0x30353c,roughness:.56}),
    accent: new THREE.MeshStandardMaterial({color:0xe32635,roughness:.8}),
    stripe: new THREE.MeshStandardMaterial({color:0xeeeae2,roughness:.65}),
    lining: new THREE.MeshStandardMaterial({color:0x090b0e,roughness:1,side:THREE.DoubleSide}),
    lace: new THREE.MeshStandardMaterial({color:0x111418,roughness:.92})
  };
  Object.entries(materials).forEach(([key,m])=>m.name=key);
  function add(geometry, material, name) {const mesh=new THREE.Mesh(geometry,material);mesh.name=name;shoe.add(mesh);return mesh;}
  function tube(points,radius,material,name,closed=false){return add(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points.map(p=>new THREE.Vector3(...p)),closed),Math.max(24,points.length*8),radius,8,closed),material,name);}
  function interpolate(points,x){for(let i=1;i<points.length;i++){if(x<=points[i][0]){let t=(x-points[i-1][0])/(points[i][0]-points[i-1][0]);t=t*t*(3-2*t);return points[i-1][1]*(1-t)+points[i][1]*t;}}return points.at(-1)[1];}
  const widths=[[-1.5,.06],[-1.38,.32],[-1,.40],[-.5,.38],[0,.43],[.65,.5],[1.15,.44],[1.48,.25],[1.62,.02]];
  const tops=[[-1.5,.56],[-1.32,1.03],[-1.0,1.10],[-.55,1.14],[-.25,1.00],[.25,.77],[.75,.53],[1.25,.43],[1.62,.29]];
  const width=x=>interpolate(widths,x);
  const top=x=>interpolate(tops,x);
  // Elliptical cross-sections give the upper real volume on both sides.
  const p=[],uv=[],idx=[],colors=[];const nx=280,na=140;
  for(let i=0;i<=nx;i++){const x=-1.5+3.12*i/nx;for(let j=0;j<=na;j++){const a=2*Math.PI*j/na;const s=Math.sin(a);const base=.24;let y=base+(top(x)-base)*Math.max(0,s);if(s<0)y=base+s*.035;const weave=.0025*Math.sin(i*3.3)*Math.sin(j*2.5);const z=(width(x)+weave)*Math.cos(a);p.push(x,y+weave,z);uv.push(i/nx,j/na);const fiber=.35+.65*Math.pow(Math.abs(Math.sin(i*1.7+j*.7)*Math.cos(j*1.9)),.4);colors.push(fiber,fiber,fiber);}}
  for(let i=0;i<nx;i++)for(let j=0;j<na;j++){const x=-1.5+3.12*(i+.5)/nx,a=2*Math.PI*(j+.5)/na;const opening=((x+.96)/.40)**2+(Math.cos(a)*width(x)/.285)**2<1 && Math.sin(a)>.5;if(opening)continue;const k=i*(na+1)+j;idx.push(k,k+1,k+na+1,k+1,k+na+2,k+na+1);}
  const upper=new THREE.BufferGeometry();upper.setAttribute('position',new THREE.Float32BufferAttribute(p,3));upper.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));upper.setAttribute('color',new THREE.Float32BufferAttribute(colors,3));materials.knit.vertexColors=true;upper.setIndex(idx);upper.computeVertexNormals();materials.knit.side=THREE.DoubleSide;add(upper,materials.knit,'Sculpted knit upper');
  function sole(name,y,height,scale,mat){const pts=[];for(let i=0;i<=72;i++){const a=i/72*Math.PI*2;const x=.06+1.57*Math.cos(a);const z=width(Math.max(-1.5,Math.min(1.62,x)))*Math.sin(a)>0?1:1;pts.push(new THREE.Vector2(x,Math.sign(Math.sin(a))*width(Math.max(-1.5,Math.min(1.62,x)))));}const shape=new THREE.Shape(pts);const g=new THREE.ExtrudeGeometry(shape,{depth:height,bevelEnabled:true,bevelSegments:3,steps:1,bevelSize:.045,bevelThickness:.035,curveSegments:32});g.rotateX(Math.PI/2);const m=add(g,mat,name);m.position.y=y+height;m.scale.set(scale,1,scale);return m;}
  sole('Sculpted foam midsole',.02,.19,1.02,materials.rubber);
  sole('Traction outsole',-.055,.065,1.035,materials.rubber);
  // Individual sole tread bars remain actual geometry in the GLB.
  for(let i=0;i<22;i++){const x=-1.35+i*.13;const tread=add(new THREE.BoxGeometry(.045,.03,width(x)*1.8),materials.cage,'Outsole traction '+i);tread.position.set(x,-.06,0);tread.rotation.y=.10;}
  // Raised piping follows the toe and both sides of the upper.
  const trim=[];for(let i=0;i<=100;i++){const a=i/100*Math.PI*2;const x=.06+1.48*Math.cos(a);trim.push([x,.28+.025*Math.cos(a),Math.sign(Math.sin(a))*width(x)*.98]);}tube(trim,.023,materials.accent,'Color accent welt',true);
  // Padded collar around a genuine open cavity.
  const collar=[],inner=[];for(let i=0;i<64;i++){const a=i/64*Math.PI*2;const x=-.96+.40*Math.cos(a),z=.285*Math.sin(a);collar.push([x,top(x)-.025,z]);inner.push([x,top(x)-.09,z*.91]);}tube(collar,.045,materials.accent,'Padded ankle collar',true);tube(inner,.047,materials.lining,'Inner ankle padding',true);
  const footbed=add(new THREE.SphereGeometry(1,40,20),materials.lining,'Recessed footbed');footbed.scale.set(.43,.055,.29);footbed.position.set(-.96,.62,0);
  // Tongue rests on top of the instep.
  const tongue=add(new THREE.SphereGeometry(1,48,24),materials.knit,'Padded tongue');tongue.scale.set(.62,.08,.27);tongue.position.set(-.13,.96,0);tongue.rotation.z=-.48;
  // Side cages and signature three bands on both sides.
  for(const side of [-1,1]){
    const path=new THREE.Shape();path.moveTo(-.95,.25);path.lineTo(-.65,.79);path.lineTo(-.37,1.02);path.lineTo(.20,.70);path.lineTo(.35,.30);path.quadraticCurveTo(-.35,.19,-.95,.25);
    const cage=add(new THREE.ExtrudeGeometry(path,{depth:.028,bevelEnabled:true,bevelSize:.02,bevelThickness:.012,bevelSegments:2,steps:1}),materials.cage,side===1?'Lateral support cage':'Medial support cage');cage.position.z=side*.405;if(side===-1)cage.scale.z=-1;
    for(let n=0;n<3;n++){
      const x=-.78+n*.22;const shape=new THREE.Shape();shape.moveTo(x,.12);shape.lineTo(x+.14,.12);shape.lineTo(x+.39,.60);shape.lineTo(x+.25,.60);shape.closePath();const band=add(new THREE.ExtrudeGeometry(shape,{depth:.009,bevelEnabled:true,bevelSize:.004,bevelThickness:.003,bevelSegments:1}),materials.stripe,'White side stripe '+side+' '+n);band.position.z=side*.448;if(side===-1)band.scale.z=-1;
    }
    for(let n=0;n<5;n++) {const x=-.50+n*.14,y=1.19-n*.075;const eye=add(new THREE.TorusGeometry(.035,.010,8,16),materials.rubber,'Lace eyelet');eye.position.set(x,y,side*.225);eye.rotation.x=Math.PI/2;}
    for(let row=0;row<3;row++)for(let col=0;col<4;col++){const hole=add(new THREE.SphereGeometry(.017,8,6),materials.lining,'Cage vent');hole.scale.z=.2;hole.position.set(-.51+col*.15+row*.035,.44+row*.11,side*.445);}
  }
  for(let n=0;n<5;n++){const x=-.48+n*.14,y=1.235-n*.075;tube([[x,y,-.23],[x+.07,y+.045,0],[x+.14,y-.04,.23]],.021,materials.lace,'Cross lace A '+n);tube([[x,y,.23],[x+.055,y+.047,0],[x+.14,y-.04,-.23]],.021,materials.lace,'Cross lace B '+n);}
  tube([[-.46,1.25,0],[-.66,1.30,.20],[-.77,1.31,.11],[-.48,1.26,0],[-.60,1.32,-.20],[-.77,1.33,-.10],[-.46,1.25,0]],.018,materials.lace,'Lace bow');
  // Heel counter and pull loop.
  const heelPoints=[];for(let i=0;i<=32;i++){const a=Math.PI/2+i/32*Math.PI;heelPoints.push([-.93+.49*Math.cos(a),.50,.345*Math.sin(a)]);}tube(heelPoints,.07,materials.cage,'Heel stabilizer');
  tube([[-1.30,.87,-.08],[-1.44,1.27,-.08],[-1.38,1.32,.08],[-1.27,.89,.08]],.026,materials.rubber,'Heel pull loop');
  shoe.position.y=-.58;
  const root=new THREE.Group();root.name='Sneaker';root.add(shoe);root.userData={description:'Original stylized sneaker inspired by the supplied lateral reference. Unseen surfaces approximated. Not a scan or manufacturing model.'};
  return {root,materials};
}

