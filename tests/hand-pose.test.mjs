import test from 'node:test';
import assert from 'node:assert/strict';
import {handPose} from '../src/handPose.mjs';
const points = () => Array.from({length:21},(_,i)=>({x:.5,y:i===0?.8:.5}));
test('missing hand resets displacement',()=>assert.deepEqual(handPose(null,true),{x:0,y:0,grabX:0,grabY:0,pinching:false}));
test('mirrors horizontal input and bounds movement',()=>{const p=points();p[9].x=-1;assert.equal(handPose(p).x,1);});
test('pinch hysteresis prevents jitter and release resets drag',()=>{const p=points();p[8].x=.62;assert.equal(handPose(p,false).pinching,false);assert.equal(handPose(p,true).pinching,true);p[8].x=.8;assert.equal(handPose(p,true).grabX,0);assert.equal(handPose(p,true).pinching,false);});

import {createGestureTracker,gestureFixture} from '../src/handPose.mjs';
test('pinch confirms, survives dropout and opens only on sustained release',()=>{
 const t=createGestureTracker();const closed=gestureFixture(true),open=gestureFixture(false);
 assert.equal(t(open,0).pinching,false);
 assert.equal(t(closed,70).pinching,false);
 assert.equal(t(closed,250).pinching,true);
 assert.equal(t(null,400).pinching,true);
 assert.equal(t(closed,500).pinching,true);
 assert.equal(t(open,600).pinching,true);
 assert.equal(t(open,850).pinching,false);
});
test('one noisy open frame cannot cancel pinch',()=>{
 const t=createGestureTracker();t(gestureFixture(true),0);t(gestureFixture(true),200);
 assert.equal(t(gestureFixture(false),270).pinching,true);
 assert.equal(t(gestureFixture(true),340).pinching,true);
 assert.equal(t(null,1300).pinching,false);
});
