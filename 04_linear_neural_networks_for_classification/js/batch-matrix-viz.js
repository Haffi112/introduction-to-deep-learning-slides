// Batch Matrix Multiplication Visualization (refined measures + more right room)
function initBatchMatrixViz() {
    const container = d3.select('#batch-matrix-visualization');
    if (container.empty()) return;
    container.selectAll('*').remove();
  
    const width  = container.node().getBoundingClientRect().width || 960;
    const height = 480;
    const margin = { top: 52, right: 220, bottom: 96, left: 140 };
    const innerWidth  = width  - margin.left - margin.right;
    const innerHeight = height - margin.top  - margin.bottom;
  
    const svg = container.append('svg')
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('preserveAspectRatio', 'xMidYMid meet')
      .style('font-family', 'system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif');
  
    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);
  
    const batch = 32, features = 784, classes = 10;
  
    const matrixScale = 0.15;
    const matrixSpacing = 96;
  
    const raw = {
      X: { w: features * matrixScale, h: batch   * matrixScale },
      W: { w: classes  * matrixScale, h: features* matrixScale },
      O: { w: classes  * matrixScale, h: batch   * matrixScale },
      P: { w: classes  * matrixScale, h: batch   * matrixScale },
    };
  
    const minW = 14, minHThin = 12, minHThick = 18;
    const X = { w: Math.max(raw.X.w, 110), h: Math.max(raw.X.h, minHThin) };
    const W = { w: Math.max(raw.W.w, minW),  h: Math.max(raw.W.h, 110) };
    const O = { w: Math.max(raw.O.w, minW),  h: Math.max(raw.O.h, minHThin) };
    const P = { w: Math.max(raw.P.w, minW),  h: Math.max(raw.P.h, minHThin) };
  
    const chainWidth = X.w + matrixSpacing + W.w + matrixSpacing + O.w + matrixSpacing + P.w;
    const chainStartX = (innerWidth - chainWidth) / 2;
    const centerY = innerHeight / 2;
  
    const pos = {
      X: { x: chainStartX, y: centerY - X.h / 2 },
      W: { x: chainStartX + X.w + matrixSpacing, y: centerY - W.h / 2 },
      O: { x: chainStartX + X.w + matrixSpacing + W.w + matrixSpacing, y: centerY - O.h / 2 },
      P: { x: chainStartX + X.w + matrixSpacing + W.w + matrixSpacing + O.w + matrixSpacing, y: centerY - P.h / 2 },
    };
  
    const col = {
      X: '#2246F5', W: '#14B8A6', O: '#F97373', P: '#F59E0B',
      HL: '#FAC55B', text: '#444', title: '#111'
    };
  
    g.append('text')
      .attr('x', innerWidth / 2).attr('y', -16).attr('text-anchor', 'middle')
      .style('font-size', '18px').style('font-weight', 700).style('fill', col.title)
      .text('Batch Matrix Multiplication and Row-wise Softmax');
  
    function drawMatrix(group, x, y, w, h, label, dims, color, labelYOffset = -16) {
      const G = group.append('g').attr('transform', `translate(${x},${y})`);
      G.append('rect')
        .attr('width', w).attr('height', Math.max(h, minHThick))
        .attr('rx', 4).attr('ry', 4)
        .attr('fill', color).attr('opacity', 0.18)
        .attr('stroke', color).attr('stroke-width', 2);
  
      G.append('text')
        .attr('x', w / 2).attr('y', labelYOffset)
        .attr('text-anchor', 'middle')
        .style('font-size', '14px').style('font-weight', 700).style('fill', color)
        .text(label);
  
      G.append('text')
        .attr('x', w / 2).attr('y', Math.max(h, minHThick) + 20)
        .attr('text-anchor', 'middle')
        .style('font-size', '12px').style('fill', col.text)
        .text(dims);
      return G;
    }
  
    function op(x, text) {
      g.append('text')
        .attr('x', x).attr('y', centerY + 1).attr('text-anchor', 'middle').attr('dy', '.35em')
        .style('font-size', '20px').style('fill', col.title).text(text);
    }
  
    // Horizontal measurement ABOVE X (and above its title)
    function hMeasureAbove(x1, x2, topY, label, color = col.HL) {
      const y = topY - 14; // a bit above the X title
      g.append('line').attr('x1', x1).attr('x2', x1).attr('y1', y - 6).attr('y2', y + 6)
        .attr('stroke', color).attr('stroke-width', 2);
      g.append('line').attr('x1', x2).attr('x2', x2).attr('y1', y - 6).attr('y2', y + 6)
        .attr('stroke', color).attr('stroke-width', 2);
      g.append('line').attr('x1', x1).attr('x2', x2).attr('y1', y).attr('y2', y)
        .attr('stroke', color).attr('stroke-width', 2);
      g.append('text').attr('x', (x1 + x2) / 2).attr('y', y - 8).attr('text-anchor', 'middle')
        .style('font-size', '11px').style('font-weight', 700).style('fill', color)
        .text(label);
    }
  
    // Vertical measurement with LABEL AT BOTTOM
    function vMeasureBottomLabel(x, y1, y2, label, color = col.HL) {
      g.append('line').attr('x1', x - 6).attr('x2', x + 6).attr('y1', y1).attr('y2', y1)
        .attr('stroke', color).attr('stroke-width', 2);
      g.append('line').attr('x1', x - 6).attr('x2', x + 6).attr('y1', y2).attr('y2', y2)
        .attr('stroke', color).attr('stroke-width', 2);
      g.append('line').attr('x1', x).attr('x2', x).attr('y1', y1).attr('y2', y2)
        .attr('stroke', color).attr('stroke-width', 2);
      // bottom label (slightly below bottom tick)
      g.append('text').attr('x', x - 10).attr('y', y2 + 14)
        .attr('text-anchor', 'end')
        .style('font-size', '11px').style('font-weight', 700).style('fill', color)
        .text(label);
    }
  
    // Draw matrices
    drawMatrix(g, pos.X.x, pos.X.y, X.w, X.h, 'X', `[${batch} × ${features}]`, col.X);
    drawMatrix(g, pos.W.x, pos.W.y, W.w, W.h, 'W', `[${features} × ${classes}]`, col.W);
    drawMatrix(g, pos.O.x, pos.O.y, O.w, O.h, 'O = XW', `[${batch} × ${classes}]`, col.O);
    drawMatrix(g, pos.P.x, pos.P.y, P.w, P.h, 'P = softmax(O)', `[${batch} × ${classes}]`, col.P, -22);
  
    // Operators
    op(pos.X.x + X.w + matrixSpacing / 2, '×');
    op(pos.W.x + W.w + matrixSpacing / 2, '=');
  
    // Corrected measures:
    // 1) width(X) above X (above its title)
    const xTopTitleY = pos.X.y - 16;              // the title is drawn at y=-16 relative to X top
    hMeasureAbove(pos.X.x, pos.X.x + X.w, xTopTitleY, 'width = 784 (features)');
  
    // 2) height(W) at bottom of the measuring line, left of W
    const measureX_W = pos.W.x - 18;
    vMeasureBottomLabel(measureX_W, pos.W.y, pos.W.y + Math.max(W.h, 110), 'height = 784 (features)');
  
    // Softmax arrow
    const oCX = pos.O.x + P.w / 2, pCX = pos.P.x + P.w / 2, cY = centerY;
    const midX = (oCX + pCX) / 2;
    const curveY = cY - 34;
  
    g.append('path')
      .attr('d', `M ${oCX} ${cY} Q ${midX} ${curveY}, ${pCX} ${cY}`)
      .attr('fill', 'none').attr('stroke', col.P).attr('stroke-width', 2)
      .attr('opacity', 0).transition().duration(900).delay(600).attr('opacity', 1);
  
    g.append('path')
      .attr('d', `M ${pCX - 6} ${cY - 6} L ${pCX} ${cY} L ${pCX - 6} ${cY + 6}`)
      .attr('fill', 'none').attr('stroke', col.P).attr('stroke-width', 2)
      .attr('opacity', 0).transition().duration(500).delay(1100).attr('opacity', 1);
  
    g.append('text')
      .attr('x', midX).attr('y', curveY - 8).attr('text-anchor', 'middle')
      .style('font-size', '12px').style('font-weight', 600).style('fill', col.P)
      .text('softmax (row-wise)')
      .attr('opacity', 0).transition().duration(600).delay(900).attr('opacity', 1);
  
    // 3) Push probability strip further right to avoid any overlap
    const rowIdx = 3;
    const rowY_O = pos.O.y + (Math.max(O.h, minHThin) / Math.max(batch, 1)) * rowIdx;
    const rowY_P = pos.P.y + (Math.max(P.h, minHThin) / Math.max(batch, 1)) * rowIdx;
  
    g.append('line')
      .attr('x1', pos.O.x + O.w).attr('y1', rowY_O + 4)
      .attr('x2', pos.P.x).attr('y2', rowY_P + 4)
      .attr('stroke', '#999').attr('stroke-dasharray', '4 4')
      .attr('opacity', 0).transition().duration(500).delay(1200).attr('opacity', 1);
  
    // Increase stripGap substantially
    const stripGap = 72;                 // was 28 — now far right
    const barStripX = pos.P.x + P.w + stripGap;
    const barStripY = rowY_P - 10;
    const barW = 130, barH = 11, barGap = 6;
  
    const base = d3.range(classes).map(i => Math.max(0.02, Math.exp(-Math.pow(i - 4, 2) / 3)));
    const sum = d3.sum(base), probs = base.map(p => p / sum);
    const xScale = d3.scaleLinear().domain([0, 1]).range([0, barW]);
  
    const strip = g.append('g').attr('transform', `translate(${barStripX},${barStripY})`);
  
    strip.append('text')
      .attr('x', 0).attr('y', -12).attr('text-anchor', 'start')
      .style('font-size', '12px').style('font-weight', 600).style('fill', '#333')
      .text(`Probabilities (row ${rowIdx})`);
  
    strip.selectAll('text.cls')
      .data(probs).enter()
      .append('text')
      .attr('class', 'cls')
      .attr('x', -10)
      .attr('y', (_, i) => i * (barH + barGap) + barH - 1)
      .attr('text-anchor', 'end')
      .style('font-size', '11px').style('fill', '#555')
      .text((_, i) => i);
  
    strip.selectAll('rect.prob')
      .data(probs).enter()
      .append('rect')
      .attr('class', 'prob')
      .attr('x', 0)
      .attr('y', (_, i) => i * (barH + barGap))
      .attr('width', 0).attr('height', barH).attr('rx', 2).attr('ry', 2)
      .attr('fill', col.P).attr('opacity', 0.85)
      .transition().duration(700).delay((_, i) => 1400 + i * 35)
      .attr('width', d => xScale(d));
  
    const maxVal = d3.max(probs);
    const argmax = probs.indexOf(maxVal);
    const yMax = argmax * (barH + barGap) + barH / 2;
  
    strip.append('circle')
      .attr('cx', xScale(maxVal) + 6).attr('cy', yMax).attr('r', 4)
      .attr('fill', col.P).attr('opacity', 0)
      .transition().duration(500).delay(2200).attr('opacity', 1);
  
    strip.append('text')
      .attr('x', xScale(maxVal) + 12).attr('y', yMax + 4)
      .style('font-size', '11px').style('fill', '#333')
      .text(`argmax → class ${argmax}`)
      .attr('opacity', 0).transition().duration(500).delay(2200).attr('opacity', 1);
  
    // Footnotes
    g.append('text')
      .attr('x', innerWidth / 2).attr('y', innerHeight + 28).attr('text-anchor', 'middle')
      .style('font-size', '12px').style('fill', '#666')
      .text('O contains logits; P contains probabilities per row (each row sums to 1).');
  
    g.append('text')
      .attr('x', innerWidth / 2).attr('y', innerHeight + 50).attr('text-anchor', 'middle')
      .style('font-size', '12px').style('fill', '#666')
      .text('Each row in X is an example; multiplication is batched; softmax converts logits in each row to probabilities.');
  }
  