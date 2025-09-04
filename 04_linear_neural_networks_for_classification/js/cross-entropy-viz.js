// Cross-entropy loss visualization
function initCrossEntropyViz() {
    const container = d3.select('#loss-visualization');
    if (container.empty()) return;
    
    // Clear previous content
    container.selectAll('*').remove();
    
    const width = container.node().getBoundingClientRect().width || 800;
    const height = 280;
    const margin = { top: 35, right: 50, bottom: 50, left: 50 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    
    const svg = container.append('svg')
        .attr('width', width)
        .attr('height', height)
        .attr('viewBox', `0 0 ${width} ${height}`)
        .attr('preserveAspectRatio', 'xMidYMid meet');
    
    const g = svg.append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);
    
    // Number of classes
    const numClasses = 3;
    const classes = ['Class 1', 'Class 2', 'Class 3'];
    
    // Initialize with random predictions
    let predictions = [0.7, 0.2, 0.1];
    let trueClass = 0;
    
    // Normalize predictions to ensure they sum to 1
    function normalizePredictions(preds) {
        const sum = preds.reduce((a, b) => a + b, 0);
        return preds.map(p => p / sum);
    }
    
    // Calculate cross-entropy loss
    function crossEntropyLoss(predictions, trueClass) {
        // Clip predictions to avoid log(0)
        const epsilon = 1e-7;
        const clippedPred = Math.max(epsilon, Math.min(1 - epsilon, predictions[trueClass]));
        return -Math.log(clippedPred);
    }
    
    // Create visualization with two parts: predictions and loss curve
    
    // Center the visualizations
    const totalVisualizationWidth = innerWidth;
    const barChartWidth = 250;
    const lossChartWidth = 250;
    const spacing = 40;
    
    // Part 1: Prediction bars (centered on left)
    const barWidth = 50;
    const barSpacing = 25;
    const barsStartX = (totalVisualizationWidth - barChartWidth - lossChartWidth - spacing) / 2;
    
    // Create prediction bars
    const predBars = g.selectAll('.pred-bar')
        .data(predictions)
        .enter()
        .append('g')
        .attr('class', 'pred-bar-group')
        .attr('transform', (d, i) => `translate(${barsStartX + i * (barWidth + barSpacing)}, 0)`);
    
    predBars.append('rect')
        .attr('class', 'pred-bar')
        .attr('width', barWidth)
        .attr('fill', (d, i) => i === trueClass ? '#2DD2C0' : '#10099F')
        .attr('opacity', 0.8);
    
    predBars.append('text')
        .attr('class', 'pred-label')
        .attr('x', barWidth / 2)
        .attr('y', innerHeight + 20)
        .attr('text-anchor', 'middle')
        .style('font-size', '12px')
        .text((d, i) => classes[i]);
    
    predBars.append('text')
        .attr('class', 'pred-value')
        .attr('x', barWidth / 2)
        .attr('text-anchor', 'middle')
        .style('font-size', '14px')
        .style('font-weight', 'bold')
        .style('fill', '#262626');
    
    // Part 2: Loss value display (integrated with loss curve)
    const lossValue = g.append('text')
        .attr('class', 'loss-value')
        .attr('x', innerWidth / 2)
        .attr('y', -15)
        .attr('text-anchor', 'middle')
        .style('font-size', '18px')
        .style('font-weight', 'bold')
        .style('fill', '#10099F');
    
    // Part 3: Loss curve over probability (centered on right)
    const curveStartX = barsStartX + barChartWidth + spacing;
    const curveG = g.append('g')
        .attr('transform', `translate(${curveStartX}, 0)`);
    
    const curveWidth = lossChartWidth;
    const curveHeight = innerHeight;
    
    // Scales for curve
    const xScale = d3.scaleLinear()
        .domain([0, 1])
        .range([0, curveWidth]);
    
    const yScale = d3.scaleLinear()
        .domain([0, 5])
        .range([curveHeight, 0]);
    
    // Add axes for curve
    curveG.append('g')
        .attr('transform', `translate(0, ${curveHeight})`)
        .call(d3.axisBottom(xScale).ticks(5));
    
    curveG.append('g')
        .call(d3.axisLeft(yScale).ticks(5));
    
    // Add axis labels
    curveG.append('text')
        .attr('x', curveWidth / 2)
        .attr('y', curveHeight + 40)
        .attr('text-anchor', 'middle')
        .style('font-size', '12px')
        .text('P(true class)');
    
    curveG.append('text')
        .attr('transform', 'rotate(-90)')
        .attr('x', -curveHeight / 2)
        .attr('y', -40)
        .attr('text-anchor', 'middle')
        .style('font-size', '12px')
        .text('Loss');
    
    // Draw loss curve
    const lossData = d3.range(0.01, 1.01, 0.01).map(p => ({
        p: p,
        loss: -Math.log(p)
    }));
    
    const line = d3.line()
        .x(d => xScale(d.p))
        .y(d => yScale(d.loss))
        .curve(d3.curveMonotoneX);
    
    curveG.append('path')
        .datum(lossData)
        .attr('fill', 'none')
        .attr('stroke', '#FC8484')
        .attr('stroke-width', 2)
        .attr('d', line);
    
    // Add current point on curve
    const currentPoint = curveG.append('circle')
        .attr('r', 6)
        .attr('fill', '#FAC55B')
        .attr('stroke', '#262626')
        .attr('stroke-width', 2);
    
    // Update function
    function update() {
        // Update bar heights
        const barScale = d3.scaleLinear()
            .domain([0, 1])
            .range([innerHeight, 0]);
        
        g.selectAll('.pred-bar')
            .data(predictions)
            .transition()
            .duration(300)
            .attr('y', d => barScale(d))
            .attr('height', d => innerHeight - barScale(d))
            .attr('fill', (d, i) => i === trueClass ? '#2DD2C0' : '#10099F');
        
        g.selectAll('.pred-value')
            .data(predictions)
            .transition()
            .duration(300)
            .attr('y', d => barScale(d) - 5)
            .text(d => (d * 100).toFixed(1) + '%');
        
        // Update loss value
        const loss = crossEntropyLoss(predictions, trueClass);
        lossValue.text(`Loss: ${loss.toFixed(3)}`);
        
        // Update point on curve
        const truePred = predictions[trueClass];
        currentPoint
            .transition()
            .duration(300)
            .attr('cx', xScale(truePred))
            .attr('cy', yScale(loss));
        
        // Color loss value based on magnitude
        lossValue.attr('fill', loss < 0.5 ? '#2DD2C0' : loss < 1.5 ? '#FAC55B' : '#FC8484');
    }
    
    // Initialize
    update();
    
    // Add controls in a single row with columns
    const controlsContainer = container.append('div')
        .style('margin-top', '10px')
        .style('padding', '8px')
        .style('border-radius', '6px')
        .style('display', 'grid')
        .style('grid-template-columns', '1fr 1fr 1fr 1fr')
        .style('gap', '10px')
        .style('align-items', 'center')
        .style('font-size', '0.7em');
    
    // Column 1: True class selector
    const col1 = controlsContainer.append('div')
        .style('display', 'flex')
        .style('flex-direction', 'column')
        .style('align-items', 'center');
    
    col1.append('label')
        .style('font-size', '0.85em')
        .style('margin-bottom', '4px')
        .style('font-weight', 'bold')
        .text('True Class');
    
    col1.append('select')
        .attr('id', 'true-class')
        .style('padding', '4px 8px')
        .style('border', '2px solid #EEEEEE')
        .style('border-radius', '4px')
        .style('font-size', '0.85em')
        .style('cursor', 'pointer')
        .on('change', function() {
            trueClass = +this.value;
            update();
        })
        .selectAll('option')
        .data([0, 1, 2])
        .enter()
        .append('option')
        .attr('value', d => d)
        .text(d => classes[d]);
    
    // Columns 2-4: Prediction sliders
    predictions.forEach((pred, i) => {
        const col = controlsContainer.append('div')
            .style('display', 'flex')
            .style('flex-direction', 'column')
            .style('align-items', 'center');
        
        col.append('label')
            .style('font-size', '0.85em')
            .style('margin-bottom', '4px')
            .style('font-weight', 'bold')
            .text(classes[i]);
        
        const slider = col.append('input')
            .attr('type', 'range')
            .attr('min', 0)
            .attr('max', 100)
            .attr('value', pred * 100)
            .style('width', '70px')
            .style('cursor', 'pointer')
            .on('input', function() {
                predictions[i] = +this.value / 100;
                predictions = normalizePredictions(predictions);
                
                // Update all sliders to reflect normalization
                controlsContainer.selectAll('input[type="range"]')
                    .data(predictions)
                    .property('value', d => d * 100);
                
                controlsContainer.selectAll('.slider-value')
                    .data(predictions)
                    .text(d => (d * 100).toFixed(0) + '%');
                
                update();
            });
        
        col.append('span')
            .attr('class', 'slider-value')
            .style('margin-top', '2px')
            .style('font-family', 'monospace')
            .style('font-size', '0.85em')
            .style('color', '#10099F')
            .text((pred * 100).toFixed(0) + '%');
    });
}
