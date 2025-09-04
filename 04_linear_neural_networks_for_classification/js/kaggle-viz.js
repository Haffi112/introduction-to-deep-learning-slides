// Kaggle House Price Prediction Visualizations

// Initialize all Kaggle visualizations
function initKaggleViz() {
    initPreprocessingDemo();
    initLogScaleDemo();
    initKFoldDemo();
    initTrainingProgressDemo();
    initPipelineDemo();
}

// Preprocessing Pipeline Visualization
function initPreprocessingDemo() {
    const container = d3.select('#preprocessing-viz-container');
    if (container.empty()) return;
    
    container.selectAll('*').remove();
    
    const width = 800;
    const height = 400;
    
    const svg = container.append('svg')
        .attr('width', width)
        .attr('height', height)
        .attr('viewBox', `0 0 ${width} ${height}`);
    
    // Pipeline stages
    const stages = [
        { id: 'raw', label: 'Raw Data', features: '80 features', color: '#10099F' },
        { id: 'clean', label: 'Remove ID', features: '79 features', color: '#2DD2C0' },
        { id: 'numeric', label: 'Standardize', features: 'Numerical', color: '#FFA05F' },
        { id: 'categorical', label: 'One-Hot', features: 'Categorical', color: '#FC8484' },
        { id: 'final', label: 'Processed', features: '331 features', color: '#2DD2C0' }
    ];
    
    const stageWidth = 120;
    const stageHeight = 80;
    const spacing = (width - stages.length * stageWidth) / (stages.length + 1);
    
    // Draw stages
    const stageGroups = svg.selectAll('.stage')
        .data(stages)
        .enter()
        .append('g')
        .attr('class', 'stage')
        .attr('transform', (d, i) => `translate(${spacing + i * (stageWidth + spacing)}, ${height/2 - stageHeight/2})`)
        .style('opacity', 0);
    
    stageGroups.append('rect')
        .attr('width', stageWidth)
        .attr('height', stageHeight)
        .attr('rx', 10)
        .attr('fill', d => d.color)
        .attr('fill-opacity', 0.2)
        .attr('stroke', d => d.color)
        .attr('stroke-width', 2);
    
    stageGroups.append('text')
        .attr('x', stageWidth/2)
        .attr('y', stageHeight/2 - 10)
        .attr('text-anchor', 'middle')
        .attr('font-weight', 'bold')
        .text(d => d.label);
    
    stageGroups.append('text')
        .attr('x', stageWidth/2)
        .attr('y', stageHeight/2 + 15)
        .attr('text-anchor', 'middle')
        .attr('font-size', '12px')
        .attr('fill', '#666')
        .text(d => d.features);
    
    // Draw arrows
    const arrows = svg.selectAll('.arrow')
        .data(stages.slice(0, -1))
        .enter()
        .append('line')
        .attr('class', 'arrow')
        .attr('x1', (d, i) => spacing + (i + 1) * (stageWidth + spacing) - spacing/2)
        .attr('y1', height/2)
        .attr('x2', (d, i) => spacing + (i + 1) * (stageWidth + spacing) - spacing/2 + spacing/2 - 10)
        .attr('y2', height/2)
        .attr('stroke', '#999')
        .attr('stroke-width', 2)
        .attr('marker-end', 'url(#arrowhead)')
        .style('opacity', 0);
    
    // Add arrowhead marker
    svg.append('defs')
        .append('marker')
        .attr('id', 'arrowhead')
        .attr('refX', 5)
        .attr('refY', 3)
        .attr('markerWidth', 10)
        .attr('markerHeight', 6)
        .attr('orient', 'auto')
        .append('path')
        .attr('d', 'M 0 0 L 5 3 L 0 6')
        .attr('fill', '#999');
    
    // Animation
    d3.select('#preprocess-btn').on('click', function() {
        stageGroups.transition()
            .duration(500)
            .delay((d, i) => i * 200)
            .style('opacity', 1);
        
        arrows.transition()
            .duration(300)
            .delay((d, i) => i * 200 + 400)
            .style('opacity', 1);
    });
    
    d3.select('#reset-preprocess-btn').on('click', function() {
        stageGroups.style('opacity', 0);
        arrows.style('opacity', 0);
    });
}

// Log Scale Visualization
function initLogScaleDemo() {
    const container = d3.select('#log-scale-viz-container');
    if (container.empty()) return;
    
    container.selectAll('*').remove();
    
    const width = 800;
    const height = 400;
    const margin = { top: 40, right: 40, bottom: 60, left: 60 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    
    const svg = container.append('svg')
        .attr('width', width)
        .attr('height', height)
        .attr('viewBox', `0 0 ${width} ${height}`);
    
    const g = svg.append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top})`);
    
    // Sample house prices
    const houses = [
        { location: 'Ohio', actual: 125000, color: '#10099F' },
        { location: 'Texas', actual: 350000, color: '#2DD2C0' },
        { location: 'California', actual: 2000000, color: '#FC8484' },
        { location: 'New York', actual: 800000, color: '#FFA05F' }
    ];
    
    let useLogScale = false;
    let errorSize = 100000;
    
    function update() {
        g.selectAll('*').remove();
        
        // Calculate predictions with error
        const data = houses.map(h => ({
            ...h,
            predicted: h.actual + errorSize * (Math.random() - 0.5) * 2,
        }));
        
        data.forEach(d => {
            if (useLogScale) {
                d.error = Math.abs(Math.log(d.actual) - Math.log(d.predicted));
                d.relativeError = d.error;
            } else {
                d.error = Math.abs(d.actual - d.predicted);
                d.relativeError = d.error / d.actual;
            }
        });
        
        // Scales
        const xScale = d3.scaleBand()
            .domain(data.map(d => d.location))
            .range([0, innerWidth])
            .padding(0.2);
        
        const yScale = useLogScale ? 
            d3.scaleLog().domain([50000, 5000000]).range([innerHeight, 0]) :
            d3.scaleLinear().domain([0, 2500000]).range([innerHeight, 0]);
        
        // Axes
        g.append('g')
            .attr('transform', `translate(0, ${innerHeight})`)
            .call(d3.axisBottom(xScale));
        
        g.append('g')
            .call(d3.axisLeft(yScale).tickFormat(d => `$${d/1000}k`));
        
        // Bars for actual prices
        g.selectAll('.actual-bar')
            .data(data)
            .enter()
            .append('rect')
            .attr('class', 'actual-bar')
            .attr('x', d => xScale(d.location))
            .attr('y', d => yScale(d.actual))
            .attr('width', xScale.bandwidth() / 2)
            .attr('height', d => innerHeight - yScale(d.actual))
            .attr('fill', d => d.color)
            .attr('opacity', 0.6);
        
        // Bars for predicted prices
        g.selectAll('.predicted-bar')
            .data(data)
            .enter()
            .append('rect')
            .attr('class', 'predicted-bar')
            .attr('x', d => xScale(d.location) + xScale.bandwidth() / 2)
            .attr('y', d => yScale(d.predicted))
            .attr('width', xScale.bandwidth() / 2)
            .attr('height', d => innerHeight - yScale(d.predicted))
            .attr('fill', d => d.color)
            .attr('opacity', 0.3)
            .attr('stroke', d => d.color)
            .attr('stroke-width', 2)
            .attr('stroke-dasharray', '4,2');
        
        // Error labels
        g.selectAll('.error-label')
            .data(data)
            .enter()
            .append('text')
            .attr('class', 'error-label')
            .attr('x', d => xScale(d.location) + xScale.bandwidth() / 2)
            .attr('y', d => Math.min(yScale(d.actual), yScale(d.predicted)) - 10)
            .attr('text-anchor', 'middle')
            .attr('font-size', '12px')
            .attr('font-weight', 'bold')
            .text(d => `${(d.relativeError * 100).toFixed(1)}%`);
        
        // Title
        svg.append('text')
            .attr('x', width / 2)
            .attr('y', 20)
            .attr('text-anchor', 'middle')
            .attr('font-size', '16px')
            .attr('font-weight', 'bold')
            .text(useLogScale ? 'Log Scale (Equal Relative Errors)' : 'Linear Scale (Different Relative Errors)');
        
        // Legend
        const legend = svg.append('g')
            .attr('transform', `translate(${width - 120}, 40)`);
        
        legend.append('rect')
            .attr('width', 15)
            .attr('height', 15)
            .attr('fill', '#10099F')
            .attr('opacity', 0.6);
        
        legend.append('text')
            .attr('x', 20)
            .attr('y', 12)
            .text('Actual');
        
        legend.append('rect')
            .attr('y', 20)
            .attr('width', 15)
            .attr('height', 15)
            .attr('fill', '#10099F')
            .attr('opacity', 0.3)
            .attr('stroke', '#10099F')
            .attr('stroke-width', 2)
            .attr('stroke-dasharray', '4,2');
        
        legend.append('text')
            .attr('x', 20)
            .attr('y', 32)
            .text('Predicted');
    }
    
    // Event handlers
    d3.select('#error-slider').on('input', function() {
        errorSize = +this.value;
        d3.select('#error-value').text(`$${(errorSize/1000).toFixed(0)},000`);
        update();
    });
    
    d3.select('#toggle-scale-btn').on('click', function() {
        useLogScale = !useLogScale;
        update();
    });
    
    update();
}

// K-Fold Cross-Validation Visualization
function initKFoldDemo() {
    const container = d3.select('#kfold-viz-container');
    if (container.empty()) return;
    
    container.selectAll('*').remove();
    
    const width = 800;
    const height = 400;
    const margin = { top: 60, right: 40, bottom: 40, left: 40 };
    
    const svg = container.append('svg')
        .attr('width', width)
        .attr('height', height)
        .attr('viewBox', `0 0 ${width} ${height}`);
    
    let k = 5;
    let currentFold = -1;
    let animationInterval;
    
    function drawFolds() {
        svg.selectAll('*').remove();
        
        const maxFoldsPerRow = 5;
        const rows = Math.ceil(k / maxFoldsPerRow);
        const foldsInFirstRow = Math.min(k, maxFoldsPerRow);
        const foldsInSecondRow = k > maxFoldsPerRow ? k - maxFoldsPerRow : 0;
        
        const foldWidth = (width - margin.left - margin.right) / maxFoldsPerRow;
        const foldHeight = 60;
        const rowSpacing = 120;
        const startY = height / 2 - (rows * foldHeight + (rows - 1) * (rowSpacing - foldHeight)) / 2;
        
        // Title
        svg.append('text')
            .attr('x', width / 2)
            .attr('y', 30)
            .attr('text-anchor', 'middle')
            .attr('font-size', '18px')
            .attr('font-weight', 'bold')
            .text(`${k}-Fold Cross-Validation`);
        
        // Draw folds
        for (let i = 0; i < k; i++) {
            const row = Math.floor(i / maxFoldsPerRow);
            const colInRow = i % maxFoldsPerRow;
            const foldsInCurrentRow = row === 0 ? foldsInFirstRow : foldsInSecondRow;
            
            // Center the folds in each row
            const rowStartX = margin.left + (width - margin.left - margin.right - foldsInCurrentRow * foldWidth) / 2;
            const xPos = rowStartX + colInRow * foldWidth;
            const yPos = startY + row * rowSpacing;
            
            const g = svg.append('g')
                .attr('transform', `translate(${xPos}, ${yPos})`);
            
            // Fold rectangle
            g.append('rect')
                .attr('class', `fold-${i}`)
                .attr('width', foldWidth - 5)
                .attr('height', foldHeight)
                .attr('fill', i === currentFold ? '#FC8484' : '#10099F')
                .attr('opacity', i === currentFold ? 0.8 : 0.3)
                .attr('stroke', '#333')
                .attr('stroke-width', 2)
                .attr('rx', 5);
            
            // Fold label
            g.append('text')
                .attr('x', foldWidth / 2 - 2.5)
                .attr('y', foldHeight / 2)
                .attr('text-anchor', 'middle')
                .attr('dominant-baseline', 'middle')
                .attr('fill', 'white')
                .attr('font-weight', 'bold')
                .text(`Fold ${i + 1}`);
            
            // Role label
            g.append('text')
                .attr('x', foldWidth / 2 - 2.5)
                .attr('y', foldHeight + 20)
                .attr('text-anchor', 'middle')
                .attr('font-size', '12px')
                .attr('fill', i === currentFold ? '#FC8484' : '#10099F')
                .attr('font-weight', i === currentFold ? 'bold' : 'normal')
                .text(i === currentFold ? 'Validation' : 'Training');
        }
        
        // Current iteration label
        if (currentFold >= 0) {
            svg.append('text')
                .attr('x', width / 2)
                .attr('y', height - 40)
                .attr('text-anchor', 'middle')
                .attr('font-size', '16px')
                .text(`Iteration ${currentFold + 1} of ${k}`);
        }
    }
    
    // Event handlers
    d3.select('#k-slider').on('input', function() {
        k = +this.value;
        d3.select('#k-value').text(k);
        currentFold = -1;
        if (animationInterval) clearInterval(animationInterval);
        drawFolds();
    });
    
    d3.select('#animate-kfold-btn').on('click', function() {
        if (animationInterval) clearInterval(animationInterval);
        currentFold = 0;
        
        animationInterval = setInterval(() => {
            drawFolds();
            currentFold++;
            if (currentFold >= k) {
                currentFold = 0;
            }
        }, 1000);
    });
    
    d3.select('#reset-kfold-btn').on('click', function() {
        if (animationInterval) clearInterval(animationInterval);
        currentFold = -1;
        drawFolds();
    });
    
    drawFolds();
}

// Training Progress Visualization
function initTrainingProgressDemo() {
    const container = d3.select('#training-progress-viz-container');
    if (container.empty()) return;
    
    container.selectAll('*').remove();
    
    const width = 800;
    const height = 400;
    const margin = { top: 40, right: 120, bottom: 60, left: 60 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    
    const svg = container.append('svg')
        .attr('width', width)
        .attr('height', height)
        .attr('viewBox', `0 0 ${width} ${height}`);
    
    const g = svg.append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top})`);
    
    // Data
    const maxEpochs = 50;
    let epoch = 0;
    const trainLoss = [];
    const valLoss = [];
    let animationId;
    let isPaused = false;
    
    // Scales
    const xScale = d3.scaleLinear()
        .domain([0, maxEpochs])
        .range([0, innerWidth]);
    
    const yScale = d3.scaleLinear()
        .domain([0, 1])
        .range([innerHeight, 0]);
    
    // Axes
    g.append('g')
        .attr('transform', `translate(0, ${innerHeight})`)
        .call(d3.axisBottom(xScale).ticks(10))
        .append('text')
        .attr('x', innerWidth / 2)
        .attr('y', 40)
        .attr('fill', 'black')
        .style('text-anchor', 'middle')
        .text('Epoch');
    
    g.append('g')
        .call(d3.axisLeft(yScale))
        .append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', -40)
        .attr('x', -innerHeight / 2)
        .attr('fill', 'black')
        .style('text-anchor', 'middle')
        .text('Loss');
    
    // Line generators
    const trainLine = d3.line()
        .x((d, i) => xScale(i))
        .y(d => yScale(d))
        .curve(d3.curveMonotoneX);
    
    const valLine = d3.line()
        .x((d, i) => xScale(i))
        .y(d => yScale(d))
        .curve(d3.curveMonotoneX);
    
    // Paths
    const trainPath = g.append('path')
        .attr('class', 'train-line')
        .attr('fill', 'none')
        .attr('stroke', '#10099F')
        .attr('stroke-width', 2);
    
    const valPath = g.append('path')
        .attr('class', 'val-line')
        .attr('fill', 'none')
        .attr('stroke', '#FC8484')
        .attr('stroke-width', 2);
    
    // Legend
    const legend = svg.append('g')
        .attr('transform', `translate(${width - 100}, 60)`);
    
    legend.append('line')
        .attr('x1', 0)
        .attr('x2', 20)
        .attr('y1', 0)
        .attr('y2', 0)
        .attr('stroke', '#10099F')
        .attr('stroke-width', 2);
    
    legend.append('text')
        .attr('x', 25)
        .attr('y', 4)
        .text('Training');
    
    legend.append('line')
        .attr('x1', 0)
        .attr('x2', 20)
        .attr('y1', 20)
        .attr('y2', 20)
        .attr('stroke', '#FC8484')
        .attr('stroke-width', 2);
    
    legend.append('text')
        .attr('x', 25)
        .attr('y', 24)
        .text('Validation');
    
    // Overfitting indicator
    const overfitText = svg.append('text')
        .attr('x', width / 2)
        .attr('y', height - 10)
        .attr('text-anchor', 'middle')
        .attr('fill', '#FC8484')
        .attr('font-weight', 'bold')
        .style('opacity', 0);
    
    function generateLoss() {
        // Simulate training dynamics
        const trainBase = 0.8 * Math.exp(-epoch / 10) + 0.05;
        const trainNoise = (Math.random() - 0.5) * 0.02;
        trainLoss.push(Math.max(0.02, trainBase + trainNoise));
        
        // Validation starts similar but diverges (overfitting)
        const valBase = epoch < 15 ? 
            0.8 * Math.exp(-epoch / 10) + 0.08 :
            0.08 + 0.002 * (epoch - 15) * (epoch - 15);
        const valNoise = (Math.random() - 0.5) * 0.03;
        valLoss.push(Math.max(0.02, valBase + valNoise));
    }
    
    function update() {
        if (epoch < maxEpochs && !isPaused) {
            generateLoss();
            
            trainPath.attr('d', trainLine(trainLoss));
            valPath.attr('d', valLine(valLoss));
            
            // Check for overfitting
            if (epoch > 10 && valLoss[epoch] > valLoss[epoch - 5]) {
                overfitText
                    .text('⚠️ Overfitting detected!')
                    .style('opacity', 1);
            }
            
            epoch++;
            animationId = requestAnimationFrame(() => setTimeout(update, 100));
        }
    }
    
    // Event handlers
    d3.select('#start-training-btn').on('click', function() {
        isPaused = false;
        if (epoch === 0 || epoch >= maxEpochs) {
            epoch = 0;
            trainLoss.length = 0;
            valLoss.length = 0;
            overfitText.style('opacity', 0);
        }
        update();
    });
    
    d3.select('#pause-training-btn').on('click', function() {
        isPaused = true;
        if (animationId) cancelAnimationFrame(animationId);
    });
    
    d3.select('#reset-training-btn').on('click', function() {
        isPaused = true;
        if (animationId) cancelAnimationFrame(animationId);
        epoch = 0;
        trainLoss.length = 0;
        valLoss.length = 0;
        trainPath.attr('d', '');
        valPath.attr('d', '');
        overfitText.style('opacity', 0);
    });
}

// Complete Pipeline Visualization
function initPipelineDemo() {
    const container = d3.select('#pipeline-viz-container');
    if (container.empty()) return;
    
    container.selectAll('*').remove();
    
    const width = 800;
    const height = 500;
    
    const svg = container.append('svg')
        .attr('width', width)
        .attr('height', height)
        .attr('viewBox', `0 0 ${width} ${height}`);
    
    // Pipeline steps
    const steps = [
        { id: 'load', label: 'Load Data', y: 50, color: '#10099F' },
        { id: 'preprocess', label: 'Preprocess', y: 130, color: '#2DD2C0' },
        { id: 'split', label: 'K-Fold Split', y: 210, color: '#FFA05F' },
        { id: 'train', label: 'Train Models', y: 290, color: '#FC8484' },
        { id: 'ensemble', label: 'Ensemble', y: 370, color: '#2DD2C0' },
        { id: 'submit', label: 'Submit', y: 450, color: '#10099F' }
    ];
    
    const boxWidth = 150;
    const boxHeight = 50;
    const xCenter = width / 2;
    
    // Draw steps
    const stepGroups = svg.selectAll('.step')
        .data(steps)
        .enter()
        .append('g')
        .attr('class', d => `step step-${d.id}`)
        .style('opacity', 0);
    
    stepGroups.append('rect')
        .attr('x', xCenter - boxWidth / 2)
        .attr('y', d => d.y - boxHeight / 2)
        .attr('width', boxWidth)
        .attr('height', boxHeight)
        .attr('rx', 10)
        .attr('fill', d => d.color)
        .attr('fill-opacity', 0.2)
        .attr('stroke', d => d.color)
        .attr('stroke-width', 2);
    
    stepGroups.append('text')
        .attr('x', xCenter)
        .attr('y', d => d.y)
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .attr('font-weight', 'bold')
        .text(d => d.label);
    
    // Draw arrows
    const arrows = svg.selectAll('.arrow')
        .data(steps.slice(0, -1))
        .enter()
        .append('line')
        .attr('class', 'arrow')
        .attr('x1', xCenter)
        .attr('y1', (d, i) => steps[i].y + boxHeight / 2)
        .attr('x2', xCenter)
        .attr('y2', (d, i) => steps[i + 1].y - boxHeight / 2 - 5)
        .attr('stroke', '#999')
        .attr('stroke-width', 2)
        .attr('marker-end', 'url(#pipeline-arrowhead)')
        .style('opacity', 0);
    
    // Add arrowhead marker
    svg.append('defs')
        .append('marker')
        .attr('id', 'pipeline-arrowhead')
        .attr('refX', 5)
        .attr('refY', 3)
        .attr('markerWidth', 10)
        .attr('markerHeight', 6)
        .attr('orient', 'auto')
        .append('path')
        .attr('d', 'M 0 0 L 5 3 L 0 6')
        .attr('fill', '#999');
    
    // Add annotations
    const annotations = [
        { step: 'preprocess', text: '79 → 331 features', x: xCenter + boxWidth / 2 + 20 },
        { step: 'split', text: '5-fold CV', x: xCenter + boxWidth / 2 + 20 },
        { step: 'train', text: '5 models', x: xCenter + boxWidth / 2 + 20 },
        { step: 'ensemble', text: 'Average predictions', x: xCenter + boxWidth / 2 + 20 }
    ];
    
    const annotationGroups = svg.selectAll('.annotation')
        .data(annotations)
        .enter()
        .append('text')
        .attr('class', d => `annotation ann-${d.step}`)
        .attr('x', d => d.x)
        .attr('y', d => steps.find(s => s.id === d.step).y)
        .attr('font-size', '12px')
        .attr('fill', '#666')
        .text(d => d.text)
        .style('opacity', 0);
    
    // Animation
    d3.select('#animate-pipeline-btn').on('click', function() {
        stepGroups.transition()
            .duration(500)
            .delay((d, i) => i * 300)
            .style('opacity', 1);
        
        arrows.transition()
            .duration(300)
            .delay((d, i) => i * 300 + 200)
            .style('opacity', 1);
        
        annotationGroups.transition()
            .duration(300)
            .delay((d, i) => {
                const stepIndex = steps.findIndex(s => s.id === d.step);
                return stepIndex * 300 + 400;
            })
            .style('opacity', 1);
    });
    
    d3.select('#reset-pipeline-btn').on('click', function() {
        stepGroups.style('opacity', 0);
        arrows.style('opacity', 0);
        annotationGroups.style('opacity', 0);
    });
}

// Export functions
window.initKaggleViz = initKaggleViz;
window.initPreprocessingDemo = initPreprocessingDemo;
window.initLogScaleDemo = initLogScaleDemo;
window.initKFoldDemo = initKFoldDemo;
window.initTrainingProgressDemo = initTrainingProgressDemo;
window.initPipelineDemo = initPipelineDemo;