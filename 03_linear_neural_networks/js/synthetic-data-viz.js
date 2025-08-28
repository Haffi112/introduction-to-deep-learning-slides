// Synthetic Data Visualizations

// Validation Cycle Visualization
function initValidationCycle() {
    const container = d3.select('#validation-cycle-viz');
    if (container.empty() || !container.node()) return;
    
    container.selectAll("*").remove();
    
    const width = container.node().getBoundingClientRect().width || 800;
    const height = 400;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) * 0.35;
    
    const svg = container.append('svg')
        .attr('width', width)
        .attr('height', height);
    
    // Define cycle steps
    const steps = [
        { label: "Generate\nSynthetic Data", angle: 0, color: "#10099F" },
        { label: "Train\nModel", angle: 72, color: "#2DD2C0" },
        { label: "Predict\nParameters", angle: 144, color: "#FFA05F" },
        { label: "Compare with\nGround Truth", angle: 216, color: "#FC8484" },
        { label: "Validate\nImplementation", angle: 288, color: "#FAC55B" }
    ];
    
    // Draw connections
    const connections = svg.append('g').attr('class', 'connections');
    
    steps.forEach((step, i) => {
        const nextStep = steps[(i + 1) % steps.length];
        const startAngle = (step.angle - 90) * Math.PI / 180;
        const endAngle = (nextStep.angle - 90) * Math.PI / 180;
        
        const x1 = centerX + radius * Math.cos(startAngle);
        const y1 = centerY + radius * Math.sin(startAngle);
        const x2 = centerX + radius * Math.cos(endAngle);
        const y2 = centerY + radius * Math.sin(endAngle);
        
        // Curved path
        const path = connections.append('path')
            .attr('d', `M ${x1},${y1} Q ${centerX},${centerY} ${x2},${y2}`)
            .attr('fill', 'none')
            .attr('stroke', '#EEEEEE')
            .attr('stroke-width', 2)
            .attr('marker-end', 'url(#arrowhead)');
    });
    
    // Define arrow marker
    svg.append('defs').append('marker')
        .attr('id', 'arrowhead')
        .attr('markerWidth', 10)
        .attr('markerHeight', 10)
        .attr('refX', 8)
        .attr('refY', 3)
        .attr('orient', 'auto')
        .append('polygon')
        .attr('points', '0 0, 10 3, 0 6')
        .attr('fill', '#EEEEEE');
    
    // Draw step nodes
    const nodes = svg.append('g').attr('class', 'nodes');
    
    steps.forEach((step, i) => {
        const angle = (step.angle - 90) * Math.PI / 180;
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);
        
        const group = nodes.append('g')
            .attr('transform', `translate(${x}, ${y})`);
        
        // Circle
        group.append('circle')
            .attr('r', 45)
            .attr('fill', step.color)
            .attr('stroke', 'white')
            .attr('stroke-width', 3)
            .style('filter', 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))');
        
        // Text
        const lines = step.label.split('\n');
        lines.forEach((line, j) => {
            group.append('text')
                .attr('text-anchor', 'middle')
                .attr('y', (j - (lines.length - 1) / 2) * 16)
                .attr('fill', 'white')
                .attr('font-size', '12px')
                .attr('font-weight', 'bold')
                .text(line);
        });
    });
    
    // Center text
    svg.append('text')
        .attr('x', centerX)
        .attr('y', centerY)
        .attr('text-anchor', 'middle')
        .attr('font-size', '14px')
        .attr('fill', '#262626')
        .attr('font-weight', 'bold')
        .text('Validation Cycle');
}

// Data Generation Demo
function initDataGenerationDemo() {
    const container = d3.select('#data-generation-demo');
    if (container.empty() || !container.node()) return;
    
    const svg = d3.select('#data-gen-svg');
    if (svg.empty()) return;
    
    svg.selectAll("*").remove();
    
    const width = container.node().getBoundingClientRect().width || 800;
    const height = 400;
    const margin = { top: 20, right: 20, bottom: 40, left: 50 };
    const plotWidth = width - margin.left - margin.right;
    const plotHeight = height - margin.top - margin.bottom;
    
    svg.attr('width', width).attr('height', height);
    
    const g = svg.append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top})`);
    
    // True parameters
    const w1 = 2;
    const w2 = -3.4;
    const b = 4.2;
    
    // Scales
    const xScale = d3.scaleLinear()
        .domain([-3, 3])
        .range([0, plotWidth]);
    
    const yScale = d3.scaleLinear()
        .domain([-10, 20])
        .range([plotHeight, 0]);
    
    // Axes
    g.append('g')
        .attr('transform', `translate(0, ${plotHeight})`)
        .call(d3.axisBottom(xScale));
    
    g.append('g')
        .call(d3.axisLeft(yScale));
    
    // Labels
    g.append('text')
        .attr('x', plotWidth / 2)
        .attr('y', plotHeight + 35)
        .attr('text-anchor', 'middle')
        .text('Feature (X₁)');
    
    g.append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', -35)
        .attr('x', -plotHeight / 2)
        .attr('text-anchor', 'middle')
        .text('Target (y)');
    
    // Generate and plot data
    function generateAndPlot() {
        const noiseLevel = parseFloat(d3.select('#noise-level').property('value'));
        const numSamples = parseInt(d3.select('#num-samples').property('value'));
        
        // Update display values
        d3.select('#noise-value').text(noiseLevel.toFixed(2));
        d3.select('#samples-value').text(numSamples);
        
        // Generate data points
        const data = [];
        for (let i = 0; i < numSamples; i++) {
            const x1 = (Math.random() - 0.5) * 6; // Random between -3 and 3
            const x2 = (Math.random() - 0.5) * 6;
            const yClean = w1 * x1 + w2 * x2 + b;
            const noise = (Math.random() - 0.5) * 2 * noiseLevel * 10;
            const y = yClean + noise;
            data.push({ x1, x2, y, yClean });
        }
        
        // Plot true line (for x2 = 0)
        const lineData = d3.range(-3, 3.1, 0.1).map(x1 => ({
            x: x1,
            y: w1 * x1 + b
        }));
        
        // Remove old elements
        g.selectAll('.data-point').remove();
        g.selectAll('.true-line').remove();
        
        // Draw true line
        const line = d3.line()
            .x(d => xScale(d.x))
            .y(d => yScale(d.y));
        
        g.append('path')
            .datum(lineData)
            .attr('class', 'true-line')
            .attr('d', line)
            .attr('fill', 'none')
            .attr('stroke', '#10099F')
            .attr('stroke-width', 2)
            .attr('stroke-dasharray', '5,5');
        
        // Draw data points
        g.selectAll('.data-point')
            .data(data)
            .enter().append('circle')
            .attr('class', 'data-point')
            .attr('cx', d => xScale(d.x1))
            .attr('cy', d => yScale(d.y))
            .attr('r', 3)
            .attr('fill', '#2DD2C0')
            .attr('fill-opacity', 0.6);
        
        // Update parameter display
        d3.select('#true-params')
            .html(`<strong>True Parameters:</strong> w₁ = ${w1}, w₂ = ${w2}, b = ${b.toFixed(1)} (showing projection for x₂ = 0)`);
    }
    
    // Event listeners
    d3.select('#noise-level').on('input', generateAndPlot);
    d3.select('#num-samples').on('input', generateAndPlot);
    d3.select('#regenerate-data').on('click', generateAndPlot);
    
    // Initial plot
    generateAndPlot();
}

// Iteration Demo
function initIterationDemo() {
    const container = d3.select('#iteration-demo');
    if (container.empty() || !container.node()) return;
    
    container.selectAll("*").remove();
    
    const width = container.node().getBoundingClientRect().width || 800;
    const height = 400;
    const margin = { top: 40, right: 20, bottom: 20, left: 20 };
    const plotWidth = width - margin.left - margin.right;
    const plotHeight = height - margin.top - margin.bottom;
    
    const svg = container.append('svg')
        .attr('width', width)
        .attr('height', height);
    
    const g = svg.append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top})`);
    
    // Generate sample data
    const totalSamples = 100;
    const batchSize = 10;
    const data = d3.range(totalSamples).map(i => ({
        id: i,
        value: Math.random() * 10
    }));
    
    // Layout parameters
    const cols = 20;
    const rows = Math.ceil(totalSamples / cols);
    const cellWidth = plotWidth / cols;
    const cellHeight = plotHeight / rows;
    const cellSize = Math.min(cellWidth, cellHeight) * 0.8;
    
    // Draw data points
    const cells = g.selectAll('.data-cell')
        .data(data)
        .enter().append('g')
        .attr('class', 'data-cell')
        .attr('transform', (d, i) => {
            const col = i % cols;
            const row = Math.floor(i / cols);
            const x = col * cellWidth + cellWidth / 2;
            const y = row * cellHeight + cellHeight / 2;
            return `translate(${x}, ${y})`;
        });
    
    cells.append('rect')
        .attr('width', cellSize)
        .attr('height', cellSize)
        .attr('x', -cellSize / 2)
        .attr('y', -cellSize / 2)
        .attr('fill', '#EEEEEE')
        .attr('stroke', '#fff')
        .attr('stroke-width', 1);
    
    cells.append('text')
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .attr('font-size', '10px')
        .attr('fill', '#262626')
        .text(d => d.id);
    
    // Animation state
    let animationInterval;
    let currentBatch = 0;
    let shuffledIndices;
    
    function resetVisualization() {
        clearInterval(animationInterval);
        currentBatch = 0;
        cells.selectAll('rect').attr('fill', '#EEEEEE');
    }
    
    function animateIteration() {
        const mode = d3.select('#iteration-mode').property('value');
        
        // Reset previous batch
        cells.selectAll('rect').attr('fill', '#EEEEEE');
        
        // Prepare indices
        if (currentBatch === 0) {
            if (mode === 'train') {
                // Shuffle for training
                shuffledIndices = d3.shuffle(d3.range(totalSamples));
            } else {
                // Sequential for validation
                shuffledIndices = d3.range(totalSamples);
            }
        }
        
        // Get current batch indices
        const startIdx = currentBatch * batchSize;
        const endIdx = Math.min(startIdx + batchSize, totalSamples);
        const batchIndices = shuffledIndices.slice(startIdx, endIdx);
        
        // Highlight current batch
        cells.each(function(d) {
            if (batchIndices.includes(d.id)) {
                d3.select(this).select('rect')
                    .transition()
                    .duration(300)
                    .attr('fill', '#2DD2C0');
            }
        });
        
        // Update batch counter
        currentBatch++;
        if (currentBatch * batchSize >= totalSamples) {
            currentBatch = 0;
        }
    }
    
    // Event listeners
    d3.select('#start-iteration').on('click', function() {
        clearInterval(animationInterval);
        animationInterval = setInterval(animateIteration, 1000);
        animateIteration(); // Start immediately
    });
    
    d3.select('#reset-iteration').on('click', resetVisualization);
}

// Pipeline Composition Visualization
function initPipelineComposition() {
    const container = d3.select('#pipeline-composition-viz');
    if (container.empty() || !container.node()) return;
    
    container.selectAll("*").remove();
    
    const width = container.node().getBoundingClientRect().width || 800;
    const height = 300;
    
    const svg = container.append('svg')
        .attr('width', width)
        .attr('height', height);
    
    // Pipeline stages
    const stages = [
        { name: "Raw Data", color: "#10099F" },
        { name: "Transform", color: "#2DD2C0" },
        { name: "Augment", color: "#FFA05F" },
        { name: "Batch", color: "#FAC55B" },
        { name: "Model", color: "#FC8484" }
    ];
    
    const boxWidth = 120;
    const boxHeight = 60;
    const spacing = (width - stages.length * boxWidth) / (stages.length + 1);
    const y = height / 2;
    
    // Draw connections
    stages.forEach((stage, i) => {
        if (i < stages.length - 1) {
            const x1 = spacing + i * (boxWidth + spacing) + boxWidth;
            const x2 = spacing + (i + 1) * (boxWidth + spacing);
            
            svg.append('line')
                .attr('x1', x1)
                .attr('y1', y)
                .attr('x2', x2)
                .attr('y2', y)
                .attr('stroke', '#EEEEEE')
                .attr('stroke-width', 2)
                .attr('marker-end', 'url(#pipeline-arrow)');
        }
    });
    
    // Define arrow marker
    svg.append('defs').append('marker')
        .attr('id', 'pipeline-arrow')
        .attr('markerWidth', 10)
        .attr('markerHeight', 10)
        .attr('refX', 0)
        .attr('refY', 3)
        .attr('orient', 'auto')
        .append('polygon')
        .attr('points', '0 0, 10 3, 0 6')
        .attr('fill', '#EEEEEE');
    
    // Draw stages
    const stageGroups = svg.selectAll('.stage')
        .data(stages)
        .enter().append('g')
        .attr('class', 'stage')
        .attr('transform', (d, i) => {
            const x = spacing + i * (boxWidth + spacing);
            return `translate(${x}, ${y - boxHeight / 2})`;
        });
    
    stageGroups.append('rect')
        .attr('width', boxWidth)
        .attr('height', boxHeight)
        .attr('rx', 5)
        .attr('fill', d => d.color)
        .style('filter', 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))');
    
    stageGroups.append('text')
        .attr('x', boxWidth / 2)
        .attr('y', boxHeight / 2)
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .attr('fill', 'white')
        .attr('font-weight', 'bold')
        .attr('font-size', '14px')
        .text(d => d.name);
    
    // Add data flow animation
    function animateDataFlow() {
        const particle = svg.append('circle')
            .attr('r', 5)
            .attr('fill', '#10099F')
            .attr('cx', spacing / 2)
            .attr('cy', y);
        
        particle.transition()
            .duration(3000)
            .ease(d3.easeLinear)
            .attr('cx', width - spacing / 2)
            .on('end', function() {
                particle.remove();
                setTimeout(animateDataFlow, 500);
            });
    }
    
    animateDataFlow();
}

// Initialize all visualizations when the slide is shown
function initSyntheticDataVisualizations() {
    initValidationCycle();
    initDataGenerationDemo();
    initIterationDemo();
    initPipelineComposition();
}

// Export functions for use in main script
if (typeof window !== 'undefined') {
    window.initValidationCycle = initValidationCycle;
    window.initDataGenerationDemo = initDataGenerationDemo;
    window.initIterationDemo = initIterationDemo;
    window.initPipelineComposition = initPipelineComposition;
    window.initSyntheticDataVisualizations = initSyntheticDataVisualizations;
}