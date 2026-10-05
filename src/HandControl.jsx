import { useEffect, useRef, useState } from 'react';
import { handPose } from './handPose.mjs';

export function HandControl({ motion }) {
  const video = useRef(null);
  const session = useRef({ id: 0 });
  const [packedPreview, setPackedPreview] = useState(false);
  const [phase, setPhase] = useState('off');
  const [message, setMessage] = useState('Move your hand to tilt. Pinch to pack. Open to reveal.');
  function release() {
    const s = session.current;
    s.id++; cancelAnimationFrame(s.frame);
    s.stream?.getTracks().forEach(t => t.stop()); s.stream = null;
    s.detector?.close(); s.detector = null;
    if (video.current) video.current.srcObject = null;
    Object.assign(motion.current, { hand: false, x: 0, y: 0, grabX: 0, grabY: 0, pinching: false });
  }
  function stop() { release(); setPhase('off'); setMessage('Camera off. Mouse control is available.'); }
  useEffect(() => {
    const hidden = () => { if (document.hidden) stop(); };
    document.addEventListener('visibilitychange', hidden);
    return () => { release(); document.removeEventListener('visibilitychange', hidden); };
  }, []);
  async function start() {
    motion.current.previewPacked = false; setPackedPreview(false);
    release(); const s = session.current, id = s.id;
    setPhase('loading'); setMessage('Loading hand control…');
    try {
      if (!navigator.mediaDevices?.getUserMedia) throw new Error('Camera access needs HTTPS and a supported browser.');
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user', width: 640, height: 480 }, audio: false });
      if (id !== s.id) { stream.getTracks().forEach(t => t.stop()); return; }
      s.stream = stream; video.current.srcObject = stream; await video.current.play();
      const { FilesetResolver, HandLandmarker } = await import('@mediapipe/tasks-vision');
      const vision = await FilesetResolver.forVisionTasks('https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.32/wasm');
      if (id !== s.id) return;
      const detector = await HandLandmarker.createFromOptions(vision, {
        baseOptions: { modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task' },
        runningMode: 'VIDEO', numHands: 1, minHandDetectionConfidence: .6, minTrackingConfidence: .6,
      });
      if (id !== s.id) { detector.close(); return; }
      s.detector = detector; motion.current.hand = true; setPhase('on');
      let last = 0, lastVideo = -1, pinching = false, lastLabel = '';
      const tick = now => {
        if (id !== s.id) return;
        try {
          if (now - last > 65 && video.current.readyState >= 2 && video.current.currentTime !== lastVideo) {
            last = now; lastVideo = video.current.currentTime;
            const points = detector.detectForVideo(video.current, now).landmarks[0];
            const pose = handPose(points, pinching); pinching = pose.pinching;
            Object.assign(motion.current, pose);
            const label = !points ? 'Show one hand to the camera' : pinching ? 'Packed — open your hand to reveal' : 'Move to tilt — pinch to pack the shoe';
            if (label !== lastLabel) { setMessage(label); lastLabel = label; }
          }
          s.frame = requestAnimationFrame(tick);
        } catch { release(); setPhase('error'); setMessage('Tracking stopped. Try enabling hand control again.'); }
      };
      s.frame = requestAnimationFrame(tick);
    } catch (error) {
      if (id !== s.id) return;
      release(); setPhase('error');
      setMessage(error.name === 'NotAllowedError' ? 'Camera permission denied. Allow camera access, then retry.' : error.name === 'NotFoundError' ? 'No camera found. Mouse control still works.' : 'Could not start hand control. Check your camera and connection, then retry.');
    }
  }
  const active = phase === 'loading' || phase === 'on';
  return <div className="hand-control">
    <button className="hand-button" onClick={active ? stop : start} aria-pressed={active}>{active ? 'STOP CAMERA' : 'ENABLE HAND CONTROL'}</button>
    {!active && <button className="box-preview" aria-pressed={packedPreview} onClick={() => { motion.current.previewPacked = !packedPreview; setPackedPreview(!packedPreview); }}>{packedPreview ? 'OPEN BOX' : 'PREVIEW BOX'}</button>}
    <div className="hand-status" role="status">{message}</div>
    <small>Camera frames stay in your browser. Tracking files download on enable.</small>
    <video className={active ? 'hand-video active' : 'hand-video'} ref={video} muted playsInline aria-label="Mirrored camera preview" />
  </div>;
}
