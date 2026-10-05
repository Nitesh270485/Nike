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
