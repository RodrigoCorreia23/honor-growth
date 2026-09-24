/* Pure movement rules shared by the page and its regression tests. */
(function (root) {
  const clamp = (n, a=0, b=1) => Math.min(b, Math.max(a,n));
  const rules = {
    ease: p => { const t=clamp(p); return t*t*(3-2*t); },
    storyIndex: (p,count) => Math.min(count-1,Math.floor(clamp((p-.14)/.86)*count)),
    storyProgress: (index,count) => .14+(index+.35)*.86/count,
    storyStep: (p,count,steps=3) => {
      const position=clamp((p-.14)/.86)*count;
      return Math.min(steps-1,Math.floor((position-Math.min(count-1,Math.floor(position)))*steps));
    },
    returnLayout: ({top,height,viewport,scrollY}) => {
      const removed=Math.max(0,height-viewport);
      return {removed,scrollY:Math.max(0,scrollY-Math.min(removed,Math.max(0,-top)))};
    },
    navigationDuration: distance => clamp(900+Math.abs(distance)*.22,900,1600)
  };
  if(typeof module==='object' && module.exports) module.exports=rules;
  else root.HonorMotion=rules;
})(globalThis);
