// scratch-implementation-viz.js - Visualizations for Linear Regression from Scratch

// Training Pipeline Overview
function initTrainingPipelineOverview() {
    const container = d3.select('#training-pipeline-overview');
    if (container.empty() || container.select('svg').size() > 0) return;
    
    const width = 800;
    const height = 400;
    
    const svg = container.append('svg')
        .attr('width', width)
        .attr('height', height)
        .attr('viewBox', `0 0 ${width} ${height}`);
    
    // Pipeline stages
    const stages = [
        { name: 'Initialize\nParameters', x: 100, y: 200, color: '#10099F' },
        { name: 'Forward\nPass', x: 250, y: 200, color: '#2DD2C0' },
        { name: 'Compute\nLoss', x: 400, y: 200, color: '#FAC55B' },
        { name: 'Backward\nPass', x: 550, y: 200, color: '#FFA05F' },
        { name: 'Update\nParameters', x: 700, y: 200, color: '#FC8484' }
    ];
    
    // Draw connections
    const connections = svg.append('g').attr('class', 'connections');
    for (let i = 0; i < stages.length - 1; i++) {
        connections.append('line')
            .attr('x1', stages[i].x + 40)
            .attr('y1', stages[i].y)
            .attr('x2', stages[i + 1].x - 40)
            .attr('y2', stages[i + 1].y)
            .attr('stroke', '#EEEEEE')
            .attr('stroke-width', 2)
            .attr('marker-end', 'url(#arrowhead)');
    }
    
    // Add feedback loop
    connections.append('path')
        .attr('d', `M ${stages[4].x} ${stages[4].y + 30} 
                    Q ${stages[4].x} ${stages[4].y + 80}, ${(stages[4].x + stages[1].x) / 2} ${stages[4].y + 80}
                    T ${stages[1].x} ${stages[1].y + 30}`)
        .attr('stroke', '#EEEEEE')
        .attr('stroke-width', 2)
        .attr('fill', 'none')
        .attr('stroke-dasharray', '5,5')
        .attr('marker-end', 'url(#arrowhead)');
    
    // Define arrow marker
    svg.append('defs').append('marker')
        .attr('id', 'arrowhead')
        .attr('viewBox', '0 0 10 10')
        .attr('refX', 5)
        .attr('refY', 5)
        .attr('markerWidth', 5)
        .attr('markerHeight', 5)
        .attr('orient', 'auto')
        .append('path')
        .attr('d', 'M 0 0 L 10 5 L 0 10 z')
        .attr('fill', '#EEEEEE');
    
    // Draw stage boxes
    const stageGroups = svg.selectAll('.stage')
        .data(stages)
        .enter()
        .append('g')
        .attr('class', 'stage')
        .attr('transform', d => `translate(${d.x}, ${d.y})`);
    
    stageGroups.append('rect')
        .attr('x', -40)
        .attr('y', -30)
        .attr('width', 80)
        .attr('height', 60)
        .attr('rx', 5)
        .attr('fill', d => d.color)
        .attr('opacity', 0.8);
    
    stageGroups.append('text')
        .attr('text-anchor', 'middle')
        .attr('fill', 'white')
        .attr('font-size', '12px')
        .attr('font-weight', 'bold')
        .selectAll('tspan')
        .data(d => d.name.split('\n'))
        .enter()
        .append('tspan')
        .attr('x', 0)
        .attr('dy', (d, i) => i === 0 ? -5 : 15)
        .text(d => d);
    
    // Add epoch counter
    svg.append('text')
        .attr('x', width / 2)
        .attr('y', 50)
        .attr('text-anchor', 'middle')
        .attr('font-size', '16px')
        .attr('fill', '#262626')
        .text('Training Pipeline');
    
    svg.append('text')
        .attr('x', width / 2)
        .attr('y', 350)
        .attr('text-anchor', 'middle')
        .attr('font-size', '14px')
        .attr('fill', '#262626')
        .text('Repeat for multiple epochs')
        .style('font-style', 'italic');
}

// Parameter Initialization Comparison
function initInitializationComparison() {
    const container = d3.select('#initialization-comparison');
    if (container.empty()) return;
    
    container.html(''); // Clear previous content
    
    const width = 700;
    const height = 300;
    
    const svg = container.append('svg')
        .attr('width', width)
        .attr('height', height)
        .attr('viewBox', `0 0 ${width} ${height}`);
    
    let currentInit = 'random';
    const numWeights = 10;
    let weights = [];
    
    function generateWeights(type) {
        weights = [];
        for (let i = 0; i < numWeights; i++) {
            if (type === 'zeros') {
                weights.push(0);
            } else if (type === 'random') {
                weights.push((Math.random() - 0.5) * 0.02); // Small random values
            } else if (type === 'large') {
                weights.push((Math.random() - 0.5) * 10); // Large random values
            }
        }
        return weights;
    }
    
    // Scales
    const xScale = d3.scaleBand()
        .domain(d3.range(numWeights))
        .range([50, width - 50])
        .padding(0.1);
    
    const yScale = d3.scaleLinear()
        .domain([-5, 5])
        .range([height - 50, 50]);
    
    // Draw axes
    svg.append('g')
        .attr('transform', `translate(0, ${height / 2})`)
        .append('line')
        .attr('x1', 40)
        .attr('x2', width - 40)
        .attr('stroke', '#EEEEEE')
        .attr('stroke-width', 1);
    
    svg.append('text')
        .attr('x', 25)
        .attr('y', height / 2 + 5)
        .attr('text-anchor', 'end')
        .attr('font-size', '12px')
        .attr('fill', '#262626')
        .text('0');
    
    // Weight bars
    const bars = svg.append('g').attr('class', 'bars');
    
    function updateVisualization(initType) {
        const data = generateWeights(initType);
        
        // Update bars
        const barSelection = bars.selectAll('rect')
            .data(data);
        
        barSelection.enter().append('rect')
            .merge(barSelection)
            .transition()
            .duration(500)
            .attr('x', (d, i) => xScale(i))
            .attr('y', d => d >= 0 ? yScale(d) : yScale(0))
            .attr('width', xScale.bandwidth())
            .attr('height', d => Math.abs(yScale(d) - yScale(0)))
            .attr('fill', d => d >= 0 ? '#2DD2C0' : '#FC8484')
            .attr('opacity', 0.7);
        
        // Update title
        svg.selectAll('.init-title').remove();
        svg.append('text')
            .attr('class', 'init-title')
            .attr('x', width / 2)
            .attr('y', 30)
            .attr('text-anchor', 'middle')
            .attr('font-size', '16px')
            .attr('fill', '#262626')
            .text(`Weight Initialization: ${initType.charAt(0).toUpperCase() + initType.slice(1)}`);
        
        // Add description
        svg.selectAll('.init-desc').remove();
        let desc = '';
        if (initType === 'zeros') {
            desc = 'All weights are zero - causes symmetry problems!';
        } else if (initType === 'random') {
            desc = 'Small random values - breaks symmetry, stable training';
        } else if (initType === 'large') {
            desc = 'Large values - may cause gradient explosion';
        }
        
        svg.append('text')
            .attr('class', 'init-desc')
            .attr('x', width / 2)
            .attr('y', height - 20)
            .attr('text-anchor', 'middle')
            .attr('font-size', '12px')
            .attr('fill', '#262626')
            .style('font-style', 'italic')
            .text(desc);
    }
    
    // Initial display
    updateVisualization('random');
    
    // Button handlers
    d3.select('#init-zeros').on('click', () => updateVisualization('zeros'));
    d3.select('#init-random').on('click', () => updateVisualization('random'));
    d3.select('#init-large').on('click', () => updateVisualization('large'));
}

// Loss Function Properties Visualization
function initLossPropertiesViz() {
    const container = d3.select('#loss-properties-viz');
    if (container.empty()) return;
    
    container.html('');
    
    const width = 700;
    const height = 400;
    const margin = { top: 20, right: 20, bottom: 50, left: 50 };
    
    const svg = container.append('svg')
        .attr('width', width)
        .attr('height', height);
    
    let trueValue = 0;
    let showGradient = false;
    
    // Scales
    const xScale = d3.scaleLinear()
        .domain([-3, 3])
        .range([margin.left, width - margin.right]);
    
    const yScale = d3.scaleLinear()
        .domain([0, 5])
        .range([height - margin.bottom, margin.top]);
    
    // Axes
    svg.append('g')
        .attr('transform', `translate(0, ${height - margin.bottom})`)
        .call(d3.axisBottom(xScale))
        .append('text')
        .attr('x', width / 2)
        .attr('y', 40)
        .attr('fill', 'black')
        .style('text-anchor', 'middle')
        .text('Prediction (ŷ)');
    
    svg.append('g')
        .attr('transform', `translate(${margin.left}, 0)`)
        .call(d3.axisLeft(yScale))
        .append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', -35)
        .attr('x', -height / 2)
        .attr('fill', 'black')
        .style('text-anchor', 'middle')
        .text('Loss');
    
    // Loss function path
    const lossPath = svg.append('path')
        .attr('fill', 'none')
        .attr('stroke', '#10099F')
        .attr('stroke-width', 2);
    
    // Gradient path
    const gradientPath = svg.append('path')
        .attr('fill', 'none')
        .attr('stroke', '#FC8484')
        .attr('stroke-width', 2)
        .attr('stroke-dasharray', '5,5')
        .style('opacity', 0);
    
    // True value line
    const trueLine = svg.append('line')
        .attr('stroke', '#2DD2C0')
        .attr('stroke-width', 2)
        .attr('stroke-dasharray', '3,3');
    
    // Minimum point
    const minPoint = svg.append('circle')
        .attr('r', 5)
        .attr('fill', '#2DD2C0');
    
    function updateLoss() {
        trueValue = parseFloat(d3.select('#true-value').property('value'));
        d3.select('#true-value-display').text(trueValue.toFixed(1));
        
        // Generate loss curve data
        const lossData = [];
        for (let x = -3; x <= 3; x += 0.1) {
            lossData.push({
                x: x,
                y: Math.pow(x - trueValue, 2) / 2
            });
        }
        
        // Update loss curve
        const line = d3.line()
            .x(d => xScale(d.x))
            .y(d => yScale(d.y));
        
        lossPath.transition()
            .duration(300)
            .attr('d', line(lossData));
        
        // Update true value line
        trueLine
            .transition()
            .duration(300)
            .attr('x1', xScale(trueValue))
            .attr('y1', yScale(0))
            .attr('x2', xScale(trueValue))
            .attr('y2', yScale(5));
        
        // Update minimum point
        minPoint
            .transition()
            .duration(300)
            .attr('cx', xScale(trueValue))
            .attr('cy', yScale(0));
        
        // Update gradient if shown
        if (showGradient) {
            const gradientData = [];
            for (let x = -3; x <= 3; x += 0.1) {
                gradientData.push({
                    x: x,
                    y: (x - trueValue) + 2.5 // Shifted for visibility
                });
            }
            
            gradientPath
                .attr('d', line(gradientData))
                .style('opacity', 1);
        }
    }
    
    // Event handlers
    d3.select('#true-value').on('input', updateLoss);
    d3.select('#show-gradient').on('click', function() {
        showGradient = !showGradient;
        d3.select(this).text(showGradient ? 'Hide Gradient' : 'Show Gradient');
        gradientPath.style('opacity', showGradient ? 1 : 0);
        updateLoss();
    });
    
    // Initial render
    updateLoss();
}

// Learning Rate Effects Visualization
function initLearningRateEffects() {
    const container = d3.select('#learning-rate-effects');
    if (container.empty()) return;
    
    container.html('');
    
    const width = 700;
    const height = 400;
    
    const svg = container.append('svg')
        .attr('width', width)
        .attr('height', height);
    
    let lr = 0.03;
    let iterations = [];
    let animationId = null;
    
    // True parameters
    const trueW = 2;
    const trueB = 4.2;
    
    // Scales
    const xScale = d3.scaleLinear()
        .domain([0, 100])
        .range([50, width - 50]);
    
    const yScale = d3.scaleLinear()
        .domain([0, 10])
        .range([height - 50, 50]);
    
    // Axes
    svg.append('g')
        .attr('transform', `translate(0, ${height - 50})`)
        .call(d3.axisBottom(xScale))
        .append('text')
        .attr('x', width / 2)
        .attr('y', 40)
        .attr('fill', 'black')
        .text('Iteration');
    
    svg.append('g')
        .attr('transform', `translate(50, 0)`)
        .call(d3.axisLeft(yScale))
        .append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', -35)
        .attr('x', -height / 2)
        .attr('fill', 'black')
        .text('Loss');
    
    // Loss path
    const lossPath = svg.append('path')
        .attr('fill', 'none')
        .attr('stroke', '#10099F')
        .attr('stroke-width', 2);
    
    // Target loss line
    svg.append('line')
        .attr('x1', 50)
        .attr('x2', width - 50)
        .attr('y1', yScale(0.01))
        .attr('y2', yScale(0.01))
        .attr('stroke', '#2DD2C0')
        .attr('stroke-width', 1)
        .attr('stroke-dasharray', '3,3');
    
    svg.append('text')
        .attr('x', width - 55)
        .attr('y', yScale(0.01) - 5)
        .attr('text-anchor', 'end')
        .attr('font-size', '12px')
        .attr('fill', '#2DD2C0')
        .text('Target');
    
    function runTraining() {
        lr = parseFloat(d3.select('#lr-select').value);
        iterations = [];
        
        // Initialize parameters randomly
        let w = Math.random() * 0.1;
        let b = 0;
        
        // Simulate training
        for (let i = 0; i < 100; i++) {
            // Compute loss (simplified)
            const loss = Math.pow(w - trueW, 2) + Math.pow(b - trueB, 2);
            iterations.push({ x: i, y: loss });
            
            // Update parameters (simplified gradient descent)
            const gradW = 2 * (w - trueW);
            const gradB = 2 * (b - trueB);
            
            w -= lr * gradW;
            b -= lr * gradB;
            
            // Check for divergence
            if (Math.abs(w) > 100 || Math.abs(b) > 100) {
                for (let j = i + 1; j < 100; j++) {
                    iterations.push({ x: j, y: 10 }); // Cap at max
                }
                break;
            }
        }
        
        // Update visualization
        const line = d3.line()
            .x(d => xScale(d.x))
            .y(d => yScale(Math.min(d.y, 10)));
        
        lossPath
            .datum(iterations)
            .transition()
            .duration(1000)
            .attr('d', line);
        
        // Update title
        svg.selectAll('.lr-title').remove();
        let status = '';
        if (lr < 0.01) status = ' (Too Small - Slow Convergence)';
        else if (lr > 0.1) status = ' (Too Large - May Diverge)';
        else status = ' (Good Range)';
        
        svg.append('text')
            .attr('class', 'lr-title')
            .attr('x', width / 2)
            .attr('y', 30)
            .attr('text-anchor', 'middle')
            .attr('font-size', '16px')
            .attr('fill', '#262626')
            .text(`Learning Rate: ${lr}${status}`);
    }
    
    // Event handlers
    d3.select('#lr-select').on('change', runTraining);
    d3.select('#restart-sgd').on('click', runTraining);
    
    // Initial run
    runTraining();
}

// Training Flow Visualization
function initTrainingFlowViz() {
    const container = d3.select('#training-flow-viz');
    if (container.empty()) return;
    
    container.html('');
    
    const width = 700;
    const height = 450;
    
    const svg = container.append('svg')
        .attr('width', width)
        .attr('height', height);
    
    let isRunning = false;
    let isPaused = false;
    let currentStep = 0;
    
    // Define the flow steps
    const steps = [
        { id: 'data', label: 'Load Batch', x: 100, y: 100, color: '#10099F' },
        { id: 'forward', label: 'Forward Pass', x: 350, y: 100, color: '#2DD2C0' },
        { id: 'loss', label: 'Compute Loss', x: 600, y: 100, color: '#FAC55B' },
        { id: 'backward', label: 'Backward Pass', x: 350, y: 250, color: '#FFA05F' },
        { id: 'update', label: 'Update Params', x: 100, y: 250, color: '#FC8484' }
    ];
    
    // Draw connections
    const connections = [
        { from: 0, to: 1 },
        { from: 1, to: 2 },
        { from: 2, to: 3 },
        { from: 3, to: 4 },
        { from: 4, to: 0 }
    ];
    
    svg.selectAll('.connection')
        .data(connections)
        .enter()
        .append('line')
        .attr('class', 'connection')
        .attr('x1', d => steps[d.from].x)
        .attr('y1', d => steps[d.from].y)
        .attr('x2', d => steps[d.to].x)
        .attr('y2', d => steps[d.to].y)
        .attr('stroke', '#EEEEEE')
        .attr('stroke-width', 2)
        .attr('marker-end', 'url(#arrow)');
    
    // Arrow marker
    svg.append('defs').append('marker')
        .attr('id', 'arrow')
        .attr('viewBox', '0 0 10 10')
        .attr('refX', 25)
        .attr('refY', 5)
        .attr('markerWidth', 5)
        .attr('markerHeight', 5)
        .attr('orient', 'auto')
        .append('path')
        .attr('d', 'M 0 0 L 10 5 L 0 10 z')
        .attr('fill', '#EEEEEE');
    
    // Draw step nodes
    const nodes = svg.selectAll('.node')
        .data(steps)
        .enter()
        .append('g')
        .attr('class', 'node')
        .attr('transform', d => `translate(${d.x}, ${d.y})`);
    
    nodes.append('circle')
        .attr('r', 40)
        .attr('fill', d => d.color)
        .attr('opacity', 0.3)
        .attr('class', 'node-circle');
    
    nodes.append('text')
        .attr('text-anchor', 'middle')
        .attr('dy', 5)
        .attr('font-size', '14px')
        .attr('font-weight', 'bold')
        .attr('fill', '#262626')
        .text(d => d.label);
    
    // Add data flow particle
    const particle = svg.append('circle')
        .attr('r', 8)
        .attr('fill', '#10099F')
        .attr('opacity', 0);
    
    // Animation function
    function animateFlow() {
        if (!isRunning || isPaused) return;
        
        // Highlight current step
        svg.selectAll('.node-circle')
            .attr('opacity', (d, i) => i === currentStep ? 0.8 : 0.3);
        
        // Move particle
        const current = steps[currentStep];
        const next = steps[(currentStep + 1) % steps.length];
        
        particle
            .attr('cx', current.x)
            .attr('cy', current.y)
            .attr('opacity', 1)
            .transition()
            .duration(1000)
            .attr('cx', next.x)
            .attr('cy', next.y)
            .on('end', () => {
                currentStep = (currentStep + 1) % steps.length;
                if (isRunning && !isPaused) {
                    animateFlow();
                }
            });
    }
    
    // Add info panel
    const infoPanel = svg.append('g')
        .attr('transform', 'translate(350, 350)');
    
    infoPanel.append('rect')
        .attr('x', -150)
        .attr('y', -20)
        .attr('width', 300)
        .attr('height', 40)
        .attr('fill', '#F5F5F5')
        .attr('stroke', '#EEEEEE')
        .attr('rx', 5);
    
    const infoText = infoPanel.append('text')
        .attr('text-anchor', 'middle')
        .attr('dy', 5)
        .attr('font-size', '14px')
        .attr('fill', '#262626')
        .text('Click Start to begin animation');
    
    // Control handlers
    d3.select('#start-training-flow').on('click', () => {
        isRunning = true;
        isPaused = false;
        infoText.text('Training in progress...');
        animateFlow();
    });
    
    d3.select('#pause-training-flow').on('click', () => {
        isPaused = !isPaused;
        infoText.text(isPaused ? 'Paused' : 'Training in progress...');
        if (!isPaused && isRunning) animateFlow();
    });
    
    d3.select('#reset-training-flow').on('click', () => {
        isRunning = false;
        isPaused = false;
        currentStep = 0;
        particle.attr('opacity', 0);
        svg.selectAll('.node-circle').attr('opacity', 0.3);
        infoText.text('Click Start to begin animation');
    });
}

// Convergence Tracking Visualization
function initConvergenceTrackingViz() {
    const container = d3.select('#convergence-tracking-viz');
    if (container.empty()) return;
    
    container.html('');
    
    const width = 700;
    const height = 300;
    
    const svg = container.append('svg')
        .attr('width', width)
        .attr('height', height);
    
    // True parameters
    const trueW1 = 2;
    const trueW2 = -3.4;
    const trueB = 4.2;
    
    // Training history
    const history = [];
    let epoch = 0;
    
    // Initialize parameters
    let w1 = Math.random() * 0.1;
    let w2 = Math.random() * 0.1;
    let b = 0;
    
    // Scales
    const xScale = d3.scaleLinear()
        .domain([0, 50])
        .range([50, width - 50]);
    
    const yScale = d3.scaleLinear()
        .domain([0, 5])
        .range([height - 50, 50]);
    
    // Axes
    svg.append('g')
        .attr('transform', `translate(0, ${height - 50})`)
        .call(d3.axisBottom(xScale))
        .append('text')
        .attr('x', width / 2)
        .attr('y', 40)
        .attr('fill', 'black')
        .text('Iteration');
    
    svg.append('g')
        .attr('transform', `translate(50, 0)`)
        .call(d3.axisLeft(yScale))
        .append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', -35)
        .attr('x', -height / 2)
        .attr('fill', 'black')
        .text('Parameter Error');
    
    // Lines for each parameter
    const w1Line = svg.append('path')
        .attr('fill', 'none')
        .attr('stroke', '#10099F')
        .attr('stroke-width', 2);
    
    const w2Line = svg.append('path')
        .attr('fill', 'none')
        .attr('stroke', '#2DD2C0')
        .attr('stroke-width', 2);
    
    const bLine = svg.append('path')
        .attr('fill', 'none')
        .attr('stroke', '#FC8484')
        .attr('stroke-width', 2);
    
    // Legend
    const legend = svg.append('g')
        .attr('transform', `translate(${width - 150}, 50)`);
    
    const legendItems = [
        { color: '#10099F', label: 'w₁ error' },
        { color: '#2DD2C0', label: 'w₂ error' },
        { color: '#FC8484', label: 'b error' }
    ];
    
    legendItems.forEach((item, i) => {
        legend.append('rect')
            .attr('x', 0)
            .attr('y', i * 20)
            .attr('width', 15)
            .attr('height', 15)
            .attr('fill', item.color);
        
        legend.append('text')
            .attr('x', 20)
            .attr('y', i * 20 + 12)
            .attr('font-size', '12px')
            .attr('fill', '#262626')
            .text(item.label);
    });
    
    // Simulate training
    function trainStep() {
        if (epoch >= 50) return;
        
        // Compute errors
        const w1Error = Math.abs(w1 - trueW1);
        const w2Error = Math.abs(w2 - trueW2);
        const bError = Math.abs(b - trueB);
        
        history.push({
            epoch: epoch,
            w1Error: w1Error,
            w2Error: w2Error,
            bError: bError
        });
        
        // Update parameters (simplified)
        const lr = 0.03;
        w1 -= lr * (w1 - trueW1);
        w2 -= lr * (w2 - trueW2);
        b -= lr * (b - trueB);
        
        // Update visualization
        const line = d3.line()
            .x(d => xScale(d.epoch))
            .y(d => yScale(d.value));
        
        w1Line.datum(history.map(d => ({ epoch: d.epoch, value: d.w1Error })))
            .attr('d', line);
        
        w2Line.datum(history.map(d => ({ epoch: d.epoch, value: d.w2Error })))
            .attr('d', line);
        
        bLine.datum(history.map(d => ({ epoch: d.epoch, value: d.bError })))
            .attr('d', line);
        
        epoch++;
        
        // Update parameter comparison
        updateParameterComparison();
        
        setTimeout(trainStep, 100);
    }
    
    function updateParameterComparison() {
        const compContainer = d3.select('#parameter-comparison');
        compContainer.html('');
        
        const table = compContainer.append('table')
            .style('width', '100%')
            .style('margin-top', '20px');
        
        const headers = table.append('tr');
        headers.append('th').text('Parameter');
        headers.append('th').text('True Value');
        headers.append('th').text('Current Value');
        headers.append('th').text('Error');
        
        const rows = [
            { name: 'w₁', true: trueW1, current: w1 },
            { name: 'w₂', true: trueW2, current: w2 },
            { name: 'b', true: trueB, current: b }
        ];
        
        rows.forEach(row => {
            const tr = table.append('tr');
            tr.append('td').text(row.name);
            tr.append('td').text(row.true.toFixed(3));
            tr.append('td').text(row.current.toFixed(3));
            tr.append('td').text(Math.abs(row.true - row.current).toFixed(4))
                .style('color', Math.abs(row.true - row.current) < 0.01 ? '#2DD2C0' : '#FC8484');
        });
    }
    
    // Start training
    trainStep();
}

// Complete Training Visualization
function initCompleteTrainingViz() {
    const container = d3.select('#complete-training-viz');
    if (container.empty()) return;
    
    container.html('');
    
    const width = 700;
    const height = 400;
    
    const svg = container.append('svg')
        .attr('width', width)
        .attr('height', height);
    
    let isTraining = false;
    let speed = 'normal';
    
    // Create visualization areas
    const lossArea = svg.append('g')
        .attr('transform', 'translate(50, 50)');
    
    const paramArea = svg.append('g')
        .attr('transform', 'translate(400, 50)');
    
    // Loss chart
    const lossWidth = 300;
    const lossHeight = 200;
    
    const lossXScale = d3.scaleLinear()
        .domain([0, 30])
        .range([0, lossWidth]);
    
    const lossYScale = d3.scaleLinear()
        .domain([0, 1])
        .range([lossHeight, 0]);
    
    lossArea.append('text')
        .attr('x', lossWidth / 2)
        .attr('y', -10)
        .attr('text-anchor', 'middle')
        .attr('font-size', '14px')
        .attr('font-weight', 'bold')
        .text('Training Loss');
    
    lossArea.append('g')
        .attr('transform', `translate(0, ${lossHeight})`)
        .call(d3.axisBottom(lossXScale).ticks(5));
    
    lossArea.append('g')
        .call(d3.axisLeft(lossYScale).ticks(5));
    
    const lossPath = lossArea.append('path')
        .attr('fill', 'none')
        .attr('stroke', '#10099F')
        .attr('stroke-width', 2);
    
    // Parameter convergence
    paramArea.append('text')
        .attr('x', 125)
        .attr('y', -10)
        .attr('text-anchor', 'middle')
        .attr('font-size', '14px')
        .attr('font-weight', 'bold')
        .text('Parameter Values');
    
    const paramBars = paramArea.append('g');
    
    // Info display
    const infoArea = svg.append('g')
        .attr('transform', 'translate(350, 300)');
    
    const epochText = infoArea.append('text')
        .attr('text-anchor', 'middle')
        .attr('font-size', '16px')
        .attr('font-weight', 'bold')
        .text('Epoch: 0/3');
    
    const lossText = infoArea.append('text')
        .attr('text-anchor', 'middle')
        .attr('y', 25)
        .attr('font-size', '14px')
        .text('Loss: -');
    
    // Training simulation
    function runTraining() {
        if (isTraining) return;
        isTraining = true;
        
        const trueW = [2, -3.4];
        const trueB = 4.2;
        
        let w = [Math.random() * 0.1, Math.random() * 0.1];
        let b = 0;
        const lr = 0.03;
        
        const lossHistory = [];
        let iteration = 0;
        const maxIterations = 30;
        
        const speedMap = {
            'slow': 200,
            'normal': 100,
            'fast': 50
        };
        
        const delay = speedMap[d3.select('#training-speed').property('value')];
        
        function step() {
            if (iteration >= maxIterations) {
                isTraining = false;
                return;
            }
            
            // Compute loss
            const loss = Math.pow(w[0] - trueW[0], 2) + 
                        Math.pow(w[1] - trueW[1], 2) + 
                        Math.pow(b - trueB, 2);
            
            lossHistory.push({ x: iteration, y: Math.min(loss / 10, 1) });
            
            // Update parameters
            w[0] -= lr * 2 * (w[0] - trueW[0]);
            w[1] -= lr * 2 * (w[1] - trueW[1]);
            b -= lr * 2 * (b - trueB);
            
            // Update visualization
            const line = d3.line()
                .x(d => lossXScale(d.x))
                .y(d => lossYScale(d.y));
            
            lossPath.datum(lossHistory)
                .attr('d', line);
            
            // Update parameter bars
            const params = [
                { name: 'w₁', value: w[0], true: trueW[0], color: '#10099F' },
                { name: 'w₂', value: w[1], true: trueW[1], color: '#2DD2C0' },
                { name: 'b', value: b, true: trueB, color: '#FC8484' }
            ];
            
            const barScale = d3.scaleLinear()
                .domain([-5, 5])
                .range([0, 200]);
            
            const bars = paramBars.selectAll('g')
                .data(params);
            
            const barEnter = bars.enter().append('g')
                .attr('transform', (d, i) => `translate(0, ${i * 60})`);
            
            barEnter.append('text')
                .attr('x', -10)
                .attr('y', 20)
                .attr('text-anchor', 'end')
                .attr('font-size', '12px')
                .text(d => d.name);
            
            barEnter.append('rect')
                .attr('class', 'param-bar');
            
            barEnter.append('line')
                .attr('class', 'true-line');
            
            bars.select('.param-bar')
                .attr('x', d => d.value >= 0 ? barScale(0) : barScale(d.value))
                .attr('y', 10)
                .attr('width', d => Math.abs(barScale(d.value) - barScale(0)))
                .attr('height', 20)
                .attr('fill', d => d.color)
                .attr('opacity', 0.7);
            
            bars.select('.true-line')
                .attr('x1', d => barScale(d.true))
                .attr('x2', d => barScale(d.true))
                .attr('y1', 5)
                .attr('y2', 35)
                .attr('stroke', '#262626')
                .attr('stroke-width', 2)
                .attr('stroke-dasharray', '3,3');
            
            // Update text
            epochText.text(`Epoch: ${Math.floor(iteration / 10) + 1}/3`);
            lossText.text(`Loss: ${(loss / 10).toFixed(4)}`);
            
            iteration++;
            if (isTraining) {
                setTimeout(step, delay);
            }
        }
        
        step();
    }
    
    d3.select('#run-complete-training').on('click', runTraining);
}

// Learning Rate Experiment Visualization
function initLRExperimentViz() {
    const container = d3.select('#lr-experiment-viz');
    if (container.empty()) return;
    
    container.html('');
    
    const width = 700;
    const height = 350;
    
    const svg = container.append('svg')
        .attr('width', width)
        .attr('height', height);
    
    // Create three panels for different learning rates
    const panels = [
        { lr: 0.001, x: 50, label: 'Too Small' },
        { lr: 0.03, x: 250, label: 'Just Right' },
        { lr: 1.0, x: 450, label: 'Too Large' }
    ];
    
    const panelWidth = 180;
    const panelHeight = 250;
    
    panels.forEach(panel => {
        const g = svg.append('g')
            .attr('transform', `translate(${panel.x}, 50)`);
        
        // Panel background
        g.append('rect')
            .attr('width', panelWidth)
            .attr('height', panelHeight)
            .attr('fill', '#F5F5F5')
            .attr('stroke', '#EEEEEE');
        
        // Title
        g.append('text')
            .attr('x', panelWidth / 2)
            .attr('y', -10)
            .attr('text-anchor', 'middle')
            .attr('font-size', '14px')
            .attr('font-weight', 'bold')
            .text(`LR = ${panel.lr}`);
        
        g.append('text')
            .attr('x', panelWidth / 2)
            .attr('y', panelHeight + 20)
            .attr('text-anchor', 'middle')
            .attr('font-size', '12px')
            .attr('fill', panel.label === 'Just Right' ? '#2DD2C0' : '#FC8484')
            .text(panel.label);
        
        // Loss curve
        const xScale = d3.scaleLinear()
            .domain([0, 50])
            .range([10, panelWidth - 10]);
        
        const yScale = d3.scaleLinear()
            .domain([0, 1])
            .range([panelHeight - 20, 20]);
        
        // Generate loss data
        const lossData = [];
        let loss = 1;
        
        for (let i = 0; i < 50; i++) {
            lossData.push({ x: i, y: loss });
            
            if (panel.lr === 0.001) {
                loss *= 0.98; // Very slow decrease
            } else if (panel.lr === 0.03) {
                loss *= 0.9; // Good decrease
            } else {
                loss = loss * 0.5 + Math.random() * 0.5; // Oscillation
            }
            
            loss = Math.max(0.01, Math.min(1, loss));
        }
        
        const line = d3.line()
            .x(d => xScale(d.x))
            .y(d => yScale(d.y));
        
        g.append('path')
            .datum(lossData)
            .attr('d', line)
            .attr('fill', 'none')
            .attr('stroke', '#10099F')
            .attr('stroke-width', 2);
    });
    
    // Update display based on slider
    function updateLRDisplay() {
        const lr = Math.pow(10, parseFloat(d3.select('#lr-exp-slider').property('value')));
        d3.select('#lr-exp-value').text(lr.toFixed(4));
    }
    
    d3.select('#lr-exp-slider').on('input', updateLRDisplay);
    d3.select('#run-lr-experiment').on('click', () => {
        // Re-render with current LR
        initLRExperimentViz();
    });
    
    updateLRDisplay();
}

// Initialize all visualizations when ready
if (typeof Reveal !== 'undefined') {
    Reveal.on('slidechanged', event => {
        const currentSlide = event.currentSlide;
        
        if (currentSlide.querySelector('#training-pipeline-overview')) {
            initTrainingPipelineOverview();
        }
        if (currentSlide.querySelector('#initialization-comparison')) {
            initInitializationComparison();
        }
        if (currentSlide.querySelector('#loss-properties-viz')) {
            initLossPropertiesViz();
        }
        if (currentSlide.querySelector('#learning-rate-effects')) {
            initLearningRateEffects();
        }
        if (currentSlide.querySelector('#training-flow-viz')) {
            initTrainingFlowViz();
        }
        if (currentSlide.querySelector('#convergence-tracking-viz')) {
            initConvergenceTrackingViz();
        }
        if (currentSlide.querySelector('#complete-training-viz')) {
            initCompleteTrainingViz();
        }
        if (currentSlide.querySelector('#lr-experiment-viz')) {
            initLRExperimentViz();
        }
    });
}