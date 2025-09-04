document.addEventListener('DOMContentLoaded', function () {
    const vizContainer = document.getElementById('regularization-viz');
    if (!vizContainer) return;
  
    // controls
    const regTypeSelect = document.getElementById('reg-type');
    const lambdaSlider  = document.getElementById('lambda-slider');
    const lambdaValue   = document.getElementById('lambda-value');
    const trainBtn      = document.getElementById('train-model');
    const resetBtn      = document.getElementById('reset-model');
  
    // layout
    const M = { top: 24, right: 28, bottom: 48, left: 54 };
    function layout() {
      const w = vizContainer.clientWidth || 800;
      const svgWidth = Math.max(340, (w - 24 - (M.left + M.right) * 2) / 2);
      const height = 280;
      return { svgWidth, height };
    }
    let { svgWidth, height } = layout();
  
    // state
    const numWeights = 50;
    const maxSteps = 100;
    let weights = [];
    let targets = [];     // data-preferred weights w*
    let lossHistory = [];
    let step = 0;
    let running = false;
    let timerId = null;
  
    // small AR(1) noise for correlated jitter in curves
    let noiseState = { data: 0, reg: 0 };
    const randn = () => {
      let u=0,v=0; while(!u) u=Math.random(); while(!v) v=Math.random();
      return Math.sqrt(-2*Math.log(u)) * Math.cos(2*Math.PI*v);
    };
  
    // build svgs
    const svg1 = d3.select(vizContainer).append('svg')
      .attr('height', height + M.top + M.bottom)
      .attr('width',  svgWidth + M.left + M.right)
      .style('flex','1 1 0').style('min-width','340px').style('display','block');
  
    const svg2 = d3.select(vizContainer).append('svg')
      .attr('height', height + M.top + M.bottom)
      .attr('width',  svgWidth + M.left + M.right)
      .style('flex','1 1 0').style('min-width','340px').style('display','block');
  
    const g1 = svg1.append('g').attr('transform', `translate(${M.left},${M.top})`);
    const g2 = svg2.append('g').attr('transform', `translate(${M.left},${M.top})`);
  
    // scales & axes
    let xBand = d3.scaleBand().domain(d3.range(numWeights)).range([0, svgWidth]).padding(0.15);
    let yW = d3.scaleLinear().domain([-2, 2]).nice().range([height, 0]);
  
    const axXW = g1.append('g').attr('transform', `translate(0,${height})`).call(d3.axisBottom(xBand).tickValues([]));
    const axYW = g1.append('g').attr('class','y-axis-w').call(d3.axisLeft(yW).ticks(5));
    g1.append('text')
      .attr('x', svgWidth/2).attr('y', -6).attr('fill','black')
      .style('text-anchor','middle').style('font-weight','bold').style('font-size','16px')
      .text('Weight Distribution');
    g1.append('text')
      .attr('transform','rotate(-90)')
      .attr('x', -height/2).attr('y', -42).attr('fill','black')
      .style('text-anchor','middle').style('font-size','12px').style('font-weight','400')
      .text('Weight Value');
  
    let xLoss = d3.scaleLinear().domain([0, maxSteps]).range([0, svgWidth]);
    let yLoss = d3.scaleLinear().domain([0, 0.6]).range([height, 0]);
  
    const axXL = g2.append('g').attr('transform', `translate(0,${height})`).call(d3.axisBottom(xLoss));
    axXL.append('text').attr('x', svgWidth/2).attr('y', 40).attr('fill','black').style('text-anchor','middle').text('Training Step');
    const axYL = g2.append('g').call(d3.axisLeft(yLoss));
    axYL.append('text')
      .attr('transform','rotate(-90)').attr('x', -height/2).attr('y', -44).attr('fill','black')
      .style('text-anchor','middle').style('font-size','12px').style('font-weight','400').text('Loss');
    g2.append('text')
      .attr('x', svgWidth/2).attr('y', -6).attr('fill','black')
      .style('text-anchor','middle').style('font-weight','bold').style('font-size','16px')
      .text('Loss Over Time');
  
    // lines & legend
    const dataLine = d3.line().x(d => xLoss(d.step)).y(d => yLoss(d.dataLoss)).curve(d3.curveMonotoneX);
    const regLine  = d3.line().x(d => xLoss(d.step)).y(d => yLoss(d.regLoss)).curve(d3.curveMonotoneX);
    const totLine  = d3.line().x(d => xLoss(d.step)).y(d => yLoss(d.totalLoss)).curve(d3.curveMonotoneX);
  
    const dataPath = g2.append('path').style('stroke','#10099F').style('stroke-width',2).style('fill','none');
    const regPath  = g2.append('path').style('stroke','#FC8484').style('stroke-width',2).style('fill','none');
    const totPath  = g2.append('path').style('stroke','#2DD2C0').style('stroke-width',2).style('fill','none').style('stroke-dasharray','5,3');
  
    const legend = g2.append('g').attr('transform', `translate(${svgWidth - 140}, 14)`);
    legend.append('line').attr('x1',0).attr('x2',16).style('stroke','#10099F').style('stroke-width',2);
    legend.append('text').attr('x',22).attr('y',4).style('font-size','11px').text('Data Loss');
    legend.append('line').attr('x1',0).attr('x2',16).attr('y1',16).attr('y2',16).style('stroke','#FC8484').style('stroke-width',2);
    legend.append('text').attr('x',22).attr('y',20).style('font-size','11px').text('Reg. Loss');
    legend.append('line').attr('x1',0).attr('x2',16).attr('y1',32).attr('y2',32).style('stroke','#2DD2C0').style('stroke-width',2).style('stroke-dasharray','5,3');
    legend.append('text').attr('x',22).attr('y',36).style('font-size','11px').text('Total');
  
    // init targets (data prefers these weights). Many zeros → helps L1 produce sparsity.
    function initTargets() {
      targets = Array.from({length: numWeights}, () => {
        const pZero = 0.6; // 60% of true targets are exactly 0
        if (Math.random() < pZero) return 0;
        // non-zero targets are modest in magnitude
        return 0.6 * randn(); // mean 0
      });
    }
  
    // init weights
    function initializeWeights() {
      weights = Array.from({length:numWeights}, () => (Math.random()-0.5)*3);
      initTargets();
      lossHistory = [];
      step = 0;
      noiseState = { data: 0, reg: 0 };
    }
  
    // proximal/gradient steps
    function stepNone(w, lr) {
      // move toward target (quadratic data term)
      return w.map((val, i) => val - lr * (val - targets[i]));
    }
    function stepL2(w, lr, lambda) {
      // gradient of data + λ/2 * ||w||^2  → add λ*w term
      return w.map((val, i) => val - lr * ((val - targets[i]) + lambda * val));
    }
    function stepL1(w, lr, lambda) {
      // proximal gradient for L1: gradient step on data, then soft-threshold
      const z = w.map((val, i) => val - lr * (val - targets[i]));
      const T = lr * lambda;
      return z.map(v => {
        if (v >  T) return v - T;
        if (v < -T) return v + T;
        return 0;
      });
    }
  
    function applyUpdate(regType, lambda, t) {
      const lr0 = 0.08;                // keep decreasing slowly (no early saturation)
      const lr  = lr0;                 // constant keeps progress visible across steps
      // small dynamic jitter to weights (prevents perfect determinism)
      const jitter = 0.01;
  
      let wNew;
      if (regType === 'none')      wNew = stepNone(weights, lr);
      else if (regType === 'l2')   wNew = stepL2(weights, lr, lambda);
      else                         wNew = stepL1(weights, lr, lambda);
  
      // add tiny zero-mean noise
      wNew = wNew.map(v => v + jitter * randn());
      return wNew;
    }
  
    // losses with correlated noise; regLoss is exactly 0 when regType = none
    function computeLosses(regType, lambda) {
      const diffSq = weights.map((w,i) => (w - targets[i])*(w - targets[i]));
      const meanDiffSq = diffSq.reduce((s,x)=>s+x,0)/numWeights;
  
      const meanSq  = weights.reduce((s,x)=>s+x*x,0)/numWeights;
      const meanAbs = weights.reduce((s,x)=>s+Math.abs(x),0)/numWeights;
  
      // irreducible floor prevents auto-zeroing
      const dataFloor = 0.03;
      let dataLoss = dataFloor + 0.5 * meanDiffSq;
  
      // reg loss
      let regLoss = 0;
      if (regType === 'l2') regLoss = lambda * 0.5 * meanSq;
      else if (regType === 'l1') regLoss = lambda * meanAbs;
  
      // correlated noise (diminishes as step grows, but never to 0)
      const dSigma = 0.015 + 0.02 * Math.exp(-step/60);
      const rSigma = 0.015 + 0.02 * Math.exp(-step/60);
      noiseState.data = 0.85 * noiseState.data + dSigma * randn();
      noiseState.reg  = 0.85 * noiseState.reg  + rSigma * randn();
  
      dataLoss = Math.max(0, dataLoss + noiseState.data);
      if (regType === 'none') {
        regLoss = 0; // exactly zero when no regularization
        noiseState.reg = 0;
      } else {
        regLoss = Math.max(0, regLoss + 0.5 * noiseState.reg);
      }
  
      const totalLoss = (regType === 'none') ? dataLoss : dataLoss + regLoss;
      return { dataLoss, regLoss, totalLoss };
    }
  
    // draw weights
    function drawWeights() {
      // adapt y domain but keep readable margins
      const maxAbs = Math.max(1.5, d3.max(weights, d => Math.abs(d)) || 1.5);
      yW.domain([-maxAbs, maxAbs]).nice();
      axYW.call(d3.axisLeft(yW).ticks(5));
  
      const bars = g1.selectAll('rect.weight-bar').data(weights, (_, i) => i);
      bars.enter().append('rect')
        .attr('class','weight-bar')
        .attr('x', (_,i) => xBand(i)).attr('width', xBand.bandwidth())
        .attr('y', yW(0)).attr('height', 0)
        .merge(bars)
        .transition().duration(120)
        .attr('x', (_,i) => xBand(i)).attr('width', xBand.bandwidth())
        .attr('y', d => d>=0 ? yW(d) : yW(0))
        .attr('height', d => Math.abs(yW(d)-yW(0)))
        .style('fill', d => Math.abs(d)<1e-3 ? '#E5E7EB' : (d>0 ? '#10099F' : '#FC8484'))
        .style('opacity', d => 0.35 + 0.6 * (Math.min(1, Math.abs(d)/maxAbs)));
      bars.exit().remove();
  
      g1.selectAll('line.zero-line').data([0]).join('line')
        .attr('class','zero-line').attr('x1',0).attr('x2',svgWidth)
        .attr('y1',yW(0)).attr('y2',yW(0))
        .style('stroke','#262626').style('stroke-width',1).style('stroke-dasharray','3,3');
  
      if (regTypeSelect.value === 'l1') {
        const zeros = weights.filter(w => Math.abs(w) < 1e-3).length;
        g1.selectAll('text.sparsity').data([0]).join('text')
          .attr('class','sparsity').attr('x', svgWidth/2).attr('y', height+34)
          .attr('text-anchor','middle').style('font-size','12px').style('fill','#2DD2C0')
          .text(`Sparsity: ${zeros}/${numWeights} weights ≈ 0`);
      } else {
        g1.selectAll('text.sparsity').remove();
      }
    }
  
    // draw loss curves
    function drawLossCurves() {
      const maxVal = Math.max(0.15, d3.max(lossHistory, d => Math.max(d.dataLoss, d.regLoss, d.totalLoss)) || 0.15);
      yLoss.domain([0, maxVal * 1.15]);
      axYL.call(d3.axisLeft(yLoss));
  
      dataPath.datum(lossHistory).attr('d', dataLine);
      regPath.datum(lossHistory).attr('d', regLine);
      totPath.datum(lossHistory).attr('d', totLine);
    }
  
    // one tick
    function tick() {
      if (step >= maxSteps) { running = false; return; }
  
      const regType = regTypeSelect.value;
      const lambda  = parseFloat(lambdaSlider.value) / 100;
  
      weights = applyUpdate(regType, lambda, step);
      const L = computeLosses(regType, lambda);
      lossHistory.push({ step, ...L });
  
      drawWeights();
      drawLossCurves();
  
      step++;
      if (running) timerId = setTimeout(tick, 50);
    }
  
    // controls
    function startTraining() {
      if (running) return;
      running = true;
      initializeWeights();
      drawWeights();
      drawLossCurves();
      tick();
    }
    function resetAll() {
      running = false;
      if (timerId) clearTimeout(timerId);
      initializeWeights();
      drawWeights();
      lossHistory = [];
      drawLossCurves();
    }
  
    lambdaSlider.addEventListener('input', () => {
      const v = parseFloat(lambdaSlider.value) / 100;
      lambdaValue.textContent = v.toFixed(2);
    });
    trainBtn.addEventListener('click', startTraining);
    resetBtn.addEventListener('click', resetAll);
  
    // resize
    window.addEventListener('resize', () => {
      const s = layout();
      svgWidth = s.svgWidth;
  
      svg1.attr('width', svgWidth + M.left + M.right);
      svg2.attr('width', svgWidth + M.left + M.right);
  
      xBand.range([0, svgWidth]);
      axXW.call(d3.axisBottom(xBand).tickValues([]));
  
      xLoss.range([0, svgWidth]);
      axXL.call(d3.axisBottom(xLoss));
      legend.attr('transform', `translate(${svgWidth - 140}, 14)`);
  
      drawWeights();
      drawLossCurves();
    });
  
    // initial render
    initializeWeights();
    drawWeights();
    drawLossCurves();
  });