const clamp = v => Math.max(-1, Math.min(1, v));
export function handPose(points, wasPinching = false) {
  if (!points || points.length < 21) return { x: 0, y: 0, grabX: 0, grabY: 0, pinching: false };
  const distance = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
  const palm = Math.max(distance(points[0], points[9]), .02);
  const pinching = distance(points[4], points[8]) / palm < (wasPinching ? .48 : .32);
  const x = clamp((.5 - points[9].x) * 2.6);
  const y = clamp((points[9].y - .5) * 2.6);
  return { x, y, pinching, grabX: 0, grabY: 0 };
}


// Confirm gestures over time; never treat one missed frame as a release.
export function createGestureTracker() {
  let packed = false, candidate = null, candidateSince = 0, lastSeen = null;
  let previous = { x: 0, y: 0, grabX: 0, grabY: 0 };
  return (points, now) => {
    if (!points || points.length < 21) {
      candidate = null;
      if (lastSeen === null || now - lastSeen > 900) { packed = false; previous = {x:0,y:0,grabX:0,grabY:0}; }
      return {...previous, pinching: packed, tracked: false};
    }
    lastSeen = now;
    const distance = (a,b) => Math.hypot(a.x-b.x,a.y-b.y);
    const scale = Math.max(distance(points[0],points[9]),distance(points[5],points[17]),.04);
    const ratio = distance(points[4],points[8]) / scale;
    const desired = packed ? ratio < .65 : ratio < .42;
    if (desired === packed) candidate = null;
    else if (candidate !== desired) { candidate = desired; candidateSince = now; }
    else if (now - candidateSince >= (desired ? 160 : 220)) { packed = desired; candidate = null; }
    previous = handPose(points, packed);
    return {...previous,pinching:packed,tracked:true};
  };
}

export function gestureFixture(pinched, x=.5) {
  const p=Array.from({length:21},()=>({x,y:.5}));
  p[0]={x,y:.8};p[5]={x:x-.12,y:.5};p[17]={x:x+.12,y:.5};
  p[4]={x:x-.03,y:.3};p[8]={x:x+(pinched?.02:.24),y:.3};
  return p;
}
