function initTrainingLoopViz() {
    const container = d3.select('#training-loop-demo');
    if (container.empty()) return;
    
    container.selectAll('*').remove();
    
    const width = 800;
    const height = 300;
    const margin = {top: 20, right: 60, bottom: 20, left: 80};
    const plotWidth = width - margin.left - margin.right;
    const plotHeight = height - margin.top - margin.bottom;
    
    // State variables
    let isTraining = false;
    let animationId = null;
    let epoch = 0;
    let lossHistory = [];
    let accuracyHistory = [];
    
    // Hyperparameters
    let learningRate = 0.1;
    let batchSize = 256;
    let maxEpochs = 10;
    
    // Control panel
    const controls = container.append('div')
        .style('display', 'flex')
        .style('align-items', 'center')
        .style('justify-content', 'center')
        .style('gap', '20px')
        .style('margin-bottom', '20px')
        .style('padding', '15px')
        .style('background', '#f9f9f9')
        .style('border-radius', '8px')
        .style('z-index', '100');
    
    // Learning rate slider
    const lrGroup = controls.append('div')
        .style('display', 'flex')
        .style('align-items', 'center')
        .style('gap', '10px');
    
    lrGroup.append('label')
        .style('font-weight', 'bold')
        .style('color', '#10099F')
        .text('Learning Rate:').style('font-size', '15px');
    
    const lrSlider = lrGroup.append('input')
        .attr('type', 'range')
        .attr('min', '0.001')
        .attr('max', '0.5')
        .attr('step', '0.001')
        .attr('value', learningRate)
        .style('width', '120px')
        .on('input', function() {
            learningRate = parseFloat(this.value);
            lrValue.text(learningRate.toFixed(3));
        });
    
    const lrValue = lrGroup.append('span')
        .style('font-family', 'monospace')
        .style('width', '50px')
        .text(learningRate.toFixed(3)).style('font-size', '15px');
    
    // Batch size selector
    const batchGroup = controls.append('div')
        .style('display', 'flex')
        .style('align-items', 'center')
        .style('gap', '10px');
    
    batchGroup.append('label')
        .style('font-weight', 'bold')
        .style('color', '#10099F')
        .text('Batch Size:').style('font-size', '15px');
    
    const batchSelect = batchGroup.append('select')
        .style('padding', '5px')
        .style('border', '1px solid #ddd')
        .style('border-radius', '4px');
    
    [64, 128, 256, 512].forEach(size => {
        batchSelect.append('option')
            .attr('value', size)
            .property('selected', size === batchSize)
            .text(size);
    });
    
    batchSelect.on('change', function() {
        batchSize = parseInt(this.value);
    });
    
    // Control buttons
    const startButton = controls.append('button')
        .text('Start Training')
        .style('background', '#10099F')
        .style('color', 'white')
        .style('border', 'none')
        .style('padding', '8px 16px')
        .style('border-radius', '5px')
        .style('cursor', 'pointer')
        .on('click', toggleTraining);
    
    const resetButton = controls.append('button')
        .text('Reset')
        .style('background', '#FC8484')
        .style('color', 'white')
        .style('border', 'none')
        .style('padding', '8px 16px')
        .style('border-radius', '5px')
        .style('cursor', 'pointer')
        .on('click', resetTraining);
    
    // SVG for plots
    const svg = container.append('svg')
        .attr('width', width)
        .attr('height', height)
        .attr('viewBox', `0 0 ${width} ${height}`)
        .style('max-width', '100%');
    
    const g = svg.append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);
    
    // Title
    svg.append('text')
        .attr('x', width / 2)
        .attr('y', 20)
        .attr('text-anchor', 'middle')
        .style('font-size', '18px')
        .style('font-weight', 'bold')
        .style('fill', '#10099F')
        .text('Training Progress');
    
    // Scales
    const xScale = d3.scaleLinear()
        .domain([0, maxEpochs])
        .range([0, plotWidth]);
    
    const yScaleLoss = d3.scaleLinear()
        .domain([0, 3])
        .range([plotHeight, 0]);
    
    const yScaleAccuracy = d3.scaleLinear()
        .domain([0, 1])
        .range([plotHeight, 0]);
    
    // Axes
    const xAxis = d3.axisBottom(xScale)
        .ticks(maxEpochs)
        .tickFormat(d => d);
    
    const yAxisLoss = d3.axisLeft(yScaleLoss)
        .ticks(5);
    
    const yAxisAccuracy = d3.axisRight(yScaleAccuracy)
        .ticks(5)
        .tickFormat(d => (d * 100) + '%');
    
    g.append('g')
        .attr('transform', `translate(0,${plotHeight})`)
        .call(xAxis)
        .append('text')
        .attr('x', plotWidth / 2)
        .attr('y', 40)
        .style('fill', '#262626')
        .style('font-size', '14px')
        .attr('text-anchor', 'middle')
        .text('Epoch').style('font-size', '15px');
    
    g.append('g')
        .attr('class', 'y-axis-loss')
        .call(yAxisLoss)
        .append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', -50)
        .attr('x', -plotHeight / 2)
        .style('fill', '#FC8484')
        .style('font-size', '14px')
        .attr('text-anchor', 'middle')
        .text('Loss').style('font-size', '15px');
    
    g.append('g')
        .attr('class', 'y-axis-accuracy')
        .attr('transform', `translate(${plotWidth},0)`)
        .call(yAxisAccuracy)
        .append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', 45)
        .attr('x', -plotHeight / 2)
        .style('fill', '#2DD2C0')
        .style('font-size', '14px')
        .attr('text-anchor', 'middle')
        .text('Accuracy').style('font-size', '15px');
    
    // Line generators
    const lossLine = d3.line()
        .x((d, i) => xScale(i + 1))
        .y(d => yScaleLoss(d))
        .curve(d3.curveMonotoneX);
    
    const accuracyLine = d3.line()
        .x((d, i) => xScale(i + 1))
        .y(d => yScaleAccuracy(d))
        .curve(d3.curveMonotoneX);
    
    // Paths for lines
    const lossPath = g.append('path')
        .attr('class', 'loss-line')
        .attr('fill', 'none')
        .attr('stroke', '#FC8484')
        .attr('stroke-width', 2);
    
    const accuracyPath = g.append('path')
        .attr('class', 'accuracy-line')
        .attr('fill', 'none')
        .attr('stroke', '#2DD2C0')
        .attr('stroke-width', 2);
    
    // Legend
    const legend = g.append('g')
        .attr('transform', `translate(${plotWidth - 120}, 10)`);
    
    legend.append('rect')
        .attr('x', 0)
        .attr('y', 0)
        .attr('width', 110)
        .attr('height', 50)
        .attr('fill', 'white')
        .attr('stroke', '#ddd')
        .attr('stroke-width', 1)
        .attr('rx', 3);
    
    legend.append('line')
        .attr('x1', 10)
        .attr('y1', 15)
        .attr('x2', 30)
        .attr('y2', 15)
        .attr('stroke', '#FC8484')
        .attr('stroke-width', 2);
    
    legend.append('text')
        .attr('x', 35)
        .attr('y', 19)
        .style('font-size', '12px')
        .text('Loss').style('font-size', '15px');
    
    legend.append('line')
        .attr('x1', 10)
        .attr('y1', 35)
        .attr('x2', 30)
        .attr('y2', 35)
        .attr('stroke', '#2DD2C0')
        .attr('stroke-width', 2);
    
    legend.append('text')
        .attr('x', 35)
        .attr('y', 39)
        .style('font-size', '12px')
        .text('Accuracy').style('font-size', '15px');
    
    // Info display
    const infoDisplay = container.append('div')
        .style('margin-top', '20px')
        .style('padding', '15px')
        .style('background', '#f9f9f9')
        .style('border-radius', '8px')
        .style('display', 'flex')
        .style('justify-content', 'space-around')
        .style('font-family', 'monospace');
    
    const epochInfo = infoDisplay.append('div');
    const lossInfo = infoDisplay.append('div');
    const accuracyInfo = infoDisplay.append('div');
    
    function updateInfo() {
        epochInfo.html(`<span style="font-size: 15px;"><strong>Epoch:</strong> ${epoch}/${maxEpochs}</span>`);
        
        if (lossHistory.length > 0) {
            const currentLoss = lossHistory[lossHistory.length - 1];
            lossInfo.html(`<span style="font-size: 15px;"><strong>Loss:</strong> ${currentLoss.toFixed(4)}</span>`);
        } else {
            lossInfo.html('<strong style="font-size: 15px;">Loss:</strong> -');
        }
        
        if (accuracyHistory.length > 0) {
            const currentAccuracy = accuracyHistory[accuracyHistory.length - 1];
            accuracyInfo.html(`<span style="font-size: 15px;"><strong>Accuracy:</strong> ${(currentAccuracy * 100).toFixed(1)}%</span>`);
        } else {
            accuracyInfo.html('<strong style="font-size: 15px;">Accuracy:</strong> -');
        }
    }
    
    function simulateEpoch() {
        epoch++;
        
        // Simulate loss decay
        const baseLoss = 2.5 * Math.exp(-learningRate * epoch * 2);
        const noise = (Math.random() - 0.5) * 0.1;
        const loss = Math.max(0.3, baseLoss + noise);
        lossHistory.push(loss);
        
        // Simulate accuracy increase
        const baseAccuracy = 0.85 * (1 - Math.exp(-epoch * 0.3));
        const accNoise = (Math.random() - 0.5) * 0.02;
        const accuracy = Math.min(0.85, Math.max(0, baseAccuracy + accNoise));
        accuracyHistory.push(accuracy);
        
        // Update visualization
        lossPath.attr('d', lossLine(lossHistory));
        accuracyPath.attr('d', accuracyLine(accuracyHistory));
        
        // Add data points
        g.selectAll('.loss-point').remove();
        g.selectAll('.loss-point')
            .data(lossHistory)
            .enter().append('circle')
            .attr('class', 'loss-point')
            .attr('cx', (d, i) => xScale(i + 1))
            .attr('cy', d => yScaleLoss(d))
            .attr('r', 3)
            .attr('fill', '#FC8484');
        
        g.selectAll('.accuracy-point').remove();
        g.selectAll('.accuracy-point')
            .data(accuracyHistory)
            .enter().append('circle')
            .attr('class', 'accuracy-point')
            .attr('cx', (d, i) => xScale(i + 1))
            .attr('cy', d => yScaleAccuracy(d))
            .attr('r', 3)
            .attr('fill', '#2DD2C0');
        
        updateInfo();
        
        if (epoch >= maxEpochs) {
            stopTraining();
        }
    }
    
    function startTraining() {
        isTraining = true;
        startButton.text('Stop Training');
        
        function train() {
            if (!isTraining || epoch >= maxEpochs) {
                stopTraining();
                return;
            }
            
            simulateEpoch();
            animationId = setTimeout(train, 1000);
        }
        
        train();
    }
    
    function stopTraining() {
        isTraining = false;
        startButton.text('Start Training');
        if (animationId) {
            clearTimeout(animationId);
            animationId = null;
        }
    }
    
    function toggleTraining() {
        if (isTraining) {
            stopTraining();
        } else {
            if (epoch >= maxEpochs) {
                resetTraining();
            }
            startTraining();
        }
    }
    
    function resetTraining() {
        stopTraining();
        epoch = 0;
        lossHistory = [];
        accuracyHistory = [];
        lossPath.attr('d', '');
        accuracyPath.attr('d', '');
        g.selectAll('.loss-point').remove();
        g.selectAll('.accuracy-point').remove();
        updateInfo();
    }
    
    // Initialize display
    updateInfo();
}